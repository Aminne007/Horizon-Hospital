import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import type { ResultRow } from "../../types/db";

type DoctorResultWithClient = ResultRow & { client?: { full_name: string | null } | null };

const DoctorResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<DoctorResultWithClient[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "ready" | "pending">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      setLoading(true);
      setError(null);

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setError("Your session expired. Please sign in again.");
        setLoading(false);
        return;
      }

      const { data: rows, error: rowsError } = await supabase
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
        .eq("doctor_id", userData.user.id)
        .order("result_date", { ascending: false });

      if (rowsError) {
        console.error("[DoctorResults] query error", rowsError);
        setError("Unable to load results created by you.");
        setLoading(false);
        return;
      }

      setResults((rows || []) as DoctorResultWithClient[]);
      setLoading(false);
    }

    loadResults();
  }, []);

  const readyCount = useMemo(() => results.filter((r) => r.file_path).length, [results]);
  const pendingCount = useMemo(() => results.filter((r) => !r.file_path).length, [results]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return results
      .filter((r) => {
        if (statusFilter === "ready") return Boolean(r.file_path);
        if (statusFilter === "pending") return !r.file_path;
        return true;
      })
      .filter((r) =>
        [r.title, r.result_type, r.description, r.client?.full_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
  }, [results, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#B8E1F0] p-6 shadow-[0_20px_80px_-55px_rgba(74,144,164,0.8)]">
        <div className="pointer-events-none absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_12%_20%,rgba(74,144,164,0.2),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(63,108,125,0.16),transparent_30%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3e6f7b]">Lab results</p>
            <h2 className="text-3xl font-black text-[#1f3d47] sm:text-4xl">Your uploads</h2>
            <p className="text-sm text-[#355c68]">Find a report fast, open the patient chart, or open the file.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#2f5f6a]">
            <span className="rounded-full bg-white/85 px-3 py-1 ring-1 ring-[#d3e8f2]">Total {results.length}</span>
            <span className="rounded-full bg-white/85 px-3 py-1 ring-1 ring-[#d3e8f2]">Ready {readyCount}</span>
            <span className="rounded-full bg-white/85 px-3 py-1 ring-1 ring-[#d3e8f2]">Pending {pendingCount}</span>
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-[#d3e8f2] bg-white/95 p-5 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative w-full sm:max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7aa3b0]">
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M13.78 12.72a6 6 0 1 0-1.06 1.06l3.75 3.75a.75.75 0 1 0 1.06-1.06l-3.75-3.75ZM12 9a5 5 0 1 1-10 0a5 5 0 0 1 10 0Z"
                />
              </svg>
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, type, or patient"
              className="w-full rounded-full border border-[#d3e8f2] bg-[#f6fbfd] pl-10 pr-4 py-3 text-sm font-medium text-[#1f3d47] shadow-inner shadow-[#4A90A4]/5 transition focus:border-[#4A90A4] focus:bg-white focus:ring-4 focus:ring-[#B8E1F0]"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {(["all", "ready", "pending"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                  statusFilter === status
                    ? "bg-[#2f5f6a] text-white shadow-lg shadow-[#2f5f6a]/20"
                    : "text-[#2f5f6a] ring-1 ring-[#d3e8f2] bg-white hover:bg-[#E8F4F8]"
                }`}
              >
                {status === "all" && "All"}
                {status === "ready" && `Ready (${readyCount})`}
                {status === "pending" && `Pending (${pendingCount})`}
              </button>
            ))}
          </div>
          {loading && <span className="text-sm font-semibold text-[#3e6f7b]">Loading...</span>}
        </div>

        {error && (
          <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-5 space-y-3">
            {filtered.map((result) => {
              const isReady = Boolean(result.file_path);
              const hasClient = Boolean(result.client_id);
              return (
                <article
                  key={result.id}
                  className="relative overflow-hidden rounded-[24px] border border-[#d3e8f2] bg-gradient-to-br from-white via-[#f6fbfd] to-[#E8F4F8] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_12%_18%,rgba(74,144,164,0.12),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(184,225,240,0.18),transparent_36%)]" />
                  <div className="relative flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">
                        {result.result_type || "Result"}
                      </p>
                      <h3 className="text-lg font-bold text-[#1f3d47] leading-tight">{result.title}</h3>
                      <p className="text-xs text-[#527884]">
                        {result.result_date ? new Date(result.result_date).toLocaleDateString() : "Date pending"}
                      </p>
                      {result.client?.full_name && (
                        <p className="text-xs font-semibold text-[#2f5f6a]">Client: {result.client.full_name}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                          isReady
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {isReady ? "Ready" : "Pending"}
                      </span>
                      {hasClient ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/app/doctor/patients/${result.client_id}`)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#d3e8f2] bg-white px-3 py-1.5 text-xs font-semibold text-[#2f5f6a] shadow-sm transition hover:-translate-y-0.5 hover:border-[#4A90A4]"
                        >
                          Open patient chart
                          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M12.8 4.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4L17.6 12l-4.8-4.7a1 1 0 0 1 0-1.4Z"
                            />
                            <path
                              fill="currentColor"
                              d="M4 12a1 1 0 0 1 1-1h9.5a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z"
                            />
                          </svg>
                        </button>
                      ) : (
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
                          No patient linked
                        </span>
                      )}
                    </div>
                  </div>
                  {result.description && (
                    <p className="relative mt-2 text-sm text-[#1f3d47] leading-relaxed">
                      {result.description}
                    </p>
                  )}
                  {isReady && result.file_path && (
                    <a
                      href={result.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2f5f6a] underline-offset-4 transition hover:text-[#1f3d47]"
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
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="mt-5 rounded-2xl border border-[#d3e8f2] bg-[#f6fbfd] px-4 py-5 text-sm text-[#3e6f7b]">
            No results matched "{search}". Try a different keyword or switch the status filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorResultsPage;
