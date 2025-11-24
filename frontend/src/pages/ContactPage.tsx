import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="w-full px-4 py-10 sm:py-12">
        <PageShell
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
          eyebrow="We respond quickly"
          kicker="Contact"
          accent="#0ea5e9"
          actions={<span className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-md">Hotline: {t("common.hotlineNumber")}</span>}
        >
          <div className="grid gap-8 lg:grid-cols-5">
            <form className="lg:col-span-3 space-y-4 rounded-3xl bg-white/85 p-5 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                  {t("contact.name")}
                <input type="text" className="rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-4 py-3 text-base sm:text-lg border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_38px_-28px_rgba(15,23,42,0.35)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition" />
              </label>
              <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                {t("contact.email")}
                <input type="email" className="rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-4 py-3 text-base sm:text-lg border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_38px_-28px_rgba(15,23,42,0.35)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition" />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("contact.subject")}
              <input type="text" className="rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-4 py-3 text-base sm:text-lg border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_38px_-28px_rgba(15,23,42,0.35)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition" />
            </label>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("contact.message")}
              <textarea rows={4} className="rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-4 py-3 text-base sm:text-lg border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_38px_-28px_rgba(15,23,42,0.35)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition" />
            </label>
              <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
                <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Same-day callbacks</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Secure intake</span>
              </div>
              <button type="button" className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 sm:text-lg">
                {t("contact.submit")}
              </button>
            </form>

            <div className="lg:col-span-2 space-y-4 rounded-3xl bg-white/85 p-5 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:p-6">
              <h2 className="text-2xl font-bold">{t("contact.infoTitle")}</h2>
              <p className="text-lg text-slate-800">{t("contact.address")}</p>
              <p className="text-lg text-slate-800">{t("contact.phone")}</p>
              <p className="text-lg text-slate-800">{t("contact.emailAddress")}</p>
              <p className="text-lg text-slate-800">{t("contact.hours")}</p>
              <div className="rounded-2xl bg-slate-100 px-4 py-8 text-center text-lg font-semibold text-slate-600 ring-1 ring-slate-200">
                {t("contact.mapHint")}
              </div>
            </div>
          </div>
        </PageShell>
      </div>
    </div>
  );
};

export default ContactPage;
