import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Doctor = {
  name: string;
  role: string;
  note: string;
};

type DoctorProfileModalProps = {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  achievements: string[];
  education: string[];
  experience: string[];
  specializations: string[];
  updatedLabel: string;
};

const DoctorProfileModal = ({
  doctor,
  isOpen,
  onClose,
  achievements,
  education,
  experience,
  specializations,
  updatedLabel,
}: DoctorProfileModalProps) => {
  const { t } = useTranslation();

  const titleId = `doctor-modal-title-${doctor.name.replace(/\s+/g, "-")}`;
  const descId = `doctor-modal-desc-${doctor.name.replace(/\s+/g, "-")}`;
  const profileMeta = useMemo(() => {
    const seed = doctor.name.length + doctor.role.length;
    const ratings = [4.9, 4.8, 4.95, 4.7, 5.0];
    const response = ["<10m", "<15m", "<20m", "<30m", "<45m"];
    const languages = [
      ["English", "Arabic"],
      ["English", "French"],
      ["English", "Spanish"],
      ["English", "German"],
      ["English", "Hindi"],
    ];
    const panels = [
      "Cardio-thoracic rounds",
      "Multidisciplinary tumor board",
      "Pediatric safety council",
      "Ortho mobility board",
      "Chronic care steering",
    ];
    const formats = ["In-person", "Telehealth", "Home follow-up"];
    return {
      rating: ratings[seed % ratings.length],
      responseTime: response[seed % response.length],
      languages: languages[seed % languages.length],
      board: panels[seed % panels.length],
      formats,
      panelCount: 12 + (seed % 6),
      annualCases: 240 + seed * 2,
      licenses: ["Board certified", "Fellowship trained", "Credentialed privileges"],
      clinics: ["Clinic A - Mon/Wed", "Clinic B - Tue/Thu", "Telehealth - Fri"],
    };
  }, [doctor.name.length, doctor.role.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-6 sm:items-center">
      <div
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white/95 p-0 shadow-[0_28px_90px_-34px_rgba(15,23,42,0.5)] ring-1 ring-slate-200 backdrop-blur max-h-[calc(100vh-2rem)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8%] bottom-[-12%] h-64 w-64 rounded-full bg-slate-200/50 blur-3xl" />

        <div className="relative overflow-hidden rounded-b-[28px] bg-white p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.1),transparent_36%),radial-gradient(circle_at_50%_90%,rgba(148,163,184,0.12),transparent_38%)]" aria-hidden="true" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600" id={descId}>
                {doctor.role}
              </p>
              <h4 className="text-2xl font-black text-slate-900 sm:text-3xl" id={titleId}>
                {doctor.name}
              </h4>
              <p className="text-sm text-slate-600">{doctor.note}</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              onClick={onClose}
            >
              {t("common.close", { defaultValue: "Close" })}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-semibold text-slate-700">Snapshot</h5>
                <div className="mt-2 grid gap-2 text-sm text-slate-800 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Rating</p>
                    <p className="text-xl font-bold text-slate-900">{profileMeta.rating.toFixed(2)}</p>
                    <p className="text-xs text-slate-600">Patient satisfaction</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Response</p>
                    <p className="text-base font-semibold text-slate-900">{profileMeta.responseTime}</p>
                    <p className="text-xs text-slate-600">Care team reply</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Annual cases</p>
                    <p className="text-base font-semibold text-slate-900">{profileMeta.annualCases}+</p>
                    <p className="text-xs text-slate-600">Across {profileMeta.panelCount} panels</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-700">{t("doctorsPage.educationLabel")}</h5>
                <ul className="mt-2 space-y-1 text-sm text-slate-800">
                  {education.map((item) => (
                    <li key={`${doctor.name}-${item}`} className="border-b border-slate-200/70 pb-1 last:border-none">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-700">{t("doctorsPage.experienceLabel")}</h5>
                <ul className="mt-2 space-y-1 text-sm text-slate-800">
                  {experience.map((item) => (
                    <li key={`${doctor.name}-${item}`} className="border-b border-slate-200/70 pb-1 last:border-none">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-700">{t("doctorsPage.specializationsLabel")}</h5>
                <p className="mt-2 text-sm text-slate-800">{specializations.join(", ")}</p>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-700">Licenses & clinics</h5>
                <p className="mt-2 text-sm text-slate-800">
                  Licenses: {profileMeta.licenses.join(", ")}
                </p>
                <p className="text-sm text-slate-800">
                  Clinics: {profileMeta.clinics.join(" • ")}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-semibold text-slate-700">Formats & availability</h5>
                <p className="mt-2 text-sm text-slate-800">Formats: {profileMeta.formats.join(", ")}</p>
                <p className="text-sm text-slate-800">Languages: {profileMeta.languages.join(", ")}</p>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-700">Achievements</h5>
                <ul className="mt-2 space-y-1 text-sm text-slate-800">
                  {achievements.map((item) => (
                    <li key={`${doctor.name}-${item}`} className="border-b border-slate-200/70 pb-1 last:border-none">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-slate-700">Panels & cases</h5>
                <p className="mt-2 text-sm text-slate-800">
                  {profileMeta.panelCount} expert panels; lead cases: {profileMeta.annualCases}+; board: {profileMeta.board}.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
            <span>Updated {updatedLabel}</span>
            <span className="font-semibold text-slate-700">Trusted profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;
