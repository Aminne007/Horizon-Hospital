import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import heroImageOne from "../assets/Hero-title.webp";
import heroImageTwo from "../assets/Hero-title1.webp";
import heroImageThree from "../assets/Hero-title2.webp";
import DoctorProfileModal from "../components/DoctorProfileModal";
import { useDoctorSelection } from "../context/DoctorSelectionContext";

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
  const navigate = useNavigate();
  const { setSelectedDoctor } = useDoctorSelection();
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

  const handleDoctorBook = (name: string) => {
    setSelectedDoctor(name);
    navigate(`/appointments?doctor=${encodeURIComponent(name)}`);
    setIsDoctorModalOpen(false);
  };

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
    mq.addEventListener ? mq.addEventListener("change", listener) : mq.addListener(listener);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", listener) : mq.removeListener(listener);
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
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative isolate w-full min-h-[50vh] sm:min-h-[54vh] md:min-h-[56vh] lg:min-h-[60vh] max-h-[86vh] overflow-hidden bg-slate-950 text-white">
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

        <div className="relative mx-auto flex min-h-[34vh] flex-col justify-center px-4 py-6 sm:py-8 md:max-w-5xl lg:max-w-6xl lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 px-5 py-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/25 sm:px-7 sm:py-8 lg:px-10 lg:py-12 animate-soft-fade scroll-reveal">
              <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-400/25 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 top-6 h-28 w-28 rounded-full bg-sky-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 right-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />

              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100">
                Trusted Care - Calm Spaces
              </p>
              <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] sm:mt-4">
                {t("common.hospitalName")}
              </h1>
              <p className="mt-4 max-w-2xl text-[clamp(1rem,2.6vw,1.25rem)] text-blue-50/90">
                Premium diagnostics, surgical suites, and attentive teams guiding every visit with clarity and calm.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/appointments"
                  className="inline-flex items-center justify-center rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-white sm:px-5 sm:text-base lg:px-6 lg:text-lg"
                >
                  {t("home.ctaPrimary")}
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-inner backdrop-blur transition hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/20 focus-visible:outline-white sm:px-5 sm:text-base lg:px-6 lg:text-lg"
                >
                  {t("common.nav.doctors")}
                </Link>
              </div>
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
      <section className="w-full px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">{t("home.doctorsTitle")}</h2>
          <Link to="/doctors" className="text-base font-semibold text-blue-900 underline sm:text-lg">
            {t("common.nav.doctors")}
          </Link>
        </div>
        <div className="mt-8">
          {isMobileDoctors ? (
            <div className="overflow-hidden rounded-3xl ring-1 ring-slate-100 shadow-md bg-white/80">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeDoctorSlide * 100}%)` }}
              >
                {doctors.map((doc) => (
                  <div key={doc.name} className="min-w-full px-2 py-2">
                    <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100">
                      <div className="h-32 rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
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
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                          onClick={() => {
                            handleDoctorBook(doc.name);
                          }}
                        >
                          {t("common.bookNow")}
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
              {doctors.map((doc) => (
                <div
                  key={doc.name}
                  className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover-lift"
                >
                  <div className="h-28 sm:h-32 md:h-36 rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
                    {placeholders.doctorImage}
                  </div>
                  <p className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">{doc.name}</p>
                  <p className="text-sm font-semibold text-blue-900 sm:text-base">{doc.role}</p>
                  <p className="mt-2 text-sm text-slate-700 sm:text-base">{doc.note}</p>
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
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 sm:text-base"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDoctorBook(doc.name);
                      }}
                    >
                      {t("common.bookNow")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SIGNATURE SERVICES */}
      <section className="w-full px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">{t("home.servicesTitle")}</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              to={`/services/${service.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "")}`}
              className="group rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover-lift scroll-reveal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl transition duration-200 group-hover:scale-110">
                  {service.icon}
                </span>
                <p className="text-lg font-semibold text-slate-900 sm:text-xl">{service.title}</p>
              </div>
              <p className="mt-3 text-base text-slate-700 sm:text-lg">{service.desc}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-500 transition duration-200 group-hover:bg-slate-100">
                {placeholders.serviceImage}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED DEPARTMENTS */}
      <section className="bg-slate-50 py-10 sm:py-12">
        <div className="w-full px-3 sm:px-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("home.departmentsTitle")}</h2>
            <Link to="/departments" className="text-base font-semibold text-blue-900 underline sm:text-lg">
              {t("common.nav.departments")}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
            {featuredDepartments.map((dept) => (
              <Link
                key={dept}
                to={`/departments/${dept.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "")}`}
                className="group rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 hover-lift scroll-reveal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <p className="text-base font-semibold text-slate-900 transition duration-200 group-hover:text-blue-900 sm:text-lg">
                  {dept}
                </p>
                <div className="mt-2 h-24 rounded-xl bg-slate-100 text-center text-sm text-slate-500 transition duration-200 group-hover:bg-slate-200">
                  {placeholders.departmentImage}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-4 sm:py-6 text-white">
        <div className="mx-auto grid w-full gap-2 sm:gap-3 px-3 sm:px-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold">
              {t("home.testimonialsTitle")}
            </h3>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-blue-100">
              {t("home.testimonialsSubtitle")}
            </p>
          </div>

          <div className="md:col-span-2 grid gap-3 sm:gap-4">
            <div className="overflow-hidden rounded-2xl bg-white/10 p-2 sm:p-3 md:p-4 shadow-lg ring-1 ring-white/10">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonialGroupSafe * 100}%)` }}
              >
                {testimonialGroups.map((group, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="grid min-w-full grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 px-1"
                  >
                    {group.map((story, idx) => (
                      <div
                        key={`${story.name}-${idx}`}
                        className="rounded-2xl bg-white/5 p-2 sm:p-3 md:p-4 shadow-inner ring-1 ring-white/10"
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

            <div className="flex items-center gap-1.5 sm:gap-2">
              {testimonialGroups.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to testimonial group ${idx + 1}`}
                  onClick={() => setActiveTestimonialGroup(idx)}
                  className={`rounded-full border border-white/70 transition ${
                    idx === activeTestimonialGroupSafe ? "bg-white" : "bg-transparent"
                  } h-2 w-2 sm:h-3 sm:w-3`}
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
          onBook={handleDoctorBook}
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
