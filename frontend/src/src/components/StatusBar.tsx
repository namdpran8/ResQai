import { Wifi, Battery, Signal } from "lucide-react";

interface StatusBarProps {
  isDark: boolean;
}

export default function StatusBar({ isDark }: StatusBarProps) {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      className={`flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold z-50 relative ${
        isDark ? "text-white/70" : "text-gray-600"
      }`}
    >
      <span className="font-orbitron">{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={12} />
        <Wifi size={12} />
        <Battery size={14} />
      </div>
    </div>
  );
}
