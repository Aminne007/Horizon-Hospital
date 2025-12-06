import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

type EmbeddedClientProfile = {
  phone: string | null;
  city: string | null;
  state: string | null;
  sex: string | null;
  blood_type: string | null;
};

type ClientRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "CLIENT" | "DOCTOR" | "ADMIN";
  client_profiles: EmbeddedClientProfile[];
};

const DoctorPatientsPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatients() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("profiles")
        .select(
          `
        id,
        full_name,
        email,
        role,
        client_profiles (
          phone,
          city,
          state,
          sex,
          blood_type
        )
      `
        )
        .eq("role", "CLIENT")
        .order("full_name", { ascending: true });

      if (queryError) {
        setError("Unable to load patient list. Please try again.");
      }

      const rows = (data ?? []) as ClientRow[];
      setClients(rows);
      setLoading(false);
    }

    loadPatients();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((client) => {
      const details = client.client_profiles?.[0];
      return [client.full_name, client.email, details?.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [clients, search]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#B8E1F0] p-6 shadow-[0_20px_80px_-55px_rgba(74,144,164,0.8)]">
        <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_12%_18%,rgba(74,144,164,0.22),transparent_34%),radial-gradient(circle_at_78%_0%,rgba(63,108,125,0.16),transparent_30%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3e6f7b]">Patient directory</p>
            <h2 className="text-3xl font-black text-[#1f3d47] sm:text-4xl">Clients under your care</h2>
            <p className="text-sm text-[#355c68]">Search fast, open a chart, or start a follow-up right away.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[#2f5f6a] ring-1 ring-[#d3e8f2] shadow-inner">
              <span>Total</span>
              <span className="rounded-full bg-[#4A90A4] px-2 py-0.5 text-white">{clients.length}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-[#2f5f6a] ring-1 ring-[#d3e8f2] shadow-inner">
              <span>Filtered</span>
              <span className="rounded-full bg-[#2f5f6a] px-2 py-0.5 text-white">{filtered.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-[#d3e8f2] bg-white/90 p-5 shadow-[0_26px_70px_-56px_rgba(74,144,164,0.85)] backdrop-blur">
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
              placeholder="Search by name, email, or phone"
              className="w-full rounded-full border border-[#d3e8f2] bg-[#f6fbfd] pl-10 pr-4 py-3 text-sm font-medium text-[#1f3d47] shadow-inner shadow-[#4A90A4]/5 transition focus:border-[#4A90A4] focus:bg-white focus:ring-4 focus:ring-[#B8E1F0]"
            />
          </label>
          {loading && <span className="text-sm font-semibold text-[#3e6f7b]">Loading patients...</span>}
        </div>

        {error && (
          <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((client) => {
              const detail = client.client_profiles?.[0];
              const location = detail?.city || detail?.state ? [detail?.city, detail?.state].filter(Boolean).join(", ") : "No location set";
              return (
                <article
                  key={client.id}
                  className="group relative overflow-hidden rounded-[26px] border border-[#d3e8f2] bg-gradient-to-br from-white via-[#f6fbfd] to-[#E8F4F8] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_12%_20%,rgba(74,144,164,0.12),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(184,225,240,0.22),transparent_36%)]" />
                  <div className="relative space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3e6f7b]">Client</p>
                        <h3 className="text-xl font-bold text-[#1f3d47] leading-tight">{client.full_name || "Unnamed Client"}</h3>
                        <p className="text-xs text-[#527884]">{client.email || "No email on file"}</p>
                      </div>
                      <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
                        {detail?.sex || "—"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#2f5f6a]">
                      <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#d3e8f2]">{detail?.phone || "No phone"}</span>
                      <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#d3e8f2]">{location}</span>
                      {detail?.blood_type && (
                        <span className="rounded-full bg-[#fbe7ef] px-3 py-1 text-rose-800 ring-1 ring-rose-100">Blood {detail.blood_type}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => navigate(`/app/doctor/patients/${client.id}`)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#4A90A4] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#4A90A4]/20 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
                      >
                        Open chart
                        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M12.8 4.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4L17.6 12l-4.8-4.7a1 1 0 0 1 0-1.4Z"
                          />
                          <path fill="currentColor" d="M4 12a1 1 0 0 1 1-1h9.5a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" />
                        </svg>
                      </button>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
                        {client.role}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="mt-6 rounded-2xl border border-[#d3e8f2] bg-[#f6fbfd] px-4 py-5 text-sm text-[#3e6f7b]">
            No patients match "{search}". Try a different name, email, or phone.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientsPage;
