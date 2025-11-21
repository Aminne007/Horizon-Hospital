import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-10 text-white shadow-lg">
          <h1 className="text-4xl font-bold">{t("contact.title")}</h1>
          <p className="mt-2 text-lg text-blue-100">{t("contact.subtitle")}</p>
          <p className="mt-1 text-base font-semibold text-white">{t("contact.helper")}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <form className="lg:col-span-3 space-y-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                {t("contact.name")}
                <input type="text" className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
              </label>
              <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                {t("contact.email")}
                <input type="email" className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("contact.subject")}
              <input type="text" className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
            </label>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("contact.message")}
              <textarea rows={4} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
            </label>
            <button type="button" className="w-full rounded-2xl bg-blue-900 px-5 py-3 text-lg font-semibold text-white shadow-lg">
              {t("contact.submit")}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
            <h2 className="text-2xl font-bold">{t("contact.infoTitle")}</h2>
            <p className="text-lg text-slate-800">📍 {t("contact.address")}</p>
            <p className="text-lg text-slate-800">☎ {t("contact.phone")}</p>
            <p className="text-lg text-slate-800">✉ {t("contact.emailAddress")}</p>
            <p className="text-lg text-slate-800">⏰ {t("contact.hours")}</p>
            <div className="rounded-2xl bg-slate-100 px-4 py-8 text-center text-lg font-semibold text-slate-600">
              {t("contact.mapHint")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
