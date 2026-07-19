"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) { setIsSupported(false); return; }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++)
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
      if (final) setTranscript((p) => p + final);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onerror = (e: any) => { setError(String(e.error)); setIsListening(false); };
    r.onend = () => setIsListening(false);
    recRef.current = r;

    return () => { try { r.stop(); } catch { /* ignore */ } };
  }, []);

  const startListening = useCallback(() => {
    if (!recRef.current || !isSupported) return;
    try { recRef.current.start(); setIsListening(true); } catch { /* already started */ }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!recRef.current) return;
    try { recRef.current.stop(); setIsListening(false); } catch { /* ignore */ }
  }, []);

  return { isListening, transcript, isSupported, error, startListening, stopListening };
}
