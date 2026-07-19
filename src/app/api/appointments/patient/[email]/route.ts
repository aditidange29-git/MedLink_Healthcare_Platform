import { NextRequest, NextResponse } from "next/server";
import { getAppointmentsByEmail } from "@/lib/firestore";

export async function GET(_: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params;
    const appointments = await getAppointmentsByEmail(decodeURIComponent(email));
    return NextResponse.json({ appointments });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
