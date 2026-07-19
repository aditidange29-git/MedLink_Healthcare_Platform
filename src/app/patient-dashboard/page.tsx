"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, Calendar, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doctorsData, type Doctor } from "@/data/doctorsData";
import { createAppointment, getAppointmentsByEmail, deleteAppointment, type Appointment } from "@/lib/firestore";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<Appointment[]>([]);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dateOffset, setDateOffset] = useState(0);
  const [details, setDetails] = useState({ date: "", timeSlot: "", patientName: user?.name || "", patientAge: "", problemDescription: "" });

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { full: d.toISOString().split("T")[0], dayName: d.toLocaleDateString("en-US", { weekday: "short" }), dayNum: d.getDate(), month: d.toLocaleDateString("en-US", { month: "short" }) };
  });
  const visible = dates.slice(dateOffset, dateOffset + 7);
  const slots = ["9:00 AM - 9:30 AM","9:30 AM - 10:00 AM","10:00 AM - 10:30 AM","10:30 AM - 11:00 AM","2:00 PM - 2:30 PM","2:30 PM - 3:00 PM","3:00 PM - 3:30 PM","3:30 PM - 4:00 PM"];

  useEffect(() => { if (user?.name) setDetails((p) => ({ ...p, patientName: user.name })); }, [user]);
  useEffect(() => { if (user?.email) getAppointmentsByEmail(user.email).then(setHistory); }, [user]);

  const filtered = doctorsData.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));

  const handleBook = async () => {
    if (!user?.email) { alert("Please log in to book"); return; }
    if (!bookingDoctor || !details.date || !details.timeSlot) { alert("Please select date and time"); return; }
    await createAppointment({ patientId: user.id, doctorId: String(bookingDoctor.id), patientName: details.patientName, patientEmail: user.email, patientPhone: user.phone || "", doctorName: bookingDoctor.name, specialty: bookingDoctor.specialty, location: bookingDoctor.location, appointmentDate: details.date, appointmentTime: details.timeSlot.split(" - ")[0], status: "confirmed", notes: `Age: ${details.patientAge}. ${details.problemDescription}` });
    setShowSuccess(true);
    getAppointmentsByEmail(user.email).then(setHistory);
  };

  const handleCancel = async (id: string) => {
    await deleteAppointment(id);
    if (user?.email) getAppointmentsByEmail(user.email).then(setHistory);
  };

  const upcoming = history.filter((a) => a.status === "pending" || a.status === "confirmed");

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Hello, {user?.name}</h1>
          <p className="text-slate-500 text-lg">Manage your health and appointments here.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search doctors or specializations..." className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Available Doctors</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((doc) => (
              <div key={doc.id} className="premium-card p-6 border-l-4 border-l-primary group">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4">{doc.specialty}</span>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{doc.experience} experience · ⭐ {doc.rating}</p>
                <button onClick={() => setBookingDoctor(doc)} className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-[1.02]">Book Appointment</button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Upcoming Bookings</h2>
          <div className="space-y-4">
            {upcoming.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-6 border-2 border-primary/10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10"><CheckCircle size={40} className="text-primary" /></div>
                <div className="flex justify-between items-start mb-4">
                  <div><h4 className="font-bold text-slate-900">{app.doctorName}</h4><p className="text-sm text-slate-500 font-medium">{app.specialty}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-bold uppercase text-slate-400">
                  <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-lg"><Calendar size={14} className="text-primary" />{app.appointmentDate}</div>
                  <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-lg"><Clock size={14} className="text-primary" />{app.appointmentTime}</div>
                </div>
                {app.id && <button onClick={() => handleCancel(app.id!)} className="w-full py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100">Cancel Booking</button>}
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-slate-400 italic">No upcoming appointments scheduled.</p>}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingDoctor && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
              {showSuccess ? (
                <div className="py-20 text-center space-y-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                    <CheckCircle size={50} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-slate-900">Appointment Booked! ✅</h2>
                  <p className="text-slate-500">Your slot with {bookingDoctor.name} is confirmed.</p>
                  <button onClick={() => { setShowSuccess(false); setBookingDoctor(null); }} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Return to Dashboard</button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-8">
                    <div><h2 className="text-3xl font-bold text-slate-900 mb-1">Schedule Appointment</h2><p className="text-primary font-bold">{bookingDoctor.specialty} · {bookingDoctor.name}</p></div>
                    <button onClick={() => setBookingDoctor(null)} className="p-2 hover:bg-slate-100 rounded-full"><XCircle size={24} className="text-slate-400" /></button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">1. Select Date</label>
                          <div className="flex gap-2">
                            <button onClick={() => setDateOffset((p) => Math.max(0, p - 1))} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronLeft size={20} /></button>
                            <button onClick={() => setDateOffset((p) => Math.min(dates.length - 7, p + 1))} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronRight size={20} /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {visible.map((d) => (
                            <button key={d.full} onClick={() => setDetails({ ...details, date: d.full })} className={`p-2 rounded-xl text-center transition-all ${details.date === d.full ? "bg-primary text-white shadow-lg" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                              <div className="text-[10px] uppercase font-bold opacity-60">{d.dayName}</div>
                              <div className="text-lg font-black">{d.dayNum}</div>
                              <div className="text-[10px] uppercase font-bold opacity-60">{d.month}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">2. Select Time</label>
                        <div className="grid grid-cols-2 gap-2">
                          {slots.map((s) => (
                            <button key={s} onClick={() => setDetails({ ...details, timeSlot: s })} className={`p-2 rounded-xl text-xs font-bold transition-all ${details.timeSlot === s ? "bg-primary text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">3. Patient Info</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Patient Name" value={details.patientName} onChange={(e) => setDetails({ ...details, patientName: e.target.value })} />
                      <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Age" value={details.patientAge} onChange={(e) => setDetails({ ...details, patientAge: e.target.value })} />
                      <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" rows={4} placeholder="Describe your problem..." value={details.problemDescription} onChange={(e) => setDetails({ ...details, problemDescription: e.target.value })} />
                      <button onClick={handleBook} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Confirm Booking</button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
