import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
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
  const servicesTypingLines = useMemo(() => {
    const lines = t("home.servicesTypingLines", { returnObjects: true }) as string[] | undefined;
    return Array.isArray(lines) ? lines.filter(Boolean) : [];
  }, [t]);

  const departments = t("home.departments", { returnObjects: true }) as string[];
  const featuredDepartments = departments.slice(0, 3);

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

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/(^-|-$)/g, "");

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
  const [doctorPerView, setDoctorPerView] = useState(3);
  const [activeServiceSlide, setActiveServiceSlide] = useState(0);
  const [typingLineIndex, setTypingLineIndex] = useState(0);
  const [typedServiceLine, setTypedServiceLine] = useState("");
  const [isDoctorInteracting, setIsDoctorInteracting] = useState(false);
  const [isServiceInteracting, setIsServiceInteracting] = useState(false);
  const doctorResumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doctorDragStartX = useRef<number | null>(null);
  const serviceResumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serviceDragStartX = useRef<number | null>(null);
  const doctorPages = useMemo(() => {
    const size = Math.max(1, doctorPerView);
    const pages: typeof doctors[] = [];
    for (let i = 0; i < doctors.length; i += size) {
      pages.push(doctors.slice(i, i + size));
    }
    return pages.length ? pages : [doctors];
  }, [doctorPerView, doctors]);
  const totalDoctorPages = doctorPages.length;
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
  const moveTestimonialGroup = (delta: number) => {
    if (!totalTestimonialGroups) return;
    setActiveTestimonialGroup((prev) => ((prev + delta) % totalTestimonialGroups + totalTestimonialGroups) % totalTestimonialGroups);
  };

  const formattedDates = useMemo(
    () =>
      doctors.map((_, idx) =>
        new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(
          new Date(2024 + Math.floor(idx / 12), idx % 12, Math.min(28, idx + 5))
        )
      ),
    [doctors]
  );
  const heroSlides = useMemo(
    () => [
      {
        label: "Hospital exterior and welcome",
        gradient: "from-sky-800/55 via-sky-600/40 to-blue-400/25",
        image: heroImageOne,
      },
      {
        label: "Doctors and comforting care",
        gradient: "from-sky-800/55 via-sky-600/40 to-blue-400/25",
        image: heroImageTwo,
      },
      {
        label: "MRI and surgical suites",
        gradient: "from-sky-800/55 via-sky-600/40 to-sky-400/25",
        image: heroImageThree,
      },
    ],
    []
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const quickStats = stats.slice(0, 3);
  const activeServiceIndex = services.length ? activeServiceSlide % services.length : 0;
  const activeDoctorIndex = totalDoctorPages ? activeDoctorSlide % totalDoctorPages : 0;

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
    if (prefersReducedMotion || services.length <= 1) return;
    if (isServiceInteracting) return;
    const id = setInterval(() => {
      setActiveServiceSlide((prev) => (prev + 1) % services.length);
    }, 4800);
    return () => clearInterval(id);
  }, [prefersReducedMotion, services.length, isServiceInteracting]);

  useEffect(() => {
    if (prefersReducedMotion || totalDoctorPages <= 1 || isDoctorInteracting) return;
    const id = setInterval(() => {
      safelySetDoctorSlide(activeDoctorIndex + 1);
    }, 5200);
    return () => clearInterval(id);
  }, [prefersReducedMotion, totalDoctorPages, isDoctorInteracting, activeDoctorIndex]);

  useEffect(() => {
    setActiveServiceSlide(0);
  }, [services.length]);

  useEffect(() => {
    if (!activeDoctor && doctors.length) {
      setActiveDoctor(doctors[0]);
    }
  }, [activeDoctor, doctors]);

  const safelySetDoctorSlide = (next: number) => {
    if (!totalDoctorPages) return;
    setActiveDoctorSlide(((next % totalDoctorPages) + totalDoctorPages) % totalDoctorPages);
  };

  const beginDoctorInteraction = () => {
    setIsDoctorInteracting(true);
    if (doctorResumeTimeout.current) clearTimeout(doctorResumeTimeout.current);
  };

  const endDoctorInteraction = () => {
    if (doctorResumeTimeout.current) clearTimeout(doctorResumeTimeout.current);
    doctorResumeTimeout.current = setTimeout(() => setIsDoctorInteracting(false), 1000);
  };

  const handleDoctorPointerDown = (clientX: number | null) => {
    beginDoctorInteraction();
    doctorDragStartX.current = clientX;
  };

  const handleDoctorPointerUp = (clientX: number | null) => {
    const startX = doctorDragStartX.current;
    doctorDragStartX.current = null;
    if (startX !== null && clientX !== null) {
      const delta = clientX - startX;
      if (Math.abs(delta) > 40) {
        safelySetDoctorSlide(activeDoctorIndex + (delta > 0 ? -1 : 1));
      }
    }
    endDoctorInteraction();
  };

  const handleBubblePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = Math.min(100, Math.max(0, (x / rect.width) * 100));
    const pctY = Math.min(100, Math.max(0, (y / rect.height) * 100));
    const tiltX = ((pctX - 50) / 50) * 4;
    const tiltY = ((pctY - 50) / 50) * -4;
    target.style.setProperty("--glow-x", `${pctX}%`);
    target.style.setProperty("--glow-y", `${pctY}%`);
    target.style.setProperty("--tilt-x", `${tiltX}deg`);
    target.style.setProperty("--tilt-y", `${tiltY}deg`);
  };

  const resetBubblePointer = (target: HTMLDivElement | null) => {
    if (!target) return;
    target.style.setProperty("--glow-x", "50%");
    target.style.setProperty("--glow-y", "50%");
    target.style.setProperty("--tilt-x", "0deg");
    target.style.setProperty("--tilt-y", "0deg");
  };

  const safelySetServiceSlide = (next: number) => {
    if (!services.length) return;
    setActiveServiceSlide(((next % services.length) + services.length) % services.length);
  };

  const beginServiceInteraction = () => {
    setIsServiceInteracting(true);
    if (serviceResumeTimeout.current) clearTimeout(serviceResumeTimeout.current);
  };

  const endServiceInteraction = () => {
    if (serviceResumeTimeout.current) clearTimeout(serviceResumeTimeout.current);
    serviceResumeTimeout.current = setTimeout(() => setIsServiceInteracting(false), 1000);
  };

  const handleServicePointerDown = (clientX: number | null) => {
    beginServiceInteraction();
    serviceDragStartX.current = clientX;
  };

  const handleServicePointerUp = (clientX: number | null) => {
    const startX = serviceDragStartX.current;
    serviceDragStartX.current = null;
    if (startX !== null && clientX !== null && services.length) {
      const delta = clientX - startX;
      if (Math.abs(delta) > 40) {
        safelySetServiceSlide(activeServiceIndex + (delta > 0 ? -1 : 1));
      }
    }
    endServiceInteraction();
  };

  useEffect(() => {
    const updatePerView = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width < 640) setDoctorPerView(1);
      else if (width < 1024) setDoctorPerView(2);
      else setDoctorPerView(3);
    };
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  useEffect(
    () => () => {
      if (doctorResumeTimeout.current) clearTimeout(doctorResumeTimeout.current);
      if (serviceResumeTimeout.current) clearTimeout(serviceResumeTimeout.current);
    },
    []
  );

  useEffect(() => {
    if (!servicesTypingLines.length) {
      setTypedServiceLine("");
      return;
    }
    setTypingLineIndex(0);
    setTypedServiceLine(prefersReducedMotion ? servicesTypingLines[0] : "");
  }, [servicesTypingLines, prefersReducedMotion]);

  useEffect(() => {
    if (!servicesTypingLines.length) return;
    if (prefersReducedMotion) {
      setTypedServiceLine(servicesTypingLines[typingLineIndex % servicesTypingLines.length]);
      return;
    }

    const currentLine = servicesTypingLines[typingLineIndex % servicesTypingLines.length];
    if (typedServiceLine === currentLine) {
      const pauseId = setTimeout(() => {
        setTypedServiceLine("");
        setTypingLineIndex((prev) => (prev + 1) % servicesTypingLines.length);
      }, 1600);
      return () => clearTimeout(pauseId);
    }

    const typeId = setTimeout(() => {
      setTypedServiceLine(currentLine.slice(0, typedServiceLine.length + 1));
    }, 55);

    return () => clearTimeout(typeId);
  }, [typedServiceLine, typingLineIndex, servicesTypingLines, prefersReducedMotion]);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative isolate w-full min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh] lg:min-h-[58vh] overflow-hidden bg-sky-900 text-white">
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
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/60 via-sky-800/45 to-sky-500/18" aria-hidden="true" />

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
                className={`h-3 w-3 rounded-full border border-white/50 transition ${idx === activeSlide ? "bg-white shadow" : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="relative isolate w-full px-4 py-16 sm:py-[4.5rem]">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#e8f1ff] via-[#f0f6ff] to-white"
          aria-hidden="true"
        />
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

        <div className="mt-8 space-y-4">
          <div
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-white/35 via-[#e9f3ff]/30 to-white/20 backdrop-blur"
            onPointerDown={(e) => handleDoctorPointerDown(e.clientX)}
            onPointerUp={(e) => handleDoctorPointerUp(e.clientX)}
            onPointerLeave={() => endDoctorInteraction()}
            onMouseEnter={beginDoctorInteraction}
            onMouseLeave={endDoctorInteraction}
            onTouchStart={(e) => handleDoctorPointerDown(e.touches?.[0]?.clientX ?? null)}
            onTouchEnd={(e) => handleDoctorPointerUp(e.changedTouches?.[0]?.clientX ?? null)}
          >
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{ transform: `translateX(-${activeDoctorIndex * 100}%)` }}
              aria-live="polite"
            >
              {doctorPages.map((group, pageIdx) => (
                <div key={`page-${pageIdx}`} className="min-w-full px-1">
                  <div
                    className="grid gap-3 sm:gap-4"
                    style={{ gridTemplateColumns: `repeat(${Math.max(1, doctorPerView)}, minmax(0, 1fr))` }}
                  >
                    {group.map((doc) => (
                      <Link
                        key={doc.name}
                        to={`/doctors#${slugify(doc.name)}`}
                        className="block rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200/60"
                        onClick={beginDoctorInteraction}
                      >
                        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white/45 via-[#e8f2ff]/35 to-white/30 p-5 backdrop-blur transition hover:-translate-y-0.5">
                          <div className="mt-4 flex justify-center">
                            <div
                              className="interactive-bubble relative h-[15.1rem] w-[13.75rem] rounded-[999px] bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-[0_20px_50px_-22px_rgba(59,130,246,0.55)] ring-1 ring-[#3b82f6]/30 sm:h-[16.5rem] sm:w-[16.5rem]"
                              onPointerMove={handleBubblePointerMove}
                              onPointerLeave={(e) => resetBubblePointer(e.currentTarget)}
                            >
                              <div className="absolute -inset-3 rounded-[999px] bg-gradient-to-br from-sky-200/45 via-blue-100/28 to-white/6 blur-2xl opacity-65" aria-hidden="true" />
                              <span className="bubble-light" aria-hidden="true" />
                              <span className="bubble-ripple" aria-hidden="true" />
                              <div className="absolute inset-[0.35rem] flex items-center justify-center overflow-hidden rounded-[999px] bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.92),rgba(255,255,255,0)),radial-gradient(circle_at_75%_65%,rgba(59,130,246,0.22),rgba(255,255,255,0))] text-center text-[13px] font-semibold text-slate-500 shadow-inner animate-[float-soft_6s_ease-in-out_infinite]">
                                {placeholders.doctorImage}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 text-center space-y-1">
                            <p className="text-lg font-bold text-slate-900">{doc.name}</p>
                            <p className="text-sm font-semibold text-blue-900">{doc.role}</p>
                            <p className="text-sm text-slate-700">{doc.note}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2">
            {doctorPages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to doctor ${idx + 1}`}
                onClick={() => {
                  beginDoctorInteraction();
                  safelySetDoctorSlide(idx);
                  endDoctorInteraction();
                }}
                className={`h-2 rounded-full transition ${idx === activeDoctorIndex ? "w-6 bg-blue-800" : "w-2 bg-slate-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE SERVICES */}
      <section className="relative isolate w-full overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white px-4 pt-[4.5rem] pb-[6rem] sm:pt-[5.25rem] sm:pb-[6.5rem]">
        <div className="absolute -left-10 top-10 h-60 w-60 rounded-full bg-blue-100/60 blur-3xl animate-pan-soft" aria-hidden="true" />
        <div className="absolute -right-16 -bottom-10 h-64 w-64 rounded-full bg-sky-200/55 blur-3xl animate-pan-soft" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_72%_62%,rgba(14,165,233,0.08),transparent_38%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-2">
          <div className="scroll-reveal space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-800 shadow-sm">
              Signature Services
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.2)]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[clamp(1.9rem,3vw,2.7rem)] font-black leading-tight text-slate-900">
                {t("home.servicesTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Quick access to the departments patients rely on most.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white/70 via-slate-50/50 to-white/60 p-4 backdrop-blur">
              <p className={`text-sm font-semibold text-slate-800 sm:text-base ${prefersReducedMotion ? "" : "typing-line"}`}>
                {typedServiceLine}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Imaging &gt; Pharmacy &gt; Recovery &gt; ICU-ready
              </p>
            </div>
          </div>

          <div className="scroll-reveal h-full">
            <div
              className="relative flex h-full min-h-[248px] overflow-hidden rounded-3xl bg-gradient-to-br from-white/55 via-slate-50/35 to-white/55 backdrop-blur sm:min-h-[280px]"
              onPointerDown={(e) => handleServicePointerDown(e.clientX)}
              onPointerUp={(e) => handleServicePointerUp(e.clientX)}
              onPointerLeave={() => endServiceInteraction()}
              onMouseEnter={beginServiceInteraction}
              onMouseLeave={endServiceInteraction}
              onTouchStart={(e) => handleServicePointerDown(e.touches?.[0]?.clientX ?? null)}
              onTouchEnd={(e) => handleServicePointerUp(e.changedTouches?.[0]?.clientX ?? null)}
            >
              <div
                className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{ transform: `translateX(-${activeServiceIndex * 100}%)` }}
              >
                {services.map((service) => (
                  <Link
                    key={service.title}
                    to={`/services/${slugify(service.title)}`}
                    className="group min-w-full flex h-full min-h-[232px] flex-col gap-3 px-5 py-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_25px_60px_-28px_rgba(15,23,42,0.35)] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200/60 sm:min-h-[256px] sm:gap-4 sm:px-7 sm:py-8"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-base font-bold text-white shadow-inner transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-12 sm:w-12 sm:text-lg">
                          {service.icon}
                        </span>
                        <div>
                          <p className="text-lg font-semibold text-slate-900 sm:text-xl">{service.title}</p>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Flagship care
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                        Live now
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 sm:text-base">{service.desc}</p>
                    <div className="flex-1 rounded-2xl bg-white/40 px-3 py-3 text-sm text-slate-500 transition duration-200 sm:text-base">
                      {placeholders.serviceImage}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-3 flex w-full flex-col gap-2 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-y-2 sm:justify-between relative z-10">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:hidden">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" aria-hidden="true" />
                <span>Swipe services</span>
              </div>
              <div className="flex items-center gap-2">
                {services.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to service ${idx + 1}`}
                    onClick={() => {
                      beginServiceInteraction();
                      safelySetServiceSlide(idx);
                      endServiceInteraction();
                    }}
                    className={`h-2.5 w-2.5 rounded-full border border-slate-200 transition ${idx === activeServiceIndex ? "bg-slate-900" : "bg-white"}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  aria-label="Previous service"
                  onClick={() => {
                    beginServiceInteraction();
                    safelySetServiceSlide(activeServiceIndex - 1);
                    endServiceInteraction();
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  Prev
                </button>
                <button
                  type="button"
                  aria-label="Next service"
                  onClick={() => {
                    beginServiceInteraction();
                    safelySetServiceSlide(activeServiceIndex + 1);
                    endServiceInteraction();
                  }}
                  className="rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DEPARTMENTS */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-sky-50 to-white py-16 sm:py-[4.75rem] text-slate-900">
        <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="pointer-events-none absolute right-[-6%] bottom-[-12%] h-72 w-72 rounded-full bg-slate-200/55 blur-3xl" />
        <div className="w-full px-3 sm:px-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 sm:text-xs">Departments</p>
              <h2 className="text-[clamp(1.9rem,3vw,2.8rem)] font-black leading-tight">{t("home.departmentsTitle")}</h2>
              <p className="text-sm text-slate-600 sm:text-base max-w-3xl">
                Coordinated teams with imaging, surgery, pharmacy, and rehab in one calm flow.
              </p>
            </div>
            <Link
              to="/departments"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 sm:text-base"
            >
              {t("common.nav.departments")}
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredDepartments.map((dept, idx) => (
              <Link
                key={dept}
                to={`/departments/${slugify(dept)}`}
                className="group relative min-h-[260px] overflow-hidden rounded-3xl bg-white/90 p-5 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.28)] ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-[0_28px_80px_-30px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/70"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 opacity-90" aria-hidden="true" />
                <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-sky-500 via-blue-500 to-emerald-400" aria-hidden="true" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.12),transparent_40%)]" aria-hidden="true" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-inner ring-1 ring-slate-200/50">
                      {dept.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-slate-900 sm:text-xl">{dept}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Signature care</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 ring-1 ring-slate-200">
                    #{idx + 1}
                  </span>
                </div>

                <div className="relative mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl bg-white/80 p-3 text-sm text-slate-700 shadow-inner ring-1 ring-slate-200">
                    Quiet lounges, staffed triage, on-floor imaging, and pharmacists on call.
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center text-xs font-semibold text-slate-600 shadow-inner h-28 sm:h-32 flex items-center justify-center">
                    {placeholders.departmentImage}
                  </div>
                </div>

                <div className="relative mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
                  <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Multidisciplinary</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">24/7 coverage</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">Escort ready</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative isolate bg-gradient-to-r from-sky-950 via-sky-900 to-slate-900 py-9 sm:py-12 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_78%_32%,rgba(186,230,253,0.08),transparent_32%),radial-gradient(circle_at_42%_78%,rgba(59,130,246,0.18),transparent_36%)]" />
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
              <div className="ml-3 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous testimonials"
                  onClick={() => moveTestimonialGroup(-1)}
                  className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Prev
                </button>
                <button
                  type="button"
                  aria-label="Next testimonials"
                  onClick={() => moveTestimonialGroup(1)}
                  className="rounded-full border border-white/40 bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Next
                </button>
              </div>
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
