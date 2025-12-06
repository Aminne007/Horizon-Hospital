import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { ResultRow } from "../../types/db";

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const ClientResultsPage = () => {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMsg(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg("You must be logged in to view your records.");
        setLoading(false);
        return;
      }

      const { data: resultsData, error: resultsError } = await supabase
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
        .eq("client_id", user.id)
        .order("result_date", { ascending: false });

      if (resultsError) {
        console.error("[ClientResults] load error", { resultsError });
        setErrorMsg("Unable to load your data right now.");
      }

      setResults((resultsData || []) as ResultRow[]);
      setLoading(false);
    }

    loadData();
  }, []);

  const readyCount = useMemo(() => results.filter((r) => r.file_path).length, [results]);
  const pendingCount = Math.max(results.length - readyCount, 0);

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#d3e8f2] bg-white px-4 py-6 shadow-sm shadow-[#4A90A4]/10">
        <p className="text-sm font-semibold text-[#2f5f6a]">Loading your records...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMsg}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#B8E1F0] p-5 text-[#1f3d47] shadow-[0_26px_70px_-56px_rgba(74,144,164,0.85)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Your health file</p>
            <h2 className="text-2xl font-black sm:text-3xl">Results & visit history</h2>
            <p className="text-sm text-[#355c68]">Read-only view of lab/imaging uploads and doctor visit notes.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/80 px-4 py-2 shadow-inner shadow-[#4A90A4]/5 ring-1 ring-[#d3e8f2]">
              <p className="text-xs font-semibold text-[#3e6f7b]">Ready results</p>
              <p className="text-lg font-black text-[#1f3d47]">{readyCount}</p>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-2 shadow-inner shadow-[#4A90A4]/5 ring-1 ring-[#d3e8f2]">
              <p className="text-xs font-semibold text-[#3e6f7b]">Pending</p>
              <p className="text-lg font-black text-[#1f3d47]">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[28px] border border-[#d3e8f2] bg-white/95 p-5 shadow-[0_26px_70px_-56px_rgba(74,144,164,0.85)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#1f3d47]">Lab & imaging results</h3>
          <span className="rounded-full border border-[#d3e8f2] bg-[#E8F4F8] px-3 py-1 text-xs font-semibold text-[#2f5f6a]">
            {results.length} items
          </span>
        </div>

        {!results.length && (
          <div className="mt-4 rounded-2xl border border-[#d3e8f2] bg-[#f6fbfd] px-4 py-4 text-sm text-[#3e6f7b]">
            No results yet. You'll see new uploads from your care team here.
          </div>
        )}

        <div className="mt-4 space-y-4">
          {results.map((r) => {
            const isReady = Boolean(r.file_path);
            return (
              <article
                key={r.id}
                className="rounded-2xl border border-[#d3e8f2] bg-gradient-to-br from-white via-[#f6fbfd] to-[#E8F4F8] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">
                      {r.result_type || "Result"}
                    </p>
                    <h4 className="text-base font-bold text-[#1f3d47]">{r.title}</h4>
                    <p className="text-xs text-[#527884]">{r.result_date ? formatDate(r.result_date) : "Date pending"}</p>
                  </div>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide border",
                      isReady
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700",
                    ].join(" ")}
                  >
                    <span className="mr-1 h-2 w-2 rounded-full bg-current" />
                    {isReady ? "Ready" : "Pending"}
                  </span>
                </div>

                {r.description && <p className="mt-2 text-sm leading-relaxed text-[#2f5f6a]">{r.description}</p>}

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
        </div>
      </section>
    </div>
  );
};

export default ClientResultsPage;
