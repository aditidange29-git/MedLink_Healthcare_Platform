"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, User, MapPin, FileText, X } from "lucide-react";
import { getAppointmentsByEmail, updateAppointmentStatus, type Appointment } from "@/lib/firestore";

export default function Appointments() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    getAppointmentsByEmail(user.email).then((data) => { setAppointments(data); setLoading(false); }).catch(() => setLoading(false));
  }, [user, authLoading, router]);

  const cancel = async (id: string) => {
    if (!window.confirm("Cancel this appointment?")) return;
    await updateAppointmentStatus(id, "cancelled");
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
  };

  if (authLoading || loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">My Appointments</h1>
          <p className="text-slate-600">View and manage your appointments</p>
        </motion.div>
        {appointments.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 rounded-3xl shadow-xl p-12 text-center border border-slate-100">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Appointments Yet</h3>
            <p className="text-slate-500 mb-6">Book your first appointment with a doctor</p>
            <button onClick={() => router.push("/doctors")} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all">Find Doctors</button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/90 rounded-3xl shadow-xl p-6 border border-slate-100 hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">{a.doctorName?.charAt(0) || "D"}</div>
                      <div><h3 className="text-xl font-bold text-slate-800">{a.doctorName}</h3><p className="text-purple-600 font-medium">{a.specialty}</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-5 h-5 text-purple-500" /><span>{a.appointmentDate}</span></div>
                      <div className="flex items-center gap-2 text-slate-600"><Clock className="w-5 h-5 text-blue-500" /><span>{a.appointmentTime}</span></div>
                      <div className="flex items-center gap-2 text-slate-600"><User className="w-5 h-5 text-teal-500" /><span>{a.patientName}</span></div>
                      <div className="flex items-center gap-2 text-slate-600"><MapPin className="w-5 h-5 text-rose-500" /><span>{a.location || "Not specified"}</span></div>
                    </div>
                    {a.notes && <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl"><FileText className="w-5 h-5 text-slate-400 mt-0.5" /><div><p className="text-sm font-medium text-slate-700">Notes:</p><p className="text-sm">{a.notes}</p></div></div>}
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${a.status === "confirmed" ? "bg-green-100 text-green-700" : a.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{(a.status || "PENDING").toUpperCase()}</span>
                    {a.status !== "cancelled" && a.id && (
                      <button onClick={() => cancel(a.id!)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium"><X className="w-4 h-4" />Cancel</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
