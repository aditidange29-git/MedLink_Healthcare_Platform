"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Mic, MicOff, Video, VideoOff, Copy, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useWebRTC from "@/hooks/useWebRTC";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import useSignLanguage from "@/hooks/useSignLanguage";
import SubtitleOverlay from "@/components/SubtitleOverlay";

export default function LiveAssistant() {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<"sign" | "voice" | null>(null);
  const [roomId, setRoomId] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const [localTranslation, setLocalTranslation] = useState("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { localStream, remoteStream, isConnected, error: webrtcError, joinRoom, leaveRoom, toggleAudio, toggleVideo, sendData } = useWebRTC(roomId);
  const { transcript, error: speechError, startListening, stopListening } = useSpeechRecognition();
  const { detectedSign, isDetecting, error: signError, startDetection, stopDetection } = useSignLanguage(localVideoRef);

  useEffect(() => { setRoomId(Math.random().toString(36).substring(2, 10)); }, []);
  useEffect(() => { if (localStream && localVideoRef.current) localVideoRef.current.srcObject = localStream; }, [localStream]);
  useEffect(() => { if (remoteStream && remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream; }, [remoteStream]);
  useEffect(() => {
    if (isConnected) { timerRef.current = setInterval(() => setCallDuration((p) => p + 1), 1000); }
    else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isConnected]);
  useEffect(() => { if (transcript && isConnected && role === "voice") sendData({ type: "speech-transcript", text: transcript }); }, [transcript, isConnected, role, sendData]);
  useEffect(() => {
    if (detectedSign && isConnected && role === "sign") {
      setLocalTranslation(detectedSign); sendData({ type: "sign-translation", text: detectedSign });
      try { const u = new SpeechSynthesisUtterance(detectedSign); u.lang = "en-US"; window.speechSynthesis.speak(u); } catch { /* ignore */ }
    }
  }, [detectedSign, isConnected, role, sendData]);

  const handleJoin = async () => {
    if (!role) { alert("Please select your communication mode"); return; }
    if (!user) { alert("Please login to use Live Assistant"); router.push("/login"); return; }
    try {
      await joinRoom(user.id, role); setIsJoined(true);
      if (role === "voice") startListening(); else startDetection();
    } catch { /* handled by hook */ }
  };

  const handleEnd = () => { stopListening(); stopDetection(); leaveRoom(); router.push("/"); };
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-green-900/20 to-emerald-900/20 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-bold text-lg">Live Assist Call</h2>
          {isConnected && <span className="text-green-400 text-sm flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />Connected · {fmt(callDuration)}</span>}
        </div>
        <button onClick={handleEnd} className="p-2 rounded-full bg-white/10 hover:bg-red-500 text-white transition-all hover:scale-110" aria-label="Close"><X size={24} /></button>
      </div>

      {!isJoined ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Communication Mode</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {(["sign", "voice"] as const).map((r) => (
                <button key={r} onClick={() => setRole(r)} className={`p-8 rounded-2xl border-2 transition-all ${role === r ? r === "sign" ? "border-purple-500 bg-purple-500/20" : "border-blue-500 bg-blue-500/20" : "border-white/20 bg-white/5 hover:bg-white/10"}`}>
                  <div className="text-6xl mb-4">{r === "sign" ? "🤟" : "🎤"}</div>
                  <h4 className="text-xl font-bold text-white mb-2">{r === "sign" ? "Sign Language" : "Voice"}</h4>
                  <p className={`text-sm ${r === "sign" ? "text-purple-200" : "text-blue-200"}`}>{r === "sign" ? "I will use sign language to communicate" : "I will use my voice to communicate"}</p>
                </button>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-white text-sm mb-2">Room ID:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/30 px-4 py-2 rounded-lg text-purple-300 font-mono">{roomId}</code>
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/live-assistant?room=${roomId}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-2">
                  {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
            <button onClick={handleJoin} disabled={!role} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Join Call</button>
            {(webrtcError || speechError || signError) && <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">{webrtcError || speechError || signError}</div>}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex relative">
          <div className="flex-1 relative bg-black">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4"><Video size={40} className="text-white/50" /></div>
                  <p className="text-white/70">Waiting for other user...</p>
                </div>
              </div>
            )}
            {role === "sign" && <SubtitleOverlay subtitles={[]} />}
            <div className="absolute bottom-6 left-6 w-64 h-48 bg-black rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {isVideoOff && <div className="absolute inset-0 bg-slate-800 flex items-center justify-center"><VideoOff size={32} className="text-white/50" /></div>}
            </div>
          </div>
          <div className="w-96 bg-black/50 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto">
            {role === "sign" ? (
              <div>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><span className="text-2xl">🤟</span>Your Sign Translation</h4>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 min-h-[100px]">
                  {isDetecting ? <p className="text-purple-200 text-lg">{localTranslation || "Detecting signs..."}</p> : <p className="text-white/50 italic">Sign detection paused</p>}
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><span className="text-2xl">🎤</span>Your Speech Transcript</h4>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 min-h-[100px]">
                  <p className="text-blue-200">{transcript || "Listening..."}</p>
                </div>
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <button onClick={() => { toggleAudio(); setIsMuted(!isMuted); }} className={`flex-1 p-4 rounded-xl font-bold text-sm transition-all ${isMuted ? "bg-red-500/20 border border-red-500/30 text-red-300" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"}`}>{isMuted ? <><MicOff size={20} className="mx-auto mb-1" />Unmute</> : <><Mic size={20} className="mx-auto mb-1" />Mute</>}</button>
              <button onClick={() => { toggleVideo(); setIsVideoOff(!isVideoOff); }} className={`flex-1 p-4 rounded-xl font-bold text-sm transition-all ${isVideoOff ? "bg-red-500/20 border border-red-500/30 text-red-300" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"}`}>{isVideoOff ? <><Video size={20} className="mx-auto mb-1" />Show Video</> : <><VideoOff size={20} className="mx-auto mb-1" />Hide Video</>}</button>
            </div>
            <button onClick={handleEnd} className="w-full mt-4 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors">End Call</button>
          </div>
        </div>
      )}
    </div>
  );
}
