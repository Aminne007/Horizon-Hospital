import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "CLIENT" | "DOCTOR" | "ADMIN" | string;
  created_at?: string | null;
};

const roleBadges: Record<string, string> = {
  CLIENT: "bg-slate-100 text-slate-800 border-slate-200",
  DOCTOR: "bg-sky-100 text-sky-800 border-sky-200",
  ADMIN: "bg-amber-100 text-amber-800 border-amber-200",
  DISABLED: "bg-rose-100 text-rose-800 border-rose-200",
};

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CLIENT" | "DOCTOR" | "ADMIN" | "DISABLED">("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, created_at")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Unable to load users.");
      } else if (data) {
        setUsers(data as ProfileRow[]);
      }

      setLoading(false);
    }

    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== "ALL" && user.role !== roleFilter) return false;
      if (!term) return true;
      return [user.full_name, user.email].filter(Boolean).join(" ").toLowerCase().includes(term);
    });
  }, [roleFilter, search, users]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const disableSelected = async () => {
    if (!selected.size) return;
    setActionLoading(true);
    setActionMessage(null);
    const ids = Array.from(selected);
    const { error: updateError } = await supabase.from("profiles").update({ role: "DISABLED" }).in("id", ids);
    if (updateError) {
      setActionMessage(updateError.message);
    } else {
      setUsers((prev) => prev.map((u) => (ids.includes(u.id) ? { ...u, role: "DISABLED" } : u)));
      setActionMessage(`Disabled ${ids.length} user(s).`);
      clearSelection();
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Users</p>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">All users</h2>
          <p className="text-sm text-slate-600">Search, filter, select, and manage roles.</p>
        </div>
        {loading && <span className="text-sm font-semibold text-slate-600">Loading…</span>}
        {actionMessage && <span className="text-xs font-semibold text-slate-700">{actionMessage}</span>}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.45)] backdrop-blur space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["ALL", "CLIENT", "DOCTOR", "ADMIN", "DISABLED"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={[
                  "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ring-1 transition",
                  roleFilter === role
                    ? "bg-slate-900 text-white ring-slate-900 shadow"
                    : "bg-slate-50 text-slate-700 ring-slate-200 hover:bg-slate-100",
                ].join(" ")}
              >
                {role === "ALL" ? "All" : role}
              </button>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {filtered.length} users
            </span>
          </div>
          <label className="relative w-full sm:max-w-sm">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
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
              placeholder="Search by name or email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-800 ring-1 ring-slate-200">
            <span className="font-semibold">{selected.size} selected</span>
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={disableSelected}
              disabled={actionLoading}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-60"
            >
              {actionLoading ? "Disabling…" : "Disable users"}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {filtered.length === 0 && !loading && (
            <p className="px-2 py-3 text-sm text-slate-600">No users match this filter.</p>
          )}
          {filtered.map((user) => {
            const isSelected = selected.has(user.id);
            return (
              <div
                key={user.id}
                className={[
                  "flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  isSelected ? "ring-2 ring-slate-400" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(user.id)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      aria-label={`Select ${user.full_name || "user"}`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.full_name || "Unnamed"}</p>
                      <p className="text-xs text-slate-600">{user.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        roleBadges[user.role] || "bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                    >
                      {user.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/app/admin/users/${user.id}`)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                    >
                      Manage
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                    Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Not set"}
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                    ID {user.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
