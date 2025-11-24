import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import heroImageOne from "../assets/Hero-title.webp";
import heroImageTwo from "../assets/Hero-title1.webp";
import heroImageThree from "../assets/Hero-title2.webp";
import DoctorProfileModal from "../components/DoctorProfileModal";

const HomePage = () => {
  const { t } = useTranslation();

  const services = t("home.services", { returnObjects: true }) as {
    title: string;
    desc: string;
    icon: string;
  }[];

  const departments = t("home.departments", { returnObjects: true }) as string[];
  const featuredDepartments = departments.slice(0, 4);

  const doctors = t("home.doctors", { returnObjects: true }) as {
    name: string;
    role: string;
    note: string;
  }[];

  const stats = t("home.stats", { returnObjects: true }) as {
    label: string;
    value: string;
  }[];

  const testimonials = t("home.testimonials", { returnObjects: true }) as {
    quote: string;
    name: string;
  }[];

  const placeholders = t("common.placeholders", {
    returnObjects: true,
  }) as Record<string, string>;

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const [activeTestimonialGroup, setActiveTestimonialGroup] = useState(0);
  const [activeDoctor, setActiveDoctor] = useState<null | (typeof doctors)[0]>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [activeDoctorSlide, setActiveDoctorSlide] = useState(0);
  const [isMobileDoctors, setIsMobileDoctors] = useState(false);
  const testimonialsPerPage = 3;
  const testimonialGroups = useMemo(() => {
    const groups: typeof testimonials[] = [];
    for (let i = 0; i < testimonials.length; i += testimonialsPerPage) {
      groups.push(testimonials.slice(i, i + testimonialsPerPage));
    }
    return groups.length ? groups : [[]];
  }, [testimonials]);
  const totalTestimonialGroups = testimonialGroups.length;
  const activeTestimonialGroupSafe = totalTestimonialGroups ? activeTestimonialGroup % totalTestimonialGroups : 0;

  const formattedDates = useMemo(
    () =>
      doctors.map((_, idx) =>
        new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(
          new Date(2024 + Math.floor(idx / 12), idx % 12, Math.min(28, idx + 5))
        )
      ),
    [doctors]
  );
  const doctorMeta = useMemo(
    () =>
      doctors.map((_, idx) => {
        const rating = (4.8 + (idx % 5) * 0.04).toFixed(2);
        const response = ["<10m", "<15m", "<20m"][idx % 3];
        const languages = [
          ["EN", "AR"],
          ["EN", "FR"],
          ["EN", "ES"],
        ][idx % 3];
        return { rating, response, languages };
      }),
    [doctors]
  );

  const heroSlides = useMemo(
    () => [
      {
        label: "Hospital exterior and welcome",
        gradient: "from-slate-950/65 via-blue-900/45 to-sky-900/25",
        image: heroImageOne,
      },
      {
        label: "Doctors and comforting care",
        gradient: "from-slate-950/60 via-slate-900/40 to-blue-800/25",
        image: heroImageTwo,
      },
      {
        label: "MRI and surgical suites",
        gradient: "from-slate-950/60 via-[#0b2f43]/45 to-[#0f4c75]/25",
        image: heroImageThree,
      },
    ],
    []
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const quickStats = stats.slice(0, 3);

  useScrollReveal();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!totalTestimonialGroups) return;
    const id = setInterval(
      () => setActiveTestimonialGroup((prev) => (prev + 1) % totalTestimonialGroups),
      5000
    );
    return () => clearInterval(id);
  }, [prefersReducedMotion, totalTestimonialGroups]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(
      () => setActiveSlide((prev) => (prev + 1) % heroSlides.length),
      6000
    );
    return () => clearInterval(id);
  }, [prefersReducedMotion, heroSlides.length]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileDoctors(mq.matches);
    update();
    const listener = () => update();
    if (mq.addEventListener) {
      mq.addEventListener("change", listener);
    } else {
      mq.addListener(listener);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", listener);
      } else {
        mq.removeListener(listener);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileDoctors || prefersReducedMotion || doctors.length <= 1) return;
    const id = setInterval(() => {
      setActiveDoctorSlide((prev) => (prev + 1) % doctors.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isMobileDoctors, prefersReducedMotion, doctors.length]);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative isolate w-full min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh] lg:min-h-[58vh] overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0" aria-hidden="true">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.label}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                idx === activeSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: slide.image ? `url(${slide.image})` : undefined }}
                aria-hidden="true"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_78%_32%,rgba(255,255,255,0.07),transparent_32%),radial-gradient(circle_at_42%_78%,rgba(59,130,246,0.16),transparent_36%)]" />
              {!slide.image && (
                <div className="absolute inset-0 flex items-center justify-center text-center text-lg font-semibold text-white/65">
                  {slide.label}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/50 to-slate-950/15"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[18vh] flex-col justify-center px-4 py-3 sm:py-5 md:max-w-5xl lg:max-w-6xl lg:py-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-7">
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 px-5 py-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/25 sm:px-7 sm:py-8 lg:px-9 lg:py-10 animate-soft-fade scroll-reveal">
              <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-400/25 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 top-6 h-28 w-28 rounded-full bg-sky-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 right-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />

              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100">
                Call for action
              </p>
              <h1 className="mt-3 text-[clamp(2.2rem,5.6vw,4rem)] font-black leading-[1.02] sm:mt-4">
                {t("common.hospitalName")}
              </h1>
              <p className="mt-4 max-w-2xl text-[clamp(1rem,2.6vw,1.25rem)] text-blue-50/90">
                Book your visit or talk to our care team now?same-day diagnostics, attentive specialists, and calm spaces designed around you.
              </p>
             
            </div>

            <div className="hidden w-full grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur min-[1071px]:grid lg:max-w-xs">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-left shadow-md backdrop-blur"
                >
                  <p className="text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
                  <p className="text-xs font-semibold text-blue-100 sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-pressed={idx === activeSlide}
                className={`h-3 w-3 rounded-full border border-white/50 transition ${
                  idx === activeSlide ? "bg-white shadow" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="relative isolate w-full px-4 py-10 sm:py-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-slate-50" aria-hidden="true" />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 sm:text-sm">
              Our specialists
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">{t("home.doctorsTitle")}</h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Meet the teams patients ask for most, with clear guidance and calm visits.
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 sm:text-base"
          >
            {t("common.nav.doctors")}
          </Link>
        </div>
        <div className="mt-8">
          {isMobileDoctors ? (
            <div className="overflow-hidden rounded-3xl ring-1 ring-slate-100 shadow-md bg-white/90">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeDoctorSlide * 100}%)` }}
              >
                {doctors.map((doc) => (
                  <div key={doc.name} className="min-w-full px-2 py-2">
                    <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-900">Featured</span>
                        <span className="text-blue-500">24/7 care</span>
                      </div>
                      <div className="mt-3 h-32 rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
                        {placeholders.doctorImage}
                      </div>
                      <p className="mt-3 text-lg font-bold text-slate-900">{doc.name}</p>
                      <p className="text-sm font-semibold text-blue-900">{doc.role}</p>
                      <p className="mt-2 text-sm text-slate-700">{doc.note}</p>
                      <div className="mt-4 grid gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                          onClick={() => {
                            setActiveDoctor(doc);
                            setIsDoctorModalOpen(true);
                          }}
                        >
                          {t("common.learnMore", { defaultValue: "View Profile" })}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2 pb-3 pt-2">
                {doctors.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to doctor ${idx + 1}`}
                    onClick={() => setActiveDoctorSlide(idx)}
                    className={`h-2 rounded-full transition ${idx === activeDoctorSlide ? "w-6 bg-blue-800" : "w-2 bg-slate-300"}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
              {doctors.map((doc, idx) => {
                const meta = doctorMeta[idx];
                return (
                <div
                  key={doc.name}
                  className="relative overflow-hidden rounded-3xl bg-white/90 p-5 shadow-[0_10px_45px_-18px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_20px_70px_-24px_rgba(15,23,42,0.4)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-80" />
                  <div className="relative">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-900">Featured</span>
                    <span className="text-blue-500">24/7 care</span>
                  </div>
                  <div className="mt-3 h-28 sm:h-32 md:h-36 rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
                    {placeholders.doctorImage}
                  </div>
                  <p className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">{doc.name}</p>
                  <p className="text-sm font-semibold text-blue-900 sm:text-base">{doc.role}</p>
                  <p className="mt-2 text-sm text-slate-700 sm:text-base">{doc.note}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                    <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Rating {meta.rating}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Response {meta.response}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Languages: {meta.languages.join(", ")}</span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 sm:text-base"
                      onClick={() => {
                        setActiveDoctor(doc);
                        setIsDoctorModalOpen(true);
                      }}
                    >
                      {t("common.learnMore", { defaultValue: "View Profile" })}
                    </button>
                  </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </section>

      {/* SIGNATURE SERVICES */}
      <section className="w-full px-4 py-10 sm:py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-700 sm:text-sm">
              What we do best
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">{t("home.servicesTitle")}</h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Quick access to the departments patients rely on most.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              to={`/services/${service.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "")}`}
              className="group relative overflow-hidden rounded-3xl bg-white/90 p-5 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.25)] ring-1 ring-slate-200 backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_18px_50px_-16px_rgba(15,23,42,0.28)] scroll-reveal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-80" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-inner transition duration-200 group-hover:scale-105">
                    {service.icon}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 sm:text-xl">{service.title}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">24/7 access</p>
                  </div>
                </div>
              </div>
              <p className="relative mt-3 text-sm text-slate-700 sm:text-base">{service.desc}</p>
              <div className="relative mt-4 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-500 ring-1 ring-slate-100 transition duration-200 group-hover:bg-slate-100">
                {placeholders.serviceImage}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED DEPARTMENTS */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-white py-10 sm:py-12 text-slate-900">
        <div className="w-full px-3 sm:px-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 sm:text-xs">
                Departments
              </p>
              <h2 className="text-2xl font-black sm:text-3xl">{t("home.departmentsTitle")}</h2>
              <p className="text-sm text-slate-600 sm:text-base">
                Coordinated teams across diagnostics, surgery, rehab, and beyond.
              </p>
            </div>
            <Link
              to="/departments"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 sm:text-base"
            >
              {t("common.nav.departments")}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featuredDepartments.map((dept) => (
              <Link
                key={dept}
                to={`/departments/${dept.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "")}`}
                className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-[0_10px_45px_-20px_rgba(15,23,42,0.2)] ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-[0_16px_60px_-22px_rgba(15,23,42,0.25)] hover:ring-slate-300 scroll-reveal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/80"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-90" />
                <div className="relative flex items-center justify-between">
                  <p className="text-base font-semibold text-slate-900 transition duration-200 group-hover:text-slate-700 sm:text-lg">
                    {dept}
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Care</span>
                </div>
                <div className="relative mt-3 h-24 rounded-xl bg-slate-100 text-center text-sm text-slate-500 ring-1 ring-slate-200 transition duration-200 group-hover:bg-slate-200">
                  {placeholders.departmentImage}
                </div>
                <div className="relative mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Multidisciplinary</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">24/7 coverage</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative isolate bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-6 sm:py-8 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_78%_32%,rgba(255,255,255,0.07),transparent_32%),radial-gradient(circle_at_42%_78%,rgba(59,130,246,0.16),transparent_36%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:gap-5 sm:px-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200">Voices from our patients</p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black">
              Premium care, real stories.
            </h3>
            <p className="text-sm text-blue-100">
              Calm spaces, clear updates, attentive teams—told by patients.
            </p>
          </div>

          <div className="md:col-span-2 grid gap-3 sm:gap-4">
            <div className="overflow-hidden rounded-3xl bg-white/10 p-3 sm:p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{ transform: `translateX(-${activeTestimonialGroupSafe * 100}%)` }}
              >
                {testimonialGroups.map((group, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="grid min-w-full grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-1 transition-all duration-500 ease-out"
                    style={{
                      opacity: groupIdx === activeTestimonialGroupSafe ? 1 : 0.35,
                      transform: groupIdx === activeTestimonialGroupSafe ? "scale(1)" : "scale(0.96)",
                    }}
                  >
                    {group.map((story, idx) => (
                      <div
                        key={`${story.name}-${idx}`}
                        className="rounded-2xl bg-gradient-to-br from-white/12 via-white/8 to-white/5 p-3 sm:p-4 shadow-inner ring-1 ring-white/15"
                      >
                        <p className="text-xs sm:text-sm md:text-base">
                          &ldquo;{story.quote}&rdquo;
                        </p>
                        <p className="mt-2 text-[11px] sm:text-xs font-semibold text-blue-100">
                          {story.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {testimonialGroups.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to testimonial group ${idx + 1}`}
                  onClick={() => setActiveTestimonialGroup(idx)}
                  className={`h-2 w-2 rounded-full border border-white/70 transition sm:h-2.5 sm:w-2.5 ${
                    idx === activeTestimonialGroupSafe ? "bg-white shadow" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {activeDoctor && (
        <DoctorProfileModal
          doctor={activeDoctor}
          isOpen={isDoctorModalOpen}
          onClose={() => setIsDoctorModalOpen(false)}
          achievements={t("doctorsPage.achievementsSample", { returnObjects: true }) as string[]}
          education={t("doctorsPage.educationSample", { returnObjects: true }) as string[]}
          experience={t("doctorsPage.experienceSample", { returnObjects: true }) as string[]}
          specializations={t("doctorsPage.specializationsSample", { returnObjects: true }) as string[]}
          updatedLabel={`Updated ${
            formattedDates[doctors.findIndex((doc) => doc.name === activeDoctor.name)] ?? formattedDates[0]
          }`}
        />
      )}
    </div>
  );
};

export default HomePage;
