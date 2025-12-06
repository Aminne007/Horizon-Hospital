import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { ClientMedicalRecord } from "../types/db";

type Props = {
  clientId: string;
  initial?: ClientMedicalRecord | null;
  onSaved?: (record: ClientMedicalRecord) => void;
  onCancel?: () => void;
};

const DoctorMedicalRecordForm = ({ clientId, initial, onSaved, onCancel }: Props) => {
  const [diagnosis, setDiagnosis] = useState(initial?.diagnosis || "");
  const [note, setNote] = useState(initial?.note || "");
  const [medications, setMedications] = useState(initial?.medications || "");
  const [followUp, setFollowUp] = useState(initial?.follow_up || "");
  const [heightCm, setHeightCm] = useState(initial?.height_cm?.toString() || "");
  const [weightKg, setWeightKg] = useState(initial?.weight_kg?.toString() || "");
  const [heartRateBpm, setHeartRateBpm] = useState(initial?.heart_rate_bpm?.toString() || "");
  const [allergiesSnapshot, setAllergiesSnapshot] = useState(initial?.allergies_snapshot || "");
  const [chronicConditionsSnapshot, setChronicConditionsSnapshot] = useState(
    initial?.chronic_conditions_snapshot || ""
  );
  const [nextFollowUpDate, setNextFollowUpDate] = useState(initial?.next_follow_up_date || "");
  const [status, setStatus] = useState(initial?.status || "FINAL");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setDiagnosis(initial.diagnosis || "");
      setNote(initial.note || "");
      setMedications(initial.medications || "");
      setFollowUp(initial.follow_up || "");
      setHeightCm(initial.height_cm?.toString() || "");
      setWeightKg(initial.weight_kg?.toString() || "");
      setHeartRateBpm(initial.heart_rate_bpm?.toString() || "");
      setAllergiesSnapshot(initial.allergies_snapshot || "");
      setChronicConditionsSnapshot(initial.chronic_conditions_snapshot || "");
      setNextFollowUpDate(initial.next_follow_up_date || "");
      setStatus(initial.status || "FINAL");
    }
  }, [initial]);

  const numberOrNull = (value: string) => {
    if (!value.trim()) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!diagnosis.trim()) {
      setError("Diagnosis is required.");
      return;
    }

    setSaving(true);

    const payload = {
      diagnosis: diagnosis.trim(),
      note: note.trim() || null,
      medications: medications.trim() || null,
      follow_up: followUp.trim() || null,
      height_cm: numberOrNull(heightCm),
      weight_kg: numberOrNull(weightKg),
      heart_rate_bpm: numberOrNull(heartRateBpm),
      allergies_snapshot: allergiesSnapshot.trim() || null,
      chronic_conditions_snapshot: chronicConditionsSnapshot.trim() || null,
      next_follow_up_date: nextFollowUpDate || null,
      status: status || "FINAL",
    };

    try {
      if (initial?.id) {
        const { data, error: updateError } = await supabase
          .from("client_medical_records")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initial.id)
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
        `
          )
          .single();

        if (updateError) {
          setError(updateError.message);
        } else if (data) {
          onSaved?.(data as ClientMedicalRecord);
        }
      } else {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Your session expired. Please sign in again.");
          setSaving(false);
          return;
        }

        const { data, error: insertError } = await supabase
          .from("client_medical_records")
          .insert({
            ...payload,
            client_id: clientId,
            doctor_id: user.id,
          })
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
        `
          )
          .single();

        if (insertError) {
          setError(insertError.message);
        } else if (data) {
          onSaved?.(data as ClientMedicalRecord);
          setDiagnosis("");
          setNote("");
          setMedications("");
          setFollowUp("");
          setHeightCm("");
          setWeightKg("");
          setHeartRateBpm("");
          setAllergiesSnapshot("");
          setChronicConditionsSnapshot("");
          setNextFollowUpDate("");
          setStatus("FINAL");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Clinical summary</p>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Diagnosis</span>
            <input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              required
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Note</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="Subjective, objective, assessment"
            />
          </label>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Medications & plan</p>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Medications</span>
            <textarea
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="e.g., Amoxicillin 500mg BID"
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Follow-up plan</span>
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="Return precautions, referrals, next steps"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Vitals</p>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Height (cm)</span>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              min={0}
              step="0.1"
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Weight (kg)</span>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              min={0}
              step="0.1"
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Heart rate (bpm)</span>
            <input
              type="number"
              value={heartRateBpm}
              onChange={(e) => setHeartRateBpm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              min={0}
            />
          </label>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Allergies & chronic conditions
          </p>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Allergies</span>
            <textarea
              value={allergiesSnapshot}
              onChange={(e) => setAllergiesSnapshot(e.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="Peanuts, penicillin, latex..."
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Chronic conditions</span>
            <textarea
              value={chronicConditionsSnapshot}
              onChange={(e) => setChronicConditionsSnapshot(e.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="Asthma, diabetes, HTN..."
            />
          </label>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Follow-up & status</p>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Next follow-up date</span>
            <input
              type="date"
              value={nextFollowUpDate || ""}
              onChange={(e) => setNextFollowUpDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="space-y-1 text-sm font-semibold text-slate-800">
            <span>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              <option value="FINAL">FINAL</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-70"
        >
          {saving ? "Saving..." : initial?.id ? "Update record" : "Create record"}
        </button>
      </div>
    </form>
  );
};

export default DoctorMedicalRecordForm;
