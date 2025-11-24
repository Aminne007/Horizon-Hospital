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
      <div
        className="relative overflow-hidden rounded-3xl bg-white/70 shadow-lg ring-1 ring-slate-200"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${accentBg}, transparent 35%), radial-gradient(circle at 80% 0%, #ffffff, transparent 35%), linear-gradient(135deg, #f8fafc, #ffffff)`,
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 top-8 h-48 w-48 rounded-full blur-3xl" style={{ backgroundColor: accentBg }} />
          <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full blur-3xl" style={{ backgroundColor: "#e2e8f0" }} />
        </div>
        <div className="relative flex flex-col gap-4 px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              {kicker && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{kicker}</p>}
              {eyebrow && <p className="text-xs font-semibold text-slate-600">{eyebrow}</p>}
              <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">{title}</h1>
              {subtitle && <p className="max-w-3xl text-base text-slate-700 sm:text-lg">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 ring-1 ring-slate-200">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentText }} />
              Curated experience
            </span>
            {/* Removed redundant theme label for cleaner footer alignment */}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6 sm:mt-10">{children}</div>
    </div>
  );
};

export default PageShell;
