import { useMemo, useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDoctorSelection } from "../context/DoctorSelectionContext";
import DoctorProfileModal from "../components/DoctorProfileModal";

const DoctorsPage = () => {
  const { t } = useTranslation();
  const doctors = t("doctorsPage.doctors", { returnObjects: true }) as {
    name: string;
    role: string;
    dept: string;
    note: string;
  }[];

  const departments = [t("doctorsPage.allDepartments"), ...Array.from(new Set(doctors.map((d) => d.dept)))];
  const placeholders = t("common.placeholders", { returnObjects: true }) as Record<string, string>;
  const badgeDept = t("common.badgeDept");
  const education = t("doctorsPage.educationSample", { returnObjects: true }) as string[];
  const experience = t("doctorsPage.experienceSample", { returnObjects: true }) as string[];
  const specializations = t("doctorsPage.specializationsSample", { returnObjects: true }) as string[];
  const achievements = t("doctorsPage.achievementsSample", { returnObjects: true }) as string[];
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeDoctor, setActiveDoctor] = useState<null | typeof doctors[0]>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setSelectedDoctor } = useDoctorSelection();

  const formattedDates = useMemo(
    () =>
      doctors.map((_, idx) =>
        new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(
          new Date(2024 + Math.floor(idx / 12), idx % 12, Math.min(28, idx + 5))
        )
      ),
    [doctors]
  );
  useScrollReveal();

  const handleBook = (docName: string) => {
    setSelectedDoctor(docName);
    navigate(`/appointments?doctor=${encodeURIComponent(docName)}`);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 space-y-8">
        <div className="rounded-3xl bg-slate-50 px-5 py-7 shadow-sm ring-1 ring-slate-100 sm:px-6 sm:py-8">
          <p className="text-xs font-semibold text-slate-700 sm:text-sm">{t("doctorsPage.subtitle")}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t("doctorsPage.title")}</h1>
          <p className="mt-3 text-base text-slate-800 sm:text-lg">{t("doctorsPage.description")}</p>
        </div>

        {/* Mobile-friendly doctor highlight */}
        <div className="rounded-3xl bg-blue-900 p-5 text-white shadow-lg ring-1 ring-blue-800 sm:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">{t("doctorsPage.title")}</p>
              <h2 className="text-xl font-bold">Our doctors</h2>
            </div>
            <div className="flex gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev - 1 + doctors.length) % doctors.length)}
                className="rounded-full border border-white/40 px-3 py-1 hover:bg-white/10"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev + 1) % doctors.length)}
                className="rounded-full border border-white/40 px-3 py-1 hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
          <div className="mt-4 space-y-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{doctors[carouselIndex]?.name}</p>
                <p className="text-sm text-blue-100">{doctors[carouselIndex]?.role}</p>
              </div>
              <p className="text-[11px] uppercase text-blue-100">Updated {formattedDates[carouselIndex]}</p>
            </div>
            <p className="text-sm text-white/90">{doctors[carouselIndex]?.note}</p>
            <div className="flex flex-wrap gap-2">
              {achievements.map((item) => (
                <span key={`${doctors[carouselIndex]?.name}-${item}`} className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop/tablet carousel */}
        <div className="hidden rounded-3xl bg-gradient-to-r from-blue-950 to-blue-800 p-6 text-white shadow-xl sm:block sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-100">{t("doctorsPage.title")}</p>
              <h2 className="text-2xl font-bold sm:text-3xl">Specialists you can trust</h2>
              <p className="text-base text-blue-100 sm:text-lg">Swipe through each doctor’s credentials and achievements.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setCarouselIndex((prev) => (prev - 1 + doctors.length) % doctors.length)
                }
                className="rounded-full border border-white/50 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition sm:px-4 sm:text-sm"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev + 1) % doctors.length)}
                className="rounded-full border border-white/50 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition sm:px-4 sm:text-sm"
              >
                Next
              </button>
            </div>
          </div>
          <div className="relative mt-6 overflow-hidden rounded-2xl bg-white/10 shadow-inner ring-1 ring-white/20">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {doctors.map((doc, idx) => (
                <article key={doc.name} className="min-w-full p-6">
                  <div className="flex flex-col gap-4 rounded-2xl bg-white/20 p-5 text-slate-900 shadow-inner">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{doc.name}</p>
                        <p className="text-sm font-semibold text-blue-100">{doc.role}</p>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                        Updated {formattedDates[idx]}
                      </p>
                    </div>
                    <p className="text-sm text-white/90">{doc.note}</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold uppercase text-white/80">{t("doctorsPage.educationLabel")}</p>
                        <ul className="mt-2 space-y-1 text-sm text-white/70">
                          {education.map((item) => (
                            <li key={`${doc.name}-${item}`} className="rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/10">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase text-white/80">{t("doctorsPage.experienceLabel")}</p>
                        <ul className="mt-2 space-y-1 text-sm text-white/70">
                          {experience.map((item) => (
                            <li key={`${doc.name}-${item}`} className="rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/10">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2">
                      <p className="text-sm font-semibold uppercase text-white/80">{t("doctorsPage.achievementsLabel")}</p>
                      <div className="flex flex-wrap gap-2">
                        {achievements.map((item) => (
                          <span
                            key={`${doc.name}-${item}`}
                            className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-blue-100">
                      <p>{t("doctorsPage.specializationsLabel")}:</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {specializations.map((item) => (
                          <span key={`${doc.name}-${item}`} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <label className="text-sm font-semibold text-slate-700">{t("doctorsPage.filterDepartment")}</label>
              <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900">
                {departments.map((dept) => (
                  <option key={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <label className="text-sm font-semibold text-slate-700">{t("doctorsPage.searchPlaceholder")}</label>
              <input
                type="search"
                placeholder={t("doctorsPage.searchPlaceholder")}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900"
              />
            </div>
          </div>
          <Link to="/appointments" className="rounded-2xl bg-blue-900 px-5 py-3 text-base font-semibold text-white shadow-lg sm:px-6 sm:text-lg">
            {t("home.ctaPrimary")}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <div
              key={doc.name}
              className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover-lift scroll-reveal cursor-pointer"
              onClick={() => {
                setActiveDoctor(doc);
                setIsModalOpen(true);
              }}
            >
              <div className="h-36 rounded-2xl bg-slate-100 text-center text-sm text-slate-500">{placeholders.doctorImage}</div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-bold text-slate-900 sm:text-xl">{doc.name}</p>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">{badgeDept}</span>
              </div>
              <p className="text-base font-semibold text-blue-900">{doc.role}</p>
              <p className="mt-2 text-sm text-slate-700 sm:text-base">{doc.note}</p>
              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-blue-900 px-4 py-3 text-base font-semibold text-white sm:text-lg"
                onClick={(event) => {
                  event.stopPropagation();
                  handleBook(doc.name);
                }}
              >
                {t("doctorsPage.book")}
              </button>
            </div>
          ))}
        </div>

        {activeDoctor && (
          <DoctorProfileModal
            doctor={activeDoctor}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onBook={handleBook}
            achievements={achievements}
            education={education}
            experience={experience}
            specializations={specializations}
            updatedLabel={formattedDates[carouselIndex]}
          />
        )}

      </div>
    </div>
  );
};

export default DoctorsPage;
