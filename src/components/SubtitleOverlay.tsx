"use client";
import { useEffect, useState } from "react";

interface Sub { id: number; text: string }

export default function SubtitleOverlay({ subtitles }: { subtitles: string[] }) {
  const [shown, setShown] = useState<Sub[]>([]);
  useEffect(() => {
    if (!subtitles?.length) return;
    const s: Sub = { id: Date.now(), text: subtitles[subtitles.length - 1] };
    setShown((p) => [...p, s]);
    setTimeout(() => setShown((p) => p.filter((x) => x.id !== s.id)), 5000);
  }, [subtitles]);
  if (!shown.length) return null;
  return (
    <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-2 px-6 pointer-events-none">
      {shown.map((s) => (
        <div key={s.id} className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-xl max-w-4xl">
          <p className="text-white text-xl font-medium text-center leading-relaxed">{s.text}</p>
        </div>
      ))}
    </div>
  );
}
