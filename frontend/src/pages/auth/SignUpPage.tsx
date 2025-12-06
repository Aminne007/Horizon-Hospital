import type { FormEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const SignUpPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const fullName = ((formData.get("fullName") as string) || "").trim();
    const rawEmail = (formData.get("email") as string) || "";
    const email = rawEmail.trim();
    const password = (formData.get("password") as string) || "";
    const confirmPassword = (formData.get("confirmPassword") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const dob = (formData.get("dob") as string) || "";
    const idNumber = (formData.get("idNumber") as string) || "";
    const address = (formData.get("address") as string) || "";
    const city = (formData.get("city") as string) || "";
    const state = (formData.get("state") as string) || "";
    const postal = (formData.get("postal") as string) || "";
    const sex = (formData.get("sex") as string) || "";
    const bloodType = (formData.get("bloodType") as string) || "";
    const emergencyContactPhone = (formData.get("emergencyContactPhone") as string) || "";

    if (!password || password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      console.log("[SignUp] submitted payload", {
        fullName,
        email,
        phone,
        dob,
        idNumber,
        address,
        city,
        state,
        postal,
      });

      // 1) Create auth user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log("[SignUp] auth response", { signUpData, signUpError });

      if (signUpError || !signUpData?.user) {
        setErrorMsg(signUpError?.message || "Signup failed.");
        setLoading(false);
        return;
      }

      const userId = signUpData.user.id;

      // 2) Insert base profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName,
        email,
        role: "CLIENT",
      });
      console.log("[SignUp] profiles insert", { profileError });

      if (profileError) {
        if ((profileError as any).code === "23505") {
          setErrorMsg("An account with this email already exists.");
        } else {
          setErrorMsg(profileError.message);
        }
        setLoading(false);
        return;
      }

      // 3) Insert client-specific row
      const { error: clientProfileError } = await supabase.from("client_profiles").insert({
        client_id: userId,
        phone,
        dob,
        id_number: idNumber,
        address,
        city,
        state,
        postal,
        sex,
        blood_type: bloodType,
        emergency_contact_phone: emergencyContactPhone,
      });
      console.log("[SignUp] client_profiles insert", { clientProfileError });

      if (clientProfileError) {
        if ((clientProfileError as any).code === "23505") {
          setErrorMsg("A patient with this ID or phone number is already registered.");
        } else {
          setErrorMsg(clientProfileError.message);
        }
        setLoading(false);
        return;
      }

      console.log("[SignUp] success, redirecting to login");
      setSuccessMsg("Account created. Redirecting you to login...");
      // Redirect to login form after successful account creation
      setTimeout(() => navigate("/result", { replace: true }), 900);
    } catch (err) {
      setErrorMsg("Unexpected error during signup.");
      console.error("[SignUp] unexpected error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#e8f2ff] text-slate-900">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(14,165,233,0.07),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.06),transparent_30%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10 sm:py-12">
        <div className="w-full max-w-3xl space-y-6">
          <div className="space-y-2 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] shadow-sm">
              {t("common.nav.results")}
              <span className="h-2 w-2 rounded-full bg-sky-400" />
            </p>
            <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-[2rem]">
              {t("signUpPage.title")}
            </h1>
            <p className="text-base text-slate-600">{t("signUpPage.subtitle")}</p>
            <p className="text-sm font-semibold text-slate-700">{t("signUpPage.helper")}</p>
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
            <div className="relative p-6 sm:p-8">
              {errorMsg && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="full-name" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.fullName")}
                    </label>
                    <input
                      id="full-name"
                      name="fullName"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="Alex Johnson"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-email" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.email")}
                    </label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-sex" className="text-sm font-semibold text-slate-900">
                      Sex
                    </label>
                    <select
                      id="signup-sex"
                      name="sex"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                     
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-blood" className="text-sm font-semibold text-slate-900">
                      Blood type
                    </label>
                    <select
                      id="signup-blood"
                      name="bloodType"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select blood type
                      </option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-phone" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.phone")}
                    </label>
                    <input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-dob" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.dob")}
                    </label>
                    <input
                      id="signup-dob"
                      name="dob"
                      type="date"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-id" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.idNumber")}
                    </label>
                    <input
                      id="signup-id"
                      name="idNumber"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="Patient ID or national ID"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-address" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.address")}
                    </label>
                    <input
                      id="signup-address"
                      name="address"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="123 Healing Way"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-city" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.city")}
                    </label>
                    <input
                      id="signup-city"
                      name="city"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-state" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.state")}
                    </label>
                    <input
                      id="signup-state"
                      name="state"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="State / Region"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-postal" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.postal")}
                    </label>
                    <input
                      id="signup-postal"
                      name="postal"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="ZIP / Postal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-emergency" className="text-sm font-semibold text-slate-900">
                      Emergency contact phone
                    </label>
                    <input
                      id="signup-emergency"
                      name="emergencyContactPhone"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="(555) 987-6543"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="signup-password" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.password")}
                    </label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="********"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="signup-confirm" className="text-sm font-semibold text-slate-900">
                      {t("signUpPage.confirmPassword")}
                    </label>
                    <input
                      id="signup-confirm"
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-base shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="********"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-800">
                  <label className="inline-flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="leading-relaxed">{t("signUpPage.consent")}</span>
                  </label>
                  <p className="text-xs text-slate-500">{t("signUpPage.terms")}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full sm:w-auto sm:min-w-[170px] items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-5 py-3 text-base font-semibold text-slate-900 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.42)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? t("signUpPage.loading") ?? "Creating..." : t("signUpPage.submit")}
                  </button>
                  <Link
                    to="/result"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-base font-semibold text-slate-900 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.32)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
                  >
                    {t("signUpPage.haveAccount")} {t("signUpPage.login")}
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

export default SignUpPage;
