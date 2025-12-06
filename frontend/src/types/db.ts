export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "CLIENT" | "DOCTOR" | "ADMIN";
  created_at: string;
};

export type ClientProfile = {
  client_id: string;
  phone: string | null;
  dob: string | null;
  id_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal: string | null;
  sex: string | null;
  blood_type: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
};

export type ClientMedicalRecord = {
  id: string;
  client_id: string;
  doctor_id: string | null;
  note: string | null;
  diagnosis: string | null;
  medications: string | null;
  follow_up: string | null;
  created_at: string;
  height_cm: number | null;
  weight_kg: number | null;
  heart_rate_bpm: number | null;
  allergies_snapshot: string | null;
  chronic_conditions_snapshot: string | null;
  next_follow_up_date: string | null;
  status: string | null;
  updated_at: string | null;
};

export type ResultRow = {
  id: string;
  client_id: string | null;
  doctor_id: string | null;
  title: string;
  description: string | null;
  result_type: string | null;
  result_date: string | null;
  file_path: string | null;
  created_at: string;
};

export type DoctorProfile = {
  doctor_id: string;
  specialty: string | null;
  office_phone: string | null;
  biography: string | null;
  office_location: string | null;
  created_at?: string;
};
