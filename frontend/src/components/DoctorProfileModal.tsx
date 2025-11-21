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
  onBook: (name: string) => void;
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
  onBook,
  achievements,
  education,
  experience,
  specializations,
  updatedLabel,
}: DoctorProfileModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-6 sm:items-center">
      <div
        className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8 max-h-[calc(100vh-3rem)] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={`Doctor profile for ${doctor.name}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{doctor.role}</p>
            <h4 className="text-2xl font-bold text-slate-900">{doctor.name}</h4>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
            onClick={onClose}
          >
            {t("common.close", { defaultValue: "Close" })}
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-600">{doctor.note}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">{t("doctorsPage.educationLabel")}</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {education.map((item) => (
                <li key={`${doctor.name}-${item}`} className="rounded-xl bg-slate-50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">{t("doctorsPage.experienceLabel")}</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {experience.map((item) => (
                <li key={`${doctor.name}-${item}`} className="rounded-xl bg-slate-50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {achievements.map((item) => (
            <span
              key={`${doctor.name}-${item}`}
              className="rounded-full bg-blue-900/80 px-3 py-1 text-xs font-semibold text-white"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <p>{t("doctorsPage.specializationsLabel")}:</p>
          {specializations.map((item) => (
            <span key={`${doctor.name}-${item}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white shadow-lg sm:text-base"
            onClick={() => onBook(doctor.name)}
          >
            {t("doctorsPage.book")}
          </button>
          <button
            type="button"
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm sm:text-base"
            onClick={onClose}
          >
            {t("common.close", { defaultValue: "Close" })}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">{updatedLabel}</p>
      </div>
    </div>
  );
};

export default DoctorProfileModal;
