import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const DepartmentsPage = () => {
  const { t } = useTranslation();
  const cards = t("departments.cards", { returnObjects: true }) as { name: string; description: string }[];
  const placeholders = t("common.placeholders", { returnObjects: true }) as Record<string, string>;
  const badgeDept = t("common.badgeDept");

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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {cards.slice(0, 2).map((dept) => (
                <div key={`${dept.name}-highlight`} className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-slate-900">{dept.name}</p>
                    <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold">Featured</span>
                  </div>
                  <p className="mt-3 text-base text-slate-700">{dept.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                    <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">24/7 coverage</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Multidisciplinary</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((dept) => {
                const slug = slugify(dept.name);
                return (
                  <Link
                    key={dept.name}
                    to={`/departments/${slug}`}
                    className="group relative overflow-hidden rounded-3xl bg-white/85 p-5 shadow-md ring-1 ring-slate-200 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-80" />
                    <div className="relative flex items-center justify-between">
                      <p className="text-lg font-bold text-slate-900">{dept.name}</p>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-900 ring-1 ring-blue-100">{badgeDept}</span>
                    </div>
                    <p className="relative mt-3 text-sm sm:text-base text-slate-700">{dept.description}</p>
                    <div className="relative mt-4 h-28 rounded-2xl bg-slate-100 text-center text-sm text-slate-500 ring-1 ring-slate-200">
                      {placeholders.departmentImage}
                    </div>
                    <div className="relative mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Explore department
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
