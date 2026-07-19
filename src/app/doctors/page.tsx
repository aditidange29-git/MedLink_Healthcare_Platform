"use client";
import { useState, useEffect } from "react";
import { Search, MapPin, Star, Phone } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { doctorsData, getAllSpecialties, searchDoctors, type Doctor } from "@/data/doctorsData";
import AppointmentBooking from "@/components/medical/AppointmentBooking";

interface Specialist { title: string; specialty: string; location: string; expertise: string; description: string; availability: string; phone?: string; doctorId?: number; }

export default function FindDoctors() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filtered, setFiltered] = useState<Doctor[]>(doctorsData);
  const [selectedDoctor, setSelectedDoctor] = useState<Specialist | null>(null);
  const [filters, setFilters] = useState({ specialty: searchParams.get("specialty") || "", city: searchParams.get("city") || "", search: "" });

  const specialties = getAllSpecialties();
  const cities = [...new Set(doctorsData.map((d) => d.location))].sort();

  useEffect(() => {
    let result = doctorsData;
    if (filters.specialty) result = result.filter((d) => d.specialty === filters.specialty);
    if (filters.city) result = result.filter((d) => d.location === filters.city);
    if (filters.search) result = searchDoctors(filters.search);
    setFiltered(result);
  }, [filters]);

  const set = (k: string, v: string) => setFilters((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-8">Find Doctors</h1>
        <div className="skeuo-card mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input type="text" placeholder="Search doctors..." value={filters.search} onChange={(e) => set("search", e.target.value)} className="skeuo-input w-full pl-10" />
            </div>
            <select value={filters.specialty} onChange={(e) => set("specialty", e.target.value)} className="skeuo-input">
              <option value="">All Specialties</option>
              {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filters.city} onChange={(e) => set("city", e.target.value)} className="skeuo-input">
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => setFilters({ specialty: "", city: "", search: "" })} className="skeuo-button">Clear Filters</button>
          </div>
          <div className="mt-4 text-sm text-slate-600">Showing {filtered.length} of {doctorsData.length} doctors</div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doctor) => (
            <div key={doctor.id} className="premium-card p-6 hover:border-green-300 transition-all hover:-translate-y-2 cursor-pointer" onClick={() => router.push(`/doctor/${doctor.id}`)}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {doctor.name.split(" ")[1]?.charAt(0) || "D"}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">{doctor.name}</h3>
                  <p className="text-green-600 font-medium">{doctor.specialty}</p>
                  <div className="flex items-center gap-1 mt-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /><span className="text-sm text-slate-600">{doctor.rating}</span></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} className="text-green-500" /><span>{doctor.location}</span></div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Phone size={16} className="text-green-500" /><span>{doctor.phone}</span></div>
                <div className="text-sm text-slate-500">Experience: {doctor.experience}</div>
              </div>
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">Know More</button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-slate-600 text-lg">No doctors found matching your criteria</p></div>}
      </div>
      {selectedDoctor && <AppointmentBooking specialist={selectedDoctor} onClose={() => setSelectedDoctor(null)} />}
    </div>
  );
}
