import React, { useEffect } from "react";

interface Props { onDone?: () => void }

export default function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 700);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-2xl bg-red-600/90 flex items-center justify-center shadow-lg">
          <span className="text-2xl font-black">RS</span>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">RoadSoS</p>
          <p className="text-xs text-white/70">Emergency dispatch & triage, simplified</p>
        </div>
      </div>
    </div>
  );
}
