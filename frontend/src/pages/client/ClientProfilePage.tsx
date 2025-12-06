import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { ClientMedicalRecord, ClientProfile, Profile } from "../../types/db";

const getInitials = (name: string | null | undefined) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "PT";

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const ClientProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [records, setRecords] = useState<ClientMedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You need to sign in again to view your profile.");
        setLoading(false);
        return;
      }

      const [
        { data: baseData, error: baseError },
        { data: clientData, error: clientError },
        { data: recordData, error: recordError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, role, created_at")
          .eq("id", user.id)
          .single(),
        supabase
          .from("client_profiles")
          .select(
            `
            client_id,
            phone,
            dob,
            id_number,
            address,
            city,
            state,
            postal,
            sex,
            blood_type,
            emergency_contact_name,
            emergency_contact_phone,
            created_at
          `
          )
          .eq("client_id", user.id)
          .single(),
        supabase
          .from("client_medical_records")
          .select(
            `
            id,
            diagnosis,
            note,
            medications,
            follow_up,
            next_follow_up_date,
            allergies_snapshot,
            chronic_conditions_snapshot,
            height_cm,
            weight_kg,
            heart_rate_bpm,
            status,
            created_at
          `
          )
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (baseError || clientError || recordError) {
        setError("We couldn't load your profile. Please refresh.");
      }

      setProfile(baseData as Profile);
      setClientProfile(clientData as ClientProfile);
      setRecords((recordData as ClientMedicalRecord[]) || []);
      setLoading(false);
    }

    loadProfile();
  }, []);

  const initials = useMemo(() => getInitials(profile?.full_name), [profile?.full_name]);
  const recordCategory = (rec: ClientMedicalRecord) => {
    if (rec.follow_up?.trim()) return "Follow Up";
    if (rec.diagnosis?.trim()) return "Diagnosis";
    return "Visit Note";
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#d3e8f2] bg-white px-4 py-6 shadow-sm shadow-[#4A90A4]/10">
        <p className="text-sm font-semibold text-[#2f5f6a]">Loading your profile...</p>
      </div>
    );
  }

  if (!profile || !clientProfile) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error || "Profile not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#1f3d47]">
      <section className="relative overflow-hidden rounded-[30px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#bfe0f1] p-6 shadow-[0_24px_80px_-60px_rgba(74,144,164,0.9)]">
        <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_12%_20%,rgba(74,144,164,0.14),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(184,225,240,0.22),transparent_32%)]" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3e6f7b]">Patient profile</p>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">{profile.full_name || "Patient"}</h1>
            <p className="text-sm text-[#355c68]">{profile.email || "No email on file"}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a]">
              <Chip label={`ID: ${clientProfile.id_number || "Not set"}`} />
              <Chip label={`Joined ${formatDate(profile.created_at)}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-[24px] border border-[#d3e8f2] bg-white/95 p-5 shadow-sm shadow-[#4A90A4]/12 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Contact & access</p>
              <h2 className="text-xl font-bold text-[#1f3d47]">How to reach you</h2>
            </div>
            <span className="rounded-full bg-[#f6fbfd] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
              Read only
            </span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Phone" value={clientProfile.phone || "Not provided"} />
            <InfoRow label="Email" value={profile.email || "Not provided"} />
            <InfoRow label="Emergency contact" value={clientProfile.emergency_contact_name || "Not provided"} />
            <InfoRow label="Emergency phone" value={clientProfile.emergency_contact_phone || "Not provided"} />
          </div>
        </article>

        <article className="rounded-[24px] border border-[#d3e8f2] bg-white/95 p-5 shadow-sm shadow-[#4A90A4]/12 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Vitals & identity</p>
              <h2 className="text-xl font-bold text-[#1f3d47]">At a glance</h2>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <InfoRow label="Date of birth" value={clientProfile.dob || "Not provided"} />
            <InfoRow label="Sex" value={clientProfile.sex || "Not recorded"} />
            <InfoRow label="Blood type" value={clientProfile.blood_type || "Not set"} />
            <InfoRow label="Patient ID" value={clientProfile.id_number || "Not provided"} />
          </div>
        </article>
      </section>

      <p className="text-xs text-[#527884]">
        This profile is maintained by the hospital. Contact support if anything looks incorrect.
      </p>

      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-white via-[#f7fbff] to-[#e4f1f8] p-5 shadow-[0_24px_80px_-70px_rgba(74,144,164,0.6)] backdrop-blur">
        <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_12%_18%,rgba(74,144,164,0.12),transparent_30%),radial-gradient(circle_at_88%_-6%,rgba(184,225,240,0.18),transparent_34%)]" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">My Medical Records</p>
            <h2 className="text-xl font-bold text-[#1f3d47]">Timeline</h2>
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a] shadow-sm">
            {records.length ? `${records.length} records` : "No records"}
          </span>
        </div>
        {error && (
          <div className="relative mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </div>
        )}
        {!records.length && !error && (
          <p className="relative mt-3 text-sm text-[#3e6f7b]">No medical records yet.</p>
        )}
        {records.length > 0 && (
          <div className="relative mt-5 pl-5">
            <div className="absolute left-[12px] top-0 h-full w-px bg-gradient-to-b from-[#cfe5f0] via-[#e2f0f7] to-transparent" />
            <div className="space-y-4">
              {records.map((rec) => (
                <article key={rec.id} className="relative pl-6">
                  <div className="absolute left-0 top-3 h-3 w-3 rounded-full bg-gradient-to-br from-[#4A90A4] to-[#2f5f6a] shadow-[0_10px_24px_-16px_rgba(74,144,164,0.8)]" />
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3e6f7b]">
                    <span>{formatDate(rec.created_at)}</span>
                    <span className="rounded-full bg-[#eef6fb] px-3 py-1 text-[11px] font-semibold text-[#2f5f6a]">
                      {recordCategory(rec)}
                    </span>
                    <span className="rounded-full bg-[#e8f4f8] px-3 py-1 text-[11px] font-semibold text-[#2f5f6a]">
                      {rec.status || "Final"}
                    </span>
                  </div>
                  <h4 className="mt-1 text-lg font-bold text-[#1f3d47]">{rec.diagnosis || "Diagnosis pending"}</h4>
                  {rec.note && <p className="mt-1 text-sm text-[#2f5f6a]">{rec.note}</p>}
                  {rec.follow_up && (
                    <p className="mt-1 text-sm text-[#2f5f6a]">
                      Plan: <span className="font-semibold text-[#1f3d47]">{rec.follow_up}</span>
                    </p>
                  )}
                  {rec.next_follow_up_date && (
                    <p className="text-sm text-[#2f5f6a]">Next follow-up: {formatDate(rec.next_follow_up_date)}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-[#2f5f6a]">
                    {rec.allergies_snapshot && <Chip label={`Allergies: ${rec.allergies_snapshot}`} color="amber" />}
                    {rec.chronic_conditions_snapshot && <Chip label={`Chronic: ${rec.chronic_conditions_snapshot}`} color="sky" />}
                    {rec.height_cm !== null && <Chip label={`Height: ${rec.height_cm} cm`} />}
                    {rec.weight_kg !== null && <Chip label={`Weight: ${rec.weight_kg} kg`} />}
                    {rec.heart_rate_bpm !== null && <Chip label={`Heart rate: ${rec.heart_rate_bpm} bpm`} />}
                  </div>
                  <details className="group mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-[#2f5f6a] transition group-hover:text-[#1f3d47]">
                      Medications & vitals
                    </summary>
                    <div className="mt-2 space-y-1 text-sm text-[#2f5f6a]">
                      <p>
                        <span className="font-semibold text-[#1f3d47]">Medications:</span>{" "}
                        {rec.medications || "Not provided"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#1f3d47]">Plan:</span>{" "}
                        {rec.follow_up?.trim() ||
                          (rec.next_follow_up_date ? formatDate(rec.next_follow_up_date) : "Not set")}
                      </p>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[24px] border border-[#d3e8f2] bg-white/95 p-5 shadow-sm shadow-[#4A90A4]/12 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Address</p>
            <h2 className="text-xl font-bold text-[#1f3d47]">Location on file</h2>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoRow label="Street" value={clientProfile.address || "Not provided"} />
          <InfoRow label="City" value={clientProfile.city || "Not provided"} />
          <InfoRow label="State/Region" value={clientProfile.state || "Not provided"} />
          <InfoRow label="Postal code" value={clientProfile.postal || "Not provided"} />
        </div>
      </section>

    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-[#f6fbfd]/80 px-4 py-3 ring-1 ring-[#d3e8f2] shadow-inner shadow-[#f1f7fa]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3e6f7b]">{label}</p>
    <p className="mt-1 text-sm font-semibold text-[#1f3d47]">{value}</p>
  </div>
);

const Chip = ({ label, color }: { label: string; color?: "amber" | "sky" }) => {
  const tone =
    color === "amber"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : color === "sky"
      ? "bg-sky-50 text-sky-800 ring-sky-200"
      : "bg-[#f6fbfd] text-[#1f3d47] ring-[#d3e8f2]";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tone}`}>
      {label}
    </span>
  );
};

export default ClientProfilePage;
