import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  RefreshCcw,
  LogOut,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Globe2,
  Calendar,
  CheckCircle2,
  Clock,
  Inbox,
  Archive,
  ChevronRight,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Client Inquiries — NRI Land Check" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Inquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  property_state: string;
  property_details: string;
  service: "photo" | "location" | "title" | "all";
  status: "new" | "in_progress" | "completed" | "archived";
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

type StatusKey = Inquiry["status"];

const STATUS_META: Record<StatusKey, { label: string; cls: string; icon: typeof Inbox }> = {
  new: { label: "New", cls: "bg-saffron-soft text-navy ring-1 ring-saffron/40", icon: Inbox },
  in_progress: {
    label: "In progress",
    cls: "bg-blue-50 text-navy ring-1 ring-blue-200",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    cls: "bg-emerald-soft text-navy ring-1 ring-emerald/40",
    icon: CheckCircle2,
  },
  archived: {
    label: "Archived",
    cls: "bg-muted text-muted-foreground ring-1 ring-border",
    icon: Archive,
  },
};

const SERVICE_LABEL: Record<Inquiry["service"], string> = {
  photo: "Photo proof",
  location: "Live location",
  title: "Title check",
  all: "Full check",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Inquiry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | StatusKey>("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(
        error.message.includes("permission")
          ? "Your account isn't assigned to the field team yet. Ask the project owner to grant 'staff' or 'admin' access."
          : error.message,
      );
      setRows([]);
    } else {
      setRows((data ?? []) as Inquiry[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return [r.full_name, r.email, r.phone, r.country, r.property_state, r.property_details]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, search, filter]);

  const counts = useMemo(() => {
    const c: Record<"all" | StatusKey, number> = {
      all: rows?.length ?? 0,
      new: 0,
      in_progress: 0,
      completed: 0,
      archived: 0,
    };
    rows?.forEach((r) => {
      c[r.status]++;
    });
    return c;
  }, [rows]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const updateStatus = async (id: string, status: StatusKey) => {
    const prev = rows;
    setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) {
      setRows(prev);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-navy text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald">
                Field Team Console
              </p>
              <h1 className="font-display text-base font-semibold text-navy">Client Inquiries</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden text-xs text-muted-foreground sm:inline">{userEmail}</span>
            )}
            <Link
              to="/"
              className="hidden rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-navy hover:bg-secondary sm:inline-block"
            >
              View site
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-navy hover:bg-secondary"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["all", "new", "in_progress", "completed"] as const).map((k) => {
            const isActive = filter === k;
            const label = k === "all" ? "All" : STATUS_META[k].label;
            return (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-xl border p-4 text-left transition ${
                  isActive
                    ? "border-emerald bg-emerald-soft/60"
                    : "border-border bg-card hover:border-emerald/40"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-navy">{counts[k]}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, location…"
              className="w-full rounded-md border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/30"
            />
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 self-start rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-navy hover:bg-secondary sm:self-auto"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_60px_-40px_oklch(0.18_0.06_260/0.3)]">
          {loading ? (
            <div className="grid place-items-center px-6 py-20 text-sm text-muted-foreground">
              Loading inquiries…
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState hasFilter={filter !== "all" || search.length > 0} />
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setSelected(r)}
                    className="grid w-full grid-cols-12 items-center gap-4 px-5 py-4 text-left transition hover:bg-secondary/60"
                  >
                    <div className="col-span-12 md:col-span-4">
                      <p className="font-semibold text-navy">{r.full_name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <Globe2 className="mr-1 inline h-3 w-3" />
                        {r.country}
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-emerald" /> {r.property_state}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-navy">
                        {SERVICE_LABEL[r.service]}
                      </p>
                    </div>
                    <div className="col-span-7 md:col-span-3">
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="col-span-5 flex items-center justify-end gap-3 text-xs text-muted-foreground md:col-span-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(r.created_at)}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {selected && (
        <DetailDrawer
          inquiry={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(s) => updateStatus(selected.id, s)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: StatusKey }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${m.cls}`}
    >
      <Icon className="h-3 w-3" /> {m.label}
    </span>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="grid place-items-center px-6 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-soft text-emerald">
        <Inbox className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-display text-lg text-navy">
        {hasFilter ? "No matching inquiries" : "No inquiries yet"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasFilter
          ? "Try a different search or clear the filter."
          : "When a client submits the form on your site, it will appear here in real time."}
      </p>
    </div>
  );
}

function DetailDrawer({
  inquiry,
  onClose,
  onStatusChange,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onStatusChange: (s: StatusKey) => void;
}) {
  const waMsg = encodeURIComponent(
    `Hi ${inquiry.full_name.split(" ")[0]}, this is NRI Land Check regarding your verification request for ${inquiry.property_state}.`,
  );
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-sm">
      <button
        aria-label="Close"
        onClick={onClose}
        className="flex-1"
      />
      <aside className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-background shadow-2xl">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald">Inquiry detail</p>
            <h2 className="mt-1 font-display text-xl text-navy">{inquiry.full_name}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Submitted {formatDateTime(inquiry.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <section>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(STATUS_META) as StatusKey[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    inquiry.status === s
                      ? STATUS_META[s].cls
                      : "border border-border bg-card text-muted-foreground hover:text-navy"
                  }`}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <ContactRow icon={Mail} label="Email" value={inquiry.email} href={`mailto:${inquiry.email}`} />
            <ContactRow
              icon={Phone}
              label="Phone"
              value={inquiry.phone}
              href={`tel:${inquiry.phone.replace(/[^+\d]/g, "")}`}
            />
            <ContactRow
              icon={MessageCircle}
              label="WhatsApp"
              value={inquiry.phone}
              href={`https://wa.me/${inquiry.phone.replace(/[^\d]/g, "")}?text=${waMsg}`}
              external
            />
            <ContactRow icon={Globe2} label="Country" value={inquiry.country} />
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Property
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-navy">
              <MapPin className="h-4 w-4 text-emerald" /> {inquiry.property_state}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
              Service requested
            </p>
            <p className="mt-1 text-sm font-semibold text-navy">
              {SERVICE_LABEL[inquiry.service]}
            </p>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Details</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {inquiry.property_details}
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-emerald-soft text-emerald">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="block truncate text-sm font-semibold text-navy">{value}</span>
      </span>
    </>
  );
  const cls =
    "flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-emerald/40";
  return href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cls}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
