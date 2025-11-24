import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";

const DepartmentDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const departments = t("departments.cards", { returnObjects: true }) as { name: string; description: string; services?: string[] }[];
  const dept = departments.find((d) => d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
  const placeholders = t("common.placeholders", { returnObjects: true }) as Record<string, string>;

  if (!dept) {
    return (
      <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
        <div className="w-full px-4 py-10 sm:py-12">
          <div className="rounded-3xl bg-red-50 p-6 text-red-900 ring-1 ring-red-200">
            <p className="text-lg font-semibold">Department not found</p>
            <p className="mt-2 text-sm">Please return to the departments list.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="w-full px-4 py-10 sm:py-12">
        <PageShell
          title={dept.name}
          subtitle={dept.description}
          eyebrow="Department"
          kicker="Specialty"
          accent="#0ea5e9"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl bg-white/85 p-5 shadow-md ring-1 ring-slate-200 backdrop-blur sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 sm:text-sm">Highlights</p>
              <p className="mt-2 text-base text-slate-800">{dept.description}</p>
              <div className="mt-4 h-32 rounded-2xl bg-slate-100 text-center text-sm text-slate-500 ring-1 ring-slate-200">
                {placeholders.departmentImage}
              </div>
            </div>
            <div className="rounded-3xl bg-white/85 p-5 shadow-md ring-1 ring-slate-200 backdrop-blur sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 sm:text-sm">Services</p>
              <ul className="mt-3 space-y-2 text-base text-slate-800">
                {(dept.services || ["Consultations", "Diagnostics", "Follow-ups"]).map((service) => (
                  <li key={service} className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white/85 p-5 shadow-md ring-1 ring-slate-200 backdrop-blur sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 sm:text-sm">Care approach</p>
              <p className="mt-2 text-base text-slate-800">
                Multidisciplinary teams collaborate on complex cases to ensure continuity and patient-centered outcomes.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-900">
                <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">24/7 Coverage</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Board-certified</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Evidence-based</span>
              </div>
            </div>
          </div>
        </PageShell>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
