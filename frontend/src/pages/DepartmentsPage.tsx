import { useTranslation } from "react-i18next";

const DepartmentsPage = () => {
  const { t } = useTranslation();
  const cards = t("departments.cards", { returnObjects: true }) as { name: string; description: string }[];
  const placeholders = t("common.placeholders", { returnObjects: true }) as Record<string, string>;
  const badgeDept = t("common.badgeDept");

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-10 text-white shadow-lg">
          <p className="text-sm font-semibold text-blue-100">{t("departments.subtitle")}</p>
          <h1 className="mt-2 text-4xl font-bold">{t("departments.title")}</h1>
          <p className="mt-3 max-w-3xl text-lg text-blue-100">{t("departments.description")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((dept) => (
            <div key={dept.name} className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-slate-900">{dept.name}</p>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">{badgeDept}</span>
              </div>
              <p className="mt-3 text-base text-slate-700">{dept.description}</p>
              <div className="mt-4 h-28 rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
                {placeholders.departmentImage}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
