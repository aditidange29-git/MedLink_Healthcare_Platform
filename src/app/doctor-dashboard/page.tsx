"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, User, CheckCircle, Plus } from "lucide-react";
import { getAppointmentsByPatientId, createDoctorProfile, getDoctorByUserId, type Appointment, type DoctorProfile } from "@/lib/firestore";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [newProfile, setNewProfile] = useState({ specialization: "", bio: "" });

  useEffect(() => {
    if (!user?.id) return;
    getDoctorByUserId(user.id).then((p) => {
      if (p) { setProfile(p); if (p.id) getAppointmentsByPatientId(p.id).then(setAppointments); }
      else setIsSettingUp(true);
    });
  }, [user]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const id = await createDoctorProfile({ userId: user.id, ...newProfile });
    setProfile({ id, userId: user.id, ...newProfile });
    setIsSettingUp(false);
  };

  if (isSettingUp) return (
    <div className="max-w-2xl mx-auto p-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Setup Your Doctor Profile</h1>
      <form onSubmit={handleSetup} className="space-y-6 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Specialization</label>
          <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Cardiologist" value={newProfile.specialization} onChange={(e) => setNewProfile({ ...newProfile, specialization: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Short Bio</label>
          <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" rows={4} placeholder="Tell patients about your experience..." value={newProfile.bio} onChange={(e) => setNewProfile({ ...newProfile, bio: e.target.value })} />
        </div>
        <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">Create Profile</button>
      </form>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome, Dr. {user?.name}</h1>
          <p className="text-slate-500 text-lg">You have {appointments.filter((a) => a.status === "confirmed").length} upcoming appointments.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"><Plus size={20} />Set Availability</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Appointment Schedule</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {appointments.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold"><User size={20} /></div>
                    <div><h4 className="font-bold text-slate-900">{app.patientName}</h4><p className="text-slate-400 text-xs font-bold uppercase">Patient</p></div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${app.status === "confirmed" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>{app.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-50 p-2 rounded-lg"><Calendar size={16} className="text-primary" />{app.appointmentDate}</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-50 p-2 rounded-lg"><Clock size={16} className="text-primary" />{app.appointmentTime}</div>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-4">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Patient Notes</p>
                  <p className="text-sm text-slate-900 font-bold leading-relaxed">{app.notes || "No notes provided."}</p>
                </div>
                {app.status === "confirmed" && <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all">Complete Session</button>}
              </div>
            ))}
            {appointments.length === 0 && <div className="md:col-span-2 py-20 text-center text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-100 font-medium">No appointments found in your schedule.</div>}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
          <div className="grid gap-6">
            <div className="bg-primary p-8 rounded-[2rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10"><User size={120} /></div>
              <h4 className="text-blue-100 text-sm font-bold uppercase mb-1">Total Patients</h4>
              <p className="text-5xl font-extrabold">{appointments.length}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg">
              <h4 className="text-slate-400 text-sm font-bold uppercase mb-1">Upcoming Today</h4>
              <p className="text-4xl font-extrabold text-slate-900">{appointments.filter((a) => a.status === "confirmed").length}</p>
            </div>
          </div>
          <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />System Status</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Your profile is active and visible to patients searching for <strong>{profile?.specialization}</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
