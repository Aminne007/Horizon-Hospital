import { useTranslation } from "react-i18next";
import heroImageOne from "../assets/Hero-title.webp";
import PageShell from "../components/PageShell";

const AboutPage = () => {
  const { t } = useTranslation();
  const stats = t("about.stats", { returnObjects: true }) as { label: string; value: string }[];

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="w-full px-4 py-10 sm:py-12">
        <PageShell
          title={t("about.title")}
          subtitle={t("about.intro")}
          eyebrow={t("common.hospitalName")}
          kicker="About"
          accent="#0ea5e9"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white/80 p-5 shadow-md ring-1 ring-slate-200 backdrop-blur sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 sm:text-sm">{t("about.whoTitle")}</p>
              <p className="mt-2 text-base sm:text-lg text-slate-800">{t("about.whoText")}</p>
              <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
                <img src={heroImageOne} alt="Hospital exterior" className="h-44 w-full object-cover sm:h-56" />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-white/80 p-5 shadow-md ring-1 ring-slate-200 backdrop-blur sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 sm:text-sm">{t("about.missionTitle")}</p>
                <p className="mt-2 text-base sm:text-lg text-slate-800">{t("about.missionText")}</p>
              </div>
              <div className="rounded-3xl bg-white/80 p-5 shadow-md ring-1 ring-slate-200 backdrop-blur sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 sm:text-sm">{t("about.visionTitle")}</p>
                <p className="mt-2 text-base sm:text-lg text-slate-800">{t("about.visionText")}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl bg-white/85 p-5 text-center shadow-md ring-1 ring-slate-200 backdrop-blur">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-lg font-semibold text-slate-700">{stat.label}</p>
              </div>
            ))}
          </div>
        </PageShell>
      </div>
    </div>
  );
};

export default AboutPage;
