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
    };
  }, [doctor.name.length, doctor.role.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-6 sm:items-center">
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white/90 p-6 shadow-2xl ring-1 ring-slate-200 backdrop-blur sm:p-8 max-h-[calc(100vh-3rem)] overflow-y-auto flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="pointer-events-none absolute -left-10 top-6 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-52 w-52 rounded-full bg-blue-100/70 blur-3xl" />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500" id={descId}>
              {doctor.role}
            </p>
            <h4 className="text-2xl font-black text-slate-900" id={titleId}>
              {doctor.name}
            </h4>
            <p className="text-sm text-slate-600">{doctor.note}</p>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800"
            onClick={onClose}
          >
            {t("common.close", { defaultValue: "Close" })}
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase text-slate-500">{t("doctorsPage.educationLabel")}</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-800">
              {education.map((item) => (
                <li key={`${doctor.name}-${item}`} className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase text-slate-500">{t("doctorsPage.experienceLabel")}</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-800">
              {experience.map((item) => (
                <li key={`${doctor.name}-${item}`} className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-900 text-white p-4 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Rating</p>
            <p className="mt-1 text-2xl font-black">{profileMeta.rating.toFixed(2)}</p>
            <p className="text-xs text-white/80">Patient satisfaction</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Response time</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{profileMeta.responseTime}</p>
            <p className="text-xs text-slate-600">Care team reply window</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Annual cases</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{profileMeta.annualCases}+</p>
            <p className="text-xs text-slate-600">Handled across {profileMeta.panelCount} panels</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {achievements.map((item) => (
            <span
              key={`${doctor.name}-${item}`}
              className="rounded-full bg-blue-900/85 px-3 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-blue-800/50"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{t("doctorsPage.specializationsLabel")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {specializations.map((item) => (
                <span key={`${doctor.name}-${item}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Professional profile</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-800">
              <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Board: {profileMeta.board}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Languages: {profileMeta.languages.join(", ")}</span>
              {profileMeta.formats.map((mode) => (
                <span key={`${doctor.name}-${mode}`} className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
                  {mode}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-600">
          <span>Updated {updatedLabel}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold ring-1 ring-slate-200">Trusted profile</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;
