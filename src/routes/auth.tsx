import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Team Sign In — NRI Land Check" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setInfo(
          "Account created. Ask the project owner to grant your account 'staff' or 'admin' access before you can see inquiries.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,oklch(0.30_0.09_260)_0%,oklch(0.16_0.05_260)_55%,oklch(0.12_0.04_260)_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-saffron"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-white/10 ring-1 ring-white/15">
            <ShieldCheck className="h-6 w-6 text-saffron" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-saffron">Internal</p>
            <h1 className="font-display text-2xl text-white">Team Portal</h1>
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur">
          <div className="flex gap-1 rounded-lg bg-white/5 p-1">
            <ModeBtn active={mode === "signin"} onClick={() => setMode("signin")}>
              Sign in
            </ModeBtn>
            <ModeBtn active={mode === "signup"} onClick={() => setMode("signup")}>
              Create account
            </ModeBtn>
          </div>
          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/70">
                Work email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-md border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-emerald focus:ring-2 focus:ring-emerald/30"
                placeholder="team@nrilandcheck.in"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/70">
                Password
              </span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full rounded-md border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-emerald focus:ring-2 focus:ring-emerald/30"
                placeholder="At least 8 characters"
              />
            </label>
            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/20 px-3 py-2 text-xs text-white">
                {error}
              </div>
            )}
            {info && (
              <div className="rounded-md border border-emerald/40 bg-emerald/15 px-3 py-2 text-xs text-white">
                {info}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-saffron px-4 py-2.5 text-sm font-semibold text-navy-deep transition hover:brightness-105 disabled:opacity-60"
            >
              {mode === "signin" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-white/55">
            Authorized field-team and admin access only.
          </p>
        </div>
      </div>
    </div>
  );
}

function ModeBtn({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-saffron text-navy-deep" : "text-white/70 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
