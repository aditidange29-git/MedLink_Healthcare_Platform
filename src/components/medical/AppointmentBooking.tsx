"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createAppointment } from "@/lib/firestore";

interface Specialist {
  title: string;
  specialty?: string;
  expertise?: string;
  location?: string;
  description?: string;
  availability?: string;
  phone?: string;
  doctorId?: number;
  id?: number;
}

interface Props {
  specialist: Specialist;
  onClose: () => void;
}

const generateTimeSlots = () => {
  const slots: { time: string; available: boolean }[] = [];
  [9, 10, 11, 14, 15, 16, 17].forEach((h) =>
    ["00", "30"].forEach((m) => {
      const period = h >= 12 ? "PM" : "AM";
      const dh = h > 12 ? h - 12 : h;
      slots.push({ time: `${dh}:${m} ${period}`, available: Math.random() > 0.3 });
    })
  );
  return slots;
};

const generateDates = () => {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { date: d, dayName: d.toLocaleDateString("en-US", { weekday: "short" }), dayNum: d.getDate(), month: d.toLocaleDateString("en-US", { month: "short" }) };
  });
};

const hospitalLocations: Record<string, { lat: number; lng: number; address: string }> = {
  "Neurology Center": { lat: 40.7589, lng: -73.9851, address: "123 Brain Ave, New York, NY" },
  "Respiratory Care Center": { lat: 40.7614, lng: -73.9776, address: "456 Lung Street, New York, NY" },
  "Cardiology Center": { lat: 40.7549, lng: -73.9840, address: "789 Heart Blvd, New York, NY" },
  "Orthopedic Surgery Center": { lat: 40.7580, lng: -73.9855, address: "321 Joint Road, New York, NY" },
  default: { lat: 40.7580, lng: -73.9855, address: "Medical Center, New York, NY" },
};

export default function AppointmentBooking({ specialist, onClose }: Props) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<(typeof dates)[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ time: string; available: boolean } | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [offset, setOffset] = useState(0);

  const dates = generateDates();
  const timeSlots = generateTimeSlots();
  const visible = dates.slice(offset, offset + 7);
  const loc = hospitalLocations[specialist.location ?? "default"] ?? hospitalLocations.default;

  const handleConfirm = async () => {
    if (!user) { alert("Please log in to book"); return; }
    if (!selectedDate || !selectedTime) return;
    try {
      const d = selectedDate.date;
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      await createAppointment({
        patientId: user.id,
        doctorId: String(specialist.doctorId ?? specialist.id ?? ""),
        patientName: user.name || user.email,
        patientEmail: user.email,
        patientPhone: user.phone || "",
        doctorName: specialist.title,
        specialty: specialist.specialty ?? specialist.expertise ?? "General",
        location: specialist.location ?? "Medical Center",
        appointmentDate: dateStr,
        appointmentTime: selectedTime.time,
        status: "confirmed",
        notes: "",
      });
      setConfirmed(true);
      setTimeout(onClose, 2500);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div key="booking" className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 relative overflow-hidden">
                <div className="relative flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
                    <p className="text-blue-100">{specialist.title}</p>
                    <p className="text-sm text-blue-200">{specialist.specialty ?? specialist.expertise}</p>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  {/* Date + Time */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold text-slate-800">Select Date</h3></div>
                      <div className="relative">
                        {offset > 0 && <button onClick={() => setOffset((p) => p - 1)} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-50"><ChevronLeft className="w-5 h-5 text-blue-600" /></button>}
                        <div className="grid grid-cols-7 gap-2">
                          {visible.map((d, i) => (
                            <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedDate(d)}
                              className={`p-3 rounded-xl text-center transition-all ${selectedDate?.date.toDateString() === d.date.toDateString() ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg" : "bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-100"}`}>
                              <div className="text-xs font-medium mb-1">{d.dayName}</div>
                              <div className="text-lg font-bold">{d.dayNum}</div>
                              <div className="text-xs opacity-80">{d.month}</div>
                            </motion.button>
                          ))}
                        </div>
                        {offset < dates.length - 7 && <button onClick={() => setOffset((p) => p + 1)} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-50"><ChevronRight className="w-5 h-5 text-blue-600" /></button>}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold text-slate-800">Select Time</h3></div>
                      {selectedDate ? (
                        <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2">
                          {timeSlots.map((slot, i) => (
                            <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                              disabled={!slot.available} onClick={() => setSelectedTime(slot)}
                              className={`p-3 rounded-xl text-sm font-medium transition-all ${!slot.available ? "bg-slate-100 text-slate-400 cursor-not-allowed line-through" : selectedTime?.time === slot.time ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-lg" : "bg-white border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-slate-700"}`}>
                              {slot.time}
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-xl"><Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500 text-sm">Please select a date first</p></div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <div className="flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold text-slate-800">Location</h3></div>
                    <div className="rounded-2xl overflow-hidden border-4 border-slate-100 shadow-lg">
                      <div className="h-[300px] bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center relative">
                        <div className="text-center">
                          <MapPin size={48} className="text-green-500 mx-auto mb-3" />
                          <p className="font-semibold text-slate-800">{specialist.location ?? "Medical Center"}</p>
                          <p className="text-sm text-slate-600 mt-1">{loc.address}</p>
                          <p className="text-xs text-slate-500 mt-1">Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}</p>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-xl p-4 shadow-xl">
                          <p className="font-semibold text-slate-800">{specialist.location ?? "Medical Center"}</p>
                          <p className="text-sm text-slate-600 mt-1">{loc.address}</p>
                          {specialist.availability && <div className="mt-3 px-3 py-1 bg-blue-50 rounded-lg text-xs text-blue-700 font-medium inline-block">{specialist.availability}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 p-6 bg-slate-50">
                <div className="flex justify-between items-center">
                  <div>
                    {selectedDate && selectedTime && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-sm">
                        <p className="text-slate-600">Selected:</p>
                        <p className="font-semibold text-slate-800">{selectedDate.dayName}, {selectedDate.month} {selectedDate.dayNum} at {selectedTime.time}</p>
                      </motion.div>
                    )}
                  </div>
                  <Button onClick={handleConfirm} disabled={!selectedDate || !selectedTime} className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                    Confirm Appointment
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-16 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200">
                <CheckCircle size={50} className="text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Appointment Booked! ✅</h2>
              <p className="text-slate-500 text-lg">Your slot with {specialist.title} is confirmed.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
