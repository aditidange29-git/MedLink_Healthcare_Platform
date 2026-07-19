"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Award, GraduationCap, MapPin, DollarSign, Languages, Clock, X } from "lucide-react";
import { useState } from "react";

export default function DoctorProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 7));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showCallback, setShowCallback] = useState(false);
  const [cbForm, setCbForm] = useState({ mobile: "", firstName: "", lastName: "", email: "", comments: "" });
  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM"];

  const fmt = (d: Date) => { const day = d.getDate(); const s = [11,12,13].includes(day%100) ? "th" : ["st","nd","rd"][day%10-1]||"th"; return `${day}${s} ${d.toLocaleString("default",{month:"long"})}, ${d.getFullYear()}`; };

  const doctor = { id, name: "Dr. Ethan Walker", designation: "Consultant Cardiologist", speciality: "Cardiology", subSpeciality: "Interventional Cardiology, Preventive Cardiology", experience: 18, consultationFee: 121, languages: ["English"], hospital: "MedLink Cardiology Center", about: "Experienced cardiologist specializing in heart disease management, cardiac diagnostics, and preventive heart care. With over 18 years of clinical experience, Dr. Walker has successfully treated thousands of patients with various cardiac conditions.", education: ["MBBS", "MD Internal Medicine", "DM Cardiology"], awards: ["Clinical Excellence Award", "Patient Care Recognition"] };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <button onClick={() => router.push("/")} className="hover:text-green-600">Home</button><span>›</span>
          <button onClick={() => router.push("/doctors")} className="hover:text-green-600">Doctors</button><span>›</span>
          <span className="text-slate-800 font-medium">{doctor.name}</span>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0">{doctor.name.split(" ")[1].charAt(0)}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{doctor.name}</h1>
                  <p className="text-green-600 font-semibold text-lg mb-4">{doctor.designation}</p>
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-slate-600"><Calendar size={16} className="text-green-500" /><span className="text-sm">{doctor.experience} Years Experience</span></div>
                    <div className="flex items-center gap-2 text-slate-600"><DollarSign size={16} className="text-green-500" /><span className="text-sm">${doctor.consultationFee} Consultation Fee</span></div>
                    <div className="flex items-center gap-2 text-slate-600"><MapPin size={16} className="text-green-500" /><span className="text-sm">{doctor.hospital}</span></div>
                    <div className="flex items-center gap-2 text-slate-600"><Languages size={16} className="text-green-500" /><span className="text-sm">{doctor.languages.join(", ")}</span></div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 inline-block"><p className="text-sm text-slate-700"><span className="font-semibold text-green-700">Specialization:</span> {doctor.subSpeciality}</p></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8">
              <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><span className="text-green-600 text-xl">📋</span></div><h2 className="text-2xl font-bold text-slate-800">About</h2></div>
              <p className="text-slate-600 leading-relaxed">{doctor.about}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><GraduationCap size={20} className="text-blue-600" /></div><h2 className="text-xl font-bold text-slate-800">Education</h2></div>
                <ul className="space-y-2">{doctor.education.map((e, i) => <li key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" /><span className="text-slate-700">{e}</span></li>)}</ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><Award size={20} className="text-yellow-600" /></div><h2 className="text-xl font-bold text-slate-800">Awards</h2></div>
                <ul className="space-y-2">{doctor.awards.map((a, i) => <li key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" /><span className="text-slate-700">{a}</span></li>)}</ul>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white sticky top-8">
              <h3 className="text-2xl font-bold mb-6">Book Appointment</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                <p className="text-green-100 text-sm mb-3">Select Date</p>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate()-1); setSelectedDate(d); setSelectedSlot(null); }} className="text-white/60 hover:text-white"><ArrowLeft size={20} /></button>
                  <span className="font-semibold text-center text-sm">{fmt(selectedDate)}</span>
                  <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate()+1); setSelectedDate(d); setSelectedSlot(null); }} className="text-white/60 hover:text-white"><ArrowLeft size={20} className="rotate-180" /></button>
                </div>
                <p className="text-green-100 text-sm mb-3">Available Time Slots</p>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)} className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedSlot === slot ? "bg-white text-green-600 shadow-lg" : "bg-white/20 text-white hover:bg-white/30"}`}>{slot}</button>
                  ))}
                </div>
              </div>
              {selectedSlot && <div className="bg-white/10 rounded-xl p-4 mb-4"><div className="flex items-center gap-2 text-white"><Clock size={16} /><span className="text-sm">Selected: {selectedSlot}</span></div></div>}
              <button onClick={() => selectedSlot && alert(`Appointment booked for ${fmt(selectedDate)} at ${selectedSlot}`)} disabled={!selectedSlot} className={`w-full py-3 rounded-xl font-bold mb-3 ${selectedSlot ? "bg-white text-green-600 hover:bg-green-50" : "bg-white/30 text-white/50 cursor-not-allowed"}`}>{selectedSlot ? "Confirm Appointment" : "Select a Time Slot"}</button>
              <button onClick={() => setShowCallback(true)} className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 mb-6">Request A Call Back</button>
              <button onClick={() => router.push("/doctors")} className="w-full bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 flex items-center justify-center gap-2"><ArrowLeft size={18} />Back to Doctors</button>
            </div>
          </div>
        </div>
      </div>
      {showCallback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Callback</h2>
              <button onClick={() => setShowCallback(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert(`Callback: ${cbForm.firstName} ${cbForm.lastName} - ${cbForm.mobile}`); setShowCallback(false); }} className="p-6 space-y-6">
              {(["mobile","firstName","lastName","email","comments"] as const).map((f) => (
                <div key={f}>
                  <label className="block text-slate-600 text-sm mb-2 capitalize">{f.replace(/([A-Z])/g," $1")}<span className="text-red-500">*</span></label>
                  <input type={f==="email"?"email":"text"} value={cbForm[f]} onChange={(e) => setCbForm({...cbForm,[f]:e.target.value})} required className="w-full border-b-2 border-slate-300 focus:border-green-500 outline-none py-2 text-slate-800" />
                </div>
              ))}
              <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold">Request Callback</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
