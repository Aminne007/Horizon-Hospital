import { useTranslation } from "react-i18next";
import heroImageOne from "../assets/Hero-title.webp";

const AboutPage = () => {
  const { t } = useTranslation();
  const stats = t("about.stats", { returnObjects: true }) as { label: string; value: string }[];

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-10 text-white shadow-lg">
          <h1 className="text-4xl font-bold">{t("about.title")}</h1>
          <p className="mt-3 text-lg text-blue-100">{t("about.intro")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-700">{t("about.whoTitle")}</p>
            <p className="mt-2 text-lg text-slate-800">{t("about.whoText")}</p>
            <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
              <img src={heroImageOne} alt="Hospital exterior" className="h-48 w-full object-cover" />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-700">{t("about.missionTitle")}</p>
              <p className="mt-2 text-lg text-slate-800">{t("about.missionText")}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-700">{t("about.visionTitle")}</p>
              <p className="mt-2 text-lg text-slate-800">{t("about.visionText")}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-white p-5 text-center shadow-md ring-1 ring-slate-100">
              <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
              <p className="text-lg font-semibold text-slate-800">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
