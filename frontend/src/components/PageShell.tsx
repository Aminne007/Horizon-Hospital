import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string;
  kicker?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const PageShell = ({
  eyebrow,
  title,
  subtitle,
  accent = "#0ea5e9",
  kicker,
  actions,
  children,
}: PageShellProps) => {
  const accentBg = `${accent}22`;
  const accentText = accent;

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.32)] ring-1 ring-white/60 backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_78%_35%,rgba(14,165,233,0.1),transparent_36%),radial-gradient(circle_at_50%_85%,rgba(148,163,184,0.12),transparent_38%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: accentBg }} />
        <div className="pointer-events-none absolute right-[-10%] bottom-[-15%] h-64 w-64 rounded-full bg-slate-200/60 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 px-6 py-8 sm:px-9 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              {(kicker || eyebrow) && (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] shadow-sm">
                  {kicker || eyebrow}
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentText }} />
                </div>
              )}
              <h1 className="text-[clamp(1.9rem,3.6vw,3.3rem)] font-black leading-tight text-slate-900">{title}</h1>
              {subtitle && <p className="max-w-3xl text-base text-slate-700 sm:text-lg">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentText }} />
              Curated experience
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6 sm:mt-10">{children}</div>
    </div>
  );
};

export default PageShell;
