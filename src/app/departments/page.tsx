"use client";
import { useRouter } from "next/navigation";
import { Heart, Activity, Eye, Bone, Scissors, Sparkles, Baby, UserCheck } from "lucide-react";
import AppointmentBooking from "@/components/medical/AppointmentBooking";
import { useState } from "react";

const departments = [
  { name: "Cardiology", desc: "Heart and cardiovascular care", icon: <Heart className="text-rose-500 w-8 h-8" />, specialty: "Cardiology" },
  { name: "Neurology", desc: "Brain and nervous system", icon: <Activity className="text-blue-500 w-8 h-8" />, specialty: "Neurology" },
  { name: "Orthopedics", desc: "Bones, joints, and muscles", icon: <Bone className="text-orange-500 w-8 h-8" />, specialty: "Orthopedics" },
  { name: "Pediatrics", desc: "Child healthcare", icon: <Baby className="text-pink-500 w-8 h-8" />, specialty: "Pediatrics" },
  { name: "Dermatology", desc: "Skin, hair, and nails", icon: <Sparkles className="text-purple-500 w-8 h-8" />, specialty: "Dermatology" },
  { name: "Ophthalmology", desc: "Eye care and vision", icon: <Eye className="text-emerald-500 w-8 h-8" />, specialty: "Ophthalmology" },
  { name: "Dental", desc: "Oral health and dentistry", icon: <Scissors className="text-sky-500 w-8 h-8" />, specialty: "Dental" },
  { name: "General", desc: "General health consultation", icon: <UserCheck className="text-green-500 w-8 h-8" />, specialty: "General" },
];

export default function Departments() {
  const router = useRouter();
  const [booking, setBooking] = useState<{ title: string; specialty: string; expertise: string; location: string; description: string; availability: string } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">Our Departments</h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">World-class medical departments staffed by expert physicians dedicated to your health and well-being.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((d, i) => (
            <div key={i} className="premium-card p-8 flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2 hover:border-green-300 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">{d.icon}</div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">{d.name}</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">{d.desc}</p>
              <div className="mt-auto space-y-2 w-full">
                <button onClick={() => router.push(`/doctors?specialty=${d.specialty}`)} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-transform shadow-md">Find Doctors</button>
                <button onClick={() => setBooking({ title: `${d.name} Specialist`, specialty: d.specialty, expertise: d.specialty, location: `${d.name} Center`, description: d.desc, availability: "Available Today" })} className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">Book Appointment</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {booking && <AppointmentBooking specialist={booking} onClose={() => setBooking(null)} />}
    </div>
  );
}
