import { NextResponse } from "next/server";

const hospitals = [
  { id: 1, name: "City General Hospital", distance: "2.3 km", phone: "+91-40-2345-6789", available: true, address: "Banjara Hills, Hyderabad", lat: 17.4239, lng: 78.4738 },
  { id: 2, name: "Apollo Emergency Center", distance: "3.1 km", phone: "+91-40-2345-6790", available: true, address: "Jubilee Hills, Hyderabad", lat: 17.4326, lng: 78.4071 },
  { id: 3, name: "Care Hospital Emergency", distance: "4.5 km", phone: "+91-40-2345-6791", available: false, address: "Gachibowli, Hyderabad", lat: 17.4400, lng: 78.3489 },
  { id: 4, name: "Yashoda Hospital", distance: "5.2 km", phone: "+91-40-2345-6792", available: true, address: "Somajiguda, Hyderabad", lat: 17.4312, lng: 78.4578 },
];

export async function GET() {
  return NextResponse.json(hospitals);
}

export async function POST() {
  return NextResponse.json({ success: true, message: "Ambulance dispatched", eta: "8-10 minutes", ambulance_number: "AP-09-AB-1234" });
}
