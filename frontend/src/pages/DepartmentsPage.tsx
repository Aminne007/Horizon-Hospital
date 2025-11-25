import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const DepartmentsPage = () => {
  const { t } = useTranslation();
  const cards = t("departments.cards", { returnObjects: true }) as { name: string; description: string }[];
  const placeholders = t("common.placeholders", { returnObjects: true }) as Record<string, string>;
  const badgeDept = t("common.badgeDept");

  const deptMeta: Record<string, { tags: string[]; accent: string }> = {
    Cardiology: { tags: ["Cath lab", "Echo", "Telemetry"], accent: "#ef4444" },
    Neurology: { tags: ["Stroke ready", "EEG", "ICU"], accent: "#a855f7" },
    Orthopedics: { tags: ["Joint care", "Sports", "Rehab"], accent: "#0ea5e9" },
    Oncology: { tags: ["Infusion", "Radiation", "Navigator"], accent: "#ec4899" },
    Pediatrics: { tags: ["NICU", "Family rooms", "24/7"], accent: "#22c55e" },
    Dermatology: { tags: ["Procedures", "Light therapy", "Cosmetic"], accent: "#f59e0b" },
    Radiology: { tags: ["MRI", "CT", "Ultrasound"], accent: "#06b6d4" },
    Surgery: { tags: ["Hybrid OR", "Robotics", "Minimally invasive"], accent: "#2563eb" },
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 sm:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <PageShell
            title={t("departments.title")}
            subtitle={t("departments.description")}
            eyebrow={t("departments.subtitle")}
            kicker="Departments"
            accent="#0ea5e9"
          >
            <div className="grid grid-cols-1 gap-5">
              {cards.map((dept) => {
                const slug = slugify(dept.name);
                const meta = deptMeta[dept.name] ?? { tags: ["24/7 coverage", "Multidisciplinary", "Escort ready"], accent: "#0ea5e9" };
                return (
                  <Link
                    key={dept.name}
                    to={`/departments/${slug}`}
                    className="group relative overflow-hidden rounded-3xl bg-white/95 p-6 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.32)] ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-[0_30px_90px_-36px_rgba(15,23,42,0.36)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/80"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 opacity-85" />
                    <div
                      className="absolute inset-y-0 left-0 w-1.5"
                      style={{ background: `linear-gradient(180deg, ${meta.accent}, ${meta.accent}cc, #0ea5e9)` }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(59,130,246,0.12),transparent_45%),radial-gradient(circle_at_76%_70%,rgba(14,165,233,0.1),transparent_40%)]" aria-hidden="true" />

                    <div className="relative grid gap-4 sm:grid-cols-[1.15fr_0.85fr] items-start">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-inner ring-1 ring-slate-200/50">
                              {dept.name.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <p className="text-lg font-semibold text-slate-900">{dept.name}</p>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{badgeDept}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 ring-1 ring-slate-200">
                            Care
                          </span>
                        </div>

                        <p className="text-sm sm:text-base text-slate-700">{dept.description}</p>

                        <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
                          {meta.tags.map((tag) => (
                            <span key={`${dept.name}-${tag}`} className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="rounded-2xl bg-white/80 p-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-inner ring-1 ring-slate-200">
                          On-floor imaging • Pharmacy link • Rehab consults
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-xs font-semibold text-slate-600 shadow-inner h-28 sm:h-32 flex items-center justify-center">
                          {placeholders.departmentImage}
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-white/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 ring-1 ring-slate-200">
                          <span>Visit</span>
                          <span aria-hidden="true">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </PageShell>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
