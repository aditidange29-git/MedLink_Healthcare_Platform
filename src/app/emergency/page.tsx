"use client";
import { Phone, MapPin, Clock, AlertCircle, Navigation, Ambulance } from "lucide-react";

const hospitals = [
  { id: 1, name: "City General Hospital", distance: "2.3 km", phone: "+91-40-2345-6789", available: true, address: "Banjara Hills, Hyderabad" },
  { id: 2, name: "Apollo Emergency Center", distance: "3.1 km", phone: "+91-40-2345-6790", available: true, address: "Jubilee Hills, Hyderabad" },
  { id: 3, name: "Care Hospital Emergency", distance: "4.5 km", phone: "+91-40-2345-6791", available: false, address: "Gachibowli, Hyderabad" },
  { id: 4, name: "Yashoda Hospital", distance: "5.2 km", phone: "+91-40-2345-6792", available: true, address: "Somajiguda, Hyderabad" },
];

const contacts = [
  { service: "Ambulance", number: "108", color: "from-red-500 to-rose-500" },
  { service: "Police", number: "100", color: "from-blue-500 to-indigo-500" },
  { service: "Fire", number: "101", color: "from-orange-500 to-red-500" },
  { service: "Women Helpline", number: "1091", color: "from-purple-500 to-pink-500" },
];

export default function Emergency() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <AlertCircle size={48} className="animate-pulse" />
            <div>
              <h1 className="text-3xl font-bold mb-2">24/7 Emergency Services</h1>
              <p className="text-red-100">Immediate medical assistance available round the clock</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Emergency Hotlines</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {contacts.map((c, i) => (
              <div key={i} onClick={() => window.confirm(`Call ${c.number}?`) && (window.location.href = `tel:${c.number}`)}
                className="bg-white/90 rounded-2xl p-6 shadow-lg border-2 border-red-200 hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">
                <div className={`w-16 h-16 bg-gradient-to-br ${c.color} rounded-full flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  {c.service === "Ambulance" ? <Ambulance size={32} /> : <Phone size={32} />}
                </div>
                <h3 className="text-lg font-bold text-slate-800 text-center mb-2">{c.service}</h3>
                <p className={`text-3xl font-bold text-center bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>{c.number}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Nearby Hospitals</h2>
            <button className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700"><Navigation size={20} />Use My Location</button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {hospitals.map((h) => (
              <div key={h.id} className="bg-white/90 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{h.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={14} />{h.address}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${h.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{h.available ? "Available" : "Full"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Clock size={14} />{h.distance}</span>
                    <span className="flex items-center gap-1"><Phone size={14} />{h.phone}</span>
                  </div>
                  <button onClick={() => window.confirm(`Call ambulance at ${h.name}?`) && (window.location.href = `tel:${h.phone}`)}
                    disabled={!h.available} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${h.available ? "bg-red-500 text-white hover:bg-red-600" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                    {h.available ? "Call Ambulance" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
