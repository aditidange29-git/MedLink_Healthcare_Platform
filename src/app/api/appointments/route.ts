import { NextRequest, NextResponse } from "next/server";
import { createAppointment, getAllAppointments } from "@/lib/firestore";

export async function GET() {
  try {
    const appointments = await getAllAppointments();
    return NextResponse.json({ appointments });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, patientEmail, patientPhone, doctorName, specialty,
      appointmentDate, appointmentTime, notes, patientId, doctorId, location,
      // legacy snake_case fields from old client
      patient_name, patient_email, patient_phone, doctor_name,
      appointment_date, appointment_time, specialist_name } = body;

    const id = await createAppointment({
      patientId: patientId ?? null,
      doctorId: doctorId ?? null,
      patientName: patientName ?? patient_name ?? "Patient",
      patientEmail: patientEmail ?? patient_email ?? "",
      patientPhone: patientPhone ?? patient_phone ?? "",
      doctorName: doctorName ?? doctor_name ?? specialist_name ?? "Doctor",
      specialty: specialty ?? "General",
      location: location ?? "Medical Center",
      appointmentDate: appointmentDate ?? appointment_date ?? "",
      appointmentTime: appointmentTime ?? appointment_time ?? "",
      status: "confirmed",
      notes: notes ?? body.patient_notes ?? "",
    });

    return NextResponse.json({ message: "Appointment created successfully", id }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
