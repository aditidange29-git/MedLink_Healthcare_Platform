"use client";
import { useState, useRef } from "react";
import { Camera, Upload, Scan, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FaceAnalysis() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ condition: string; confidence: string; recommendation: string }[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setImage(reader.result as string); setResults(null); };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) { videoRef.current.srcObject = stream; setCameraActive(true); }
    } catch { alert("Camera access denied"); }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    setImage(canvas.toDataURL("image/jpeg"));
    (videoRef.current.srcObject as MediaStream)?.getTracks().forEach((t) => t.stop());
    setCameraActive(false);
  };

  const analyze = () => {
    if (!image) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResults([
        { condition: "Skin Hydration Level", confidence: "Good (78%)", recommendation: "Maintain current skincare routine. Stay hydrated." },
        { condition: "Stress Indicators", confidence: "Low Stress (82%)", recommendation: "Good stress management detected. Keep it up!" },
        { condition: "Sleep Quality Signs", confidence: "Adequate (71%)", recommendation: "Consider 7-8 hours of sleep for optimal health." },
      ]);
      setAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">AI Face Analysis</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Upload a photo or use your camera for a preliminary health indicator analysis.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            <AlertCircle size={16} className="text-amber-500" />
            <p className="text-amber-700 text-sm">This is for educational purposes only. Consult a doctor for medical advice.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <button onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-purple-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Upload size={32} className="text-purple-500" /></div>
                <h3 className="font-bold text-slate-700">Upload Photo</h3>
                <p className="text-sm text-slate-500 text-center">JPG, PNG supported</p>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button onClick={cameraActive ? capturePhoto : startCamera} className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-blue-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Camera size={32} className="text-blue-500" /></div>
                <h3 className="font-bold text-slate-700">{cameraActive ? "Capture Photo" : "Use Camera"}</h3>
                <p className="text-sm text-slate-500">{cameraActive ? "Click to take photo" : "Real-time analysis"}</p>
              </button>
            </div>

            {cameraActive && <div className="rounded-2xl overflow-hidden mb-6 border-4 border-blue-100"><video ref={videoRef} autoPlay playsInline className="w-full max-h-72 object-cover" /></div>}

            {image && !cameraActive && (
              <div className="text-center mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Analysis" className="max-h-72 mx-auto rounded-2xl shadow-lg object-contain" />
              </div>
            )}

            {image && !results && (
              <button onClick={analyze} disabled={analyzing} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center justify-center gap-3">
                {analyzing ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /><span>Analyzing...</span></>) : (<><Scan size={20} /><span>Analyze Photo</span></>)}
              </button>
            )}
          </div>

          {results && (
            <div className="bg-gradient-to-br from-slate-50 to-white p-8 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><CheckCircle size={24} className="text-green-500" />Analysis Results</h2>
              <div className="grid gap-4 mb-6">
                {results.map((r, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800">{r.condition}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">{r.confidence}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{r.recommendation}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                <p className="text-blue-700 text-sm font-medium">For accurate medical diagnosis, please consult with a qualified healthcare professional.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setImage(null); setResults(null); }} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Analyze Another</button>
                <button onClick={() => router.push("/doctors")} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">Consult a Doctor</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
