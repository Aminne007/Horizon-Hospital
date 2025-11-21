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
  const services = t("home.services", { returnObjects: true }) as { title: string; desc: string; icon: string }[];
  const departments = t("home.departments", { returnObjects: true }) as string[];
  const featuredDepartments = departments.slice(0, 4);
  const doctors = t("home.doctors", { returnObjects: true }) as { name: string; role: string; note: string }[];
  const stats = t("home.stats", { returnObjects: true }) as { label: string; value: string }[];
  const testimonials = t("home.testimonials", { returnObjects: true }) as { quote: string; name: string }[];
  const placeholders = t("common.placeholders", { returnObjects: true }) as Record<string, string>;
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeDoctor, setActiveDoctor] = useState<null | typeof doctors[0]>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
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
    const id = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [prefersReducedMotion, testimonials.length]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [prefersReducedMotion, heroSlides.length]);

  return (
    <div className="bg-white text-slate-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-6xl">
      <section className="relative isolate w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0" aria-hidden="true">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.label}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                idx === activeSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90"
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

        <div className="relative mx-auto flex min-h-[60vh] flex-col justify-center px-4 py-8 sm:py-10 md:max-w-5xl lg:max-w-6xl lg:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 px-5 py-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/25 sm:px-7 sm:py-8 lg:px-10 lg:py-12 animate-soft-fade scroll-reveal">
              <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-400/25 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 top-6 h-28 w-28 rounded-full bg-sky-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 right-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />

              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100">
                Trusted Care - Calm Spaces
              </p>
              <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] sm:mt-4">{t("common.hospitalName")}</h1>
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

            <div className="hidden w-full grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur sm:grid lg:max-w-xs">
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

      <section className="w-full px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">{t("home.servicesTitle")}</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              to={`/services/${service.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "")}`}
              className="group rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover-lift scroll-reveal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl transition duration-200 group-hover:scale-110">{service.icon}</span>
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

      <section className="bg-slate-50 py-10 sm:py-12">
        <div className="w-full px-3 sm:px-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("home.departmentsTitle")}</h2>
            <Link to="/departments" className="text-base font-semibold text-blue-900 underline sm:text-lg">
              {t("common.nav.departments")}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
            {featuredDepartments.map((dept) => (
              <Link
                key={dept}
                to={`/departments/${dept.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "")}`}
                className="group rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 hover-lift scroll-reveal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <p className="text-base font-semibold text-slate-900 transition duration-200 group-hover:text-blue-900 sm:text-lg">{dept}</p>
                <div className="mt-2 h-24 rounded-xl bg-slate-100 text-center text-sm text-slate-500 transition duration-200 group-hover:bg-slate-200">
                  {placeholders.departmentImage}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

        <section className="hidden w-full px-4 py-12 md:block">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold">{t("home.doctorsTitle")}</h2>
            <Link to="/doctors" className="text-lg font-semibold text-blue-900 underline">
              {t("common.nav.doctors")}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {doctors.map((doc) => (
              <div
                key={doc.name}
                className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-100 hover-lift cursor-pointer"
                onClick={() => {
                  setActiveDoctor(doc);
                  setIsDoctorModalOpen(true);
                }}
              >
                <div className="h-36 rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
                  {placeholders.doctorImage}
                </div>
                <p className="mt-4 text-xl font-bold text-slate-900">{doc.name}</p>
                <p className="text-base font-semibold text-blue-900">{doc.role}</p>
                <p className="mt-2 text-base text-slate-700">{doc.note}</p>
                <button
                  type="button"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-blue-900 px-4 py-3 text-lg font-semibold text-white"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDoctorBook(doc.name);
                  }}
                >
                  {t("common.bookNow")}
                </button>
              </div>
            ))}
          </div>
        </section>

      <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-bold">{t("home.testimonialsTitle")}</h3>
            <p className="mt-2 text-lg text-blue-100">{t("home.testimonialsSubtitle")}</p>
          </div>
          <div className="md:col-span-2 grid gap-4">
            <div className="rounded-3xl bg-white/10 p-6 shadow-lg ring-1 ring-white/10">
              <p className="text-lg">“{testimonials[activeTestimonial]?.quote}”</p>
              <p className="mt-2 text-sm font-semibold text-blue-100">{testimonials[activeTestimonial]?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-3 w-3 rounded-full border border-white/70 transition ${idx === activeTestimonial ? "bg-white" : "bg-transparent"}`}
                  onClick={() => setActiveTestimonial(idx)}
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
          updatedLabel={`Updated ${formattedDates[doctors.findIndex((doc) => doc.name === activeDoctor.name)] ?? formattedDates[0]}`}
        />
      )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
