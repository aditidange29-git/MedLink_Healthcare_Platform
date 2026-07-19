import { NextResponse } from "next/server";
import { doctorsData } from "@/data/doctorsData";

export async function GET() {
  return NextResponse.json(doctorsData);
}
