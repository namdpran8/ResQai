import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, Circle, Phone,
  ArrowLeft, MapPin
} from "lucide-react";
import { ambulanceUpdates } from "../data/mockData";

interface TrackingScreenProps {
  isDark: boolean;
  onNavigate: (screen: string) => void;
}

export default function TrackingScreen({ isDark, onNavigate }: TrackingScreenProps) {
  const [ambulancePos, setAmbulancePos] = useState({ x: 15, y: 65 });
  const [etaSeconds, setEtaSeconds] = useState(243);
  const [routeProgress, setRouteProgress] = useState(32);

  const cardBg = isDark ? "bg-white/[0.04] border-white/[0.07]" : "bg-white/80 border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/50" : "text-gray-500";

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaSeconds((prev) => Math.max(0, prev - 1));
      setRouteProgress((prev) => Math.min(100, prev + 0.3));
      setAmbulancePos((prev) => ({
        x: Math.min(82, prev.x + 0.3),
        y: Math.max(38, prev.y - 0.15),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatETA = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
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
            <h1 className={`text-base font-bold ${textPrimary} font-orbitron`}>Live Tracking</h1>
            <p className={`text-[10px] ${textSecondary}`}>Ambulance unit AMB-047</p>
          </div>
          <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-400 text-[9px] font-semibold">LIVE</span>
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
          <div
            className="w-full h-56 rounded-3xl relative overflow-hidden border border-white/0.08"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #0a0f1e 0%, #0d1224 50%, #0a1218 100%)"
                : "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
            }}
          >
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
                `,
                backgroundSize: "28px 28px",
              }}
            />

            {/* Road network */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Main roads */}
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
              <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
              {/* Diagonal highway */}
              <line x1="0" y1="80" x2="100" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />

              {/* Ambulance route */}
              <motion.path
                d={`M ${ambulancePos.x} ${ambulancePos.y} Q 50 50 85 38`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                strokeOpacity="0.7"
                animate={{ strokeDashoffset: [0, -7] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              />

              {/* Route completed */}
              <path
                d="M 85 38 Q 90 38 90 38"
                fill="none"
                stroke="rgba(239,68,68,0.3)"
                strokeWidth="1.5"
              />
            </svg>

            {/* City blocks */}
            {[
              { x: 30, y: 15, w: 18, h: 8 },
              { x: 60, y: 15, w: 12, h: 8 },
              { x: 10, y: 55, w: 12, h: 16 },
              { x: 55, y: 55, w: 18, h: 14 },
              { x: 78, y: 55, w: 12, h: 14 },
            ].map((block, i) => (
              <div
                key={i}
                className="absolute rounded-md"
                style={{
                  left: `${block.x}%`,
                  top: `${block.y}%`,
                  width: `${block.w}%`,
                  height: `${block.h}%`,
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              />
            ))}

            {/* Ambulance marker */}
            <motion.div
              className="absolute z-10"
              style={{ left: `${ambulancePos.x}%`, top: `${ambulancePos.y}%` }}
              animate={{ x: "-50%", y: "-50%" }}
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border-2 border-red-400"
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    boxShadow: "0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4)",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  🚑
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border border-red-500/50"
                  style={{ transform: "translate(-50%, -50%)" }}
                  animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>

            {/* Destination marker (you) */}
            <div className="absolute" style={{ left: "85%", top: "38%" }}>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    boxShadow: "0 0 16px rgba(59,130,246,0.8)",
                  }}
                >
                  <MapPin size={14} className="text-white" />
                </div>
              </motion.div>
            </div>

            {/* Hospital marker */}
            <div className="absolute" style={{ left: "62%", top: "20%" }}>
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-sm border border-emerald-500/40"
                style={{
                  background: "rgba(16,185,129,0.2)",
                  boxShadow: "0 0 10px rgba(16,185,129,0.4)",
                  transform: "translate(-50%, -50%)",
                }}
              >
                🏥
              </div>
            </div>

            {/* Map overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-20 bggradienttot from-black/40 to-transparent" />

            {/* Map labels */}
            <div className="absolute bottom-3 left-4 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-white/60 text-[9px]">Ambulance</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-white/60 text-[9px]">Your Location</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-white/60 text-[9px]">Hospital</span>
              </div>
            </div>

            {/* Compass */}
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
              <span className="text-white/60 text-[9px] font-bold">N↑</span>
            </div>
          </div>
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
                <p className={`text-[10px] font-semibold ${textSecondary} uppercase tracking-wider mb-0.5`}>Estimated Arrival</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black font-orbitron ${etaSeconds < 60 ? "text-red-400" : textPrimary}`}>
                    {formatETA(etaSeconds)}
                  </span>
                  <span className={`text-xs ${textSecondary}`}>min</span>
                </div>
                <p className={`text-[10px] ${textSecondary} mt-0.5`}>Unit AMB-047 · 3 paramedics</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">
                  🚑
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
