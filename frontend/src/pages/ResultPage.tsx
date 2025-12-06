import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ResultPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function checkExistingSession() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        setCheckingSession(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        setCheckingSession(false);
        return;
      }

      if (profile.role === "CLIENT") {
        navigate("/app/client/dashboard", { replace: true });
      } else if (profile.role === "DOCTOR") {
        navigate("/app/doctor/dashboard", { replace: true });
      } else if (profile.role === "ADMIN") {
        navigate("/app/admin/dashboard", { replace: true });
      } else {
        setCheckingSession(false);
      }
    }

    checkExistingSession();
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const rawEmail = (formData.get("email") as string) || "";
    const email = rawEmail.trim().toLowerCase();
    const password = (formData.get("password") as string) || "";

    if (!email || !password) {
      setErrorMsg("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData?.user) {
        setErrorMsg(signInError?.message || "Login failed.");
        setLoading(false);
        return;
      }

      const user = signInData.user;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        setErrorMsg("Unable to load your profile.");
        setLoading(false);
        return;
      }

      if (profile.role === "CLIENT") {
        navigate("/app/client/dashboard", { replace: true });
      } else if (profile.role === "DOCTOR") {
        navigate("/app/doctor/dashboard", { replace: true });
      } else if (profile.role === "ADMIN") {
        navigate("/app/admin/dashboard", { replace: true });
      } else {
        setErrorMsg("Your account does not have a valid role.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unexpected error during login.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-[#e8f2ff]">
        <p>Checking your session…</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#e8f2ff] text-slate-900">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(14,165,233,0.07),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.06),transparent_30%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10 sm:py-12">
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-2 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] shadow-sm">
              {t("common.nav.results")}
              <span className="h-2 w-2 rounded-full bg-sky-400" />
            </p>
            <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-[2rem]">
              {t("resultPage.title")}
            </h1>
            <p className="text-base text-slate-600">{t("resultPage.subtitle")}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_30px_80px_-38px_rgba(15,23,42,0.35)] ring-1 ring-white/70 backdrop-blur">
            <div
              className="pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-[-22%] bottom-[-25%] h-72 w-72 rounded-full bg-slate-200/70 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-8 p-6 sm:p-8">
              {errorMsg && (
                <div className="mb-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="portal-email" className="text-sm font-semibold text-slate-900">
                    {t("resultPage.email")}
                  </label>
                  <input
                    id="portal-email"
                    name="email"
                    type="email"
                    dir="ltr"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="portal-password" className="text-sm font-semibold text-slate-900">
                    {t("resultPage.password")}
                  </label>
                  <input
                    id="portal-password"
                    name="password"
                    type="password"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    placeholder="********"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>{t("resultPage.remember")}</span>
                  </label>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-sky-700 underline-offset-4 transition hover:text-sky-900 hover:underline"
                  >
                    {t("resultPage.forgot")}
                  </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full sm:w-auto sm:min-w-[170px] items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-5 py-3 text-base font-semibold text-slate-900 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.42)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : t("resultPage.login")}
                    {!loading && (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          fill="currentColor"
                          d="M7.4 4.4A1 1 0 0 1 8 4h11a1 1 0 0 1 1 1v11a1 1 0 1 1-2 0V7.4l-9.3 9.3a1 1 0 0 1-1.4-1.4L16.6 6H8a1 1 0 0 1-.7-1.6Z"
                        />
                      </svg>
                    )}
                  </button>

                  <Link
                    to="/signup"
                    className="inline-flex w-full sm:w-auto sm:min-w-[170px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-base font-semibold text-slate-900 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.32)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
                  >
                    {t("resultPage.signupCta")}
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                      <path
                        fill="currentColor"
                        d="M12.8 4.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4L17.6 12l-4.8-4.7a1 1 0 0 1 0-1.4Z"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a1 1 0 0 1 1-1h9.5a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z"
                      />
                    </svg>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
