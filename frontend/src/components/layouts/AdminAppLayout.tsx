import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const AdminAppLayout = () => {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ id: string | null; full_name: string | null; email: string | null; role: string | null }>({
    id: null,
    full_name: null,
    email: null,
    role: null,
  });

  const links = [
    {
      to: "/app/admin/dashboard",
      label: "Dashboard",
      icon: <path fill="currentColor" d="M4 4h7v7H4V4Zm9 0h7v11h-7V4ZM4 13h7v11H4V13Zm9 13V17h7v9h-7Z" />,
    },
    {
      to: "/app/admin/users",
      label: "Users",
      icon: (
        <path
          fill="currentColor"
          d="M9 4a4 4 0 1 1-8 0a4 4 0 0 1 8 0ZM3 10h4a4 4 0 0 1 4 4v5H-1v-5a4 4 0 0 1 4-4Zm12.5-6A3.5 3.5 0 1 1 12 7.5A3.5 3.5 0 0 1 15.5 4ZM12 11h7a3 3 0 0 1 3 3v5h-5v-2.5a1.5 1.5 0 0 0-3 0V19h-2v-5a3 3 0 0 1 3-3Z"
        />
      ),
    },
  ];

  useEffect(() => {
    async function loadProfile() {
      setProfileLoading(true);
      setProfileError(null);
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        setProfileError("Session expired");
        setProfileLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, role")
        .eq("id", userData.user.id)
        .single();
      if (error) {
        setProfileError("Unable to load profile");
      } else {
        setProfile({
          id: userData.user.id,
          full_name: data?.full_name ?? null,
          email: data?.email ?? null,
          role: data?.role ?? null,
        });
      }
      setProfileLoading(false);
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = "/result";
  };

  return (
    <div className="min-h-screen bg-[#E8F4F8] lg:pl-28">
      <div className="flex w-full gap-4 px-4 pb-12 pt-8 sm:px-6">
        <aside className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center justify-center gap-4 rounded-3xl border border-[#d3e8f2] bg-gradient-to-b from-white via-[#E8F4F8] to-[#dff1f7] p-4 shadow-[0_20px_60px_-35px_rgba(74,144,164,0.65)] backdrop-blur-lg lg:flex">
          <nav className="pointer-events-auto flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d3e8f2] bg-white text-[#3b6f7c] transition duration-200 hover:border-[#4A90A4]/60 hover:text-[#2b6573] hover:shadow-md"
              aria-label="My profile"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8Zm0 10c4.4 0 8 2 8 4.5V20h-2v-1.5c0-1.4-2.9-2.5-6-2.5s-6 1.1-6 2.5V20H4v-1.5C4 16 7.6 14 12 14Z"
                />
              </svg>
              <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#2f5f6a] shadow-xl ring-1 ring-[#d3e8f2] opacity-0 transition duration-200 group-hover:opacity-100 group-hover:translate-x-1">
                My profile
              </span>
            </button>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "group relative flex h-12 w-12 items-center justify-center rounded-2xl border transition duration-200",
                    isActive
                      ? "border-[#4A90A4] bg-white text-[#2b6573] shadow-lg shadow-[#4A90A4]/15"
                      : "border-[#d3e8f2] bg-white text-[#3b6f7c] hover:border-[#4A90A4]/60 hover:text-[#2b6573] hover:shadow-md",
                  ].join(" ")
                }
                aria-label={link.label}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  {link.icon}
                </svg>
                <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#2f5f6a] shadow-xl ring-1 ring-[#d3e8f2] opacity-0 transition duration-200 group-hover:opacity-100 group-hover:translate-x-1">
                  {link.label}
                </span>
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-700 transition hover:border-rose-300 hover:text-rose-800 hover:shadow-md"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M13 4a1 1 0 0 1 1 1v4h-2V6H6v12h6v-3h2v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm4.8 5.2 2.6 2.6a1 1 0 0 1 0 1.4l-2.6 2.6a1 1 0 1 1-1.4-1.4L18.6 14H11v-2h7.6l-1.2-1.2a1 1 0 0 1 1.4-1.6Z"
                />
              </svg>
              <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#2f5f6a] shadow-xl ring-1 ring-[#d3e8f2] opacity-0 transition duration-200 group-hover:opacity-100 group-hover:translate-x-1">
                {loggingOut ? "Signing out..." : "Logout"}
              </span>
            </button>
          </nav>
        </aside>

      <div className="flex-1 space-y-5">
          <div className="lg:hidden rounded-2xl border border-[#cde6f1] bg-white/90 p-3 shadow-sm backdrop-blur">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-xl bg-[#2f5f6a] px-3 py-2 text-sm font-semibold text-white shadow"
              aria-expanded={open}
              aria-label="Toggle navigation"
            >
              Menu
              <span aria-hidden="true">{open ? "-" : "+"}</span>
            </button>
            {open && (
              <nav className="mt-2 grid grid-cols-2 gap-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                        isActive
                          ? "bg-[#2f5f6a] text-white shadow"
                          : "text-[#2f5f6a] hover:bg-[#E8F4F8] hover:text-[#234954]",
                      ].join(" ")
                    }
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      {link.icon}
                    </svg>
                    <span>{link.label}</span>
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                >
                  {loggingOut ? "Signing out..." : "Logout"}
                </button>
              </nav>
            )}
          </div>

          <Outlet />
        </div>
      </div>
      {profileOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0b253129]/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-[32px] border border-white/50 bg-gradient-to-br from-white/85 via-white/80 to-[#e9f5fb]/85 text-[#1f3d47] shadow-[0_30px_90px_-45px_rgba(43,101,115,0.75)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4 px-6 pt-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e6f4f9]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f5f6a] ring-1 ring-white/70">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                  Active session
                </span>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-[#1c3540]">{profile.full_name || "Admin"}</h3>
                  <p className="text-sm text-[#4b7683]">{profile.email || "No email on file"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[#2f5f6a] shadow-sm transition hover:shadow-md"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-3 border-t border-white/60 px-6 py-5 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-sm text-[#2f5f6a] shadow-inner shadow-white/50 ring-1 ring-white/80 backdrop-blur">
                <span className="font-semibold tracking-wide text-[#3a6975]">Role</span>
                <span className="rounded-full bg-[#e6f4f9] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1f3d47] ring-1 ring-[#cde6f1]">
                  {profile.role || "ADMIN"}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl bg-white/55 px-4 py-3 text-sm text-[#2f5f6a] shadow-inner shadow-white/50 ring-1 ring-white/80 backdrop-blur">
                <span className="font-semibold tracking-wide text-[#3a6975]">User ID</span>
                <span className="break-all font-mono text-[11px] font-semibold text-[#1f3d47]">{profile.id || "Unavailable"}</span>
              </div>
            </div>

            {(profileLoading || profileError) && (
              <div className="border-t border-white/60 px-6 pb-6 pt-4 text-xs">
                {profileLoading && <p className="text-[#3e6f7b]">Refreshing profile...</p>}
                {profileError && <p className="text-rose-700">{profileError}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppLayout;
