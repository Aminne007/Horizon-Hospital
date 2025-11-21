import { useTranslation } from "react-i18next";
import { useState } from "react";

const PatientStoriesPage = () => {
  const { t } = useTranslation();
  const testimonials = t("home.testimonials", { returnObjects: true }) as { quote: string; name: string }[];
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 space-y-10">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-10 text-white shadow-lg">
          <h1 className="text-4xl font-bold">{t("home.testimonialsTitle")}</h1>
          <p className="mt-3 text-lg text-blue-100">{t("home.testimonialsSubtitle")}</p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/50 transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            Add your review
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((story) => (
            <div
              key={story.name}
              className="flex h-full flex-col gap-3 rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg hover:ring-slate-200"
            >
              <p className="text-lg text-slate-800">“{story.quote}”</p>
              <p className="text-sm font-semibold text-blue-900">{story.name}</p>
              <div className="text-xs text-slate-500">Patient story</div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-slate-50 px-6 py-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">{t("home.ctaBannerTitle")}</h2>
          <p className="mt-2 text-base text-slate-700">{t("home.ctaBannerText")}</p>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                We ask for basic visit details to guarantee 100% trusted reviews.
              </p>
              <h2 className="text-2xl font-bold text-slate-900">Share your experience</h2>
            </div>

            <form className="mt-5 grid gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                  Full name
                  <input
                    required
                    type="text"
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base"
                    placeholder="Your full name"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                  Passport / ID number
                  <input
                    required
                    type="text"
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base"
                    placeholder="Document number"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                  Date of service
                  <input
                    required
                    type="date"
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                  Department / doctor visited
                  <input
                    required
                    type="text"
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base"
                    placeholder="e.g., Cardiology - Dr. Ava Thompson"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                Brief visit details (for verification)
                <textarea
                  required
                  rows={3}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base"
                  placeholder="Mention your visit purpose and any reference numbers."
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                Your review
                <textarea
                  required
                  rows={4}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base"
                  placeholder="Describe your experience and wishes for others."
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-900 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  Submit review
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientStoriesPage;
