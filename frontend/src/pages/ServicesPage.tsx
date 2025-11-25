import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useScrollReveal from "../hooks/useScrollReveal";

type Service = { title: string; desc: string; icon: string };

type ServicesCopy = {
  title: string;
  subtitle: string;
  badges: string[];
  highlights: { title: string; desc: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
  gridKicker: string;
  gridTitle: string;
  gridSubtitle: string;
  flowKicker: string;
  flowTitle: string;
  flowSubtitle: string;
  flowSteps: { title: string; desc: string }[];
};

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ServicesPage = () => {
  const { t } = useTranslation();
  const services = t("home.services", { returnObjects: true }) as Service[];
  const pageCopy = t("servicesPage", { returnObjects: true }) as ServicesCopy;

  const fallbackFlow = [
    { title: "Arrival & triage", desc: "Concierge check-in, vitals, and escalation without waits." },
    { title: "Diagnostics & consult", desc: "MRI, CT, labs, and specialist review in the same visit." },
    { title: "Procedure & recovery", desc: "Modern OR suites and calm recovery rooms with updates." },
    { title: "Follow-up & support", desc: "Pharmacy handoff, rehab scheduling, and text check-ins." },
  ];
  const flowSteps = (pageCopy?.flowSteps && Array.isArray(pageCopy.flowSteps) && pageCopy.flowSteps.length
    ? pageCopy.flowSteps
    : fallbackFlow) as { title: string; desc: string }[];

  const serviceMeta: Record<string, { highlights: string[]; icon: ReactElement }> = {
    "Emergency & Trauma": {
      highlights: ["Rapid response", "On-site imaging", "24/7 triage"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" opacity="0.18" />
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      ),
    },
    "Surgery Center": {
      highlights: ["Hybrid OR", "Robotic assist", "Minimally invasive"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" aria-hidden="true">
          <path d="M6 5.5 13.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14.5 13.5 18 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 18 11 12l2 2-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.5 6.5 17.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    "Imaging & MRI": {
      highlights: ["3T MRI", "CT & Ultrasound", "Same-day reads"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" aria-hidden="true">
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 9.5c1.5-1.5 6.5-1.5 8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 14.5c1.5 1.5 6.5 1.5 8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </svg>
      ),
    },
    "Pharmacy & Labs": {
      highlights: ["On-site meds", "Same-day labs", "Counseling"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" aria-hidden="true">
          <rect x="5" y="6" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M7.5 10h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 6V5a2 2 0 0 1 2-2h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    "Maternity & Pediatrics": {
      highlights: ["Family suites", "NICU-ready", "Child-friendly"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" aria-hidden="true">
          <path d="M7 10.5a3 3 0 1 1 6 0v.6a3.4 3.4 0 0 1-3 3.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M5.5 15.5c1.5-1.2 4.2-1.2 5.7 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M15.5 9.5a2.5 2.5 0 1 1 3 2.4V14a3 3 0 0 1-3 3h-.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    "Rehab & Recovery": {
      highlights: ["Physical therapy", "Pain control", "Home plans"],
      icon: (
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 12h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M9 9h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  };

  const getIcon = (service: Service) => serviceMeta[service.title]?.icon ?? (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" aria-hidden="true">
      <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  const getHighlights = (service: Service) =>
    serviceMeta[service.title]?.highlights ?? ["Coordinated care", "Calm rooms", "Specialist-led"];

  useScrollReveal();

  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-slate-50 to-sky-50 text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_78%_35%,rgba(14,165,233,0.1),transparent_36%),radial-gradient(circle_at_50%_85%,rgba(14,165,233,0.08),transparent_38%)]" aria-hidden="true" />
        <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl animate-pan-soft" aria-hidden="true" />
        <div className="absolute -right-16 -bottom-10 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl animate-pan-soft" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.32)] ring-1 ring-white/60 backdrop-blur">
            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-white via-slate-50 to-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.12),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.1),transparent_36%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,0.08),transparent_38%)]" aria-hidden="true" />
              <div className="flex flex-col gap-5 px-6 py-7 sm:px-9 sm:py-10">
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em]">
                  Services
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.2)]" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-[clamp(2rem,4vw,3.6rem)] font-black leading-tight text-slate-900">{pageCopy.title}</h1>
                  <p className="max-w-3xl text-base text-slate-700 sm:text-lg">{pageCopy.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/appointments"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-slate-900/60 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    {pageCopy.ctaPrimary}
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    {pageCopy.ctaSecondary}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white via-slate-50 to-white px-4 py-16 sm:py-[4.75rem]">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">{pageCopy.gridKicker}</p>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">{pageCopy.gridTitle}</h2>
            <p className="text-sm text-slate-600 sm:text-base max-w-3xl">{pageCopy.gridSubtitle}</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {services.map((service) => {
              const highlights = getHighlights(service);
              return (
                <Link
                  key={service.title}
                  to={`/services/${slugify(service.title)}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_55px_-28px_rgba(15,23,42,0.32)] transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/80"
                >
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-sky-500 via-blue-500 to-emerald-400" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50 opacity-80" aria-hidden="true" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-inner">
                      {getIcon(service)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-lg font-semibold text-slate-900 sm:text-xl">{service.title}</p>
                      <p className="text-sm text-slate-600 sm:text-base">{service.desc}</p>
                    </div>
                    <span className="relative mt-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100">
                      Details
                    </span>
                  </div>
                  <div className="relative mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
                    {highlights.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="relative mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Readiness</p>
                      <p className="mt-1 font-semibold text-slate-900">Flagship line</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Availability</p>
                      <p className="mt-1 font-semibold text-slate-900">24/7 with escort</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-4 py-14 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(59,130,246,0.24),transparent_42%),radial-gradient(circle_at_78%_62%,rgba(14,165,233,0.18),transparent_40%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl space-y-7 text-white">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-200">{pageCopy.flowKicker}</p>
              <h2 className="text-2xl font-black sm:text-3xl">{pageCopy.flowTitle}</h2>
              <p className="text-sm text-blue-100 sm:text-base">{pageCopy.flowSubtitle}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {flowSteps.map((step, idx) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/85 via-sky-900/80 to-slate-950/90 p-5 shadow-[0_22px_55px_-26px_rgba(37,99,235,0.7)] ring-1 ring-sky-500/35 backdrop-blur scroll-reveal"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.18),transparent_42%)] opacity-90" aria-hidden="true" />
                <div className="relative flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Step {idx + 1}</p>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white ring-1 ring-white/30 shadow-inner">
                    Calm
                  </span>
                </div>
                <h3 className="relative mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="relative mt-2 text-sm text-blue-100">{step.desc}</p>
                <div className="relative mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_6px_rgba(52,211,153,0.25)]" aria-hidden="true" />
                  Guided escorts
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
