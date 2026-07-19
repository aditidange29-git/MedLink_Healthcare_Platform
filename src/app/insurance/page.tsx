"use client";
import { useState } from "react";
import { ShieldCheck, Star, Check } from "lucide-react";
import { insurancePlans, getInsuranceByAge, getAgeGroups } from "@/data/insuranceData";

export default function Insurance() {
  const [age, setAge] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const ageGroups = getAgeGroups();
  const filtered = age ? getInsuranceByAge(Number(age)) : selectedGroup ? insurancePlans.filter((p) => p.ageGroup === selectedGroup) : insurancePlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"><ShieldCheck className="text-white w-8 h-8" /></div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Insurance Plans</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Find the perfect health insurance plan tailored to your age and healthcare needs.</p>
        </div>

        <div className="skeuo-card mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Enter Your Age</label>
              <input type="number" placeholder="e.g. 28" min={0} max={100} value={age} onChange={(e) => { setAge(e.target.value); setSelectedGroup(""); }} className="skeuo-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Or Browse by Age Group</label>
              <select value={selectedGroup} onChange={(e) => { setSelectedGroup(e.target.value); setAge(""); }} className="skeuo-input w-full">
                <option value="">All Age Groups</option>
                {ageGroups.map((g) => <option key={g} value={g}>{g} years</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => { setAge(""); setSelectedGroup(""); }} className="skeuo-button w-full">Show All Plans</button>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">Showing {filtered.length} plan{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((plan) => (
            <div key={plan.id} className="premium-card p-8 hover:-translate-y-2 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.provider}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">{plan.ageGroup} yrs</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-extrabold text-slate-900">${plan.monthlyPremium}</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <p className="text-green-600 font-bold text-sm mb-4">Coverage: {plan.coverage}</p>
              <div className="flex items-center gap-1 mb-6">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-slate-700">{plan.rating}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600"><Check size={14} className="text-green-500 shrink-0" />{f}</li>
                ))}
              </ul>
              <button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-yellow-200">Get This Plan</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
