import { useTranslation } from "react-i18next";
import { useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import PageShell from "../components/PageShell";

const PatientStoriesPage = () => {
  const { t } = useTranslation();
  const testimonials = t("home.testimonials", { returnObjects: true }) as { quote: string; name: string }[];
  const [isAdding, setIsAdding] = useState(false);
  useScrollReveal();

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 space-y-10">
        <PageShell
          title={t("home.testimonialsTitle")}
          subtitle="Voices from patients, families, and caregivers—curated for honesty and clarity."
          eyebrow="Stories"
          kicker="Testimonials"
          accent="#0ea5e9"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Add your review
                <span aria-hidden="true" className="text-base">
                  &#8594;
                </span>
              </button>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                Verified visits only
              </span>
            </div>
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((story) => (
              <div
                key={story.name}
                className="flex h-full flex-col gap-3 rounded-3xl bg-white/90 p-5 shadow-xl ring-1 ring-slate-200 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl scroll-reveal"
              >
                <p className="text-lg text-slate-800">"{story.quote}"</p>
                <p className="text-sm font-semibold text-slate-900">{story.name}</p>
                <div className="text-xs font-semibold text-slate-500">Patient story</div>
              </div>
            ))}
          </div>
        </PageShell>

      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div
            className="mx-auto w-full max-w-full rounded-3xl bg-white p-6 shadow-2xl sm:max-w-3xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            aria-describedby="review-modal-desc"
          >
            <div>
              <p className="text-sm font-semibold text-blue-900" id="review-modal-desc">
                We ask for basic visit details to guarantee 100% trusted reviews.
              </p>
              <h2 className="text-2xl font-bold text-slate-900" id="review-modal-title">
                Share your experience
              </h2>
            </div>

            <form className="mt-5 grid gap-4 overflow-y-auto pr-1" style={{ maxHeight: "calc(90vh - 120px)" }} onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                  Full name
                  <input
                    required
                    type="text"
                    className="w-full rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_30px_-26px_rgba(15,23,42,0.5)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
                    placeholder="Your full name"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                  Passport / ID number
                  <input
                    required
                    type="text"
                    className="w-full rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_30px_-26px_rgba(15,23,42,0.5)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
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
                    className="w-full rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_30px_-26px_rgba(15,23,42,0.5)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                  Department / doctor visited
                  <input
                    required
                    type="text"
                    className="w-full rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_30px_-26px_rgba(15,23,42,0.5)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
                    placeholder="e.g., Cardiology - Dr. Ava Thompson"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                Brief visit details (for verification)
                <textarea
                  required
                  rows={2}
                  className="w-full rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_30px_-26px_rgba(15,23,42,0.5)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
                  placeholder="Mention your visit purpose and any reference numbers."
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
                Your review
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_30px_-26px_rgba(15,23,42,0.5)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
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
