import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import type { ClientMedicalRecord, ClientProfile, Profile, ResultRow } from "../../types/db";

const formatDate = (value: string | null) => {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

type FeedItem = {
  id: string;
  kind: "result" | "record";
  title: string;
  subtitle: string;
  date: string | null;
  status?: string | null;
  href?: string | null;
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [patientName, setPatientName] = useState<string>("Patient");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [nextFollowUp, setNextFollowUp] = useState<string | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [records, setRecords] = useState<ClientMedicalRecord[]>([]);

  useEffect(() => {
    async function checkRole() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        navigate("/result", { replace: true });
        return;
      }

      const { data: profileRow, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, created_at")
        .eq("id", userData.user.id)
        .single();

      if (error || !profileRow || profileRow.role !== "CLIENT") {
        navigate("/result", { replace: true });
        return;
      }

      setPatientName(profileRow.full_name || "Patient");
      setProfile(profileRow as Profile);
      setUserId(userData.user.id);
      setChecking(false);

      const { data: cp } = await supabase
        .from("client_profiles")
        .select(
          `
        client_id,
        phone,
        dob,
        id_number,
        address,
        city,
        state,
        postal,
        sex,
        blood_type,
        emergency_contact_name,
        emergency_contact_phone,
        created_at
      `
        )
        .eq("client_id", userData.user.id)
        .maybeSingle();
      setClientProfile((cp as ClientProfile) || null);
    }

    checkRole();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    async function loadSummary() {
      setSummaryLoading(true);

      const [{ data: resultsData, error: resultsError }, { data: recordData, error: recordError }] = await Promise.all([
        supabase
          .from("results")
          .select(
            `
            id,
            client_id,
            doctor_id,
            title,
            description,
            result_type,
            result_date,
            file_path,
            created_at
          `
          )
          .eq("client_id", userId)
          .order("result_date", { ascending: false })
          .limit(5),
        supabase
          .from("client_medical_records")
          .select(
            `
            id,
            client_id,
            doctor_id,
            note,
            diagnosis,
            medications,
            follow_up,
            created_at,
            height_cm,
            weight_kg,
            heart_rate_bpm,
            allergies_snapshot,
            chronic_conditions_snapshot,
            next_follow_up_date,
            status,
            updated_at
          `
          )
          .eq("client_id", userId)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (resultsError || recordError) {
        console.error("[ClientDashboard] summary load issue", { resultsError, recordError });
      }

      const recordsFetched = (recordData || []) as ClientMedicalRecord[];
      const resultsFetched = (resultsData || []) as ResultRow[];

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = recordsFetched
        .map((rec) => rec.next_follow_up_date)
        .filter(Boolean)
        .filter((date) => {
          const parsed = new Date(date as string);
          return !Number.isNaN(parsed.getTime()) && parsed >= today;
        })
        .sort((a, b) => new Date(a as string).getTime() - new Date(b as string).getTime());
      setNextFollowUp((upcoming[0] as string) || null);

      setResults(resultsFetched);
      setRecords(recordsFetched);
      setSummaryLoading(false);
    }

    loadSummary();
  }, [userId]);

  const readyCount = useMemo(() => results.filter((r) => r.file_path).length, [results]);
  const pendingCount = useMemo(() => Math.max(results.length - readyCount, 0), [results.length, readyCount]);
  const formattedFollowUp = useMemo(() => formatDate(nextFollowUp), [nextFollowUp]);

  const feed: FeedItem[] = useMemo(() => {
    const items: FeedItem[] = [];
    results.forEach((r) =>
      items.push({
        id: `result-${r.id}`,
        kind: "result",
        title: r.title || "Result",
        subtitle: r.description || r.result_type || "Recent upload",
        date: r.result_date || r.created_at || null,
        status: r.file_path ? "Ready" : "Pending",
        href: r.file_path || null,
      }),
    );
    records.forEach((rec) =>
      items.push({
        id: `record-${rec.id}`,
        kind: "record",
        title: rec.diagnosis || "Doctor note",
        subtitle: rec.follow_up || rec.note || "Visit note",
        date: rec.created_at || null,
        status: rec.status || "Final",
      }),
    );
    return items
      .sort((a, b) => {
        const aDate = a.date ? new Date(a.date).getTime() : 0;
        const bDate = b.date ? new Date(b.date).getTime() : 0;
        return bDate - aDate;
      })
      .slice(0, 10);
  }, [records, results]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F4F8]">
        <p className="text-sm font-semibold text-[#2f5f6a]">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F4F8]">
      <div className="relative mx-4 mt-2 overflow-hidden rounded-[32px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#B8E1F0] px-6 py-8 text-[#1f3d47] shadow-[0_20px_80px_-50px_rgba(74,144,164,0.8)] sm:mx-6 sm:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,rgba(74,144,164,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(184,225,240,0.35),transparent_32%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2f5f6a]">Client space</p>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">{patientName}</h1>
            <p className="text-sm text-[#355c68]">{profile?.email || "No email on file"}</p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm">
                Next follow-up: {summaryLoading ? "Checking..." : formattedFollowUp}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm">
                Ready results: {readyCount}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm">
                Pending: {pendingCount}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/app/client/results"
              className="inline-flex items-center gap-2 rounded-full bg-[#4A90A4] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4A90A4]/25 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
            >
              View all results
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.8 4.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4L17.6 12l-4.8-4.7a1 1 0 0 1 0-1.4Z"
                />
                <path fill="currentColor" d="M4 12a1 1 0 0 1 1-1h9.5a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" />
              </svg>
            </Link>
            <Link
              to="/app/client/profile"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-3 text-sm font-semibold text-[#1f3d47] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 space-y-8">
        <section className="rounded-[26px] bg-white/90 p-5 shadow-[0_24px_70px_-60px_rgba(74,144,164,0.7)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Latest activity</p>
              <h2 className="text-xl font-bold text-[#1f3d47]">Uploads & notes</h2>
            </div>
            <span className="rounded-full bg-[#f6fbfd] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
              {summaryLoading ? "Updating..." : `${feed.length} items`}
            </span>
          </div>
          {summaryLoading && <p className="mt-3 text-sm text-[#3e6f7b]">Pulling your latest updates...</p>}
          {!summaryLoading && !feed.length && (
            <p className="mt-3 text-sm text-[#3e6f7b]">No recent uploads or notes yet.</p>
          )}
          {feed.length > 0 && (
            <div className="relative mt-4 pl-4">
              <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-[#cfe5f0] via-[#e2f0f7] to-transparent" />
              <div className="space-y-3">
                {feed.map((item) => {
                  const ready = item.status?.toLowerCase() === "ready";
                  return (
                    <article key={item.id} className="relative pl-5">
                      <div className="absolute left-[-1px] top-3 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#4A90A4] to-[#2f5f6a] shadow-[0_10px_24px_-16px_rgba(74,144,164,0.7)]" />
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3e6f7b]">
                        <span>{item.kind === "result" ? "Result" : "Doctor note"}</span>
                        {item.date && <span className="text-[#2f5f6a]">• {formatDate(item.date)}</span>}
                        {item.status && (
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-[11px] font-semibold",
                              ready
                                ? "bg-[#e9f7f1] text-[#1f7a55]"
                                : item.kind === "result"
                                ? "bg-[#fff6e6] text-[#a66c00]"
                                : "bg-[#eef6fb] text-[#2f5f6a]",
                            ].join(" ")}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#1f3d47]">{item.title}</h3>
                      <p className="text-sm text-[#2f5f6a]">{item.subtitle}</p>
                      {item.href && (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#2f5f6a] underline-offset-4 transition hover:text-[#1b3d48]"
                        >
                          Open file
                          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M7.4 4.4A1 1 0 0 1 8 4h11a1 1 0 0 1 1 1v11a1 1 0 1 1-2 0V7.4l-9.3 9.3a1 1 0 0 1-1.4-1.4L16.6 6H8a1 1 0 0 1-.7-1.6Z"
                            />
                          </svg>
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[24px] bg-white/90 p-5 shadow-[0_24px_70px_-60px_rgba(74,144,164,0.7)] backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Quick links</p>
              <h2 className="text-xl font-bold text-[#1f3d47]">Profile & results</h2>
            </div>
            <Link
              to="/app/client/profile"
              className="text-sm font-semibold text-[#2b6573] underline-offset-4 transition hover:text-[#1b3d48]"
            >
              View full profile
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#2f5f6a]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f6fbfd] px-4 py-2 ring-1 ring-[#d3e8f2]">
              {profile?.full_name || "Name not set"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f6fbfd] px-4 py-2 ring-1 ring-[#d3e8f2]">
              {profile?.email || "No email"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f6fbfd] px-4 py-2 ring-1 ring-[#d3e8f2]">
              {clientProfile?.phone || "No phone"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f6fbfd] px-4 py-2 ring-1 ring-[#d3e8f2]">
              Emergency: {clientProfile?.emergency_contact_phone || "Not set"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f6fbfd] px-4 py-2 ring-1 ring-[#d3e8f2]">
              Blood: {clientProfile?.blood_type || "Not set"}
            </span>
          </div>
          <div className="mt-3 text-xs text-[#527884]">
            Last updated {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Not available"}
          </div>
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default ClientDashboard;
