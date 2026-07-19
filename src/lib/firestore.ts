/**
 * firestore.ts — Firestore CRUD helpers for appointments and doctors.
 * Replaces all SQLite queries from the Express backend.
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Appointment {
  id?: string;
  patientId?: string;
  doctorId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  specialty: string;
  location?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "confirmed" | "cancelled" | "pending";
  notes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface DoctorProfile {
  id?: string;
  userId: string;
  specialization: string;
  bio?: string;
  availability?: string[];
  createdAt?: unknown;
}

// ─── Appointments ─────────────────────────────────────────────────────────────

const APPOINTMENTS = "appointments";

export async function createAppointment(
  data: Omit<Appointment, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, APPOINTMENTS), {
    ...data,
    status: data.status ?? "confirmed",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const snap = await getDocs(
    query(collection(db, APPOINTMENTS), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) } as Appointment));
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const snap = await getDoc(doc(db, APPOINTMENTS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as DocumentData) } as Appointment;
}

export async function getAppointmentsByEmail(email: string): Promise<Appointment[]> {
  const snap = await getDocs(
    query(
      collection(db, APPOINTMENTS),
      where("patientEmail", "==", email),
      orderBy("appointmentDate", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) } as Appointment));
}

export async function getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
  const snap = await getDocs(
    query(collection(db, APPOINTMENTS), where("patientId", "==", patientId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) } as Appointment));
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment["status"]
): Promise<void> {
  await updateDoc(doc(db, APPOINTMENTS, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAppointment(id: string): Promise<void> {
  await deleteDoc(doc(db, APPOINTMENTS, id));
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

const DOCTORS = "doctors";

export async function createDoctorProfile(
  data: Omit<DoctorProfile, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, DOCTORS), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllDoctors(): Promise<DoctorProfile[]> {
  const snap = await getDocs(collection(db, DOCTORS));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) } as DoctorProfile));
}

export async function getDoctorByUserId(userId: string): Promise<DoctorProfile | null> {
  const snap = await getDocs(
    query(collection(db, DOCTORS), where("userId", "==", userId))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as DocumentData) } as DoctorProfile;
}
