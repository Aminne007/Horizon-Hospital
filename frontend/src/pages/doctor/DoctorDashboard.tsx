import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import type { ClientMedicalRecord, ResultRow } from "../../types/db";

type RecentResult = ResultRow & { client_name?: string | null; client?: { full_name?: string | null } | null };
type RecentRecord = ClientMedicalRecord & { client_name?: string | null; client?: { full_name?: string | null } | null };

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const DoctorDashboard = () => {
  const [records, setRecords] = useState<RecentRecord[]>([]);
  const [results, setResults] = useState<RecentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      const doctorId = userData?.user?.id;
      if (!doctorId) {
        setError("Session expired.");
        setLoading(false);
        return;
      }

      const [{ data: recRows, error: recError }, { data: resultRows, error: resultError }] = await Promise.all([
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
          updated_at,
          client:profiles!client_medical_records_client_id_fkey(full_name)
        `
          )
          .eq("doctor_id", doctorId)
          .order("created_at", { ascending: false })
          .limit(20),
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
          created_at,
          client:profiles!results_client_id_fkey(full_name)
        `
          )
          .eq("doctor_id", doctorId)
          .order("result_date", { ascending: false })
          .limit(20),
      ]);

      if (recError || resultError) {
        setError("Unable to load your workspace right now.");
      }

      setRecords((recRows || []) as RecentRecord[]);
      setResults((resultRows || []) as RecentResult[]);
      setLoading(false);
    }

    load();
  }, []);

  const clientsTreated = useMemo(() => {
    const ids = new Set<string>();
    records.forEach((r) => r.client_id && ids.add(r.client_id));
    results.forEach((r) => r.client_id && ids.add(r.client_id));
    return ids.size;
  }, [records, results]);

  const recentRecords = records.slice(0, 3);
  const recentResults = results.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#E8F4F8]">
      <div className="relative mx-4 mt-2 overflow-hidden rounded-[32px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#B8E1F0] px-6 py-8 text-[#1f3d47] shadow-[0_20px_80px_-50px_rgba(74,144,164,0.8)] sm:mx-6 sm:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_12%_22%,rgba(74,144,164,0.2),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(184,225,240,0.3),transparent_34%)]" />
        <header className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#3e6f7b]">Doctor workspace</p>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">Dashboard</h1>
            <p className="text-sm text-[#355c68]">Monitor patients, uploads, and recent activity.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/app/doctor/patients"
              className="inline-flex items-center gap-2 rounded-full bg-[#4A90A4] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4A90A4]/25 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
            >
              View patients
            </Link>
            <Link
              to="/app/doctor/results"
              className="inline-flex items-center gap-2 rounded-full border border-[#d3e8f2] bg-white/80 px-4 py-3 text-sm font-semibold text-[#1f3d47] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
            >
              My results
            </Link>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 space-y-6">
        {loading && (
          <div className="rounded-3xl border border-[#d3e8f2] bg-white px-4 py-6 shadow-sm shadow-[#4A90A4]/10">
            <p className="text-sm font-semibold text-[#2f5f6a]">Loading your workspace...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Clients treated", value: clientsTreated },
            { label: "Results created", value: results.length },
            { label: "Records authored", value: records.length },
            { label: "Ready results", value: results.filter((r) => r.file_path).length },
          ].map((item) => (
            <article
              key={item.label}
              className="relative overflow-hidden rounded-3xl border border-[#d3e8f2] bg-white/90 p-5 shadow-sm shadow-[#4A90A4]/8 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_20%,rgba(184,225,240,0.5),transparent_35%)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-[#1f3d47]">{item.value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-[28px] border border-[#d3e8f2] bg-white/95 p-5 shadow-[0_26px_70px_-56px_rgba(74,144,164,0.85)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Recent records</p>
                <h3 className="text-lg font-bold text-[#1f3d47]">Latest visit notes</h3>
              </div>
              <Link
                to="/app/doctor/patients"
                className="text-sm font-semibold text-[#2b6573] underline-offset-4 hover:text-[#1b3d48]"
              >
                All patients
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentRecords.map((rec) => (
                <article
                  key={rec.id}
                  className="rounded-2xl border border-[#d3e8f2] bg-gradient-to-br from-white via-[#f6fbfd] to-[#E8F4F8] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3e6f7b]">
                        {formatDate(rec.created_at)}
                      </p>
                      <h4 className="text-base font-bold text-[#1f3d47]">{rec.diagnosis || "Diagnosis pending"}</h4>
                      {rec.client?.full_name && (
                        <p className="text-xs font-semibold text-[#2f5f6a]">Client: {rec.client.full_name}</p>
                      )}
                    </div>
                    <span className="rounded-full bg-[#4A90A4] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
                      {rec.status || "Final"}
                    </span>
                  </div>
                  {rec.note && <p className="mt-2 text-sm text-[#2f5f6a]">{rec.note}</p>}
                  {rec.next_follow_up_date && (
                    <p className="mt-2 text-xs font-semibold text-[#3e6f7b]">Next follow-up: {formatDate(rec.next_follow_up_date)}</p>
                  )}
                </article>
              ))}
              {!recentRecords.length && (
                <div className="rounded-2xl border border-dashed border-[#d3e8f2] bg-[#f6fbfd] px-4 py-4 text-sm text-[#3e6f7b]">
                  No records yet. Create one from a patient chart.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#d3e8f2] bg-white/95 p-5 shadow-[0_26px_70px_-56px_rgba(74,144,164,0.85)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Recent results</p>
                <h3 className="text-lg font-bold text-[#1f3d47]">Latest uploads</h3>
              </div>
              <Link
                to="/app/doctor/results"
                className="text-sm font-semibold text-[#2b6573] underline-offset-4 hover:text-[#1b3d48]"
              >
                All results
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentResults.map((r) => {
                const isReady = Boolean(r.file_path);
                return (
                  <article
                    key={r.id}
                    className="rounded-2xl border border-[#d3e8f2] bg-gradient-to-br from-white via-[#f6fbfd] to-[#E8F4F8] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3e6f7b]">
                          {r.result_type || "Result"}
                        </p>
                        <h4 className="text-base font-bold text-[#1f3d47]">{r.title}</h4>
                        <p className="text-xs text-[#527884]">
                          {r.result_date ? formatDate(r.result_date) : "Date pending"}
                        </p>
                        {r.client?.full_name && (
                          <p className="text-xs font-semibold text-[#2f5f6a]">Client: {r.client.full_name}</p>
                        )}
                      </div>
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide border",
                          isReady
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700",
                        ].join(" ")}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {isReady ? "Ready" : "Pending"}
                      </span>
                    </div>
                    {r.description && <p className="mt-2 text-sm text-[#2f5f6a]">{r.description}</p>}
                    {isReady && r.file_path && (
                      <a
                        href={r.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2f5f6a] underline-offset-4 transition hover:text-[#1b3d48]"
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
              {!recentResults.length && (
                <div className="rounded-2xl border border-dashed border-[#d3e8f2] bg-[#f6fbfd] px-4 py-4 text-sm text-[#3e6f7b]">
                  No results yet. Upload from a patient chart.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
