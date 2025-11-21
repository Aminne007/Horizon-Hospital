import { useTranslation } from "react-i18next";

const AppointmentsPage = () => {
  const { t } = useTranslation();
  const departmentOptions = t("home.departments", { returnObjects: true }) as string[];
  const doctorOptions = t("doctorsPage.doctors", { returnObjects: true }) as { name: string }[];
  const urgencyOptions = t("appointments.urgencyOptions", {
    returnObjects: true,
    defaultValue: ["Routine", "Soon", "Urgent"],
  }) as string[];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = t("appointments.genders", { returnObjects: true, defaultValue: ["Female", "Male"] }) as string[];

  return (
    <div className="appointments-shell bg-gradient-to-b from-blue-50 via-white to-blue-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
          <h1 className="text-4xl font-bold text-slate-900">{t("appointments.title")}</h1>
          <p className="mt-2 text-lg text-slate-700">{t("appointments.subtitle")}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{t("appointments.helper")}</p>
        </div>

        <form className="space-y-5 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.name")}
              <input type="text" required className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
              <span className="text-sm text-red-700">{t("appointments.errors.required")}</span>
            </label>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.fatherName", { defaultValue: "Father name" })}
              <input type="text" required className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
              <span className="text-sm text-red-700">
                {t("appointments.errors.fatherName", { defaultValue: "Please enter the father name" })}
              </span>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.email")}
              <input
                type="email"
                required
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg"
                placeholder="you@example.com"
              />
              <span className="text-sm text-red-700">{t("appointments.errors.email")}</span>
            </label>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.motherName", { defaultValue: "Mother name" })}
              <input type="text" required className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
              <span className="text-sm text-red-700">
                {t("appointments.errors.motherName", { defaultValue: "Please enter the mother name" })}
              </span>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.phone")}
              <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-3 text-lg">
                <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 select-none">+961</span>
                <input
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="\\d{8}"
                  maxLength={8}
                  className="w-full border-0 bg-transparent px-1 py-1 text-lg outline-none focus:outline-none"
                  placeholder="12345678"
                  title="Enter 8 digits after +961"
                />
              </div>
              <span className="text-sm text-red-700">{t("appointments.errors.phone")}</span>
            </label>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.department")}
              <select className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" required>
                <option value="">{t("appointments.department")}</option>
                {departmentOptions.map((dept) => (
                  <option key={dept}>{dept}</option>
                ))}
              </select>
              <span className="text-sm text-red-700">{t("appointments.errors.department")}</span>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.age", { defaultValue: "Age" })}
              <input
                type="text"
                inputMode="numeric"
                pattern="^\\d{1,2}$"
                maxLength={2}
                required
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg"
                placeholder="30"
                title="Enter an age up to 2 digits"
              />
              <span className="text-sm text-red-700">
                {t("appointments.errors.age", { defaultValue: "Please enter a valid age" })}
              </span>
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                {t("appointments.gender", { defaultValue: "Gender" })}
                <select className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" required>
                  <option value="">{t("appointments.gender", { defaultValue: "Gender" })}</option>
                  {genders.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <span className="text-sm text-red-700">
                  {t("appointments.errors.gender", { defaultValue: "Please select gender" })}
                </span>
              </label>
              <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                {t("appointments.bloodType", { defaultValue: "Blood type" })}
                <select className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" required>
                  <option value="">{t("appointments.bloodType", { defaultValue: "Blood type" })}</option>
                  {bloodTypes.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <span className="text-sm text-red-700">
                  {t("appointments.errors.bloodType", { defaultValue: "Please select blood type" })}
                </span>
              </label>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.dob", { defaultValue: "Date of birth" })}
              <input type="date" required className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
              <span className="text-sm text-red-700">
                {t("appointments.errors.dob", { defaultValue: "Please enter date of birth" })}
              </span>
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                {t("appointments.patientStatus", { defaultValue: "Patient status" })}
                <select className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" required>
                  <option value="">{t("appointments.patientStatus", { defaultValue: "Patient status" })}</option>
                  <option value="new">{t("appointments.newPatient", { defaultValue: "New patient" })}</option>
                  <option value="returning">{t("appointments.returningPatient", { defaultValue: "Returning patient" })}</option>
                </select>
                <span className="text-sm text-red-700">
                  {t("appointments.errors.patientStatus", { defaultValue: "Please select patient status" })}
                </span>
              </label>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.insurance", { defaultValue: "Insurance provider" })}
              <input
                type="text"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg"
                placeholder={t("appointments.insurancePlaceholder", { defaultValue: "Provider name" })}
              />
              <span className="text-sm text-red-700">
                {t("appointments.errors.insurance", { defaultValue: "Please enter insurance provider (if any)" })}
              </span>
            </label>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.policy", { defaultValue: "Policy number" })}
              <input
                type="text"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg"
                placeholder={t("appointments.policyPlaceholder", { defaultValue: "Policy / ID" })}
              />
              <span className="text-sm text-red-700">
                {t("appointments.errors.policy", { defaultValue: "Please enter policy number (if insured)" })}
              </span>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.doctor")}
              <select className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg">
                <option value="">{t("appointments.doctor")}</option>
                {doctorOptions.map((doc) => (
                  <option key={doc.name}>{doc.name}</option>
                ))}
              </select>
              <span className="text-sm text-red-700">{t("appointments.errors.doctor")}</span>
            </label>
            <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
              {t("appointments.urgency", { defaultValue: "Case urgency" })}
              <select className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" required>
                <option value="">{t("appointments.urgencyPlaceholder", { defaultValue: "Select urgency" })}</option>
                {urgencyOptions.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
              <span className="text-sm text-red-700">{t("appointments.errors.urgency", { defaultValue: "Please choose urgency" })}</span>
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                {t("appointments.date")}
                <input type="date" required className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
                <span className="text-sm text-red-700">{t("appointments.errors.date")}</span>
              </label>
              <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
                {t("appointments.time")}
                <input type="time" required className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg" />
                <span className="text-sm text-red-700">{t("appointments.errors.time")}</span>
              </label>
            </div>
          </div>

          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
            {t("appointments.reason")}
            <textarea
              rows={4}
              required
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg"
              placeholder={t("appointments.reasonExample")}
            />
            <span className="text-sm text-red-700">{t("appointments.errors.reason")}</span>
          </label>

          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
            {t("appointments.notes", { defaultValue: "Additional notes / allergies" })}
            <textarea
              rows={3}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg"
              placeholder={t("appointments.notesPlaceholder", { defaultValue: "Allergies, medications, past surgeries..." })}
            />
            <span className="text-sm text-red-700">
              {t("appointments.errors.notes", { defaultValue: "Please add any critical notes (optional)" })}
            </span>
          </label>

          <label className="flex flex-col gap-2 text-base font-semibold text-slate-900">
            {t("appointments.idUpload", { defaultValue: "Upload ID / Passport (PDF)" })}
            <input
              type="file"
              accept="application/pdf"
              required
              className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-lg file:mr-4 file:rounded-lg file:border-0 file:bg-blue-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
            />
            <span className="text-sm text-red-700">
              {t("appointments.errors.idUpload", { defaultValue: "Please upload a PDF of your ID or passport" })}
            </span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="reset" className="rounded-2xl border border-blue-900 px-5 py-3 text-lg font-semibold text-blue-900">
              {t("appointments.reset")}
            </button>
            <button type="submit" className="rounded-2xl bg-blue-900 px-5 py-3 text-lg font-semibold text-white shadow-lg">
              {t("appointments.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentsPage;
