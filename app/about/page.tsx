
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Building2,
  HeartPulse,
  ShieldCheck,
  Users,
  Target,
  Eye,
  Stethoscope,
  Smartphone,
  MapPin,
  Phone,
  Clock3,
  CheckCircle2,
  Hospital,
  HandHeart,
  Award,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/contact" },
];

const VALUES = [
  {
    icon: HeartPulse,
    title: "Patient First",
    description:
      "Keeping patient needs, dignity, and convenience at the centre of healthcare services.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    description:
      "Supporting a reliable healthcare experience through responsible service and secure digital access.",
  },
  {
    icon: HandHeart,
    title: "Community Care",
    description:
      "Working towards accessible healthcare information and services for the local community.",
  },
];

const FACILITIES = [
  {
    icon: Building2,
    title: "Hospital Facilities",
    description:
      "Learn about the hospital campus and the facilities available to visitors.",
  },
  {
    icon: Eye,
    title: "Eye Ward & O.T. Block",
    description:
      "Explore the eye-care and operation theatre block shown on our website.",
  },
  {
    icon: Smartphone,
    title: "Digital Services",
    description:
      "Access the hospital's online platform through the available patient and staff login options.",
  },
];

export default function AboutPage() {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-800 text-amber-500">
              <Activity size={18} strokeWidth={2.4} />
            </span>

            <span>
              <span className="block font-display text-[15px] font-bold leading-tight">
                YD Hospital
              </span>
              <span className="block text-[11px] leading-tight text-slate-500">
                District Hospital
              </span>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-teal-50 text-teal-800"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-teal-800/25 px-3 py-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-50 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Patient / Staff Login</span>
            <span className="sm:hidden">Login</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex items-center justify-center gap-1 overflow-x-auto px-3 pb-3 md:hidden"
        >
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-600 hover:bg-teal-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ABOUT HERO */}

<section className="relative isolate h-[320px] overflow-hidden bg-teal-950 sm:h-[380px] lg:h-[430px] ">
  {/* Background Image */}
  <img
    src="/district-hospital-jhansi.jpeg"
    alt="District Hospital, Jhansi"
    className="absolute  h-full w-full  object-center"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-teal-950/75 to-teal-950/35" />

  {/* Hero Content */}
  <div className="relative mx-auto grid h-full max-w-6xl items-center gap-6 px-5 sm:px-6 lg:grid-cols-[1.2fr,0.8fr]">
    <div className="max-w-2xl text-white">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-teal-100 backdrop-blur-sm sm:text-xs">
        <Building2 size={14} />
        About YD Hospital
      </span>

      <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        Healthcare with
        <span className="block text-teal-300">
          Care & Commitment.
        </span>
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
        Learn about our hospital, our approach to patient-focused care,
        and the digital services designed to make accessing hospital
        information simpler.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 sm:px-5"
        >
          Contact Us
          <ArrowRight size={16} />
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:px-5"
        >
          Access Portal
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  </div>
</section>


      {/* INTRODUCTION */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Who We Are
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            About District Hospital, Jhansi
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            YD Hospital's website is designed to help visitors learn about
            hospital facilities and access available digital services from
            one place.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Our focus is on clear information, convenient online access, and
            a user-friendly experience for patients and hospital staff.
            Visitors can explore the information published on this website
            and use the available contact options for further assistance.
          </p>

          <div className="mt-7 space-y-3">
            {[
              "Easy access to hospital information",
              "Patient and staff login options",
              "A responsive experience across devices",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-teal-700"
                />
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-teal-100/70 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-3 shadow-xl">
            <img
              src="/eye-ward-ot-block.jpeg"
              alt="Eye Ward and Operation Theatre Block"
              className="h-72 w-full rounded-2xl object-cover sm:h-96"
              loading="lazy"
            />

            <div className="flex items-center gap-4 p-4 sm:p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-800">
                <HeartPulse size={25} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">
                  Care & Facilities
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Explore hospital facilities and available information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              Our Purpose
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Mission & Vision
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              The principles guiding the experience we aim to provide through
              our website and digital services.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="group rounded-3xl border border-line bg-paper p-7 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg sm:p-9">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-800 text-white transition group-hover:bg-teal-700">
                <Target size={27} />
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold">
                Our Mission
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                To make hospital information and available digital services
                easier to access, while promoting a convenient and
                patient-focused experience.
              </p>
            </article>

            <article className="group rounded-3xl border border-line bg-paper p-7 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg sm:p-9">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-800 transition group-hover:bg-amber-200">
                <Eye size={27} />
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold">
                Our Vision
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                To support a more connected healthcare experience through
                clear communication, accessible information, and useful
                digital tools for the community.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              What Matters to Us
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Our Core Values
            </h2>
          </div>

          <p className="max-w-lg leading-7 text-slate-500">
            A welcoming, clear, and accessible experience for everyone
            using our website.
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {VALUES.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg sm:p-7"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-800">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 font-display text-xl font-bold">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* FACILITIES */}
      <section className="bg-teal-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
              Explore Our Hospital
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Facilities & Digital Services
            </h2>

            <p className="mt-4 leading-7 text-teal-100/70">
              Explore hospital information and use the available online
              services through the website.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {FACILITIES.map((facility) => {
              const Icon = facility.icon;

              return (
                <article
                  key={facility.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 transition hover:border-teal-400/50 hover:bg-white/10"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-800 text-teal-100">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 font-display text-xl font-bold">
                    {facility.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-teal-100/70">
                    {facility.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div>
              <h3 className="font-display text-xl font-bold">
                Access the Hospital Portal
              </h3>
              <p className="mt-2 text-sm leading-6 text-teal-100/70">
                Use the login page to access the available patient or staff
                services.
              </p>
            </div>

            <Link
              href="/login"
              className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-950 transition hover:bg-teal-50 sm:mt-0"
            >
              Go to Login
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ADMINISTRATION INFORMATION */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-8 rounded-3xl border border-line bg-white p-7 shadow-sm sm:p-10 lg:grid-cols-[1fr,auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              Hospital & Administration
            </p>

            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Information You Can Rely On
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-500">
              For official information about hospital administration,
              public services, timings, and facilities, please refer to
              verified hospital or district administration sources.
            </p>
          </div>

          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-800">
            <Users size={32} />
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="border-t border-line bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl font-bold">
              Need More Information?
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Visit the contact page for hospital enquiries and assistance.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <Phone size={17} />
            Contact Hospital
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      
    </main>
  );
}
