import React from "react";
import { AlertTriangle } from "lucide-react";

interface Props { onClick?: () => void }

export default function FloatingSOSButton({ onClick }: Props) {
  return (
    <button
      onClick={() => onClick && onClick()}
      aria-label="Open SOS"
      className="absolute right-4 bottom-20 w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-500 shadow-lg flex items-center justify-center z-50 border border-red-400/20"
    >
      <AlertTriangle size={24} className="text-white" />
    </button>
  );
}
