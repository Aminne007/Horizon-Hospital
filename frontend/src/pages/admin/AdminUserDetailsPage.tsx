import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import type { ClientProfile, Profile } from "../../types/db";

type DoctorProfile = {
  specialty: string | null;
  office_phone: string | null;
  biography: string | null;
  office_location: string | null;
};

const emptyClientProfile: ClientProfile = {
  client_id: "",
  phone: null,
  dob: null,
  id_number: null,
  address: null,
  city: null,
  state: null,
  postal: null,
  sex: null,
  blood_type: null,
  emergency_contact_name: null,
  emergency_contact_phone: null,
  created_at: "",
};

const emptyDoctorProfile: DoctorProfile = {
  specialty: null,
  office_phone: null,
  biography: null,
  office_location: null,
};

const AdminUserDetailsPage = () => {
  const navigate = useNavigate();
  const { userId = "" } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile>(emptyClientProfile);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(emptyDoctorProfile);
  const [roleSelection, setRoleSelection] = useState<Profile["role"] | "">("");
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [savingRole, setSavingRole] = useState(false);
  const [savingClient, setSavingClient] = useState(false);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      setError(null);
      setMessage(null);

      const { data: authData } = await supabase.auth.getUser();
      setCurrentAdminId(authData?.user?.id || null);

      const [{ data: profileRow, error: profileError }, { data: clientRow }, { data: doctorRow }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id, full_name, email, role, created_at")
            .eq("id", userId)
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
            .eq("client_id", userId)
            .maybeSingle(),
          supabase
            .from("doctor_profiles")
            .select("doctor_id, specialty, office_phone, biography, office_location, created_at")
            .eq("doctor_id", userId)
            .maybeSingle(),
        ]);

      if (profileError || !profileRow) {
        setError("Unable to load user.");
        setLoading(false);
        return;
      }

      setProfile(profileRow as Profile);
      setRoleSelection((profileRow as Profile).role);
      setClientProfile((clientRow as ClientProfile) || { ...emptyClientProfile, client_id: userId });
      setDoctorProfile(
        (doctorRow as DoctorProfile) || {
          ...emptyDoctorProfile,
        }
      );
      setLoading(false);
    }

    if (userId) {
      loadUser();
    }
  }, [userId]);

  const handleSaveRole = async () => {
    if (!profile || !roleSelection) return;
    setSavingRole(true);
    setMessage(null);
    const { error: updateError } = await supabase.from("profiles").update({ role: roleSelection }).eq("id", profile.id);
    if (updateError) {
      setMessage(updateError.message);
    } else {
      setProfile((prev) => (prev ? { ...prev, role: roleSelection } : prev));
      setMessage("Role updated.");
    }
    setSavingRole(false);
  };

  const handleSaveClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;
    setSavingClient(true);
    setMessage(null);
    const payload = { ...clientProfile, client_id: profile.id };
    const { error: upsertError } = await supabase.from("client_profiles").upsert(payload);
    if (upsertError) {
      setMessage(upsertError.message);
    } else {
      setMessage("Client profile saved.");
    }
    setSavingClient(false);
  };

  const handleSaveDoctor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;
    setSavingDoctor(true);
    setMessage(null);
    const payload = { ...doctorProfile, doctor_id: profile.id };
    const { error: upsertError } = await supabase.from("doctor_profiles").upsert(payload);
    if (upsertError) {
      setMessage(upsertError.message);
    } else {
      setMessage("Doctor profile saved.");
    }
    setSavingDoctor(false);
  };

  const handleDelete = async () => {
    if (!profile) return;
    setDeleting(true);
    setMessage(null);
    const { error: clientDeleteError } = await supabase.from("client_profiles").delete().eq("client_id", profile.id);
    const { error: doctorDeleteError } = await supabase.from("doctor_profiles").delete().eq("doctor_id", profile.id);
    const { error: profileDeleteError } = await supabase.from("profiles").delete().eq("id", profile.id);
    if (clientDeleteError || doctorDeleteError || profileDeleteError) {
      setMessage("Unable to delete user.");
    } else {
      navigate("/app/admin/users");
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Loading user...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-3">
        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        <button
          type="button"
          onClick={() => navigate("/app/admin/users")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Back to users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-[#1f3d47]">
      {(error || message) && (
        <div
          className={[
            "rounded-2xl px-4 py-3 text-sm",
            error
              ? "border border-rose-200 bg-rose-50 text-rose-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700",
          ].join(" ")}
        >
          {error || message}
        </div>
      )}

      <section className="relative overflow-hidden rounded-[30px] border border-[#d3e8f2] bg-gradient-to-r from-white via-[#E8F4F8] to-[#cfe6f1] p-6 shadow-[0_24px_80px_-60px_rgba(74,144,164,0.9)]">
        <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_12%_20%,rgba(74,144,164,0.14),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(184,225,240,0.22),transparent_32%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3e6f7b]">User profile</p>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">{profile.full_name || "User"}</h1>
            <p className="text-sm text-[#355c68]">{profile.email || "No email on file"}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#2f5f6a]">
              <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">ID {profile.id}</span>
              <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">
                Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Not set"}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-[#d3e8f2]">Role {profile.role}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/app/admin/users")}
              className="rounded-full border border-[#d3e8f2] bg-white px-4 py-2 text-xs font-semibold text-[#2f5f6a] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Back to users
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || (!!currentAdminId && profile?.id === currentAdminId)}
              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
            >
              {deleting ? "Removing..." : "Delete user"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-[24px] border border-[#d3e8f2] bg-white/95 p-5 shadow-sm shadow-[#4A90A4]/12 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Role</p>
              <h3 className="text-lg font-bold text-[#1f3d47]">Set access</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={roleSelection}
                onChange={(e) => setRoleSelection(e.target.value as Profile["role"])}
                disabled={currentAdminId === profile.id}
                className="rounded-xl border border-[#d3e8f2] bg-white px-3 py-2 text-sm font-semibold text-[#1f3d47] shadow-inner shadow-[#f1f7fa] focus:border-[#4A90A4] focus:ring-4 focus:ring-[#B8E1F0] disabled:opacity-50"
              >
                <option value="CLIENT">CLIENT</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="ADMIN">ADMIN</option>
                <option value="DISABLED">DISABLED</option>
              </select>
              <button
                type="button"
                onClick={handleSaveRole}
                disabled={savingRole || !roleSelection || currentAdminId === profile.id}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2f5f6a] px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E1F0] disabled:opacity-60"
              >
                {savingRole ? "Saving..." : "Save role"}
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-[#527884]">Disable prevents login; change role to restore access.</p>
        </article>

        <article className="rounded-[24px] border border-[#d3e8f2] bg-white/95 p-5 shadow-sm shadow-[#4A90A4]/12 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3e6f7b]">Contact</p>
              <h3 className="text-lg font-bold text-[#1f3d47]">Reachability</h3>
            </div>
          </div>
          <div className="mt-3 space-y-2 text-sm text-[#2f5f6a]">
            <p className="font-semibold text-[#1f3d47]">{profile.email || "No email on file"}</p>
            <p className="text-xs text-[#527884]">ID: {profile.id}</p>
          </div>
        </article>
      </section>

      {roleSelection === "CLIENT" && (
        <form
          onSubmit={handleSaveClient}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.45)] backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Client demographics</h3>
            <button
              type="submit"
              disabled={savingClient}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
            >
              {savingClient ? "Saving..." : "Save client profile"}
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Phone", "phone"],
              ["DOB", "dob"],
              ["ID number", "id_number"],
              ["Sex", "sex"],
              ["Blood type", "blood_type"],
              ["Address", "address"],
              ["City", "city"],
              ["State", "state"],
              ["Postal", "postal"],
              ["Emergency contact name", "emergency_contact_name"],
              ["Emergency contact phone", "emergency_contact_phone"],
            ].map(([label, field]) => (
              <label key={field} className="space-y-1 text-sm font-semibold text-slate-800">
                <span>{label}</span>
                <input
                  value={(clientProfile as any)[field] || ""}
                  onChange={(e) => setClientProfile((prev) => ({ ...prev, [field]: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </label>
            ))}
          </div>
        </form>
      )}

      {roleSelection === "DOCTOR" && (
        <form
          onSubmit={handleSaveDoctor}
          className="space-y-3 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.45)] backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Doctor profile</h3>
            <button
              type="submit"
              disabled={savingDoctor}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
            >
              {savingDoctor ? "Saving..." : "Save doctor profile"}
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Specialty", "specialty"],
              ["Office phone", "office_phone"],
              ["Office location", "office_location"],
            ].map(([label, field]) => (
              <label key={field} className="space-y-1 text-sm font-semibold text-slate-800">
                <span>{label}</span>
                <input
                  value={(doctorProfile as any)[field] || ""}
                  onChange={(e) => setDoctorProfile((prev) => ({ ...prev, [field]: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </label>
            ))}
          </div>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Biography</span>
            <textarea
              value={doctorProfile.biography || ""}
              onChange={(e) => setDoctorProfile((prev) => ({ ...prev, biography: e.target.value }))}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </form>
      )}
    </div>
  );
};

export default AdminUserDetailsPage;
