import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const emergencyNumber = t("common.hotlineNumber");
  const emergencyHref = useMemo(() => `tel:${emergencyNumber.replace(/\s+/g, "")}`, [emergencyNumber]);

  const navLinks = useMemo(
    () => [
      { label: t("common.nav.home"), path: "/" },
      { label: t("common.nav.departments"), path: "/departments" },
      { label: t("common.nav.doctors"), path: "/doctors" },
      { label: t("common.nav.appointments"), path: "/appointments" },
      { label: t("common.nav.contact"), path: "/contact" },
      { label: t("common.nav.about"), path: "/about" },
    ],
    [t]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-xl shadow-md relative">
      <div className="flex w-full items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 text-lg font-bold text-white shadow-lg ring-1 ring-white/40 backdrop-blur">
            HC
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold text-slate-900">{t("common.hospitalName")}</p>
            <p className="text-sm text-slate-600">{t("common.hospitalTagline")}</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={emergencyHref}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-2 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-red-300/70"
          >
            <span className="text-xs uppercase tracking-wide">SOS</span>
            <span>{t("common.emergency", { defaultValue: "Emergency" })}</span>
          </a>
          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-base font-semibold transition duration-300 backdrop-blur border border-white/40 ${
                    isActive
                      ? "bg-white/70 text-slate-900 shadow-lg ring-1 ring-white/50 scale-[1.04]"
                      : "bg-white/10 text-slate-900 hover:bg-white/30 hover:shadow-md hover:-translate-y-0.5"
                  }`
                }
                aria-current={location.pathname === link.path ? "page" : undefined}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2" />

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-white/50 bg-white/40 px-3 py-2 text-slate-900 shadow-sm backdrop-blur lg:hidden"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full border-t border-white/30 bg-white/70 backdrop-blur shadow-xl lg:hidden z-50">
          <nav className="flex w-full flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-semibold border border-white/40 backdrop-blur transition duration-300 w-full text-left ${
                    isActive
                      ? "bg-white/80 text-slate-900 shadow-md ring-1 ring-white/50 scale-[1.02]"
                      : "bg-white/20 text-slate-900 hover:bg-white/40"
                  }`
                }
                aria-current={location.pathname === link.path ? "page" : undefined}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
