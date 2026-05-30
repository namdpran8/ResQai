import React from "react";
import { Settings } from "lucide-react";

interface DemoToggleProps {
  onSeed?: () => void;
}

export default function DemoToggle({ onSeed }: DemoToggleProps) {
  return (
    <button
      aria-label="Open demo mode"
      title="Demo mode"
      onClick={() => onSeed && onSeed()}
      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/5 border border-white/6 flex items-center justify-center z-50"
    >
      <Settings size={16} className="text-white/80" />
    </button>
  );
}
