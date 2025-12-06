import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

type Stats = {
  totalUsers: number;
  clients: number;
  doctors: number;
  admins: number;
  totalResults: number;
};

type SeriesPoint = { label: string; value: number };
type DoctorPerformance = { doctor_id: string | null; doctor: { full_name: string | null } | null; total: number };
type GroupOption = "auto" | "day" | "week" | "month" | "year";

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const formatDate = (value: string | null | undefined) => {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState<string>("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthlySeries, setMonthlySeries] = useState<SeriesPoint[]>([]);
  const [doctorPerformance, setDoctorPerformance] = useState<DoctorPerformance[]>([]);
  const [timeline, setTimeline] = useState<
    Array<{ id: string; kind: "signup" | "result" | "record"; title: string; date: string | null; detail?: string }>
  >([]);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<string>("");
  const [grouping, setGrouping] = useState<GroupOption>("auto");
  const [rangeStart, setRangeStart] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5);
    return d.toISOString().slice(0, 10);
  });
  const [rangeEnd, setRangeEnd] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        navigate("/result", { replace: true });
        return;
      }

      const today = new Date();
      const start = rangeStart ? new Date(rangeStart) : new Date(today);
      const end = rangeEnd ? new Date(rangeEnd) : new Date(today);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const queries = [
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "CLIENT"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "DOCTOR"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "ADMIN"),
        supabase.from("results").select("id", { count: "exact", head: true }),
        supabase
          .from("results")
          .select("id, created_at")
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString()),
        supabase.from("results").select("doctor_id, doctor:profiles(full_name)").not("doctor_id", "is", null),
        supabase
          .from("profiles")
          .select("id, full_name, created_at, role")
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString())
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("client_medical_records")
          .select("id, created_at, diagnosis")
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString())
          .order("created_at", { ascending: false })
          .limit(100),
        supabase.from("profiles").select("full_name").eq("id", userData.user.id).maybeSingle(),
      ];

      try {
        const [
          { count: totalUsers, error: totalError },
          { count: clients, error: clientsError },
          { count: doctors, error: doctorsError },
          { count: admins, error: adminsError },
          { count: totalResults, error: resultsError },
          { data: recentResults, error: recentError },
          { data: doctorPerf, error: perfError },
          { data: recentSignups },
          { data: recentRecords },
          { data: adminRow },
        ] = await Promise.all(queries);

        const resultsArray = (Array.isArray(recentResults) ? recentResults : []) as Array<{ id: string; created_at: string }>;
        const doctorPerfArray: DoctorPerformance[] = Array.isArray(doctorPerf)
          ? (doctorPerf as any[]).map((row) => ({
              doctor_id: row.doctor_id ?? null,
              doctor: Array.isArray(row.doctor) ? row.doctor[0] ?? null : row.doctor ?? null,
              total: 1,
            }))
          : [];
        const signupsArray = (Array.isArray(recentSignups) ? recentSignups : []) as Array<{
          id: string;
          full_name: string | null;
          role?: string | null;
          created_at?: string | null;
        }>;
        const recordsArray = (Array.isArray(recentRecords) ? recentRecords : []) as Array<{
          id: string;
          created_at: string | null;
          diagnosis?: string | null;
        }>;

        const anyError = totalError || clientsError || doctorsError || adminsError || resultsError || recentError;
        if (anyError) {
          setError("Unable to load analytics right now.");
        } else {
          setStats({
            totalUsers: totalUsers || 0,
            clients: clients || 0,
            doctors: doctors || 0,
            admins: admins || 0,
            totalResults: totalResults || 0,
          });

      const labels: string[] = [];
      const counts = new Map<string, number>();
      const groupChoice: GroupOption =
        grouping === "auto"
          ? (() => {
            const diffDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
            if (diffDays <= 14) return "day";
            if (diffDays <= 120) return "week";
            if (diffDays <= 365) return "month";
            return "year";
          })()
          : grouping;

          if (groupChoice === "day") {
            const span = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
            for (let i = 0; i <= span; i += 1) {
              const d = new Date(start);
              d.setDate(start.getDate() + i);
              const key = d.toDateString();
              labels.push(key);
              counts.set(key, 0);
            }
            resultsArray.forEach((row: { created_at: string }) => {
              const createdKey = new Date(row.created_at).toDateString();
              if (counts.has(createdKey)) counts.set(createdKey, (counts.get(createdKey) || 0) + 1);
            });
            setMonthlySeries(
              labels.map((key) => ({
                label: new Date(key).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                value: counts.get(key) || 0,
              }))
            );
          } else if (groupChoice === "week") {
            const spanWeeks = Math.max(
              1,
              Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7))
            );
            for (let i = 0; i <= spanWeeks; i += 1) {
              const d = new Date(start);
              d.setDate(start.getDate() + i * 7);
              const key = d.toDateString();
              labels.push(key);
              counts.set(key, 0);
            }
            resultsArray.forEach((row: { created_at: string }) => {
              const created = new Date(row.created_at);
              const weeksDiff = Math.floor((created.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
              const anchorLabel = labels[weeksDiff];
              if (anchorLabel && counts.has(anchorLabel)) counts.set(anchorLabel, (counts.get(anchorLabel) || 0) + 1);
            });
            setMonthlySeries(
              labels.map((key) => ({
                label: "Wk " + new Date(key).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                value: counts.get(key) || 0,
              }))
            );
          } else if (groupChoice === "year") {
            const spanMonths = Math.max(
              1,
              (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
            );
            for (let i = 0; i <= spanMonths; i += 1) {
              const d = new Date(start);
              d.setMonth(start.getMonth() + i, 1);
              d.setHours(0, 0, 0, 0);
              const key = monthKey(d);
              labels.push(key);
              counts.set(key, 0);
            }
            resultsArray.forEach((row: { created_at: string }) => {
              const created = new Date(row.created_at);
              const key = monthKey(created);
              if (counts.has(key)) counts.set(key, (counts.get(key) || 0) + 1);
            });
            setMonthlySeries(
              labels.map((key) => {
                const [year, month] = key.split("-");
                const date = new Date(Number(year), Number(month) - 1, 1);
                return {
                  label: date.toLocaleDateString(undefined, { month: "short", year: "numeric" }),
                  value: counts.get(key) || 0,
                };
              })
            );
          } else {
            const spanMonths =
              groupChoice === "month"
                ? Math.max(
                    1,
                    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                  )
                : 12;
            for (let i = 0; i <= spanMonths; i += 1) {
              const d = new Date(start);
              d.setMonth(start.getMonth() + i, 1);
              d.setHours(0, 0, 0, 0);
              const key = monthKey(d);
              labels.push(key);
              counts.set(key, 0);
            }
            resultsArray.forEach((row: { created_at: string }) => {
              const created = new Date(row.created_at);
              const key = monthKey(created);
              if (counts.has(key)) counts.set(key, (counts.get(key) || 0) + 1);
            });
            setMonthlySeries(
              labels.map((key) => {
                const [year, month] = key.split("-");
                const date = new Date(Number(year), Number(month) - 1, 1);
                return {
                  label: date.toLocaleDateString(undefined, { month: "short", year: "numeric" }),
                  value: counts.get(key) || 0,
                };
              })
            );
          }
          setAdminName((adminRow as { full_name: string | null } | null)?.full_name || "Admin");
          if (!perfError && doctorPerfArray.length) {
            const agg = new Map<string, { doctor_id: string | null; doctor: { full_name: string | null } | null; total: number }>();
            doctorPerfArray.forEach((row: any) => {
              const key = row.doctor_id || "unknown";
              const existing = agg.get(key);
              if (existing) {
                existing.total += 1;
              } else {
                agg.set(key, { doctor_id: row.doctor_id, doctor: row.doctor || null, total: 1 });
              }
            });
            setDoctorPerformance(Array.from(agg.values()).sort((a, b) => b.total - a.total));
          } else {
            setDoctorPerformance([]);
          }

          const timelineItems: Array<{
            id: string;
            kind: "signup" | "result" | "record";
            title: string;
            date: string | null;
            detail?: string;
          }> = [];
          signupsArray.forEach((row: any) =>
            timelineItems.push({
              id: `signup-${row.id}`,
              kind: "signup",
              title: row.full_name || "New user",
              date: row.created_at || null,
              detail: row.role || "USER",
            })
          );
          resultsArray.forEach((row: any) =>
            timelineItems.push({
              id: `result-${row.id}`,
              kind: "result",
              title: "Result uploaded",
              date: row.created_at || null,
              detail: "",
            })
          );
          recordsArray.forEach((row: any) =>
            timelineItems.push({
              id: `record-${row.id}`,
              kind: "record",
              title: row.diagnosis || "Doctor note",
              date: row.created_at || null,
            })
          );
          timelineItems.sort((a, b) => {
            const aDate = a.date ? new Date(a.date).getTime() : 0;
            const bDate = b.date ? new Date(b.date).getTime() : 0;
            return bDate - aDate;
          });
          setTimeline(timelineItems);
        }
      } catch (err) {
        console.error("[AdminDashboard] unexpected", err);
        setError("Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate, grouping, rangeStart, rangeEnd]);

  const handleLogout = async () => {
    setLogoutError(null);
    setLogoutLoading(true);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setLogoutError(signOutError.message);
      setLogoutLoading(false);
      return;
    }
    navigate("/result", { replace: true });
  };

  const maxMonthly = useMemo(() => Math.max(1, ...monthlySeries.map((d) => d.value)), [monthlySeries]);
  const maxDoctor = useMemo(() => Math.max(1, ...doctorPerformance.map((d) => d.total)), [doctorPerformance]);

  return (
    <div className="min-h-screen bg-[#E8F4F8]">
      <div className="relative mx-4 mt-2 overflow-hidden rounded-[32px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#B8E1F0] px-6 py-8 text-[#1f3d47] shadow-[0_20px_80px_-50px_rgba(74,144,164,0.8)] sm:mx-6 sm:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_18%_22%,rgba(74,144,164,0.25),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(184,225,240,0.3),transparent_32%)]" />
        <header className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#3e6f7b]">Admin panel</p>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">{adminName}</h1>
            <p className="text-sm text-[#355c68]">Analytics and user management in one view.</p>
          </div>
          <div className="flex items-center gap-3">
            {logoutError && (
              <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                {logoutError}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="inline-flex items-center gap-2 rounded-full bg-[#4A90A4] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4A90A4]/25 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0] disabled:opacity-70"
            >
              {logoutLoading ? "Signing out..." : "Logout"}
              {!logoutLoading && (
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12.8 4.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4L17.6 12l-4.8-4.7a1 1 0 0 1 0-1.4Z"
                  />
                  <path fill="currentColor" d="M4 12a1 1 0 0 1 1-1h9.5a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" />
                </svg>
              )}
            </button>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Overview</p>
            <h2 className="text-2xl font-black text-[#1f3d47] sm:text-3xl">Platform analytics</h2>
            <p className="text-sm text-[#355c68]">Totals and recent trends across the system.</p>
          </div>
          {loading && <span className="text-sm font-semibold text-[#3e6f7b]">Loading...</span>}
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        <section className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f5f6a]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm">
            Total users: {stats?.totalUsers ?? 0}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm">
            Clients: {stats?.clients ?? 0}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm">
            Doctors: {stats?.doctors ?? 0}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm">
            Results: {stats?.totalResults ?? 0}
          </span>
        </section>

        <section className="rounded-[28px] border border-[#d3e8f2] bg-white/95 p-5 shadow-[0_26px_70px_-56px_rgba(74,144,164,0.85)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">Activity scale</p>
              <h3 className="text-lg font-bold text-[#1f3d47]">
                {grouping === "day" && "Daily"}
                {grouping === "week" && "Weekly"}
                {grouping === "month" && "Monthly"}
                {grouping === "year" && "Yearly"}
                {grouping === "auto" && "Auto grouping"}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2f5f6a]">
              <div className="flex overflow-hidden rounded-full bg-[#eef6fb] ring-1 ring-[#d3e8f2]">
                {(["auto", "day", "week", "month", "year"] as GroupOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGrouping(opt)}
                    className={[
                      "px-3 py-1 transition capitalize",
                      grouping === opt ? "bg-white text-[#1f3d47] shadow-sm" : "text-[#2f5f6a]",
                    ].join(" ")}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                className="rounded-xl border border-[#d3e8f2] bg-white px-3 py-1 text-xs font-semibold text-[#1f3d47] shadow-sm focus:border-[#4A90A4] focus:outline-none focus:ring-2 focus:ring-[#B8E1F0]"
              />
              <span>to</span>
              <input
                type="date"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                className="rounded-xl border border-[#d3e8f2] bg-white px-3 py-1 text-xs font-semibold text-[#1f3d47] shadow-sm focus:border-[#4A90A4] focus:outline-none focus:ring-2 focus:ring-[#B8E1F0]"
              />
            </div>
            <button
              type="button"
              onClick={() => navigate("/app/admin/users")}
              className="inline-flex items-center gap-2 rounded-xl border border-[#d3e8f2] bg-white px-3 py-2 text-xs font-semibold text-[#1f3d47] shadow-sm transition hover:-translate-y-0.5 hover:border-[#4A90A4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
            >
              Manage users
            </button>
          </div>
          <div className="mt-4 flex items-end gap-3 overflow-x-auto pb-2">
            {monthlySeries.length === 0 && <p className="text-sm text-[#3e6f7b]">No recent uploads.</p>}
            {monthlySeries.map((point, idx) => (
              <div key={point.label + idx} className="flex min-w-[48px] flex-col items-center gap-2">
                <div className="flex h-32 w-10 items-end overflow-hidden rounded-full bg-gradient-to-b from-[#f9fdff] to-[#e5f1f7] ring-1 ring-[#d3e8f2]/70">
                  <div
                    className="w-full rounded-full bg-gradient-to-t from-[#4A90A4] via-[#7bb8cc] to-[#c4e5f1] transition-all"
                    style={{ height: `${(point.value / maxMonthly) * 100}%` }}
                    aria-label={`${point.label}: ${point.value}`}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#3e6f7b]">{point.label}</span>
                <span className="text-[12px] font-bold text-[#1f3d47]">{point.value}</span>
              </div>
            ))}
          </div>
        </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <article
            className="rounded-[28px] border border-[#d3e8f2] bg-white/95 p-5 shadow-[0_26px_70px_-56px_rgba(74,144,164,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_80px_-60px_rgba(74,144,164,0.8)] cursor-pointer"
            onClick={() => setShowFullTimeline(true)}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">Activity</p>
                <h3 className="text-lg font-bold text-[#1f3d47]">Signups, results, records</h3>
              </div>
              {timeline.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowFullTimeline(true)}
                  className="text-xs font-semibold text-[#2b6573] underline-offset-4 transition hover:text-[#1b3d48]"
                >
                  Open full timeline
                </button>
              )}
            </div>
            <div className="relative mt-4 pl-4 pr-2">
              <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-[#cfe5f0] via-[#e2f0f7] to-transparent" />
              <div className="space-y-3">
                {timeline.length === 0 && <p className="text-sm text-[#3e6f7b]">No activity in this range.</p>}
                {timeline.slice(0, 6).map((item) => (
                  <div key={item.id} className="relative pl-5 transition hover:translate-x-0.5">
                    <div className="absolute left-[-1px] top-2.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#4A90A4] to-[#2f5f6a]" />
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3e6f7b]">
                      <span>
                        {item.kind === "signup" ? "Signup" : item.kind === "result" ? "Result" : "Record"}
                      </span>
                      {item.date && <span className="text-[#2f5f6a]">• {formatDate(item.date)}</span>}
                      {item.detail && (
                        <span className="rounded-full bg-[#eef6fb] px-3 py-1 text-[11px] font-semibold text-[#2f5f6a]">
                          {item.detail}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-[#1f3d47]">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-[#d3e8f2] bg-white/95 p-5 shadow-[0_26px_70px_-56px_rgba(74,144,164,0.85)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">
                  Doctor performance
                </p>
                <h3 className="text-lg font-bold text-[#1f3d47]">Results submitted by doctor</h3>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {doctorPerformance.length === 0 && (
                <p className="text-sm text-[#3e6f7b]">No doctor submissions recorded yet.</p>
              )}
              {doctorPerformance.map((doc) => (
                <div key={doc.doctor_id || Math.random()} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-[#2f5f6a]">
                    <span className="font-semibold">{doc.doctor?.full_name || "Unknown doctor"}</span>
                    <span className="rounded-full border border-[#d3e8f2] bg-[#E8F4F8] px-2 py-0.5 text-xs font-semibold">
                      {doc.total} results
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#f0f7fa] ring-1 ring-[#d3e8f2]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4A90A4] to-[#8fc5d4] transition-all"
                      style={{ width: `${(doc.total / maxDoctor) * 100}%` }}
                      aria-label={`${doc.doctor?.full_name || "Doctor"}: ${doc.total}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
      {showFullTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f27]/70 px-4 py-6 backdrop-blur transition">
          <div className="absolute inset-0" onClick={() => setShowFullTimeline(false)} aria-hidden="true" />
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[30px] border border-[#d3e8f2] bg-white/80 p-6 text-[#1f3d47] shadow-[0_36px_110px_-60px_rgba(15,31,39,0.75)] backdrop-blur-xl transition duration-200 ease-out">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">Full timeline</p>
                <h3 className="text-xl font-bold text-[#1f3d47]">Signups, results, records</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2f5f6a]">
                <input
                  type="date"
                  value={timelineFilter}
                  onChange={(e) => setTimelineFilter(e.target.value)}
                  className="rounded-xl border border-[#d3e8f2] bg-white px-3 py-1 text-xs font-semibold text-[#1f3d47] shadow-sm focus:border-[#4A90A4] focus:outline-none focus:ring-2 focus:ring-[#B8E1F0]"
                />
                <button
                  type="button"
                  onClick={() => setTimelineFilter("")}
                  className="rounded-full border border-[#d3e8f2] bg-white px-3 py-1 text-xs font-semibold text-[#2f5f6a] shadow-sm hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullTimeline(false)}
                  className="rounded-full border border-[#d3e8f2] bg-white px-3 py-1 text-xs font-semibold text-[#2f5f6a] shadow-sm hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="relative mt-4 max-h-[60vh] overflow-y-auto pl-4 pr-2">
              <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-[#cfe5f0] via-[#e2f0f7] to-transparent" />
              <div className="space-y-3">
                {timeline.length === 0 && <p className="text-sm text-[#3e6f7b]">No activity in this range.</p>}
                {timeline
                  .filter((item) => {
                    if (!timelineFilter) return true;
                    if (!item.date) return false;
                    return item.date.slice(0, 10) === timelineFilter;
                  })
                  .map((item) => (
                    <div key={item.id} className="relative pl-5 transition hover:translate-x-0.5">
                      <div className="absolute left-[-1px] top-2.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#4A90A4] to-[#2f5f6a]" />
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3e6f7b]">
                        <span>{item.kind === "signup" ? "Signup" : item.kind === "result" ? "Result" : "Record"}</span>
                        {item.date && <span className="text-[#2f5f6a]">• {formatDate(item.date)}</span>}
                        {item.detail && (
                          <span className="rounded-full bg-[#eef6fb] px-3 py-1 text-[11px] font-semibold text-[#2f5f6a]">
                            {item.detail}
                          </span>
                        )}
                      </div>
                      <p className="text-base font-bold text-[#1f3d47]">{item.title}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
