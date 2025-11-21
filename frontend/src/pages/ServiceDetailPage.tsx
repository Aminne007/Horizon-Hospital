import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ServiceDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const services = t("home.services", { returnObjects: true }) as { title: string; desc: string; icon: string }[];
  const placeholders = t("common.placeholders", { returnObjects: true }) as Record<string, string>;
  const doctors = t("doctorsPage.doctors", { returnObjects: true }) as { name: string; role: string; dept: string; note: string }[];

  const service = services.find((s) => slugify(s.title) === slug);
  const relatedDoctors = doctors.slice(0, 3);

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-8 text-white shadow-xl sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Service</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{service?.title ?? t("home.servicesTitle")}</h1>
          <p className="mt-3 max-w-3xl text-lg text-blue-100">{service?.desc ?? t("home.ctaBannerText")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <div className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="text-2xl">{service?.icon ?? "🏥"}</span>
              <span>{service?.title ?? t("home.servicesTitle")}</span>
            </div>
            <p className="text-base text-slate-700">{service?.desc ?? t("home.ctaBannerText")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">{placeholders.serviceImage}</div>
              <div className="rounded-2xl bg-slate-100 px-4 py-6 text-center text-sm text-slate-500">{placeholders.doctorImage}</div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{t("home.doctorsTitle")}</h2>
              <Link to="/doctors" className="text-sm font-semibold text-blue-900 underline">
                {t("common.nav.doctors")}
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {relatedDoctors.map((doc) => (
                <div key={doc.name} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-lg font-semibold text-slate-900">{doc.name}</p>
                  <p className="text-sm font-semibold text-blue-900">{doc.role}</p>
                  <p className="text-sm text-slate-600">{doc.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 underline">
          ← {t("common.nav.home")}
        </Link>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
