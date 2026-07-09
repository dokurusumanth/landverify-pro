import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  Camera,
  MapPin,
  FileCheck2,
  ShieldCheck,
  Globe2,
  Phone,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Lock,
  HardHat,
  Compass,
  Hammer,
} from "lucide-react";

import heroImage from "@/assets/hero-land.jpg";
import logoAsset from "@/assets/nrilandcheck-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NRI Land Check — Land Verification in India for NRIs" },
      {
        name: "description",
        content:
          "Trusted on-ground verification of your Indian land. Photo proof, live GPS location, and title document checks — built for Non-Resident Indians.",
      },
      { property: "og:title", content: "NRI Land Check — Land Verification for NRIs" },
      {
        property: "og:description",
        content: "Photo proof, live location, and title checks by trusted local experts in India.",
      },
    ],
  }),
  component: Landing,
});

const WHATSAPP_NUMBER = "919398666864";
const PHONE_DISPLAY = "+91 93986 66864";
const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const inquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(120),
  phone: z.string().trim().min(6, "Please enter a valid phone number").max(20),
  country: z.string().trim().min(2, "Country of residence is required").max(60),
  propertyState: z.string().trim().min(2, "State is required").max(60),
  propertyDetails: z
    .string()
    .trim()
    .min(10, "Please share at least a brief description")
    .max(1000, "Please keep this under 1000 characters"),
  service: z.enum(["photo", "location", "title", "all"]),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <TrustBar />
      <Services />
      <BuildPartners />

      <HowItWorks />
      <Inquiry />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Hello NRI Land Check, I'd like to verify my land in India.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp at ${PHONE_DISPLAY}`}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp py-3 pl-3 pr-4 text-white shadow-[0_10px_30px_-5px_oklch(0.62_0.16_150/0.55)] ring-1 ring-white/20 transition hover:scale-105 hover:brightness-110 sm:bottom-7 sm:right-7"
    >
      <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40" aria-hidden />
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M19.11 17.21c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM16.05 6C10.5 6 6 10.49 6 16.03c0 1.78.47 3.51 1.36 5.04L6 26l5.07-1.33a10.04 10.04 0 0 0 4.98 1.27h.01c5.55 0 10.05-4.5 10.05-10.03 0-2.68-1.04-5.2-2.94-7.1A10.04 10.04 0 0 0 16.05 6z" />
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp Us</span>
    </a>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#services", label: "Services" },
    { href: "#how", label: "How it Works" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src={logoAsset.url}
            alt="NRILandCheck — Land Mapping, Verification, Solutions"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-navy">
            NRI<span className="text-emerald">Land</span>Check
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="hidden items-center gap-2 text-sm font-medium text-navy lg:inline-flex"
          >
            <Phone className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          <a
            href={waLink("Hello, I'd like to verify my land in India.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-whatsapp px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>
        </div>
        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
        >
          <span className="i-block">≡</span>
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <a
              href={waLink("Hello, I'd like to verify my land in India.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-whatsapp px-4 py-2 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-navy-deep"
      style={{
        backgroundImage:
          "linear-gradient(120deg, oklch(0.18 0.06 260) 0%, oklch(0.24 0.08 260) 55%, oklch(0.30 0.09 250) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1104}
          className="h-full w-full object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,oklch(0.18_0.06_260/0.85)_0%,oklch(0.22_0.08_260/0.7)_55%,oklch(0.18_0.06_260/0.55)_100%)]" />
      </div>
      <div className="absolute -left-24 -top-24 z-0 h-72 w-72 rounded-full bg-emerald/25 blur-3xl" />
      <div className="absolute -bottom-32 right-0 z-0 h-80 w-80 rounded-full bg-saffron/20 blur-3xl" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/10 px-3 py-1 text-xs font-medium text-saffron-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
            Trusted by NRIs across 30+ countries
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Your land in India,{" "}
            <span className="text-saffron">verified on the ground</span> — by people you can trust.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            For Non-Resident Indians who can't visit in person. We send vetted local experts to
            your plot for time-stamped photo proof, live GPS location, and complete title document
            checks — so you always know what's really happening with your property.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a
              href={waLink(
                "Hi NRI Land Check, I'd like to request land verification in India. My property is located at: ",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Request a Verification
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-6 text-white">
            <Stat value="2,400+" label="Plots verified" />
            <Stat value="22" label="States covered" />
            <Stat value="48h" label="Avg. turnaround" />
          </dl>
        </div>
        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-white shadow-xl backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-medium text-saffron">
              <Lock className="h-4 w-4" /> Secure & Confidential
            </div>
            <h3 className="mt-3 font-display text-2xl text-white">Why NRIs choose us</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/85">
              {[
                "Time-stamped, geo-tagged photographs and video walkthroughs",
                "Cross-checked with revenue records (RTC / 7-12 / Patta / Khata)",
                "Encrypted file sharing — your documents never go public",
                "Direct WhatsApp reporting in your time zone",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-navy hover:bg-white/90"
            >
              <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-semibold text-saffron sm:text-3xl">{value}</dt>
      <dd className="mt-1 text-xs uppercase tracking-wider text-white/70">{label}</dd>
    </div>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, text: "Background-verified local agents" },
    { icon: Lock, text: "End-to-end encrypted reports" },
    { icon: Globe2, text: "Service in 22 states & UTs" },
    { icon: FileCheck2, text: "Lawyer-reviewed title checks" },
  ];
  return (
    <section className="border-y border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-navy">
            <Icon className="h-5 w-5 text-emerald" />
            <span className="font-medium">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const SERVICES = [
  {
    icon: Camera,
    title: "Photo Proof",
    tag: "Visual evidence",
    body: "High-resolution, time-stamped photos and a short video walkthrough of your plot from multiple angles, boundary stones, and neighbouring landmarks.",
    bullets: ["Date & time stamp", "Boundary close-ups", "Encroachment check"],
  },
  {
    icon: MapPin,
    title: "Live Location",
    tag: "GPS verified",
    body: "Geo-tagged coordinates with Google Maps pin, plot dimensions, and on-site live video call so you can virtually 'stand' on your land in real time.",
    bullets: ["GPS coordinates", "Live video call", "Plot dimensions"],
  },
  {
    icon: FileCheck2,
    title: "Title Checks",
    tag: "Legally reviewed",
    body: "Verification of land records (RTC, 7/12, Patta, Khata, EC) against the sub-registrar and revenue office — reviewed by a property lawyer.",
    bullets: ["Encumbrance check", "Mutation status", "Ownership history"],
  },
];

function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald">
          Our Services
        </p>
        <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl lg:text-5xl">
          Three pillars of land verification, done locally.
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Pick a single service or combine all three for an end-to-end property health check.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SERVICES.map((s) => (
          <article
            key={s.title}
            className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-emerald/40 hover:shadow-[0_20px_60px_-30px_oklch(0.18_0.06_260/0.35)]"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-saffron-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy">
                {s.tag}
              </span>
            </div>
            <h3 className="mt-5 font-display text-xl text-navy">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            <ul className="mt-5 space-y-2 text-sm text-foreground">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald" /> {b}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-emerald hover:gap-2"
            >
              Request this service <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Share your details",
    body: "Send us your property location and any documents via WhatsApp or the secure form. We confirm scope and a fixed quote within hours.",
  },
  {
    n: "02",
    title: "We visit the site",
    body: "A vetted local agent visits your plot, captures geo-tagged photos & video, and (optionally) hosts a live video call with you on site.",
  },
  {
    n: "03",
    title: "Receive a full report",
    body: "You get an encrypted PDF report with photos, GPS data, title document review, and a clear summary — usually within 48 hours.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl lg:text-5xl">
            From inquiry to verified report in 3 steps.
          </h2>
        </div>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-saffron/0 via-saffron/60 to-saffron/0 md:block" />
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative">
              <div className="flex items-center gap-4">
                <span className="relative grid h-14 w-14 flex-none place-items-center rounded-full border border-saffron/40 bg-navy-deep font-display text-lg font-semibold text-saffron">
                  {s.n}
                </span>
                <span className="hidden h-px flex-1 bg-white/10 md:block" />
              </div>
              <h3 className="mt-5 font-display text-xl text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{s.body}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="absolute right-0 top-4 hidden h-4 w-4 text-saffron/60 md:block" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type FormState = z.infer<typeof inquirySchema>;
const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  propertyState: "",
  propertyDetails: "",
  service: "all",
};

function Inquiry() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = inquirySchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const d = parsed.data;
    setSaving(true);
    const { error } = await supabase.from("inquiries").insert({
      full_name: d.fullName,
      email: d.email,
      phone: d.phone,
      country: d.country,
      property_state: d.propertyState,
      property_details: d.propertyDetails,
      service: d.service,
    });
    setSaving(false);
    if (error) {
      setServerError("We couldn't save your inquiry. Please try WhatsApp instead.");
      return;
    }
    const msg = [
      `New verification inquiry`,
      `Name: ${d.fullName}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone}`,
      `Country: ${d.country}`,
      `Property state: ${d.propertyState}`,
      `Service: ${d.service}`,
      `Details: ${d.propertyDetails}`,
    ].join("\n");
    setSubmitted(true);
    setForm(initialForm);
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald">
            Secure Inquiry
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
            Request your land verification
          </h2>
          <p className="mt-4 text-muted-foreground">
            Share a few details about your property in India. We'll reply on WhatsApp within
            business hours with a fixed quote and timeline.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <ContactLine icon={Phone} label="Call us" value={PHONE_DISPLAY} href={`tel:+${WHATSAPP_NUMBER}`} />
            <ContactLine
              icon={MessageCircle}
              label="WhatsApp"
              value={PHONE_DISPLAY}
              href={waLink("Hello, I'd like to verify my land in India.")}
            />
            <div className="flex items-start gap-3 rounded-xl border border-emerald/30 bg-emerald-soft/60 p-4 text-navy">
              <Lock className="mt-0.5 h-4 w-4 flex-none text-emerald" />
              <p className="text-xs leading-relaxed">
                Your information is transmitted directly to our team over WhatsApp's encrypted
                channel. We never share your details with third parties.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl border border-border bg-card p-6 shadow-[0_20px_60px_-40px_oklch(0.18_0.06_260/0.4)] sm:p-8"
          >
            {submitted && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald/40 bg-emerald-soft p-4 text-sm text-navy">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald" />
                <div>
                  Thanks — we've opened WhatsApp with your details pre-filled. Just hit send and
                  we'll reply shortly.
                </div>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName}>
                <input
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  maxLength={80}
                  autoComplete="name"
                  className={inputCls}
                  placeholder="Rohit Sharma"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  maxLength={120}
                  autoComplete="email"
                  className={inputCls}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone (with country code)" error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  maxLength={20}
                  autoComplete="tel"
                  className={inputCls}
                  placeholder="+1 415 555 0142"
                />
              </Field>
              <Field label="Country of residence" error={errors.country}>
                <input
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  maxLength={60}
                  autoComplete="country-name"
                  className={inputCls}
                  placeholder="United States"
                />
              </Field>
              <Field label="Property location (State / District)" error={errors.propertyState}>
                <input
                  value={form.propertyState}
                  onChange={(e) => update("propertyState", e.target.value)}
                  maxLength={60}
                  className={inputCls}
                  placeholder="Andhra Pradesh, Guntur"
                />
              </Field>
              <Field label="Service needed" error={errors.service}>
                <select
                  value={form.service}
                  onChange={(e) => update("service", e.target.value as FormState["service"])}
                  className={inputCls}
                >
                  <option value="all">Full check (all 3)</option>
                  <option value="photo">Photo proof</option>
                  <option value="location">Live location</option>
                  <option value="title">Title check</option>
                </select>
              </Field>
            </div>
            <div className="mt-5">
              <Field
                label="Property details (village, survey no., landmarks)"
                error={errors.propertyDetails}
              >
                <textarea
                  value={form.propertyDetails}
                  onChange={(e) => update("propertyDetails", e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className={inputCls}
                  placeholder="Survey no. 142/2, Village Kothapeta, near the school…"
                />
              </Field>
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {form.propertyDetails.length}/1000
              </p>
            </div>
            {serverError && (
              <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {serverError}
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-navy-deep disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Sending…" : "Send Secure Inquiry"} <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              By submitting, you agree to be contacted about your inquiry. We never share your data.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/30 placeholder:text-muted-foreground/70";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-emerald/40"
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-soft text-emerald">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="block text-sm font-semibold text-navy">{value}</span>
      </span>
    </a>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-navy text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-white p-1">
              <img src={logoAsset.url} alt="NRILandCheck logo" className="h-full w-full object-contain" />
            </span>
            <span className="font-display text-lg font-semibold text-white">
              NRI<span className="text-saffron">Land</span>Check
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/65">
            Trusted on-ground land verification across India — built for NRIs who can't be there in
            person.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-saffron">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={waLink("Hello, I'd like to verify my land in India.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-saffron"
              >
                WhatsApp Chat
              </a>
            </li>
            <li>NRILandCheck.in</li>
            <li>
              <a href="/auth" className="text-white/50 hover:text-saffron">Team sign in</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Services
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#services" className="hover:text-saffron">Photo proof</a></li>
            <li><a href="#services" className="hover:text-saffron">Live location</a></li>
            <li><a href="#services" className="hover:text-saffron">Title checks</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} NRI Land Check. All rights reserved.
      </div>
    </footer>
  );
}
