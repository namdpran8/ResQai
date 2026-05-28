import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WifiOff, Phone, AlertTriangle, Battery,
  Building2, ArrowLeft, RefreshCw, Download,
  Navigation
} from "lucide-react";
import { cachedHospitals, emergencyNumbers } from "../data/mockData";

interface OfflineScreenProps {
  isDark: boolean;
  onNavigate: (screen: string) => void;
}

export default function OfflineScreen({ isDark, onNavigate }: OfflineScreenProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showSOSPopup, setShowSOSPopup] = useState(false);

  const cardBg = isDark ? "bg-white/[0.04] border-white/[0.07]" : "bg-white/80 border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/50" : "text-gray-500";

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => setIsRetrying(false), 2500);
  };

  return (
    <div className={`absolute inset-0 ${isDark ? "bg-[#050810]" : "bg-slate-100"} overflow-hidden`}>
      {isDark && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 bggradienttot from-transparent via-amber-500/50 to-transparent" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", filter: "blur(50px)" }} />
        </>
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
            <h1 className={`text-base font-bold ${textPrimary} font-orbitron`}>Offline Mode</h1>
            <p className={`text-[10px] ${textSecondary}`}>Limited connectivity features</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRetry}
            className="ml-auto w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
          >
            <motion.div animate={{ rotate: isRetrying ? 360 : 0 }} transition={{ duration: 1, repeat: isRetrying ? Infinity : 0 }}>
              <RefreshCw size={13} className="text-amber-400" />
            </motion.div>
          </motion.button>
        </div>

        {/* Offline Warning Banner */}
        <motion.div
          className="mx-5 mb-4"
          animate={{
            borderColor: ["rgba(245,158,11,0.2)", "rgba(245,158,11,0.5)", "rgba(245,158,11,0.2)"],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 w-1/3 bggradienttot from-transparent via-amber-500/5 to-transparent"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <WifiOff size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-amber-300 text-sm font-bold">No Internet Connection</p>
                <p className={`text-[11px] ${textSecondary} mt-0.5`}>
                  Operating in offline emergency mode. Cached data and SMS emergency alerts available.
                </p>
              </div>
            </div>

            {/* Offline indicator bars */}
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= 1 ? "bg-amber-500/60" : isDark ? "bg-white/10" : "bg-gray-200"
                  }`}
                />
              ))}
              <span className="text-amber-400 text-[10px] font-bold ml-1">1/5 bars</span>
            </div>
          </div>
        </motion.div>

        {/* Status Cards */}
        <div className="px-5 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Battery, label: "Battery", value: "78%", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", status: "OK" },
              { icon: Navigation, label: "GPS", value: "Active", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", status: "ON" },
              { icon: Download, label: "Cache", value: "Loaded", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", status: "OK" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`p-3 rounded-2xl border ${item.bg} ${cardBg} flex flex-col items-center gap-1 text-center`}>
                  <Icon size={16} className={item.color} />
                  <span className={`text-[9px] font-semibold ${textSecondary}`}>{item.label}</span>
                  <span className={`text-[10px] font-bold ${item.color}`}>{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SMS Emergency SOS */}
        <div className="px-5 mb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowSOSPopup(true)}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 0 30px rgba(220,38,38,0.4)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-white/5"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <AlertTriangle size={18} />
            <div className="text-left">
              <p className="text-base font-black">SOS via SMS</p>
              <p className="text-white/70 text-[10px] font-normal">Send emergency alert without internet</p>
            </div>
          </motion.button>
        </div>

        {/* Retry connection */}
        <div className="px-5 mb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRetry}
            className={`w-full py-3.5 rounded-2xl border flex items-center justify-center gap-2 ${cardBg}`}
          >
            <motion.div
              animate={{ rotate: isRetrying ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRetrying ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw size={14} className={isRetrying ? "text-blue-400" : textSecondary} />
            </motion.div>
            <span className={`text-xs font-semibold ${isRetrying ? "text-blue-400" : textSecondary}`}>
              {isRetrying ? "Searching for connection..." : "Retry Connection"}
            </span>
            {isRetrying && (
              <div className="flex items-center gap-0.5 ml-1">
                {[1, 2, 3].map((j) => (
                  <motion.div
                    key={j}
                    className="w-1 h-1 rounded-full bg-blue-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.6, delay: j * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            )}
          </motion.button>
        </div>

        {/* Cached Hospitals */}
        <div className="px-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold ${textPrimary}`}>Cached Nearby Hospitals</p>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Download size={9} className="text-amber-400" />
              <span className="text-amber-400 text-[9px] font-bold">CACHED</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {cachedHospitals.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-2xl border ${cardBg} flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Building2 size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${textPrimary}`}>{h.name}</p>
                    <p className={`text-[10px] ${textSecondary}`}>{h.distance} · {h.phone}</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-red-500/15 border border-red-500/25"
                >
                  <Phone size={12} className="text-red-400" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="px-5 mb-4">
          <p className={`text-xs font-bold ${textPrimary} mb-3`}>Emergency Numbers</p>
          <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
            {emergencyNumbers.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < emergencyNumbers.length - 1
                    ? isDark ? "border-b border-white/5" : "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <p className={`text-xs font-semibold ${textPrimary}`}>{item.service}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${textPrimary}`}>{item.number}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center"
                  >
                    <Phone size={12} className="text-red-400" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Offline tips */}
        <div className="px-5 mb-2">
          <div className={`p-4 rounded-2xl border ${cardBg}`}>
            <p className={`text-xs font-bold ${textPrimary} mb-2`}>⚡ Offline Emergency Tips</p>
            {[
              "Share your GPS coordinates via SMS to 911",
              "Flash headlights in groups of 3 for help",
              "Use a mirror to signal aircraft",
              "Stay near your vehicle for visibility",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                <span className="text-amber-400 text-xs mt-0.5">•</span>
                <p className={`text-[11px] ${textSecondary}`}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOS Popup */}
      <AnimatePresence>
        {showSOSPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
            onClick={() => setShowSOSPopup(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-3xl p-6"
              style={{ background: isDark ? "rgba(15,20,35,0.98)" : "rgba(255,255,255,0.98)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-red-400" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${textPrimary}`}>Send SMS Emergency Alert</p>
                  <p className={`text-[10px] ${textSecondary}`}>No internet required</p>
                </div>
              </div>
              <div className={`p-3 rounded-xl mb-4 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                <p className={`text-[11px] font-mono ${textSecondary}`}>
                  "EMERGENCY: I need help. My location is 40.7128°N 74.0060°W · ResQAI ID: RSQ-2024-7834 · Please send emergency services immediately."
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowSOSPopup(false)}
                  className={`flex-1 py-3 rounded-xl border text-xs font-semibold ${textSecondary} ${cardBg}`}>
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowSOSPopup(false)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-bold"
                  style={{ boxShadow: "0 0 20px rgba(239,68,68,0.4)" }}
                >
                  Send SOS SMS
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
