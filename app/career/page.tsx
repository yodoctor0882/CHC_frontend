"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileText,
  GraduationCap,
  HeartPulse,
  LoaderCircle,
  Send,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from "lucide-react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

const COURSES = [
  "ANM",

  "GNM",

  "B.Sc. Nursing",

  "Post Basic B.Sc. Nursing",

  "M.Sc. Nursing",

  "Other",
];

const NAV_LINKS = [
  { label: "Home", href: "/" },

  { label: "About", href: "/about" },

  { label: "Career", href: "/career" },

  { label: "Contact Us", href: "/contact" },
];

const DURATIONS = ["1 month", "2 months", "3 months", "6 months"];

const INITIAL_FORM = {
  fullName: "",

  email: "",

  mobile: "",

  gender: "",

  dateOfBirth: "",

  course: "",

  college: "",

  currentYear: "",

  councilRegistration: "",

  preferredDuration: "",

  preferredStartDate: "",

  skills: "",

  experience: "",

  coverLetter: "",

  consent: false,
};

const BENEFITS = [
  {
    icon: HeartPulse,

    title: "Clinical Learning",

    description:
      "Learn about clinical environments under approved supervision.",
  },

  {
    icon: GraduationCap,

    title: "Professional Growth",

    description:
      "Build professional skills relevant to your nursing education.",
  },

  {
    icon: ShieldCheck,

    title: "Patient Safety",

    description:
      "Understand patient privacy, safety and professional responsibilities.",
  },
];

const REQUIRED_DOCUMENTS = [
  "Updated resume or CV",

  "College identity card or student ID",

  "Course/qualification certificate or latest marksheet",

  "College permission or recommendation, if required",

  "Nursing Council registration, if applicable",
];

const FAQS = [
  {
    question: "Who can apply for a nursing internship?",

    answer:
      "Students enrolled in an eligible nursing course may apply when a suitable internship opening is officially available. Eligibility will be confirmed by the hospital.",
  },

  {
    question: "Which nursing courses can apply?",

    answer:
      "The form includes ANM, GNM, B.Sc. Nursing, Post Basic B.Sc. Nursing, M.Sc. Nursing and Other. The hospital will determine which courses are eligible for each opening.",
  },

  {
    question: "Which documents are required?",

    answer:
      "Applicants may need a resume, student ID, course documents and college permission. Additional documents may be required in the official notice.",
  },

  {
    question: "Is the internship paid?",

    answer:
      "Stipend details depend on the approved internship notification. Do not assume that an internship is paid unless the official notice confirms it.",
  },

  {
    question: "How can I check my application status?",

    answer:
      "After submission, keep your application reference number if one is provided. Status tracking can be enabled once the hospital's application backend supports it.",
  },
];

export default function CareerPage() {
  const [form, setForm] = useState(INITIAL_FORM);

  const [resume, setResume] = useState<File | null>(null);

  const [documents, setDocuments] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  const pathname = usePathname();

  const [status, setStatus] = useState<{
    type: "success" | "error" | "";

    message: string;

    reference?: string;
  }>({ type: "", message: "" });

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    if (!isApplyModalOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) setIsApplyModalOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isApplyModalOpen, loading]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setResume(file);

    setStatus({ type: "", message: "" });

    if (file && file.size > 5 * 1024 * 1024) {
      setResume(null);

      event.target.value = "";

      setStatus({
        type: "error",

        message: "Resume must be smaller than 5 MB.",
      });

      return;
    }

    if (file && file.type !== "application/pdf") {
      setResume(null);

      event.target.value = "";

      setStatus({
        type: "error",

        message: "Please upload your resume in PDF format.",
      });
    }
  };

  const handleDocumentsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    setStatus({ type: "", message: "" });

    if (files.length > 4) {
      event.target.value = "";

      setDocuments([]);

      setStatus({
        type: "error",

        message: "You can select up to 4 supporting documents.",
      });

      return;
    }

    const invalidFile = files.find(
      (file) => file.type !== "application/pdf" || file.size > 5 * 1024 * 1024,
    );

    if (invalidFile) {
      event.target.value = "";

      setDocuments([]);

      setStatus({
        type: "error",

        message: "Each supporting document must be a PDF smaller than 5 MB.",
      });

      return;
    }

    setDocuments(files);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus({ type: "", message: "" });

    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      setStatus({
        type: "error",

        message: "Enter a valid 10-digit Indian mobile number.",
      });

      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({
        type: "error",

        message: "Enter a valid email address.",
      });

      return;
    }

    if (!form.course || !form.preferredDuration) {
      setStatus({
        type: "error",

        message: "Please select your nursing course and preferred duration.",
      });

      return;
    }

    if (!resume) {
      setStatus({
        type: "error",

        message: "Please upload your resume in PDF format.",
      });

      return;
    }

    if (!form.consent) {
      setStatus({
        type: "error",

        message: "Please accept the declaration before applying.",
      });

      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key !== "consent") {
          payload.append(key, String(value));
        }
      });

      payload.append("consent", String(form.consent));

      payload.append("resume", resume);

      documents.forEach((file) => {
        payload.append("documents", file);
      });

      const response = await fetch(
        `${API_BASE_URL}/contact/internships/apply`,
        {
          method: "POST",

          body: payload,
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit your application.");
      }

      setStatus({
        type: "success",

        message:
          data.message || "Your application has been submitted successfully.",

        reference: data.applicationId ? String(data.applicationId) : undefined,
      });

      setForm({ ...INITIAL_FORM });

      setResume(null);

      setDocuments([]);

      const formElement = event.currentTarget;

      formElement.reset();
    } catch (error: unknown) {
      setStatus({
        type: "error",

        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Navigation */}

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

      {/* Hero */}

      <section className="relative isolate overflow-hidden bg-teal-950">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950" />

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr,0.8fr] lg:py-24">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-100">
              <GraduationCap size={16} />
              Nursing Internship Program
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Learn. Care.
              <span className="block text-teal-300">Make a Difference.</span>
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-white/75">
              Explore nursing internship opportunities, strengthen your
              professional skills and prepare for a career in healthcare.
              Opportunities are subject to approved openings and eligibility.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setStatus({ type: "", message: "" });

                  setIsApplyModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-400"
              >
                Apply for Internship <ArrowRight size={17} />
              </button>

              <a
                href="#eligibility"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Check Eligibility
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-white backdrop-blur-sm sm:p-8">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-400/15 text-teal-200">
              <HeartPulse size={29} />
            </div>

            <h2 className="mt-5 font-display text-2xl font-bold">
              Your Nursing Journey Starts Here
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/70">
              Discover opportunities for supervised learning, professional
              conduct, patient safety and practical exposure.
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Learning under authorized supervision",

                "Professional conduct and patient privacy",

                "Course-specific eligibility review",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-teal-300"
                    size={18}
                  />

                  <span className="text-sm text-white/85">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Build Your Future
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Nursing Internship Opportunities
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Students may submit an application for consideration. Applying does
            not guarantee selection, placement or access to clinical duties. The
            hospital will confirm approved opportunities.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="rounded-2xl border border-line bg-white p-6 transition hover:border-teal-200 hover:shadow-lg"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-800">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Eligibility */}

      <section
        id="eligibility"
        className="scroll-mt-24 border-y border-line bg-white"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              Before Applying
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold">
              Eligibility & Requirements
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Final eligibility depends on the specific internship notice, the
              student's course and applicable hospital requirements.
            </p>

            <ul className="mt-6 space-y-4">
              {[
                "Be enrolled in, or have completed, an eligible nursing course as specified in the notice.",

                "Provide accurate educational and contact information.",

                "Provide college permission or recommendation where required.",

                "Meet any applicable registration, health, safety and verification requirements.",

                "Follow hospital confidentiality, supervision and conduct rules.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-teal-700"
                    size={19}
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-paper p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-100 text-teal-800">
                <FileText size={24} />
              </div>

              <div>
                <h3 className="font-display text-xl font-bold">
                  Documents Checklist
                </h3>

                <p className="text-sm text-slate-500">
                  Prepare these documents
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-4">
              {REQUIRED_DOCUMENTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-teal-700"
                    size={18}
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Only upload documents requested by the official internship
              notification. Do not upload patient records or unrelated sensitive
              information.
            </p>
          </div>
        </div>
      </section>

      {/* Application Process */}

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            How It Works
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold">
            Application Process
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              number: "01",

              title: "Fill the Form",

              description: "Provide your personal and educational details.",
            },

            {
              number: "02",

              title: "Upload Documents",

              description: "Attach your resume and required PDF documents.",
            },

            {
              number: "03",

              title: "Application Review",

              description:
                "The authorized team reviews eligibility and documents.",
            },

            {
              number: "04",

              title: "Further Communication",

              description:
                "Eligible candidates may be contacted according to the notice.",
            },
          ].map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <span className="text-3xl font-bold text-teal-700">
                {step.number}
              </span>

              <h3 className="mt-4 font-display font-bold">{step.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Internship Application Modal */}

      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-2 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) {
              setIsApplyModalOpen(false);
            }
          }}
        >
          <section
            id="apply"
            role="dialog"
            aria-modal="true"
            aria-labelledby="internship-modal-title"
            className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-3xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-line bg-white px-5 py-4 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
                  Nursing Internship
                </p>

                <h2
                  id="internship-modal-title"
                  className="mt-1 font-display text-xl font-bold sm:text-2xl"
                >
                  Application Form
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Complete your details and upload the required documents.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                disabled={loading}
                aria-label="Close internship application"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-3 py-4 sm:px-8 sm:py-7">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-line bg-paper p-5 shadow-sm sm:rounded-3xl sm:p-8"
              >
                {status.message && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mb-6 rounded-xl border p-4 text-sm leading-6 ${
                      status.type === "success"
                        ? "border-teal-200 bg-teal-50 text-teal-900"
                        : "border-red-200 bg-red-50 text-red-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {status.type === "success" ? (
                        <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
                      ) : (
                        <ShieldCheck className="mt-0.5 shrink-0" size={20} />
                      )}

                      <div>
                        <p>{status.message}</p>

                        {status.reference && (
                          <p className="mt-1 font-semibold">
                            Application reference: {status.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6 flex items-center gap-3 border-b border-line pb-4">
                  <UserRound className="text-teal-800" size={22} />

                  <h3 className="font-display text-xl font-bold">
                    Personal Information
                  </h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required>
                    <input
                      name="fullName"
                      required
                      minLength={2}
                      maxLength={100}
                      value={form.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Mobile Number" required>
                    <input
                      name="mobile"
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      value={form.mobile}
                      onChange={handleChange}
                      autoComplete="tel"
                      placeholder="10-digit mobile number"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Email Address" required>
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Gender (optional)">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Prefer not to say</option>

                      <option value="Female">Female</option>

                      <option value="Male">Male</option>

                      <option value="Other">Other</option>

                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </Field>

                  <Field label="Date of Birth (optional)">
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mb-6 mt-10 flex items-center gap-3 border-b border-line pb-4">
                  <BookOpen className="text-teal-800" size={22} />

                  <h3 className="font-display text-xl font-bold">
                    Educational Details
                  </h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nursing Course" required>
                    <select
                      name="course"
                      required
                      value={form.course}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select course</option>

                      {COURSES.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Current Year / Status" required>
                    <select
                      name="currentYear"
                      required
                      value={form.currentYear}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select current year/status</option>

                      <option value="1st Year">1st Year</option>

                      <option value="2nd Year">2nd Year</option>

                      <option value="3rd Year">3rd Year</option>

                      <option value="4th Year">4th Year</option>

                      <option value="Final Year">Final Year</option>

                      <option value="Completed">Course Completed</option>

                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field label="College / Institute" required>
                    <input
                      name="college"
                      required
                      maxLength={200}
                      value={form.college}
                      onChange={handleChange}
                      placeholder="Enter college or institute name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Council Registration Number">
                    <input
                      name="councilRegistration"
                      maxLength={100}
                      value={form.councilRegistration}
                      onChange={handleChange}
                      placeholder="If applicable"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Preferred Duration" required>
                    <select
                      name="preferredDuration"
                      required
                      value={form.preferredDuration}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select duration</option>

                      {DURATIONS.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Preferred Start Date">
                    <input
                      name="preferredStartDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.preferredStartDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Relevant Skills (optional)">
                    <input
                      name="skills"
                      maxLength={1000}
                      value={form.skills}
                      onChange={handleChange}
                      placeholder="Relevant skills or training"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Previous Experience (optional)">
                    <input
                      name="experience"
                      maxLength={1000}
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="Previous training or experience"
                      className={inputClass}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Why are you interested? (optional)">
                      <textarea
                        name="coverLetter"
                        rows={4}
                        maxLength={2000}
                        value={form.coverLetter}
                        onChange={handleChange}
                        placeholder="Briefly describe your learning goals"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>

                <div className="mb-6 mt-10 flex items-center gap-3 border-b border-line pb-4">
                  <Upload className="text-teal-800" size={22} />

                  <h3 className="font-display text-xl font-bold">
                    Upload Documents
                  </h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Resume / CV (PDF, max 5 MB)" required>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      required
                      onChange={handleResumeChange}
                      className={fileInputClass}
                    />

                    {resume && (
                      <p className="mt-2 break-all text-xs text-teal-800">
                        Selected: {resume.name}
                      </p>
                    )}
                  </Field>

                  <Field label="Supporting Documents (up to 4 PDFs)">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={handleDocumentsChange}
                      className={fileInputClass}
                    />

                    {documents.length > 0 && (
                      <p className="mt-2 text-xs text-teal-800">
                        {documents.length} document(s) selected
                      </p>
                    )}
                  </Field>
                </div>

                <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h4 className="font-semibold text-amber-900">
                    Important Information
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    Submitting this form does not guarantee an internship. Do
                    not upload patient records, passwords, OTPs or unrelated
                    sensitive personal information. Only authorized hospital
                    personnel should review application documents.
                  </p>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-teal-800"
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    I confirm that the information provided is accurate and
                    consent to the processing of my application data for
                    internship recruitment, according to the applicable privacy
                    notice. *
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-4 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>
      )}

      {/* FAQs */}

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Need Help?
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {FAQS.map((faq, index) => (
            <article
              key={faq.question}
              className="overflow-hidden rounded-xl border border-line bg-white"
            >
              <button
                type="button"
                aria-expanded={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
              >
                <span>{faq.question}</span>

                <ChevronDown
                  size={19}
                  className={`shrink-0 transition ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openFaq === index && (
                <p className="px-5 pb-5 text-sm leading-7 text-slate-500">
                  {faq.answer}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100";

const fileInputClass =
  "block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-teal-800";

function Field({
  label,

  required,

  children,
}: {
  label: string;

  required?: boolean;

  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}

        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      {children}
    </div>
  );
}
