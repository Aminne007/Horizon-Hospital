import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";

type BaseProfile = {
  full_name: string | null;
  email: string | null;
  created_at?: string | null;
};

type DoctorProfile = {
  specialty: string | null;
  license_number: string | null;
  office_phone: string | null;
  office_location: string | null;
  biography: string | null;
  created_at?: string | null;
};

const initialDoctorProfile: DoctorProfile = {
  specialty: "",
  license_number: "",
  office_phone: "",
  office_location: "",
  biography: "",
};

const formatPhone = (value: string | null) => value?.trim() || "Not provided";
const formatValue = (value: string | null, fallback = "Not provided") => (value?.trim() ? value.trim() : fallback);
const formatDate = (value?: string | null) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const DoctorProfilePage = () => {
  const [base, setBase] = useState<BaseProfile | null>(null);
  const [profile, setProfile] = useState<DoctorProfile>(initialDoctorProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setError("Session expired. Please sign in again.");
        setLoading(false);
        return;
      }

      const [{ data: baseProfile, error: baseError }, { data: doctorProfile, error: doctorError }] = await Promise.all([
        supabase.from("profiles").select("full_name, email, created_at").eq("id", userData.user.id).single(),
        supabase
          .from("doctor_profiles")
          .select("specialty, license_number, office_phone, office_location, biography, created_at")
          .eq("doctor_id", userData.user.id)
          .maybeSingle(),
      ]);

      if (baseError || doctorError) {
        console.warn("[DoctorProfile] load issue", { baseError, doctorError });
        setError("Unable to load your profile.");
      }

      setBase(baseProfile as BaseProfile);
      setProfile((doctorProfile as DoctorProfile) || initialDoctorProfile);
      setLoading(false);
    }

    loadProfile();
  }, []);

  const initials = useMemo(() => {
    const parts = (base?.full_name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase());
    return parts.join("") || "DR";
  }, [base?.full_name]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      setError("Session expired. Please sign in again.");
      setSaving(false);
      return;
    }

    const payload = {
      doctor_id: userData.user.id,
      specialty: profile.specialty?.trim() || null,
      license_number: profile.license_number?.trim() || null,
      office_phone: profile.office_phone?.trim() || null,
      office_location: profile.office_location?.trim() || null,
      biography: profile.biography?.trim() || null,
    };

    const { error: upsertError } = await supabase.from("doctor_profiles").upsert(payload);

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setMessage("Profile saved.");
      setShowEditor(false);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(error || message) && (
        <div
          className={[
            "rounded-2xl px-4 py-3 text-sm",
            error ? "border border-red-200 bg-red-50 text-red-700" : "border border-emerald-200 bg-emerald-50 text-emerald-700",
          ].join(" ")}
        >
          {error || message}
        </div>
      )}

      <section className="relative overflow-hidden rounded-[32px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#cfe6f1] p-6 text-[#1f3d47] shadow-[0_22px_80px_-60px_rgba(74,144,164,0.9)]">
        <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_12%_18%,rgba(74,144,164,0.12),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(184,225,240,0.18),transparent_28%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 text-2xl font-bold text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
              {initials}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Doctor profile</p>
              <h1 className="text-3xl font-black leading-tight">{base?.full_name || "Doctor"}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#355c68]">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  {formatValue(profile.specialty, "Specialty not set")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  {formatValue(profile.license_number, "License pending")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  {formatValue(profile.office_location, "No office location")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  Joined {formatDate(profile.created_at || base?.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-sm text-[#355c68]">
              <p className="font-semibold text-[#1f3d47]">{base?.email || "No email on file"}</p>
              <p>{formatPhone(profile.office_phone)}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowEditor(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2f5f6a] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#2f5f6a]/25 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
            >
              Edit profile
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4 17.2V20h2.8l8-8L12 9.2l-8 8Zm14.7-8a1 1 0 0 0 0-1.4l-2.5-2.5a1 1 0 0 0-1.4 0l-1.6 1.6L17.1 11l1.6-1.8Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <article className="rounded-[24px] border border-[#d3e8f2] bg-white/95 p-6 shadow-sm shadow-[#4A90A4]/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">Professional summary</p>
                <h2 className="text-xl font-bold text-[#1f3d47]">About</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#355c68]">
              {profile.biography?.trim() ||
                "Add a short biography so patients and colleagues can understand your focus areas, approach, and experience."}
            </p>
          </article>

          <article className="rounded-[24px] border border-[#d3e8f2] bg-white/95 p-6 shadow-sm shadow-[#4A90A4]/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">Practice details</p>
                <h2 className="text-xl font-bold text-[#1f3d47]">Clinic & operations</h2>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoRow label="Primary specialty" value={formatValue(profile.specialty, "Not set")} />
              <InfoRow label="License number" value={formatValue(profile.license_number, "Not provided")} />
              <InfoRow label="Office location" value={formatValue(profile.office_location, "Not provided")} />
              <InfoRow label="Office phone" value={formatPhone(profile.office_phone)} />
            </div>
          </article>
        </div>

        <article className="rounded-[24px] border border-[#d3e8f2] bg-white/95 p-6 shadow-sm shadow-[#4A90A4]/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">Contact & identity</p>
              <h2 className="text-xl font-bold text-[#1f3d47]">Reachability</h2>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <InfoRow label="Email" value={formatValue(base?.email || null, "No email on file")} />
            <InfoRow label="Phone" value={formatPhone(profile.office_phone)} />
            <InfoRow label="License" value={formatValue(profile.license_number, "License pending")} />
            <InfoRow label="Location" value={formatValue(profile.office_location, "Not provided")} />
          </div>
          <div className="mt-5 rounded-2xl bg-[#f6fbfd] px-4 py-3 text-xs text-[#355c68] ring-1 ring-[#d3e8f2]">
            Keep your contact, specialty, and license information current to streamline scheduling and verification.
          </div>
        </article>
      </section>

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f27]/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-[#d3e8f2] bg-white shadow-2xl shadow-[#4A90A4]/20">
            <div className="flex items-center justify-between gap-3 border-b border-[#d3e8f2] px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Edit profile</p>
                <h3 className="text-xl font-bold text-[#1f3d47]">Update professional info</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#2f5f6a] transition hover:bg-[#E8F4F8]"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path fill="currentColor" d="m6 6 12 12-1.4 1.4L4.6 7.4 6 6Zm12 0L6 18l-1.4-1.4L16.6 4.6 18 6Z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Specialty"
                  placeholder="Cardiology, Internal Medicine"
                  value={profile.specialty || ""}
                  onChange={(value) => setProfile((prev) => ({ ...prev, specialty: value }))}
                />
                <Field
                  label="License number"
                  placeholder="e.g. MD-12345"
                  value={profile.license_number || ""}
                  onChange={(value) => setProfile((prev) => ({ ...prev, license_number: value }))}
                />
                <Field
                  label="Office phone"
                  placeholder="+1 (555) 123-4567"
                  value={profile.office_phone || ""}
                  onChange={(value) => setProfile((prev) => ({ ...prev, office_phone: value }))}
                />
                <Field
                  label="Office location"
                  placeholder="Building A, 3rd floor"
                  value={profile.office_location || ""}
                  onChange={(value) => setProfile((prev) => ({ ...prev, office_location: value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1f3d47]">Short bio</label>
                <textarea
                  value={profile.biography || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, biography: e.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border border-[#d3e8f2] bg-white px-3 py-2 text-sm text-[#1f3d47] shadow-inner shadow-[#f1f7fa] transition focus:border-[#4A90A4] focus:ring-4 focus:ring-[#B8E1F0]"
                  placeholder="Summarize your practice, focus areas, and approach."
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#d3e8f2] bg-white px-4 py-2 text-sm font-semibold text-[#2f5f6a] transition hover:-translate-y-0.5 hover:border-[#4A90A4] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2f5f6a] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2f5f6a]/20 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0] disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-[#f6fbfd] px-4 py-3 ring-1 ring-[#d3e8f2]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">{label}</p>
    <p className="mt-1 text-sm font-semibold text-[#1f3d47]">{value}</p>
  </div>
);

const Field = ({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) => (
  <label className="space-y-2 text-sm font-semibold text-[#1f3d47]">
    <span>{label}</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-[#d3e8f2] bg-white px-3 py-2 text-sm text-[#1f3d47] shadow-inner shadow-[#f1f7fa] transition focus:border-[#4A90A4] focus:ring-4 focus:ring-[#B8E1F0]"
      placeholder={placeholder}
    />
  </label>
);

export default DoctorProfilePage;
