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
  preferredDate: string;   // 👈 must exist if you use register("preferredDate")
  preferredTime: string;   // 👈 must exist if you use register("preferredTime")
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

  useEffect(() => {
    const docFromQuery = searchParams.get("doctor");
    if (docFromQuery) {
      setDoctorValue(docFromQuery);
      setSelectedDoctor(docFromQuery);
    } else {
      setDoctorValue(selectedDoctor);
    }
  }, [searchParams, selectedDoctor, setSelectedDoctor]);

  return (
    <div className="appointments-shell bg-gradient-to-b from-blue-50 via-white to-blue-50 text-slate-900">
      <div className="w-full mx-auto max-w-4xl px-4 py-8 space-y-6 sm:px-6 sm:py-10">
        <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-100 sm:p-6">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t("appointments.title")}</h1>
          <p className="mt-2 text-base text-slate-700 sm:text-lg">{t("appointments.subtitle")}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">{t("appointments.helper")}</p>
        </div>

 
        <form
  className="space-y-5 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-slate-100 sm:p-6"
  onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.name")}
  <input
    type="text"
    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
    {...register("name", {
      required: t("appointments.errors.required"),
    })}
  />
  {errors.name && (
    <span className="text-sm text-red-700">
      {errors.name.message}
    </span>
  )}
</label>

<label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.fatherName", { defaultValue: "Father name" })}
  <input
    type="text"
    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
    {...register("fatherName", {
      required: t("appointments.errors.fatherName", {
        defaultValue: "Please enter the father name",
      }),
    })}
  />
  {errors.fatherName && (
    <span className="text-sm text-red-700">
      {errors.fatherName.message}
    </span>
  )}
</label>

          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.email")}
  <input
    type="email"
    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
    placeholder="you@example.com"
    {...register("email", {
      required: t("appointments.errors.email"),
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: t("appointments.errors.email"),
      },
    })}
  />
  {errors.email && (
    <span className="text-sm text-red-700">
      {errors.email.message}
    </span>
  )}
</label>

<label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.motherName", { defaultValue: "Mother name" })}
  <input
    type="text"
    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
    {...register("motherName", {
      required: t("appointments.errors.motherName", {
        defaultValue: "Please enter the mother name",
      }),
    })}
  />
  {errors.motherName && (
    <span className="text-sm text-red-700">
      {errors.motherName.message}
    </span>
  )}
</label>

          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.phone")}
  <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:py-3 sm:text-lg">
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
  {errors.phone && (
    <span className="text-sm text-red-700">
      {errors.phone.message}
    </span>
  )}
</label>

<label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.department")}
  <select
    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
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
  {errors.department && (
    <span className="text-sm text-red-700">
      {errors.department.message}
    </span>
  )}
</label>

          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
  {t("appointments.age", { defaultValue: "Age" })}
  <input
    type="text"
    inputMode="numeric"
    maxLength={2}
    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
    placeholder="30"
    {...register("age", {
      required: t("appointments.errors.age", { defaultValue: "Please enter a valid age" }),
      pattern: {
        value: /^[0-9]{1,2}$/,
        message: t("appointments.errors.age", { defaultValue: "Please enter a valid age" }),
      },
    })}
  />
  {errors.age && (
    <span className="text-sm text-red-700">
      {errors.age.message}
    </span>
  )}
</label>

            <div className="grid gap-5 sm:grid-cols-2">
            <select
  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
  {...register("gender", {
    required: t("appointments.errors.gender", { defaultValue: "Please select gender" }),
  })}
>
  <option value="">
    {t("appointments.gender", { defaultValue: "Gender" })}
  </option>
  {genders.map((g) => (
    <option key={g}>{g}</option>
  ))}
</select>
{errors.gender && (
  <span className="text-sm text-red-700">
    {errors.gender.message}
  </span>
)}

<select
  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
  {...register("bloodType", {
    required: t("appointments.errors.bloodType", {
      defaultValue: "Please select blood type",
    }),
  })}
>
  <option value="">
    {t("appointments.bloodType", { defaultValue: "Blood type" })}
  </option>
  {bloodTypes.map((b) => (
    <option key={b}>{b}</option>
  ))}
</select>
{errors.bloodType && (
  <span className="text-sm text-red-700">
    {errors.bloodType.message}
  </span>
)}

            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.dob", { defaultValue: "Date of birth" })}
      <input
        type="date"
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
        {...register("dob", {
          required: t("appointments.errors.dob", {
            defaultValue: "Please enter date of birth",
          }),
        })}
      />
      {errors.dob && (
        <span className="text-sm text-red-700">
          {errors.dob.message}
        </span>
      )}
    </label>
            <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
        {t("appointments.patientStatus", { defaultValue: "Patient status" })}
        <select
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
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
        {errors.patientStatus && (
          <span className="text-sm text-red-700">
            {errors.patientStatus.message}
          </span>
        )}
      </label>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.insurance", { defaultValue: "Insurance provider" })}
      <input
        type="text"
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
        placeholder={t("appointments.insurancePlaceholder", {
          defaultValue: "Provider name",
        })}
        {...register("insurance")}
      />
      {/* optional field – no error needed unless you want it */}
    </label>
    <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.policy", { defaultValue: "Policy number" })}
      <input
        type="text"
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
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
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
        {...register("doctor", {
          required: t("appointments.errors.doctor"),
        })}
      >
        <option value="">{t("appointments.doctor")}</option>
        {doctorOptions.map((doc) => (
          <option key={doc.name}>{doc.name}</option>
        ))}
      </select>
      {errors.doctor && (
        <span className="text-sm text-red-700">
          {errors.doctor.message}
        </span>
      )}
    </label>
    <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
      {t("appointments.urgency", { defaultValue: "Case urgency" })}
      <select
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
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
      {errors.urgency && (
        <span className="text-sm text-red-700">
          {errors.urgency.message}
        </span>
      )}
    </label>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
        {t("appointments.date")}
        <input
          type="date"
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
          {...register("preferredDate", {
            required: t("appointments.errors.date"),
          })}
        />
        {errors.preferredDate && (
          <span className="text-sm text-red-700">
            {errors.preferredDate.message}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
        {t("appointments.time")}
        <input
          type="time"
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
          {...register("preferredTime", {
            required: t("appointments.errors.time"),
          })}
        />
        {errors.preferredTime && (
          <span className="text-sm text-red-700">
            {errors.preferredTime.message}
          </span>
        )}
      </label>
    </div>
  </div>

  {/* Reason */}
  <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
    {t("appointments.reason")}
    <textarea
      rows={3}
      className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg"
      placeholder={t("appointments.reasonExample")}
      {...register("reason", {
        required: t("appointments.errors.reason"),
      })}
    />
    {errors.reason && (
      <span className="text-sm text-red-700">
        {errors.reason.message}
      </span>
    )}
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
      className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg file:mr-4 file:rounded-lg file:border-0 file:bg-blue-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
      {...register("idUpload", {
        required: t("appointments.errors.idUpload", {
          defaultValue: "Please upload a PDF of your ID or passport",
        }),
      })}
    />
    {errors.idUpload && (
      <span className="text-sm text-red-700">
        {errors.idUpload.message}
      </span>
    )}
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
