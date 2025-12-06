
import { useEffect, useMemo, useState, type SVGProps } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import AddResultForm from "../../components/AddResultForm";
import DoctorMedicalRecordForm from "../../components/DoctorMedicalRecordForm";
import type { ClientMedicalRecord, ClientProfile, Profile, ResultRow } from "../../types/db";

// Lightweight inline icons to match lucide without extra dependency
const Phone = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.07 2h3a2 2 0 0 1 2 1.72c.12.83.37 1.64.73 2.4a2 2 0 0 1-.45 2.18L8.09 9.91a16 16 0 0 0 6 6l1.61-1.26a2 2 0 0 1 2.18-.45c.76.36 1.57.61 2.4.73A2 2 0 0 1 22 16.92Z" />
  </svg>
);
const Mail = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const MapPin = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const Calendar = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);
const Activity = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
const FileText = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);
const ChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const Stethoscope = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 4v2" />
    <path d="M18 4v2" />
    <path d="M18 7a6 6 0 0 1-12 0" />
    <path d="M12 17a3 3 0 0 1-6 0V4" />
    <path d="M12 17a3 3 0 0 0 6 0v-3" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);
const User = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const AlertCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);
const Droplet = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2.69 7.14 7.22a7.34 7.34 0 0 0-2.42 5.44A7.34 7.34 0 0 0 12 20a7.34 7.34 0 0 0 7.28-7.34 7.34 7.34 0 0 0-2.42-5.44Z" />
  </svg>
);
const X = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const Clock = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const formatDate = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const getInitials = (name: string | null | undefined) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const getAge = (dob: string | null) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;
  const diff = Date.now() - birthDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const DoctorPatientDetailsPage = () => {
  const navigate = useNavigate();
  const { clientId = "" } = useParams<{ clientId: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [records, setRecords] = useState<ClientMedicalRecord[]>([]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingRecord, setEditingRecord] = useState<ClientMedicalRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "results">("overview");
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  useEffect(() => {
    async function loadPatient() {
      if (!clientId) {
        setError("Missing patient id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setError("Your session expired. Please sign in again.");
        setLoading(false);
        return;
      }
      const currentDoctorId = userData.user.id;

      const [
        { data: profileRow, error: baseError },
        { data: clientRow, error: clientError },
        { data: recordRows, error: recordError },
        { data: resultRows, error: resultError },
      ] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, role, created_at").eq("id", clientId).single(),
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
        `,
          )
          .eq("client_id", clientId)
          .single(),
        supabase
          .from("client_medical_records")
          .select(
            `
          id,
          client_id,
          doctor_id,
          note,
          diagnosis,
          medications,
          follow_up,
          created_at,
          height_cm,
          weight_kg,
          heart_rate_bpm,
          allergies_snapshot,
          chronic_conditions_snapshot,
          next_follow_up_date,
          status,
          updated_at
        `,
          )
          .eq("client_id", clientId)
          .eq("doctor_id", currentDoctorId)
          .order("created_at", { ascending: false }),
        supabase
          .from("results")
          .select(
            `
          id,
          client_id,
          doctor_id,
          title,
          description,
          result_type,
          result_date,
          file_path,
          created_at
        `,
          )
          .eq("client_id", clientId)
          .eq("doctor_id", currentDoctorId)
          .order("result_date", { ascending: false }),
      ]);

      if (baseError || clientError || !profileRow) {
        setError("Unable to load patient details right now.");
        setLoading(false);
        return;
      }
      if (recordError || resultError) {
        setError("Unable to load the patient's history right now.");
      }

      setProfile(profileRow as Profile);
      setClientProfile(clientRow as ClientProfile);
      setRecords((recordRows || []) as ClientMedicalRecord[]);
      setResults((resultRows || []) as ResultRow[]);
      setLoading(false);
    }

    loadPatient();
  }, [clientId]);

  const readyResultCount = useMemo(() => results.filter((r) => r.file_path).length, [results]);
  const lastVisitDate = useMemo(() => records[0]?.created_at || null, [records]);
  const nextFollowUpDate = useMemo(
    () => records.find((rec) => rec.next_follow_up_date)?.next_follow_up_date || null,
    [records],
  );
  const age = useMemo(() => getAge(clientProfile?.dob ?? null), [clientProfile?.dob]);
  const latestDiagnosis = useMemo(() => records[0]?.diagnosis || null, [records]);

  const handleSavedRecord = (record: ClientMedicalRecord) => {
    setRecords((prev) => {
      const exists = prev.some((r) => r.id === record.id);
      if (exists) return prev.map((r) => (r.id === record.id ? record : r));
      return [record, ...prev];
    });
    setEditingRecord(null);
    setShowRecordModal(false);
  };
  if (loading) {
    return (
      <div className="rounded-[28px] border border-[#d3e8f2] bg-white px-4 py-6 shadow-sm shadow-[#4A90A4]/10">
        <p className="text-sm font-semibold text-[#2f5f6a]">Loading patient...</p>
      </div>
    );
  }

  if (error || !profile || !clientProfile) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={() => navigate("/app/doctor/patients")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#d3e8f2] bg-white px-4 py-2 text-sm font-semibold text-[#2f5f6a] shadow-sm transition hover:-translate-y-0.5 hover:border-[#4A90A4] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
        >
          Back to patients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#B8E1F0] p-6 shadow-[0_20px_80px_-50px_rgba(74,144,164,0.8)]">
        <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_15%_20%,rgba(74,144,164,0.18),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(63,108,125,0.18),transparent_28%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
              {getInitials(profile.full_name) || "PT"}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3e6f7b]">Patient profile</p>
              <h1 className="text-3xl font-black text-[#1f3d47]">{profile.full_name || "Client"}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#355c68]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  <User className="h-4 w-4" />
                  ID: {clientProfile.id_number || "Not set"}
                </span>
                {age !== null && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                    <Calendar className="h-4 w-4" />
                    {age} yrs
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  <Clock className="h-4 w-4" />
                  Joined {formatDate(profile.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex flex-wrap justify-end gap-2 text-xs font-semibold text-[#2f5f6a]">
              {latestDiagnosis ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  <Stethoscope className="h-4 w-4 text-[#4A90A4]" />
                  {latestDiagnosis}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowContactInfo(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[#2f5f6a] ring-1 ring-[#d3e8f2] transition hover:bg-[#E8F4F8]"
                  aria-label="View contact info"
                  title="View contact info"
                >
                  <AlertCircle className="h-4 w-4 text-[#4A90A4]" />
                  Contact info
                </button>
              )}
              {lastVisitDate && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  <Clock className="h-4 w-4 text-[#4A90A4]" />
                  Last visit: {formatDate(lastVisitDate)}
                </span>
              )}
              {nextFollowUpDate && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                  <Calendar className="h-4 w-4 text-[#4A90A4]" />
                  Next: {formatDate(nextFollowUpDate)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate("/app/doctor/patients")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A90A4] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#4A90A4]/25 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
            >
              Back to patients
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#d3e8f2] bg-white/90 p-5 shadow-sm shadow-[#4A90A4]/10">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F4F8] text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
            <FileText className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-[#1f3d47]">{results.length}</div>
          <p className="text-sm font-semibold text-[#355c68]">Results uploaded by you</p>
        </div>
        <div className="rounded-2xl border border-[#d3e8f2] bg-white/90 p-5 shadow-sm shadow-[#4A90A4]/10">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F4F8] text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-[#1f3d47]">{nextFollowUpDate ? formatDate(nextFollowUpDate) : "—"}</div>
          <p className="text-sm font-semibold text-[#355c68]">Next follow-up</p>
        </div>
        <div className="rounded-2xl border border-[#d3e8f2] bg-white/90 p-5 shadow-sm shadow-[#4A90A4]/10">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F4F8] text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-[#1f3d47]">{records.length}</div>
          <p className="text-sm font-semibold text-[#355c68]">Visits documented</p>
        </div>
        <div className="rounded-2xl border border-[#d3e8f2] bg-white/90 p-5 shadow-sm shadow-[#4A90A4]/10">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F4F8] text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
            <Activity className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-[#1f3d47]">{readyResultCount}</div>
          <p className="text-sm font-semibold text-[#355c68]">Ready for patient</p>
        </div>
      </div>

      <div className="rounded-[20px] border border-[#d3e8f2] bg-white/90 p-2 shadow-sm shadow-[#4A90A4]/10">
        <div className="flex flex-wrap gap-2">
          {["overview", "records", "results"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as "overview" | "records" | "results")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-[#2f5f6a] text-white shadow-lg shadow-[#2f5f6a]/25"
                  : "text-[#2f5f6a] hover:bg-[#E8F4F8]"
              }`}
            >
              {tab === "overview" && "Overview"}
              {tab === "records" && "Medical records"}
              {tab === "results" && "Results"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <section className="relative overflow-hidden rounded-[24px] border border-[#d3e8f2] bg-white shadow-sm shadow-[#4A90A4]/12 backdrop-blur">
          <div className="pointer-events-none absolute inset-[-120px] bg-[radial-gradient(circle_at_12%_18%,rgba(102,154,184,0.18),transparent_32%),radial-gradient(circle_at_85%_-8%,rgba(184,225,240,0.28),transparent_30%)] blur-2xl opacity-80" />
          <div className="relative space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Patient overview</p>
                <h2 className="text-xl font-bold text-[#1f3d47]">Quick facts</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6fbfd] px-3 py-1 ring-1 ring-[#d3e8f2]">
                  <Calendar className="h-4 w-4" />
                  {nextFollowUpDate ? `Next: ${formatDate(nextFollowUpDate)}` : "No follow-up set"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6fbfd] px-3 py-1 ring-1 ring-[#d3e8f2]">
                  <Activity className="h-4 w-4" />
                  {readyResultCount} ready results
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl bg-[#f6fbfd]/90 p-4 ring-1 ring-[#d3e8f2] shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">
                  <Phone className="h-4 w-4 text-[#2f5f6a]" />
                  Contact
                </div>
                <div className="mt-3 space-y-2 text-sm text-[#1f3d47]">
                  <p className="font-semibold">{profile.full_name}</p>
                  <div className="flex items-center gap-2 text-[#2f5f6a]">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email || "No email on file"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2f5f6a]">
                    <Phone className="h-4 w-4" />
                    <span>{clientProfile.phone || "No phone listed"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#f6fbfd]/90 p-4 ring-1 ring-[#d3e8f2] shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">
                  <User className="h-4 w-4 text-[#2f5f6a]" />
                  Identity
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[#1f3d47] sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#527884]">Patient ID</p>
                    <p className="font-semibold">{clientProfile.id_number || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#527884]">Date of birth</p>
                    <p className="font-semibold">{clientProfile.dob || "Not provided"}</p>
                    {age !== null && <p className="text-xs text-[#527884]">{age} years</p>}
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#527884]">Sex</p>
                    <p className="font-semibold">{clientProfile.sex || "Not recorded"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-rose-500" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#527884]">Blood type</p>
                      <p className="font-semibold text-[#1f3d47]">{clientProfile.blood_type || "Not set"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#f6fbfd]/90 p-4 ring-1 ring-[#d3e8f2] shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">
                  <MapPin className="h-4 w-4 text-[#2f5f6a]" />
                  Address
                </div>
                <div className="mt-3 space-y-2 text-sm text-[#1f3d47]">
                  <p className="font-semibold">{clientProfile.address || "Not provided"}</p>
                  <p className="text-[#2f5f6a]">
                    {[clientProfile.city, clientProfile.state, clientProfile.postal].filter(Boolean).join(", ") || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#f6fbfd]/90 p-4 ring-1 ring-[#d3e8f2] shadow-sm md:col-span-2 xl:col-span-1">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">
                  <AlertCircle className="h-4 w-4 text-[#2f5f6a]" />
                  Emergency contact
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[#1f3d47] sm:grid-cols-2 xl:grid-cols-1">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#527884]">Contact name</p>
                    <p className="font-semibold">{clientProfile.emergency_contact_name || "Not provided"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[#2f5f6a]">
                    <Phone className="h-4 w-4" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#527884]">Contact phone</p>
                      <p className="font-semibold text-[#1f3d47]">
                        {clientProfile.emergency_contact_phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {activeTab === "records" && (
        <div className="overflow-hidden rounded-[22px] border border-[#d3e8f2] bg-white shadow-sm shadow-[#4A90A4]/10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d3e8f2] px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-[#1f3d47]">Medical records</h2>
              <p className="mt-1 text-sm text-[#527884]">Only records documented by you are shown.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingRecord(null);
                setShowRecordModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A90A4] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#4A90A4]/20 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
            >
              <FileText className="h-4 w-4" />
              Add record
            </button>
          </div>

          <div className="p-6">
            {records.length === 0 ? (
              <div className="space-y-4 rounded-2xl border border-dashed border-[#d3e8f2] bg-[#F4FBFD] px-4 py-10 text-center text-sm text-[#355c68]">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-white text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
                  <FileText className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-semibold text-[#1f3d47]">No medical records yet</h3>
                <p className="mx-auto max-w-md text-sm text-[#527884]">Start documenting patient care by creating the first medical record.</p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRecord(null);
                    setShowRecordModal(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#4A90A4] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#4A90A4]/20 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0]"
                >
                  Create first record
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((rec) => {
                  const hasVitals = rec.height_cm !== null || rec.weight_kg !== null || rec.heart_rate_bpm !== null;
                  return (
                    <article key={rec.id} className="rounded-2xl border border-[#d3e8f2] bg-[#f6fbfd] p-5 shadow-sm shadow-[#4A90A4]/5 transition hover:-translate-y-0.5 hover:bg-white">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#527884]">{formatDate(rec.created_at)}</p>
                          <h4 className="text-base font-bold text-[#1f3d47]">{rec.diagnosis || "Diagnosis pending"}</h4>
                          <p className="text-xs text-[#527884]">Next follow-up: {rec.next_follow_up_date ? formatDate(rec.next_follow_up_date) : "Not set"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#2f5f6a] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">{rec.status || "FINAL"}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRecord(rec);
                              setShowRecordModal(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#d3e8f2] bg-white px-3 py-1.5 text-xs font-semibold text-[#2f5f6a] transition hover:border-[#4A90A4]"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      {rec.note && (
                        <div className="mt-2 rounded-xl bg-white px-3 py-2 text-sm text-[#1f3d47] ring-1 ring-[#d3e8f2]">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#527884]">Note</p>
                          <p>{rec.note}</p>
                        </div>
                      )}
                      {rec.medications && (
                        <div className="mt-2 rounded-xl bg-white px-3 py-2 text-sm text-[#1f3d47] ring-1 ring-[#d3e8f2]">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#527884]">Medications</p>
                          <p>{rec.medications}</p>
                        </div>
                      )}
                      {rec.follow_up && (
                        <div className="mt-2 rounded-xl bg-white px-3 py-2 text-sm text-[#1f3d47] ring-1 ring-[#d3e8f2]">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#527884]">Plan</p>
                          <p>{rec.follow_up}</p>
                        </div>
                      )}
                      {hasVitals && (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#2f5f6a]">
                          {rec.height_cm !== null && <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#d3e8f2]">Height {rec.height_cm} cm</span>}
                          {rec.weight_kg !== null && <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#d3e8f2]">Weight {rec.weight_kg} kg</span>}
                          {rec.heart_rate_bpm !== null && <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#d3e8f2]">Heart rate {rec.heart_rate_bpm} bpm</span>}
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {rec.allergies_snapshot && (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">Allergies: {rec.allergies_snapshot}</span>
                        )}
                        {rec.chronic_conditions_snapshot && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">Chronic: {rec.chronic_conditions_snapshot}</span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
      </div>
    )}
    {activeTab === "results" && (
      <div className="overflow-hidden rounded-[22px] border border-[#d3e8f2] bg-white shadow-sm shadow-[#4A90A4]/10">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="border-b border-[#d3e8f2] px-6 py-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1f3d47]">Lab results</h2>
                <p className="mt-1 text-sm text-[#527884]">Uploads linked to your doctor account.</p>
              </div>
              <span className="rounded-full bg-[#f6fbfd] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
                {results.length} total
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {results.length === 0 ? (
                <div className="space-y-4 rounded-2xl border border-dashed border-[#d3e8f2] bg-[#F4FBFD] px-4 py-10 text-center text-sm text-[#355c68]">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-white text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
                    <Activity className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f3d47]">No results yet for this client</h3>
                  <p className="mx-auto max-w-md text-sm text-[#527884]">Lab results, imaging reports, and pathology findings will appear here once uploaded.</p>
                </div>
              ) : (
                results.map((result) => {
                  const isReady = Boolean(result.file_path);
                  return (
                    <article key={result.id} className="rounded-2xl border border-[#d3e8f2] bg-[#f6fbfd] p-5 shadow-sm shadow-[#4A90A4]/5 transition hover:-translate-y-0.5 hover:bg-white">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#527884]">{result.result_type || "Result"}</p>
                          <h4 className="text-base font-bold text-[#1f3d47]">{result.title}</h4>
                          <p className="text-xs text-[#527884]">{result.result_date ? formatDate(result.result_date) : "Date pending"}</p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            isReady ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {isReady ? "Ready" : "Pending"}
                        </span>
                      </div>
                      {result.description && <p className="mt-2 text-sm text-[#1f3d47]">{result.description}</p>}
                      {isReady && result.file_path && (
                        <a
                          href={result.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2f5f6a] underline-offset-4 transition hover:text-[#1f3d47]"
                        >
                          Open file
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <div className="px-6 py-5 lg:pl-0">
            <div className="rounded-[20px] border border-[#d3e8f2] bg-[#f6fbfd] p-4 shadow-inner shadow-[#4A90A4]/5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#1f3d47]">Add new result</h3>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a] ring-1 ring-[#d3e8f2]">
                  Quick upload
                </span>
              </div>
              <AddResultForm clientId={clientId} onCreated={(result) => setResults((prev) => [result as ResultRow, ...prev])} />
            </div>
            <div className="mt-4 rounded-[18px] border border-[#d3e8f2] bg-white px-4 py-3 text-xs text-[#355c68] shadow-sm shadow-[#4A90A4]/10">
              Need to share directly? Attach the file, set a clear title/type, and the patient will see it instantly once ready.
            </div>
          </div>
        </div>
      </div>
    )}

      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f27]/70 p-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-[24px] border border-[#d3e8f2] bg-white shadow-2xl shadow-[#4A90A4]/25">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#d3e8f2] bg-white px-8 py-6">
              <div>
                <h2 className="text-xl font-bold text-[#1f3d47]">New medical record</h2>
                <p className="mt-1 text-sm text-[#527884]">Document patient care and medical history</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRecordModal(false);
                  setEditingRecord(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#2f5f6a] transition-colors hover:bg-[#E8F4F8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-8">
              <DoctorMedicalRecordForm
                clientId={clientId}
                initial={editingRecord}
                onSaved={handleSavedRecord}
                onCancel={() => {
                  setShowRecordModal(false);
                  setEditingRecord(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {showContactInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f27]/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[24px] border border-[#d3e8f2] bg-white shadow-2xl shadow-[#4A90A4]/25">
            <div className="flex items-center justify-between border-b border-[#d3e8f2] px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-[#1f3d47]">Client contact</h3>
                <p className="text-xs text-[#527884]">Quick access to reach the patient.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowContactInfo(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#2f5f6a] transition hover:bg-[#E8F4F8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5 text-sm text-[#1f3d47]">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#4A90A4]" />
                <span className="font-semibold">{clientProfile.phone || "No phone on file"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#4A90A4]" />
                <span className="font-semibold">{profile.email || "No email on file"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#4A90A4]" />
                <span className="font-semibold">
                  {clientProfile.address ||
                    clientProfile.city ||
                    clientProfile.state ||
                    clientProfile.postal
                    ? [clientProfile.address, clientProfile.city, clientProfile.state, clientProfile.postal]
                        .filter(Boolean)
                        .join(", ")
                    : "No address recorded"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#4A90A4]" />
                <span className="font-semibold">
                  Emergency: {clientProfile.emergency_contact_name || "Not set"} — {clientProfile.emergency_contact_phone || "No phone"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientDetailsPage;

