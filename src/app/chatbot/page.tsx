"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Send, Bot, User } from "lucide-react";

interface Message { id: number; text: string; sender: "bot" | "user"; }

const getResponse = (msg: string) => {
  const m = msg.toLowerCase();
  if (m.includes("appointment") || m.includes("book")) return "I can help you book an appointment! Visit our 'Find Doctors' page to select a specialist and schedule your appointment.";
  if (m.includes("doctor") || m.includes("find")) return "We have 96+ doctors across 8 specialties including Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, Ophthalmology, Dental, and General Medicine.";
  if (m.includes("emergency") || m.includes("urgent")) return "For emergencies, please call 911 immediately. You can also visit our Emergency page for nearby hospitals.";
  if (m.includes("department")) return "We offer: Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, Ophthalmology, Dental, and General Medicine.";
  if (m.includes("video") || m.includes("call") || m.includes("live")) return "Our Live Assistant feature allows video consultations with sign language and speech recognition support. Click 'Live Assistant' in the Services menu!";
  if (m.includes("hello") || m.includes("hi") || m.includes("hey")) return "Hello! How can I assist you with your healthcare needs today?";
  if (m.includes("thank")) return "You're welcome! Is there anything else I can help you with?";
  return "I'm here to help! You can ask me about booking appointments, finding doctors, emergency services, or our departments.";
};

export default function ChatBotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([{ id: 1, text: "Hello! I'm MedLink Assistant. How can I help you today?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const quickReplies = ["Book an appointment", "Find a doctor", "Emergency services", "View departments"];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((p) => [...p, { id: Date.now(), text: input, sender: "user" }]);
    const q = input; setInput(""); setIsTyping(true);
    setTimeout(() => { setMessages((p) => [...p, { id: Date.now() + 1, text: getResponse(q), sender: "bot" }]); setIsTyping(false); }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[calc(100vh-8rem)] bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-green-200">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><Bot size={24} className="text-green-600" /></div>
            <div><h3 className="text-white font-bold text-lg">MedLink Assistant</h3><p className="text-green-100 text-xs">Online · Ready to help</p></div>
          </div>
          <button onClick={() => router.push("/")} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110" aria-label="Close"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "bot" ? "bg-gradient-to-br from-green-500 to-emerald-500" : "bg-gradient-to-br from-slate-500 to-slate-600"}`}>
                {msg.sender === "bot" ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
              </div>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === "bot" ? "bg-white border border-green-200 text-slate-800" : "bg-gradient-to-r from-green-600 to-emerald-600 text-white"}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"><Bot size={16} className="text-white" /></div>
              <div className="bg-white border border-green-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 0.2, 0.4].map((d, i) => <span key={i} className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 2 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-600 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((r, i) => <button key={i} onClick={() => setInput(r)} className="px-3 py-1.5 bg-white border border-green-200 rounded-full text-xs text-slate-700 hover:bg-green-50 hover:border-green-300 transition-all">{r}</button>)}
            </div>
          </div>
        )}

        <div className="border-t border-green-200 bg-white px-6 py-4">
          <div className="flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type your message..." className="flex-1 px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-400 bg-green-50/50" />
            <button onClick={handleSend} disabled={!input.trim()} className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"><Send size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
