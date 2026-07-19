import { NextResponse } from "next/server";

const departments = [
  { id: 1, name: "Cardiology", description: "Heart and cardiovascular care" },
  { id: 2, name: "Neurology", description: "Brain and nervous system" },
  { id: 3, name: "Orthopedics", description: "Bones, joints, and muscles" },
  { id: 4, name: "Pediatrics", description: "Child healthcare" },
  { id: 5, name: "Dermatology", description: "Skin, hair, and nails" },
  { id: 6, name: "Ophthalmology", description: "Eye care and vision" },
  { id: 7, name: "Dental", description: "Oral health and dentistry" },
  { id: 8, name: "General", description: "General health consultation" },
];

export async function GET() {
  return NextResponse.json(departments);
}
