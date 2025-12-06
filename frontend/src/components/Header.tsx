import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";

const DESKTOP_BREAKPOINT = 1450;

const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();

  const emergencyNumber = t("common.hotlineNumber");
  const emergencyHref = useMemo(() => {
    const digitsOnly = emergencyNumber.replace(/[^\d+]/g, "");
    return `tel:${digitsOnly}`;
  }, [emergencyNumber]);

  const navLinks = useMemo(
    () => [
      { label: t("common.nav.home"), path: "/" },
      { label: t("common.nav.services"), path: "/services" },
      { label: t("common.nav.departments"), path: "/departments" },
      { label: t("common.nav.doctors"), path: "/doctors" },
      { label: t("common.nav.appointments"), path: "/appointments" },
      { label: t("common.nav.results"), path: "/result" },
      { label: t("common.nav.contact"), path: "/contact" },
      { label: t("common.nav.about"), path: "/about" },
    ],
    [t]
  );

  useEffect(() => {
    if (!open) return;
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handleChange = (event?: MediaQueryListEvent) => {
      const matches = event ? event.matches : mq.matches;
      setIsDesktop(matches);
      if (matches) {
        setOpen(false);
      }
    };

    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    // fixed + glassmorph
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/35 backdrop-blur-xl shadow-md">
      <div className="mx-auto flex h-16 sm:h-20 w-full items-center justify-between px-4 py-3 sm:py-4 md:px-6">
        {/* Logo / name */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 text-lg font-bold text-white shadow-lg ring-1 ring-white/40 backdrop-blur">
            HC
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold text-slate-900">
              {t("common.hospitalName")}
            </p>
            <p className="text-sm text-slate-600">
              {t("common.hospitalTagline")}
            </p>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Emergency */}
          <a
            href={emergencyHref}
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-2.5 py-2 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-red-300/70 sm:px-3 sm:text-sm"
            aria-label={t("common.emergency", { defaultValue: "Emergency" })}
          >
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15"
            >
              <svg
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  fill="currentColor"
                  d="M6.6 4.2c.4-.4 1-.5 1.5-.3l2.7 1.2c.6.2.9.9.7 1.5l-.7 2.2a1.3 1.3 0 0 1-.6.8l-.8.4a10.4 10.4 0 0 0 4.6 4.6l.4-.8c.1-.3.4-.5.8-.6l2.2-.7c.6-.2 1.2.1 1.5.7l1.2 2.7c.3.5.1 1.1-.3 1.5l-1.3 1.3c-.4.4-1 .5-1.5.3C11.7 18.5 5.5 12.3 3.2 6c-.2-.5-.1-1.1.3-1.5z"
                />
              </svg>
            </span>
          </a>

          {/* Desktop nav */}
          {isDesktop && (
            <div className="flex flex-wrap justify-end gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-sm font-semibold transition duration-300 backdrop-blur border border-white/40 lg:text-base lg:px-4 ${
                      isActive
                        ? "bg-white/70 text-slate-900 shadow-lg ring-1 ring-white/50 scale-[1.04]"
                        : "bg-white/10 text-slate-900 hover:bg-white/30 hover:shadow-md hover:-translate-y-0.5"
                    }`
                  }
                  aria-current={
                    location.pathname === link.path ? "page" : undefined
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2" />

          {/* Mobile button */}
          {!isDesktop && (
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg border border-white/50 bg-white/40 px-3 py-2 text-slate-900 shadow-sm backdrop-blur"
              aria-label="Menu"
              aria-expanded={open}
            >
              <span className="sr-only">
                {open ? "Close menu" : "Open menu"}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
              >
                {open ? (
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M6 6l12 12M6 18L18 6"
                  />
                ) : (
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && !isDesktop && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-slate-200 bg-white/90 backdrop-blur-xl shadow-xl">
          <nav className="flex w-full flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `w-full rounded-xl px-4 py-3 text-left text-base font-semibold border border-slate-300 transition duration-300 ${
                    isActive
                      ? "bg-slate-100 text-slate-900 shadow-md ring-1 ring-slate-300 scale-[1.02]"
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  }`
                }
                aria-current={
                  location.pathname === link.path ? "page" : undefined
                }
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
