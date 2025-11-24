import { useMemo, useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import { useTranslation } from "react-i18next";
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
  const badgeDept = t("common.badgeDept");
  const education = t("doctorsPage.educationSample", { returnObjects: true }) as string[];
  const experience = t("doctorsPage.experienceSample", { returnObjects: true }) as string[];
  const specializations = t("doctorsPage.specializationsSample", { returnObjects: true }) as string[];
  const achievements = t("doctorsPage.achievementsSample", { returnObjects: true }) as string[];
  const [activeDoctor, setActiveDoctor] = useState<null | typeof doctors[0]>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const palettes = useMemo(
    () => [
      { from: "#eef2ff", to: "#e0f2fe", accent: "#4338ca", ring: "ring-indigo-200" },
      { from: "#fef3c7", to: "#e0f2fe", accent: "#c2410c", ring: "ring-orange-200" },
      { from: "#f1f5f9", to: "#dcfce7", accent: "#0f766e", ring: "ring-emerald-200" },
      { from: "#fff1f2", to: "#e0f2fe", accent: "#be123c", ring: "ring-rose-200" },
      { from: "#f4f4ff", to: "#fce7f3", accent: "#7c3aed", ring: "ring-purple-200" },
      { from: "#f0f9ff", to: "#ecfeff", accent: "#0ea5e9", ring: "ring-sky-200" },
    ],
    []
  );
  const scheduleTemplates = useMemo(
    () => [
      ["Mon 9-1", "Wed 12-5", "Fri 9-3"],
      ["Tue 10-4", "Thu 9-2", "Sat 10-1"],
      ["Mon 2-6", "Wed 9-1", "Thu 1-5"],
      ["Tue 9-3", "Fri 10-4", "Sat 9-12"],
    ],
    []
  );
  const highlightStats = useMemo(
    () => [
      { label: "Years of experience", value: "15+" },
      { label: "Patient satisfaction", value: "98%" },
      { label: "Procedures completed", value: "4.5k" },
      { label: "Research papers", value: "32" },
      { label: "Languages spoken", value: "4" },
      { label: "Response time", value: "<15m" },
    ],
    []
  );
  const doctorProfiles = useMemo(
    () =>
      doctors.map((doc, idx) => {
        const palette = palettes[idx % palettes.length];
        const schedule = scheduleTemplates[idx % scheduleTemplates.length];
        const stat = highlightStats[idx % highlightStats.length];
        const deptKey = doc.dept.toLowerCase();
        const tailored = (() => {
          if (deptKey.includes("cardio")) {
            return {
              quote: "Heart-first decisions powered by precise diagnostics.",
              focus: "Advanced echo, preventive cardiology, and rhythm care.",
            };
          }
          if (deptKey.includes("pedi")) {
            return {
              quote: "Pediatric care that keeps families confident and calm.",
              focus: "Growth tracking, vaccinations, and friendly consultations.",
            };
          }
          if (deptKey.includes("ortho")) {
            return {
              quote: "Movement restored with evidence-based orthopedics.",
              focus: "Injury triage, joint care, and recovery roadmaps.",
            };
          }
          if (deptKey.includes("neuro")) {
            return {
              quote: "Clarity and comfort for complex neurological stories.",
              focus: "Headache clinics, seizure care, and cognitive mapping.",
            };
          }
          if (deptKey.includes("derm")) {
            return {
              quote: "Skin health designed for real life, not stock photos.",
              focus: "Dermoscopy, tailored regimens, and scar management.",
            };
          }
          return {
            quote: "Whole-person medicine that meets you where you are.",
            focus: doc.note,
          };
        })();
        const insights = [
          { label: "Lead cases this year", value: `${180 + idx * 12}` },
          { label: stat.label, value: stat.value },
          { label: "Team handoffs", value: `${12 + idx} departments` },
        ];
        return { palette, schedule, tailored, stat, insights };
      }),
    [doctors, highlightStats, palettes, scheduleTemplates]
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-8 px-4 py-10 sm:py-12">
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-3xl bg-white/80 px-5 py-8 shadow-xl ring-1 ring-slate-200 backdrop-blur sm:px-6 sm:py-9">
            <div className="pointer-events-none absolute -left-10 top-6 h-44 w-44 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-40 w-40 rounded-full bg-sky-100/60 blur-3xl" />
            <div className="relative space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{t("doctorsPage.subtitle")}</p>
              <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">{t("doctorsPage.title")}</h1>
              <p className="text-base text-slate-700 sm:text-lg max-w-3xl">{t("doctorsPage.description")}</p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Human-first consultations</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Department-matched guidance</span>
              </div>
            </div>
          </div>

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

          <div className="space-y-10">
            {doctors.map((doc, idx) => {
              const profile = doctorProfiles[idx];
              return (
                <section
                  key={doc.name}
                  className="overflow-hidden rounded-[36px] shadow-2xl ring-1 ring-slate-200/60 scroll-reveal"
                  style={{
                    background: `linear-gradient(135deg, ${profile.palette.from}, ${profile.palette.to})`,
                  }}
                >
                  <div className="grid items-stretch gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-wrap gap-2">
                        {[doc.dept, profile.tailored.focus.split(",")[0] || "Trusted", "Patient-first"].map((badge) => (
                          <span
                            key={`${doc.name}-${badge}`}
                            className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-slate-900 ring-1 ring-white/70 backdrop-blur"
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: profile.palette.accent }} />
                            {badge}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-white">
                          <span className="rounded-full bg-slate-900/10 px-2 py-0.5 text-[11px] uppercase tracking-wide">Consults</span>
                          {profile.schedule.join(" • ")}
                        </div>
                        <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                          {profile.tailored.quote}
                        </h2>
                        <p className="text-base text-slate-800 sm:text-lg">
                          {profile.tailored.focus}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900 sm:text-base">
                          <span>
                            {doc.name} - {doc.role}
                          </span>
                          <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-900 ring-1 ring-slate-200">
                            {badgeDept}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 sm:text-base">{doc.note}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {profile.insights.map((item) => (
                          <div
                            key={`${doc.name}-${item.label}`}
                            className={`rounded-2xl bg-white/80 p-4 text-slate-900 shadow-md ring-1 ring-white/70 backdrop-blur ${profile.palette.ring}`}
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{item.label}</p>
                            <p className="mt-2 text-xl font-bold">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDoctor(doc);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:-translate-y-0.5 hover:bg-slate-800"
                        >
                          Meet {doc.name}
                          <span aria-hidden="true" className="text-base">
                            &#8594;
                          </span>
                        </button>
                        <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-semibold text-slate-800 ring-1 ring-white">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: profile.palette.accent }} />
                          Same-week slots available
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-10 top-6 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: `${profile.palette.accent}22` }} />
                      <div className="absolute inset-x-6 bottom-4 h-16 rounded-full bg-slate-900/10 blur-2xl" />
                      <div className="relative overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.8)] ring-1 ring-slate-200">
                        <div className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100">
                          {profile.stat.value} {profile.stat.label}
                        </div>
                        <div
                          className="h-full min-h-[360px] w-full bg-slate-100 lg:min-h-[480px]"
                          role="img"
                          aria-label={`${doc.name} portrait`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/0 to-transparent" />
                        <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
                          {profile.schedule.map((slot) => (
                            <span
                              key={`${doc.name}-${slot}`}
                              className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow-sm ring-1 ring-white"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {activeDoctor && (
          <DoctorProfileModal
            doctor={activeDoctor}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            achievements={achievements}
            education={education}
            experience={experience}
            specializations={specializations}
            updatedLabel={
              formattedDates[doctors.findIndex((d) => d.name === activeDoctor.name)] ?? formattedDates[0]
            }
          />
        )}

      </div>
    </div>
  );
};

export default DoctorsPage;
