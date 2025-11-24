import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";

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
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <PageShell
          title={service?.title ?? t("home.servicesTitle")}
          subtitle={service?.desc ?? t("home.ctaBannerText")}
          eyebrow="Service"
          kicker="Care"
          accent="#0ea5e9"
          actions={
            <Link to="/doctors" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md hover:-translate-y-0.5 transition">
              {t("common.nav.doctors")}
            </Link>
          }
        >
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 rounded-3xl bg-white/85 p-6 shadow-md ring-1 ring-slate-200 backdrop-blur">
              <div className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                <span className="text-2xl">{service?.icon ?? "Service"}</span>
                <span>{service?.title ?? t("home.servicesTitle")}</span>
              </div>
              <p className="text-base text-slate-700">{service?.desc ?? t("home.ctaBannerText")}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">{placeholders.serviceImage}</div>
                <div className="rounded-2xl bg-slate-100 px-4 py-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">{placeholders.doctorImage}</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/85 p-6 shadow-md ring-1 ring-slate-200 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{t("home.doctorsTitle")}</h2>
                <Link to="/doctors" className="text-sm font-semibold text-slate-900 underline">
                  {t("common.nav.doctors")}
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {relatedDoctors.map((doc) => (
                  <div key={doc.name} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-lg font-semibold text-slate-900">{doc.name}</p>
                    <p className="text-sm font-semibold text-slate-700">{doc.role}</p>
                    <p className="text-sm text-slate-600">{doc.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline">
            {"<-"} {t("common.nav.home")}
          </Link>
        </PageShell>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
