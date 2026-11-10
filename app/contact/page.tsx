"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock3,
  MessageSquare,
  Send,
  CheckCircle2,
  ShieldCheck,
  Headset,
  LoaderCircle,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/contact" },
];

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: "Hospital Address",
    value: "District Hospital, Jhansi",
    description: "Jhansi, Uttar Pradesh, India",
  },
  {
    icon: Phone,
    title: "Phone Number",
    value: "Official number required",
    description: "Add the verified hospital contact number.",
  },
  {
    icon: Mail,
    title: "Email Address",
    value: "Official email required",
    description: "Add the verified hospital email address.",
  },
  {
    icon: Clock3,
    title: "Office Hours",
    value: "Please confirm timings",
    description: "Contact the hospital for current timings.",
  },
];

const ENQUIRY_TYPES = [
  "General Enquiry",
  "Appointment Assistance",
  "Website / Login Support",
  "Feedback / Grievance",
  "Other",
];

const INITIAL_FORM = {
  name: "",
  mobile: "",
  email: "",
  enquiryType: "General Enquiry",
  message: "",
  consent: false,
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

export default function ContactPage() {
  const pathname = usePathname();

  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = event.target;

    const checked =
      type === "checkbox" && "checked" in event.target
        ? event.target.checked
        : false;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus({ type: "", message: "" });

    const normalizedMobile = form.mobile.replace(/[\s-]/g, "");
    const normalizedEmail = form.email.trim();

    if (!form.name.trim() || form.name.trim().length < 2) {
      setStatus({
        type: "error",
        message: "Please enter your full name.",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      setStatus({
        type: "error",
        message: "Please enter a valid 10-digit Indian mobile number.",
      });
      return;
    }

    if (
      normalizedEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (form.message.trim().length < 10) {
      setStatus({
        type: "error",
        message: "Please enter a message of at least 10 characters.",
      });
      return;
    }

    if (form.message.trim().length > 2000) {
      setStatus({
        type: "error",
        message: "Your message cannot exceed 2000 characters.",
      });
      return;
    }

    if (!form.consent) {
      setStatus({
        type: "error",
        message: "Please provide consent before submitting the enquiry.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: normalizedMobile,
          email: normalizedEmail || null,
          enquiryType: form.enquiryType,
          message: form.message.trim(),
          consent: form.consent,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your enquiry right now.",
        );
      }

      setStatus({
        type: "success",
        message:
          data.message || "Your enquiry has been submitted successfully.",
      });

      setForm({ ...INITIAL_FORM });
    } catch (error: unknown) {
      console.error("Contact enquiry submission failed:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to connect to the server. Please try again later.";

      setStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

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
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
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

          <Link
            href="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-teal-800/25 px-3 py-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-50 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Patient / Staff Login</span>
            <span className="sm:hidden">Login</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* MOBILE NAVIGATION */}
        <nav
          aria-label="Mobile navigation"
          className="flex items-center justify-center gap-1 overflow-x-auto px-3 pb-3 md:hidden"
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
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
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

      {/* HERO */}
      <section className="relative isolate h-[300px] overflow-hidden bg-teal-950 sm:h-[350px] lg:h-[390px]">
        <img
          src="/district-hospital-jhansi.jpeg"
          alt="District Hospital, Jhansi"
          className="absolute inset-0 h-full w-full object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-teal-950/75 to-teal-950/35" />

        <div className="relative mx-auto flex h-full max-w-6xl items-center px-5 sm:px-6">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-100 backdrop-blur-sm">
              <MessageSquare size={14} />
              Contact Us
            </span>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              We&apos;re Here
              <span className="block text-teal-300">To Help You.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Have a question or need assistance? Get in touch with us through
              the contact options available on this page.
            </p>

            <a
              href="#contact-form"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              Send an Enquiry
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* INTRODUCTION AND CONTACT CARDS */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Get In Touch
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            How Can We Help You?
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Find hospital information or send an enquiry to the appropriate
            team. Please do not include sensitive medical information in this
            general contact form.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg sm:p-6"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-800">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold">
                  {card.title}
                </h3>

                <p className="mt-2 break-words text-sm font-semibold text-teal-800">
                  {card.value}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section
        id="contact-form"
        className="scroll-mt-28 border-y border-line bg-white"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[0.8fr,1.2fr] lg:gap-14 lg:py-20">
          {/* LEFT INFORMATION */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              Send Us a Message
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Let&apos;s Talk
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              Complete the enquiry form with your contact details and message.
              Your enquiry will be submitted to the hospital enquiry system.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-800">
                  <Headset size={22} />
                </div>

                <div>
                  <h3 className="font-semibold">General Assistance</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    For general questions about the website and available
                    hospital information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-800">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h3 className="font-semibold">Your Privacy Matters</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Share only the information needed to respond to your
                    enquiry.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  Medical Emergency?
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  This form is not for emergencies. Seek immediate emergency
                  medical assistance instead.
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-line bg-paper p-5 shadow-sm sm:p-8"
          >
            <div className="mb-7">
              <h3 className="font-display text-2xl font-bold">
                Submit an Enquiry
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Fields marked with * are required.
              </p>
            </div>

            {status.message && (
              <div
                role="status"
                aria-live="polite"
                className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                  status.type === "success"
                    ? "border-teal-200 bg-teal-50 text-teal-900"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
                ) : (
                  <MessageSquare className="mt-0.5 shrink-0" size={19} />
                )}
                <p>{status.message}</p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* MOBILE */}
              <div>
                <label
                  htmlFor="mobile"
                  className="mb-2 block text-sm font-semibold"
                >
                  Mobile Number *
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  maxLength={15}
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* ENQUIRY TYPE */}
              <div>
                <label
                  htmlFor="enquiryType"
                  className="mb-2 block text-sm font-semibold"
                >
                  Enquiry Type *
                </label>
                <select
                  id="enquiryType"
                  name="enquiryType"
                  required
                  value={form.enquiryType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                >
                  {ENQUIRY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* MESSAGE */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Please describe your enquiry..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                />
                <p className="mt-2 text-right text-xs text-slate-400">
                  {form.message.length}/2000 characters
                </p>
              </div>
            </div>

            {/* CONSENT */}
            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 shrink-0 accent-teal-800"
              />
              <span className="text-xs leading-6 text-slate-500">
                I consent to the hospital using the information I have provided
                to respond to this enquiry.
              </span>
            </label>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Enquiry
                </>
              )}
            </button>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Please do not submit medical records, passwords, OTPs, or other
              sensitive personal information through this form.
            </p>
          </form>
        </div>
      </section>

      {/* LOCATION */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              Find Us
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Hospital Location
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              View the hospital location on Google Maps.
            </p>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=District+Hospital+Jhansi+Uttar+Pradesh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-teal-800/20 px-4 py-3 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
          >
            <MapPin size={17} />
            Get Directions
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
          <iframe
            title="District Hospital Jhansi location map"
            src="https://maps.google.com/maps?q=District%20Hospital%20Jhansi%20Uttar%20Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="h-[300px] w-full sm:h-[400px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Please verify the map pin and exact hospital entrance before
          publishing the website.
        </p>
      </section>
    </main>
  );
}
