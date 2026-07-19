"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";
import { Globe, LogOut, User as UserIcon, ChevronDown, Video, MessageCircle } from "lucide-react";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [servicesOpen, setServicesOpen] = useState(false);

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value).then(() => window.location.reload());
  };

  const handleLogout = async () => { await logout(); router.push("/"); };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <circle cx="12" cy="7" r="3" /><path d="M12 10 L12 18" /><path d="M8 13 L12 11 L16 13" />
              <path d="M12 13 L12 15" strokeWidth="1.5" /><path d="M11 14 L13 14" strokeWidth="1.5" />
            </svg>
          </div>
          MedLink
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <Link href="/medical-explorer" className="hover:text-green-600 transition-colors">Medical Explorer</Link>
          <Link href="/appointments" className="hover:text-green-600 transition-colors">Appointments</Link>
          <Link href="/emergency" className="hover:text-green-600 transition-colors flex items-center gap-1">
            <span className="animate-pulse">🚨</span> Emergency
          </Link>
          {/* Services dropdown */}
          <div className="relative">
            <button onClick={() => setServicesOpen(!servicesOpen)} onMouseEnter={() => setServicesOpen(true)}
              className="hover:text-green-600 transition-colors flex items-center gap-1">
              Services <ChevronDown size={16} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-green-100 py-2 z-50"
                onMouseLeave={() => setServicesOpen(false)}>
                <div className="px-3 py-2"><p className="text-xs font-bold text-green-600 uppercase tracking-wider">Medical Services</p></div>
                <Link href="/doctors" className="block px-4 py-3 hover:bg-green-50 text-slate-700 hover:text-green-600" onClick={() => setServicesOpen(false)}>Find Doctors</Link>
                <Link href="/departments" className="block px-4 py-3 hover:bg-green-50 text-slate-700 hover:text-green-600" onClick={() => setServicesOpen(false)}>{t("departments")}</Link>
                <div className="border-t border-green-100 my-2" />
                <div className="px-3 py-2"><p className="text-xs font-bold text-green-600 uppercase tracking-wider">Our Features</p></div>
                <button onClick={() => { setServicesOpen(false); router.push("/live-assistant"); }}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 text-slate-700 hover:text-green-600 flex items-center gap-2">
                  <Video size={16} className="text-green-500" /><span>Live Assistant</span>
                </button>
                <button onClick={() => { setServicesOpen(false); router.push("/chatbot"); }}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 text-slate-700 hover:text-green-600 flex items-center gap-2">
                  <MessageCircle size={16} className="text-green-500" /><span>AI ChatBot</span>
                </button>
                <Link href="/face-analysis" className="block px-4 py-3 hover:bg-green-50 text-slate-700 hover:text-green-600" onClick={() => setServicesOpen(false)}>Face Analysis</Link>
              </div>
            )}
          </div>
          <Link href="/careers" className="hover:text-green-600 transition-colors">Careers</Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-3 py-1.5 text-sm">
            <Globe size={16} className="text-green-500" />
            <select onChange={changeLanguage} defaultValue={i18n.language}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-700" aria-label="Select language">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-2xl border border-green-200">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-900 leading-none truncate max-w-[80px]">{user.name || "User"}</span>
                  <span className="text-[8px] font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent uppercase tracking-wider">{user.role || "patient"}</span>
                </div>
              </div>
              <Link href={user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}
                className="hidden md:flex items-center gap-2 text-green-600 font-medium hover:scale-105 transition-transform">
                <UserIcon size={18} /><span>Portal</span>
              </Link>
              <button onClick={handleLogout} className="hidden md:block p-2 text-slate-400 hover:text-rose-500 transition-colors" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95">
              Login to Portal
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
