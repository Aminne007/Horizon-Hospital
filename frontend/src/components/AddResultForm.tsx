import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../supabaseClient";
import type { ResultRow } from "../types/db";

export type CreatedResult = ResultRow;

type Props = {
  clientId: string;
  onCreated?: (result: CreatedResult) => void;
};

const AddResultForm = ({ clientId, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [resultType, setResultType] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      setError("Session expired. Please sign in again.");
      setLoading(false);
      return;
    }

    let storedPath: string | null = null;
    if (file) {
      const extension = file.name.includes(".") ? file.name.split(".").pop() : "pdf";
      const path = `${clientId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("results")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("results").getPublicUrl(path);
      storedPath = data?.publicUrl || null;
    }

    const payload = {
      client_id: clientId,
      title: title.trim() || "Lab Result",
      result_type: resultType.trim() || null,
      result_date: resultDate || null,
      description: description.trim() || null,
      file_path: storedPath,
      doctor_id: userData.user.id,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("results")
      .insert(payload)
      .select("*")
      .single();

    if (insertError) {
      setError(insertError.message);
    } else if (inserted) {
      const created = inserted as CreatedResult;
      onCreated?.(created);
      setSuccess("Result created and uploaded.");
      setTitle("");
      setResultType("");
      setResultDate("");
      setDescription("");
      setFile(null);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {success}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm font-semibold text-slate-800">
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder="CBC, X-ray, etc."
            required
          />
        </label>
        <label className="space-y-1 text-sm font-semibold text-slate-800">
          <span>Result type</span>
          <input
            value={resultType}
            onChange={(e) => setResultType(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder="Lab, Imaging, Pathology..."
          />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm font-semibold text-slate-800">
          <span>Date</span>
          <input
            type="date"
            value={resultDate}
            onChange={(e) => setResultDate(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </label>
        <label className="space-y-1 text-sm font-semibold text-slate-800">
          <span>Attach file</span>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </label>
      </div>
      <label className="space-y-1 text-sm font-semibold text-slate-800">
        <span>Notes</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-100 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          placeholder="Optional description for the patient or lab."
        />
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-70"
        >
          {loading ? "Saving..." : "Create result"}
        </button>
      </div>
    </form>
  );
};

export default AddResultForm;
