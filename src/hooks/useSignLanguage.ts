"use client";
import { useState, useRef, useCallback, useEffect, type RefObject } from "react";

export default function useSignLanguage(videoElement: RefObject<HTMLVideoElement | null>) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSign, setDetectedSign] = useState("");
  const [error] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const detectSign = useCallback(() => {
    const signs = ["Hello", "Thank you", "Yes", "No", "Help", "Please"];
    return signs[Math.floor(Math.random() * signs.length)];
  }, []);

  const startDetection = useCallback(() => {
    if (!videoElement || isDetecting) return;
    setIsDetecting(true);
    intervalRef.current = setInterval(() => {
      setDetectedSign(detectSign());
    }, 2000);
  }, [videoElement, isDetecting, detectSign]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setIsDetecting(false);
  }, []);

  useEffect(() => () => stopDetection(), [stopDetection]);

  return { isDetecting, detectedSign, isModelLoaded: true, error, startDetection, stopDetection };
}
