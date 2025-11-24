import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDoctorSelection } from "../context/DoctorSelectionContext";
import { useForm } from "react-hook-form";


type AppointmentForm = {
  name: string;
  fatherName: string;
  email: string;
  motherName: string;
  phone: string;
  department: string;
  age: string;
  gender: string;
  bloodType: string;
  dob: string;
  patientStatus: string;
  insurance?: string;
  policy?: string;
  doctor: string;
  urgency: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  notes?: string;
  idUpload: FileList;
};



const AppointmentsPage = () => {
  const { t } = useTranslation();
  const departmentOptions = t("home.departments", { returnObjects: true }) as string[];
  const doctorOptions = t("doctorsPage.doctors", { returnObjects: true }) as { name: string }[];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentForm>({
    mode: "onBlur", // validate when leaving input (or use "onSubmit")
  });
  const onSubmit = (data: AppointmentForm) => {
    console.log("Appointment submitted:", data);
    // later you can send this to your backend
  };
  
  const urgencyOptions = t("appointments.urgencyOptions", {
    returnObjects: true,
    defaultValue: ["Routine", "Soon", "Urgent"],
  }) as string[];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = t("appointments.genders", { returnObjects: true, defaultValue: ["Female", "Male"] }) as string[];
  const [searchParams] = useSearchParams();
  const { selectedDoctor, setSelectedDoctor } = useDoctorSelection();
  const [doctorValue, setDoctorValue] = useState(selectedDoctor);
  const fieldBorder = (hasError: boolean) =>
    hasError
      ? "border-2 border-red-500 ring-2 ring-red-200 shadow-[0_10px_35px_-25px_rgba(220,38,38,0.5)]"
      : "border border-transparent ring-1 ring-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_38px_-28px_rgba(15,23,42,0.35)] focus:border-slate-900 focus:ring-2 focus:ring-slate-200";
  const controlClass = (hasError: boolean) =>
    `w-full h-14 sm:h-14 rounded-2xl bg-gradient-to-r from-white via-white to-slate-50 px-4 py-3 text-base sm:text-lg transition focus:-translate-y-[1px] ${fieldBorder(hasError)}`;

  useEffect(() => {
    const docFromQuery = searchParams.get("doctor");
    const nextValue = docFromQuery ?? selectedDoctor;
    if (nextValue === doctorValue) return;
    setDoctorValue(nextValue);
    setSelectedDoctor(nextValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, selectedDoctor]);

  return (
    <div className="appointments-shell bg-gradient-to-b from-blue-50 via-white to-blue-50 text-slate-900">
      <div className="w-full mx-auto max-w-4xl px-4 py-8 space-y-6 sm:px-6 sm:py-10">
        <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-100 sm:p-6">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t("appointments.title")}</h1>
          <p className="mt-2 text-base text-slate-700 sm:text-lg">{t("appointments.subtitle")}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">{t("appointments.helper")}</p>
        </div>

 
        <form
          className="space-y-5 rounded-3xl bg-white/85 p-4 shadow-xl ring-1 ring-slate-200 backdrop-blur sm:p-6"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
  <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.name")}
  <input
    type="text"
    className={controlClass(!!errors.name)}
    {...register("name", {
      required: t("appointments.errors.required"),
    })}
  />
</label>

<label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.fatherName", { defaultValue: "Father name" })}
  <input
    type="text"
    className={controlClass(!!errors.fatherName)}
    {...register("fatherName", {
      required: t("appointments.errors.fatherName", {
        defaultValue: "Please enter the father name",
      }),
    })}
  />
</label>

          </div>

          <div className="grid gap-5 md:grid-cols-2">
  <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.email")}
  <input
    type="email"
    className={controlClass(!!errors.email)}
    placeholder="you@example.com"
    {...register("email", {
      required: t("appointments.errors.email"),
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: t("appointments.errors.email"),
      },
    })}
  />
</label>

  <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.motherName", { defaultValue: "Mother name" })}
  <input
    type="text"
    className={controlClass(!!errors.motherName)}
    {...register("motherName", {
      required: t("appointments.errors.motherName", {
        defaultValue: "Please enter the mother name",
      }),
    })}
  />
</label>

          </div>

          <div className="grid gap-5 md:grid-cols-2">
  <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.phone")}
  <div className={`flex items-center gap-2 ${controlClass(!!errors.phone)}`}>
    <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 select-none">
      +961
    </span>
    <input
      type="tel"
      inputMode="numeric"
      maxLength={8}
      className="w-full border-0 bg-transparent px-1 py-1 text-base outline-none focus:outline-none sm:text-lg"
      placeholder="12345678"
      {...register("phone", {
        required: t("appointments.errors.phone"),
        pattern: {
          value: /^[0-9]{8}$/,
        message: t("appointments.errors.phone"),
      },
    })}
  />
  </div>
</label>

<label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.department")}
  <select
    className={controlClass(!!errors.department)}
    {...register("department", {
      required: t("appointments.errors.department"),
    })}
    value={doctorValue}
    onChange={(event) => {
      setDoctorValue(event.target.value);
      setSelectedDoctor(event.target.value);
    }}
  >
    <option value="">{t("appointments.department")}</option>
    {departmentOptions.map((dept) => (
      <option key={dept}>{dept}</option>
    ))}
  </select>
</label>

          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.dob", { defaultValue: "Date of birth" })}
      <input
        type="date"
        className={controlClass(!!errors.dob)}
        {...register("dob", {
          required: t("appointments.errors.dob", {
            defaultValue: "Please enter date of birth",
          }),
        })}
      />
    </label>
            <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
        {t("appointments.patientStatus", { defaultValue: "Patient status" })}
        <select
          className={controlClass(!!errors.patientStatus)}
          {...register("patientStatus", {
            required: t("appointments.errors.patientStatus", {
              defaultValue: "Please select patient status",
            }),
          })}
        >
          <option value="">
            {t("appointments.patientStatus", { defaultValue: "Patient status" })}
          </option>
          <option value="new">
            {t("appointments.newPatient", { defaultValue: "New patient" })}
          </option>
          <option value="returning">
            {t("appointments.returningPatient", {
              defaultValue: "Returning patient",
            })}
          </option>
        </select>
      </label>
      <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
        {t("appointments.bloodType", { defaultValue: "Blood type" })}
        <select
          className={controlClass(!!errors.bloodType)}
          {...register("bloodType", {
            required: t("appointments.errors.bloodType", {
              defaultValue: "Please select blood type",
            }),
          })}
        >
          <option value="">{t("appointments.bloodType", { defaultValue: "Blood type" })}</option>
          {bloodTypes.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.insurance", { defaultValue: "Insurance provider" })}
      <input
        type="text"
        className={controlClass(false)}
        placeholder={t("appointments.insurancePlaceholder", {
          defaultValue: "Provider name",
        })}
        {...register("insurance")}
      />
      {/* optional field - no error needed unless you want it */}
    </label>
    <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.policy", { defaultValue: "Policy number" })}
      <input
        type="text"
        className={controlClass(false)}
        placeholder={t("appointments.policyPlaceholder", {
          defaultValue: "Policy / ID",
        })}
        {...register("policy")}
      />
      {/* optional field */}
    </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
          {t("appointments.doctor")}
          <select
            className={controlClass(!!errors.doctor)}
            {...register("doctor", {
              required: t("appointments.errors.doctor"),
        })}
      >
        <option value="">{t("appointments.doctor")}</option>
        {doctorOptions.map((doc) => (
          <option key={doc.name}>{doc.name}</option>
        ))}
      </select>
    </label>
    <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
          {t("appointments.urgency", { defaultValue: "Case urgency" })}
          <select
            className={controlClass(!!errors.urgency)}
            {...register("urgency", {
              required: t("appointments.errors.urgency", {
            defaultValue: "Please choose urgency",
          }),
        })}
      >
        <option value="">
          {t("appointments.urgencyPlaceholder", {
            defaultValue: "Select urgency",
          })}
        </option>
        {urgencyOptions.map((level) => (
          <option key={level}>{level}</option>
        ))}
      </select>
    </label>
  </div>

  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.age", { defaultValue: "Age" })}
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        className={controlClass(!!errors.age)}
        placeholder="30"
        {...register("age", {
          required: t("appointments.errors.age", { defaultValue: "Please enter a valid age" }),
          pattern: {
            value: /^[0-9]{1,2}$/,
            message: t("appointments.errors.age", { defaultValue: "Please enter a valid age" }),
          },
        })}
      />
    </label>

    <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.gender", { defaultValue: "Gender" })}
      <select
        className={controlClass(!!errors.gender)}
        {...register("gender", {
          required: t("appointments.errors.gender", { defaultValue: "Please select gender" }),
        })}
      >
        <option value="">{t("appointments.gender", { defaultValue: "Gender" })}</option>
        {genders.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>
    </label>

    <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.date")}
      <input
        type="date"
        className={controlClass(!!errors.preferredDate)}
        {...register("preferredDate", {
          required: t("appointments.errors.date"),
        })}
      />
    </label>

    <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.time")}
      <input
        type="time"
        className={controlClass(!!errors.preferredTime)}
        {...register("preferredTime", {
          required: t("appointments.errors.time"),
        })}
      />
    </label>
  </div>

  {/* Reason */}
  <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
    {t("appointments.reason")}
    <textarea
      rows={3}
      className={`w-full rounded-2xl bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg ${fieldBorder(!!errors.reason)}`}
      placeholder={t("appointments.reasonExample")}
      {...register("reason", {
        required: t("appointments.errors.reason"),
      })}
    />
  </label>

  {/* Notes (optional) */}
  <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
    {t("appointments.notes", { defaultValue: "Additional notes / allergies" })}
    <textarea
      rows={2}
      className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
      placeholder={t("appointments.notesPlaceholder", {
        defaultValue: "Allergies, medications, past surgeries...",
      })}
      {...register("notes")}
    />
  </label>

  {/* ID upload */}
  <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
    {t("appointments.idUpload", { defaultValue: "Upload ID / Passport (PDF)" })}
    <input
      type="file"
      accept="application/pdf"
      className={`w-full h-14 sm:h-14 rounded-2xl border border-dashed bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg file:mr-4 file:rounded-lg file:border-0 file:bg-blue-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800 ${fieldBorder(!!errors.idUpload)}`}
      {...register("idUpload", {
        required: t("appointments.errors.idUpload", {
          defaultValue: "Please upload a PDF of your ID or passport",
        }),
      })}
    />
  </label>

  {/* Buttons */}
  <div className="flex flex-wrap gap-3">
    <button
      type="reset"
      className="rounded-2xl border border-blue-900 px-5 py-3 text-lg font-semibold text-blue-900"
    >
      {t("appointments.reset")}
    </button>
    <button
      type="submit"
      className="rounded-2xl bg-blue-900 px-5 py-3 text-lg font-semibold text-white shadow-lg"
    >
      {t("appointments.submit")}
    </button>
  </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentsPage;
