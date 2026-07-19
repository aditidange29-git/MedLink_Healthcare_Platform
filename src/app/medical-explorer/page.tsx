"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { diseasesData, specialistsInfo, type Disease } from "@/data/medicalData";
import AppointmentBooking from "@/components/medical/AppointmentBooking";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function MedicalExplorer() {
  const [activeLetter, setActiveLetter] = useState("A");
  const [search, setSearch] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(null);
  const [bookingSpecialist, setBookingSpecialist] = useState<{ title: string; specialty: string; expertise: string; location: string; description: string; availability: string } | null>(null);

  const diseases: Disease[] = search
    ? Object.values(diseasesData).flat().filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()))
    : diseasesData[activeLetter] || [];

  const handleBookSpecialist = (name: string) => {
    const info = specialistsInfo[name];
    if (info) setBookingSpecialist({ title: name, specialty: info.expertise, expertise: info.expertise, location: info.location, description: info.description, availability: info.availability });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">Medical Explorer</h1>
        <p className="text-slate-600 mb-8">Search diseases and find the right specialist for your needs.</p>

        {/* Search */}
        <div className="relative max-w-2xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search diseases, conditions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-green-200 focus:border-green-400 focus:outline-none bg-white shadow-sm text-slate-800" />
        </div>

        {/* Alphabet picker */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-8">
            {LETTERS.map((l) => (
              <button key={l} onClick={() => setActiveLetter(l)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${activeLetter === l ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200" : "bg-white text-slate-600 border-2 border-slate-200 hover:border-green-300"} ${!diseasesData[l]?.length ? "opacity-30 cursor-not-allowed" : ""}`} disabled={!diseasesData[l]?.length}>{l}</button>
            ))}
          </div>
        )}

        {/* Disease cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {diseases.map((disease, i) => (
            <div key={i} className="premium-card p-6 group cursor-pointer hover:-translate-y-2 transition-all" onClick={() => setSelectedSpecialist(selectedSpecialist === disease.name ? null : disease.name)}>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{disease.name}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{disease.description}</p>
              <div className="flex flex-wrap gap-2">
                {disease.specialists.map((s, j) => (
                  <button key={j} onClick={(e) => { e.stopPropagation(); handleBookSpecialist(s); }} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold hover:bg-green-200 transition-colors">{s}</button>
                ))}
              </div>
            </div>
          ))}
          {diseases.length === 0 && <div className="col-span-3 text-center py-12 text-slate-500">No diseases found for &quot;{search}&quot;</div>}
        </div>

        {/* Specialist info panel */}
        {selectedSpecialist && (() => {
          const disease = diseases.find((d) => d.name === selectedSpecialist);
          if (!disease) return null;
          return (
            <div className="skeuo-card mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Specialists for {disease.name}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disease.specialists.map((name, i) => {
                  const info = specialistsInfo[name];
                  if (!info) return null;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4">{name.charAt(0)}</div>
                      <h3 className="font-bold text-slate-800 mb-1">{name}</h3>
                      <p className="text-green-600 text-sm font-medium mb-2">{info.expertise}</p>
                      <p className="text-slate-500 text-sm mb-3 line-clamp-2">{info.description}</p>
                      <div className="text-xs text-slate-400 mb-3">{info.availability} · {info.location}</div>
                      <button onClick={() => handleBookSpecialist(name)} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg text-sm font-bold hover:scale-105 transition-transform">Book Appointment</button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
      {bookingSpecialist && <AppointmentBooking specialist={bookingSpecialist} onClose={() => setBookingSpecialist(null)} />}
    </div>
  );
}
