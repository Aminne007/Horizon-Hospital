import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const DepartmentsPage = () => {
  const { t } = useTranslation();
  const cards = t("departments.cards", { returnObjects: true }) as { name: string; description: string }[];
  const placeholders = t("common.placeholders", { returnObjects: true }) as Record<string, string>;
  const badgeDept = t("common.badgeDept");

  return (
    <div className="bg-white text-slate-900">
      <div className="w-full px-4 py-10 sm:py-12">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 px-5 py-8 text-white shadow-lg sm:mb-8 sm:px-6 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-100 sm:text-sm">{t("departments.subtitle")}</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-4xl">{t("departments.title")}</h1>
          <p className="mt-3 text-base sm:text-lg text-blue-100">{t("departments.description")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((dept) => {
            const slug = slugify(dept.name);
            return (
              <Link
                key={dept.name}
                to={`/departments/${slug}`}
                className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-slate-900">{dept.name}</p>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-900">{badgeDept}</span>
                </div>
                <p className="mt-3 text-sm sm:text-base text-slate-700">{dept.description}</p>
                <div className="mt-4 h-28 rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
                  {placeholders.departmentImage}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
