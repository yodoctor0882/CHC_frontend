"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Clock3,
  MapPin,
  Phone,
  HeartPulse,
  Stethoscope,
  Bone,
  Baby,
  Building2,
  CheckCircle2,
  Siren,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SERVICES = [
  {
    icon: ShieldCheck,
    title: "Secure Access",
    desc: "Your hospital services are protected with secure digital access.",
  },
  {
    icon: Smartphone,
    title: "Easy to Use",
    desc: "Simple and accessible digital services for patients and staff.",
  },
  {
    icon: Clock3,
    title: "Save Time",
    desc: "Access essential hospital services without unnecessary paperwork.",
  },
];

const DEPARTMENTS = [
  { icon: Stethoscope, name: "General Medicine" },
  { icon: HeartPulse, name: "Cardiology" },
  { icon: Bone, name: "Orthopaedics" },
  { icon: Baby, name: "Paediatrics" },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/contact" },
];

const HOSPITAL_SLIDES = [
  {
    src: "/district-hospital-jhansi.jpeg",
    alt: "District Hospital, Jhansi building",
    eyebrow: "District Hospital",
    title: "Healthcare for Every Community",
    description: "Accessible healthcare services for the people of Jhansi.",
  },
  {
    src: "/eye-ward-ot-block.jpeg",
    alt: "Eye Ward and O.T. Block",
    eyebrow: "Hospital Facilities",
    title: "Care, Treatment & Support",
    description: "Discover the facilities available at our hospital.",
  },
  {
    src: "/jhansi-fort.webp",
    alt: "Historic Jhansi Fort",
    eyebrow: "Our City, Our Heritage",
    title: "The Historic Spirit of Jhansi",
    description: "Celebrating the heritage and history of our city.",
  },
];

export default function Home() {
  const pathname = usePathname();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HOSPITAL_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-6 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-teal-800 text-amber-500">
              <Activity size={18} strokeWidth={2.4} />
            </span>

            <span>
              <p className="font-display font-bold text-[15px] leading-tight text-ink">
                YD Hospital
              </p>

              <p className="text-[11px] text-slate-500 leading-tight">
                District Hospital
              </p>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    isActive
                      ? "bg-teal-50 text-teal-800"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Login */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-800 border border-teal-800/25 rounded-lg px-3 sm:px-4 py-2 hover:bg-teal-50 transition shrink-0"
          >
            <span className="hidden sm:inline">Patient / Staff Login</span>
            <span className="sm:hidden">Login</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile Navigation */}
        <nav
          aria-label="Mobile navigation"
          className="md:hidden flex items-center justify-center gap-1 px-3 pb-3 overflow-x-auto"
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ================= HOSPITAL & JHANSI BACKGROUND CAROUSEL ================= */}

      <section className="relative isolate h-[420px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-slate-950">
        {/* Background Images */}
        {HOSPITAL_SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            aria-hidden={activeSlide !== index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className={`h-full w-full object-cover transition-transform duration-[6000ms] ${
                activeSlide === index ? "scale-105" : "scale-100"
              }`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />

        {/* Text Over Background Image */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <div className="max-w-2xl text-white">
              <p className="inline-flex items-center gap-2 rounded-full bg-teal-700/80 px-3 py-1.5 mb-5 text-[11px] font-semibold uppercase tracking-wide">
                <Building2 size={13} />
                District Hospital, Jhansi
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[58px] font-bold leading-[1.06] tracking-tight">
                Quality Healthcare,
                <br />
                <span className="text-teal-300">Closer to You.</span>
              </h1>

              <p className="text-white/85 text-base sm:text-lg mt-6 max-w-xl leading-relaxed">
                Access essential hospital services through a simple and secure
                digital platform designed for patients and hospital staff.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-teal-700 text-white font-semibold text-sm rounded-xl px-5 py-3 hover:bg-teal-600 transition shadow-sm"
                >
                  Patient Login
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 border border-white/60 bg-white/10 backdrop-blur-sm font-semibold text-sm rounded-xl px-5 py-3 text-white hover:bg-white/20 transition"
                >
                  Staff Login
                </Link>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-xs text-white/90">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-teal-300" />
                  Secure Platform
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-teal-300" />
                  Digital Services
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-teal-300" />
                  Easy Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Image */}
        <button
          type="button"
          aria-label="Previous image"
          onClick={() =>
            setActiveSlide(
              (current) =>
                (current - 1 + HOSPITAL_SLIDES.length) % HOSPITAL_SLIDES.length,
            )
          }
          className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/60 sm:left-6 sm:h-12 sm:w-12"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next Image */}
        <button
          type="button"
          aria-label="Next image"
          onClick={() =>
            setActiveSlide((current) => (current + 1) % HOSPITAL_SLIDES.length)
          }
          className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/60 sm:right-6 sm:h-12 sm:w-12"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {HOSPITAL_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/55 hover:bg-white/85"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= DISTRICT LEADERSHIP ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/50 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          {/* Section Heading */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-800">
              District Administration
            </span>

            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              Leadership & Public Service
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Recognising leadership and public service in support of
              governance, community welfare and healthcare.
            </p>

            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-teal-700" />
          </div>

          {/* Official Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Prime Minister */}
            <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden bg-slate-100 sm:h-72">
                <img
                  src="/modi.png"
                  alt="Narendra Modi"
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/50 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-teal-900">
                  Government of India
                </span>
              </div>

              <div className="p-6 text-center">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Narendra Modi
                </h3>
                <p className="mt-2 text-sm font-medium text-teal-800">
                  Hon'ble Prime Minister of India
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  National leadership and public welfare initiatives.
                </p>
              </div>
            </article>

            {/* Chief Minister */}
            <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden bg-slate-100 sm:h-72">
                <img
                  src="/Yogi.jpg"
                  alt="Yogi Adityanath"
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/50 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-teal-900">
                  Uttar Pradesh
                </span>
              </div>

              <div className="p-6 text-center">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Yogi Adityanath
                </h3>
                <p className="mt-2 text-sm font-medium text-teal-800">
                  Hon'ble Chief Minister of Uttar Pradesh
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  State governance, public welfare and healthcare initiatives.
                </p>
              </div>
            </article>

            {/* District Magistrate */}
            <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <div className="relative h-64 overflow-hidden bg-slate-100 sm:h-72">
                <img
                  src="/dm-jhansi.jpeg"
                  alt="Gaurang Rathi, District Magistrate, Jhansi"
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/50 to-transparent" />

                <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-teal-900">
                  District Administration
                </span>
              </div>

              <div className="p-6 text-center">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Gaurang Rathi
                </h3>

                <p className="mt-2 text-sm font-medium text-teal-800">
                  District Magistrate, Jhansi
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Leading district administration and coordinating public
                  services for the people of Jhansi.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="border-y border-line bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Our Digital Services
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
              Healthcare made simpler.
            </h2>

            <p className="text-slate-500 mt-3 leading-relaxed">
              A modern digital experience that makes accessing hospital services
              easier, faster and more convenient.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {SERVICES.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-2xl border border-line bg-paper p-6 hover:border-teal-200 hover:shadow-sm transition"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 grid place-items-center">
                    <Icon size={21} />
                  </div>

                  <h3 className="font-display font-bold text-lg mt-5">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DEPARTMENTS ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Healthcare Services
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
              Medical Departments
            </h2>

            <p className="text-slate-500 mt-3 max-w-xl">
              Explore the healthcare departments available at YD District
              Hospital.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-9">
          {DEPARTMENTS.map((department) => {
            const Icon = department.icon;

            return (
              <div
                key={department.name}
                className="group rounded-2xl border border-line bg-white p-5 hover:border-teal-200 hover:shadow-sm transition"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 grid place-items-center group-hover:bg-teal-800 group-hover:text-white transition">
                  <Icon size={23} />
                </div>

                <h3 className="font-semibold text-sm sm:text-base mt-5">
                  {department.name}
                </h3>

                <div className="flex items-center gap-1 text-xs text-teal-700 mt-3">
                  Healthcare Services
                  <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="bg-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              About YD Hospital
            </p>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 leading-tight">
              Serving the community with accessible healthcare.
            </h2>

            <p className="text-teal-100/75 mt-5 leading-relaxed max-w-xl">
              YD District Hospital is committed to providing accessible,
              reliable and patient-focused healthcare services to the community
              through modern healthcare facilities and digital solutions.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-7 bg-white text-teal-900 font-semibold text-sm rounded-xl px-5 py-3 hover:bg-teal-50 transition"
            >
              Access Hospital Services
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
              <HeartPulse size={25} className="text-amber-400" />
              <p className="font-semibold mt-5">Patient Focused</p>
              <p className="text-xs text-teal-100/60 mt-2 leading-relaxed">
                Services designed around patient convenience.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
              <ShieldCheck size={25} className="text-amber-400" />
              <p className="font-semibold mt-5">Secure</p>
              <p className="text-xs text-teal-100/60 mt-2 leading-relaxed">
                Secure digital access to hospital services.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
              <Smartphone size={25} className="text-amber-400" />
              <p className="font-semibold mt-5">Digital</p>
              <p className="text-xs text-teal-100/60 mt-2 leading-relaxed">
                Modern tools for easier access.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
              <Building2 size={25} className="text-amber-400" />
              <p className="font-semibold mt-5">Community</p>
              <p className="text-xs text-teal-100/60 mt-2 leading-relaxed">
                Healthcare for the local community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOSPITAL INFO ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Hospital Information
          </p>

          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
            Important Information
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <div className="border border-line rounded-2xl p-6 bg-white">
            <Clock3 className="text-teal-800" size={23} />

            <p className="font-semibold mt-5">OPD Hours</p>

            <p className="text-sm text-slate-500 mt-2">Monday – Saturday</p>

            <p className="text-sm font-medium mt-1">9:00 AM – 4:00 PM</p>
          </div>

          <div className="border border-line rounded-2xl p-6 bg-white">
            <Siren className="text-teal-800" size={23} />

            <p className="font-semibold mt-5">Emergency Services</p>

            <p className="text-sm text-slate-500 mt-2">Emergency department</p>

            <p className="text-sm font-medium mt-1">Available 24 × 7</p>
          </div>

          <div className="border border-line rounded-2xl p-6 bg-white">
            <MapPin className="text-teal-800" size={23} />

            <p className="font-semibold mt-5">Hospital Location</p>

            <p className="text-sm text-slate-500 mt-2">YD District Hospital</p>

            <p className="text-sm font-medium mt-1">District Hospital Campus</p>
          </div>
        </div>
      </section>

      {/* ================= CONTACT STRIP ================= */}
      <section id="contact" className="border-t border-line bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-semibold">Need assistance?</p>
            <p className="text-sm text-slate-500 mt-1">
              Contact the hospital help desk for assistance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-teal-800">
            <Phone size={16} />
            Hospital Help Desk
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-line bg-paper">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-7 h-7 rounded-lg bg-teal-800 text-amber-500">
              <Activity size={14} />
            </span>

            <span className="font-semibold text-sm">YD District Hospital</span>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 YD District Hospital · Government Healthcare Services
          </p>
        </div>
      </footer>
    </main>
  );
}
