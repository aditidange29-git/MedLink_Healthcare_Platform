"use client";
import { useState } from "react";
import { Briefcase, MapPin, Clock, ChevronDown, ChevronUp, Send } from "lucide-react";

const jobs = [
  { id: 1, title: "Senior Cardiologist", department: "Cardiology", location: "New York, NY", type: "Full-time", desc: "Lead cardiac care team and perform advanced interventional procedures.", requirements: ["MD with Cardiology specialization", "10+ years experience", "Board certified"] },
  { id: 2, title: "Pediatric Nurse Practitioner", department: "Pediatrics", location: "San Francisco, CA", type: "Full-time", desc: "Provide comprehensive care to pediatric patients in a fast-paced environment.", requirements: ["NP license", "Pediatric experience", "Excellent communication skills"] },
  { id: 3, title: "Health IT Specialist", department: "Technology", location: "Remote", type: "Full-time", desc: "Develop and maintain our healthcare management platform.", requirements: ["5+ years software development", "Healthcare domain experience", "React/Node.js expertise"] },
  { id: 4, title: "Clinical Research Coordinator", department: "Research", location: "Boston, MA", type: "Contract", desc: "Coordinate clinical trials and research studies across multiple departments.", requirements: ["Bachelor's in Life Sciences", "GCP certification", "2+ years research experience"] },
  { id: 5, title: "Medical Social Worker", department: "Patient Services", location: "Chicago, IL", type: "Part-time", desc: "Support patients and families navigating complex healthcare systems.", requirements: ["MSW degree", "Healthcare setting experience", "Strong counseling skills"] },
  { id: 6, title: "Radiology Technologist", department: "Radiology", location: "Houston, TX", type: "Full-time", desc: "Perform diagnostic imaging procedures with precision and care.", requirements: ["ARRT certification", "3+ years experience", "MRI/CT proficiency"] },
];

export default function Careers() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [applied, setApplied] = useState<Set<number>>(new Set());

  const apply = (id: number) => {
    setApplied((p) => new Set([...p, id]));
    alert("Application submitted! We will contact you soon.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">Join MedLink</h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Be part of a team transforming healthcare through technology and compassion.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[["🌍", "Global Impact", "Serve patients across the world"], ["💡", "Innovation First", "Work with cutting-edge healthcare tech"], ["❤️", "Great Culture", "Collaborative, inclusive, and supportive"]].map(([icon, title, desc], i) => (
            <div key={i} className="premium-card p-6 text-center">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Open Positions ({jobs.length})</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <button onClick={() => setExpanded(expanded === job.id ? null : job.id)} className="w-full p-6 text-left flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{job.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Briefcase size={14} />{job.department}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} />{job.type}</span>
                  </div>
                </div>
                {expanded === job.id ? <ChevronUp size={20} className="text-slate-400 mt-1 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 mt-1 shrink-0" />}
              </button>
              {expanded === job.id && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                  <p className="text-slate-600 mb-4">{job.desc}</p>
                  <h4 className="font-bold text-slate-800 mb-3">Requirements:</h4>
                  <ul className="space-y-2 mb-6">{job.requirements.map((r, i) => <li key={i} className="flex items-center gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" />{r}</li>)}</ul>
                  <button onClick={() => apply(job.id)} disabled={applied.has(job.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${applied.has(job.id) ? "bg-green-100 text-green-700 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105 shadow-lg"}`}>
                    <Send size={16} />{applied.has(job.id) ? "Application Submitted ✓" : "Apply Now"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
