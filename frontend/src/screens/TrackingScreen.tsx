import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, Circle, Phone,
  ArrowLeft
} from "lucide-react";
import MapView from "../components/MapView";
import { ambulanceUpdates } from "../data/mockData";

interface TrackingScreenProps {
  isDark: boolean;
  onNavigate: (screen: string) => void;
}

export default function TrackingScreen({ isDark, onNavigate }: TrackingScreenProps) {
  const [ambulancePos, setAmbulancePos] = useState({ x: 15, y: 65 });
  const [etaSeconds, setEtaSeconds] = useState(240);
  const [routeProgress, setRouteProgress] = useState(32);
  const [distance, setDistance] = useState(1.8);

  const cardBg = isDark ? "bg-white/[0.04] border-white/[0.07]" : "bg-white/80 border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/50" : "text-gray-500";

  useEffect(() => {
  const interval = setInterval(() => {
  setEtaSeconds((prev) => Math.max(0, prev - 1));

  setDistance((prev) => Math.max(0, prev - 0.01));

  setRouteProgress((prev) => Math.min(100, prev + 0.3));

  setAmbulancePos((prev) => ({
    x: Math.min(85, prev.x + 0.15),
    y: Math.max(38, prev.y - 0.08),
  }));
}, 1000);
    return () => clearInterval(interval);
  }, []);
  const formatETA = (s: number) => {
    const m = Math.floor(s / 60);
    const sec =Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };



  return (
    <div className={`absolute inset-0 ${isDark ? "bg-[#050810]" : "bg-slate-100"} overflow-hidden`}>
      {isDark && (
        <div className="absolute bottom-20 left-0 w-64 h-64 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #dc2626 0%, transparent 70%)", filter: "blur(50px)" }} />
      )}

      <div className="relative z-10 h-full flex flex-col overflow-y-auto" style={{ paddingBottom: "80px" }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate("home")}
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${cardBg} border`}
          >
            <ArrowLeft size={14} className={textPrimary} />
          </motion.button>
          <div>
            <h1 className={`text-xl font-bold ${textPrimary}`}>
  Ambulance On The Way
</h1>

<p className={`text-[12px] ${textSecondary}`}>
  Help is on the way. Stay calm.
</p>
          </div>
          <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-[9px] font-semibold">LIVE</span>
          </div>
        </div>

        {/* Dispatch Status */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mb-4 p-3 rounded-2xl bg-green-500/10 border border-green-500/25 flex items-center gap-2"
        >
          <CheckCircle size={16} className="text-green-400" />
          <div>
            <p className="text-green-400 text-xs font-bold">Dispatch Accepted</p>
            <p className={`text-[10px] ${textSecondary}`}>Paramedic team dispatched — Unit AMB-047</p>
          </div>
          <div className="ml-auto">
            <span className="text-green-400 text-[9px] font-mono font-bold">14:33</span>
          </div>
        </motion.div>

        {/* Map Section */}
        <div className="px-5 mb-4">
          <MapView
            ariaLabel="Live ambulance map"
            className="w-full h-[320px] rounded-3xl relative overflow-hidden border border-white/6 bg-[#0b1220]"
            markers={[
              { id: "ambulance", label: "Ambulance", emoji: "🚑" },
              { id: "you", label: "Your location", emoji: "📍" },
              { id: "hospital", label: "Nearest hospital", emoji: "🏥" },
            ]}
          />
        </div>

        {/* ETA Card */}
        <div className="px-5 mb-4">
          <motion.div
            className={`p-4 rounded-2xl border ${cardBg} relative overflow-hidden`}
            animate={{ borderColor: ["rgba(239,68,68,0.15)", "rgba(239,68,68,0.35)", "rgba(239,68,68,0.15)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5"
              style={{ background: "radial-gradient(circle, #ef4444 0%, transparent 70%)" }} />

            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[10px] font-semibold ${textSecondary} uppercase tracking-wider mb-0.5`}>Estimated Arriving</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black font-orbitron ${etaSeconds < 60 ? "text-red-400" : textPrimary}`}>
                    {formatETA(etaSeconds)}
                  </span>
                  <span className={`text-xs ${textSecondary}`}>min</span>
                </div>
                <p className={`text-[10px] ${textSecondary} mt-0.5`}>Unit POL-911 · 4 OFFICERS</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl">
                <span className="text-3xl">🚑</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-[9px] font-semibold">EN ROUTE</span>
                </div>
              </div>
            </div>

            {/* Route progress */}
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className={`text-[10px] ${textSecondary}`}>Route Progress</span>
                <span className="text-red-400 text-[10px] font-bold">{Math.round(routeProgress)}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"} overflow-hidden`}>
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: "linear-gradient(90deg, #dc2626, #ef4444)",
                    boxShadow: "0 0 8px rgba(239,68,68,0.6)",
                  }}
                  animate={{ width: `${routeProgress}%` }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="absolute right-0 top-0 bottom-0 w-3 bg-white/30 rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between mt-1">
                <span className={`text-[9px] ${textSecondary}`}>Dispatch point</span>
                <span className={`text-[9px] ${textSecondary}`}>Your location</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Updates Timeline */}
        <div className="px-5 mb-4">
          <p className={`text-xs font-bold ${textPrimary} mb-3`}>Live Emergency Updates</p>
          <div className={`p-4 rounded-2xl border ${cardBg}`}>
            {ambulanceUpdates.map((update, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 mb-3 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    update.status === "done"
                      ? "bg-green-500/20 border border-green-500/40"
                      : update.status === "active"
                      ? "bg-red-500/20 border border-red-500/40"
                      : isDark ? "bg-white/5 border border-white/10" : "bg-gray-100 border border-gray-200"
                  }`}>
                    {update.status === "done" ? (
                      <CheckCircle size={10} className="text-green-400" />
                    ) : update.status === "active" ? (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-red-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ) : (
                      <Circle size={10} className={textSecondary} />
                    )}
                  </div>
                  {i < ambulanceUpdates.length - 1 && (
                    <div className={`w-px flex-1 mt-1 min-h-16px ${
                      update.status === "done" ? "bg-green-500/30" : isDark ? "bg-white/5" : "bg-gray-200"
                    }`} />
                  )}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-semibold ${
                      update.status === "active" ? "text-red-400" : update.status === "done" ? textPrimary : textSecondary
                    }`}>{update.message}</p>
                    {update.status === "active" && (
                      <span className="text-[8px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">NOW</span>
                    )}
                  </div>
                  <p className={`text-[10px] ${textSecondary} font-mono mt-0.5`}>{update.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Supporting Services */}
        <div className="px-5 mb-4">
          <p className={`text-xs font-bold ${textPrimary} mb-3`}>Response Units</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Police", unit: "Unit P-22", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", emoji: "👮" },
              { label: "Hospital", unit: "City General", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", emoji: "🏥" },
            ].map((item, i) => {
              return (
                <div key={i} className={`p-3 rounded-2xl border ${item.bg} ${cardBg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.emoji}</span>
                    <div>
                      <p className={`text-[10px] font-bold ${item.color}`}>{item.label}</p>
                      <p className={`text-[9px] ${textSecondary}`}>{item.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20 w-fit">
                    <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-[9px] font-semibold">ALERTED</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency call button */}
        <div className="px-5 mb-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 0 20px rgba(220,38,38,0.3)",
            }}
          >
            <Phone size={16} />
            <span>Call Paramedic Direct</span>
          </motion.button>
        </div>
      </div>
      </div>
  );
}