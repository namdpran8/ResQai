import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Mic, Shield, AlertTriangle, ChevronRight,
  Navigation, Clock, Siren, Users, Building2, Car, Sun, Moon, Zap, Phone
} from "lucide-react";
import { userProfile, nearbyServices } from "../data/mockData";
import FloatingAlert from "../components/FloatingAlert";
// FloatingAlert is used in the banner

interface HomeScreenProps {
  isDark: boolean;
  onToggleDark: () => void;
  onSOSPress: () => void;
  onVoicePress: () => void;
  onNavigate: (screen: string) => void;
}

const quickActions = [
  { id: "ambulance", label: "Ambulance", icon: Car, color: "from-red-600 to-red-800", glow: "#dc2626", desc: "Dispatch now" },
  { id: "police", label: "Police", icon: Shield, color: "from-blue-600 to-blue-800", glow: "#2563eb", desc: "Alert unit" },
  { id: "hospital", label: "Hospital", icon: Building2, color: "from-emerald-600 to-emerald-800", glow: "#059669", desc: "Find nearest" },
  { id: "contacts", label: "Contacts", icon: Users, color: "from-violet-600 to-violet-800", glow: "#7c3aed", desc: "Notify family" },
];

const serviceIcons: Record<string, any> = {
  Hospital: Building2,
  Fire: Siren,
  Police: Shield,
};

const serviceColors: Record<string, string> = {
  Hospital: "text-emerald-400",
  Fire: "text-orange-400",
  Police: "text-blue-400",
};

const serviceBg: Record<string, string> = {
  Hospital: "bg-emerald-500/10 border-emerald-500/20",
  Fire: "bg-orange-500/10 border-orange-500/20",
  Police: "bg-blue-500/10 border-blue-500/20",
};

export default function HomeScreen({
  isDark, onToggleDark, onSOSPress, onVoicePress, onNavigate
}: HomeScreenProps) {
  const [sosPressing, setSosPressing] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSOSStart = useCallback(() => setSosPressing(true), []);
  const handleSOSEnd = useCallback(() => {
    setSosPressing(false);
    onSOSPress();
  }, [onSOSPress]);

  const bg = isDark
    ? "bg-[#050810]"
    : "bg-gradient-to-br from-slate-100 to-gray-200";

  const cardBg = isDark
    ? "bg-white/[0.04] border-white/[0.07]"
    : "bg-white/80 border-gray-200";

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/50" : "text-gray-500";

  return (
    <div className={`absolute inset-0 ${bg} overflow-hidden`}>
      {/* Ambient background */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #dc262620 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div className="absolute bottom-32 right-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(50px)" }} />
        </>
      )}

      <div className="relative z-10 h-full flex flex-col overflow-y-auto scroll-smooth" style={{ paddingBottom: "80px" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <Shield size={12} className="text-red-400" />
              </div>
              <span className={`font-orbitron font-bold text-base tracking-wider ${isDark ? "text-white" : "text-gray-900"}`}>
                ResQAI
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${textSecondary}`}>
              {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[10px] font-semibold">LIVE</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDark}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${cardBg} border`}
            >
              {isDark ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-gray-600" />}
            </motion.button>
          </div>
        </div>

        {/* Emergency Status Banner */}
        <AnimatePresence>
          {showEmergencyBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-5 mb-3 overflow-hidden"
            >
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bggradienttot from-transparent via-amber-500/5 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <AlertTriangle size={13} className="text-amber-400 shrink-0" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <FloatingAlert isDark={isDark} />
                  </div>
                </div>
                <button onClick={() => setShowEmergencyBanner(false)}
                  className="text-white/30 text-xs ml-2 shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOS Button Section */}
        <div className="flex flex-col items-center px-5 pt-2 pb-4">
          <p className={`text-xs font-medium mb-4 ${textSecondary} uppercase tracking-widest`}>
            Press & Hold for Emergency
          </p>

          {/* SOS Button */}
          <div className="relative flex items-center justify-center mb-5">
            {/* Outer pulse rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border border-red-500/30"
                animate={{
                  scale: sosPressing ? [1, 1.5 + ring * 0.3] : [1, 1.3 + ring * 0.2, 1],
                  opacity: sosPressing ? [0.8, 0] : [0.4, 0, 0.4],
                }}
                transition={{
                  duration: sosPressing ? 0.8 : 2,
                  delay: ring * 0.3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                style={{
                  width: 160 + ring * 30,
                  height: 160 + ring * 30,
                }}
              />
            ))}

            {/* SOS button */}
            <motion.button
              onMouseDown={handleSOSStart}
              onMouseUp={handleSOSEnd}
              onTouchStart={handleSOSStart}
              onTouchEnd={handleSOSEnd}
              animate={{
                scale: sosPressing ? 0.93 : 1,
                boxShadow: sosPressing
                  ? "0 0 60px rgba(239,68,68,0.9), 0 0 120px rgba(239,68,68,0.5), 0 0 200px rgba(239,68,68,0.2)"
                  : "0 0 30px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.25), 0 0 100px rgba(239,68,68,0.1)",
              }}
              transition={{ duration: 0.15 }}
              className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center cursor-pointer select-none z-10"
              style={{
                background: sosPressing
                  ? "linear-gradient(135deg, #ff1a1a, #cc0000)"
                  : "linear-gradient(135deg, #ef4444, #b91c1c)",
                border: "3px solid rgba(255,100,100,0.4)",
              }}
            >
              <motion.div
                animate={{ opacity: sosPressing ? [1, 0.6, 1] : 1 }}
                transition={{ duration: 0.3, repeat: sosPressing ? Infinity : 0 }}
              >
                <span className="font-orbitron font-black text-white text-3xl tracking-widest">SOS</span>
                <p className="text-white/70 text-[10px] font-medium mt-0.5 text-center tracking-wider">
                  {sosPressing ? "ALERTING..." : "EMERGENCY"}
                </p>
              </motion.div>

              {/* Inner shimmer */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.button>
          </div>

          {/* Voice Assistant Button */}
          <motion.button
            onClick={onVoicePress}
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border ${cardBg} backdrop-blur-lg`}
          >
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <Mic size={14} className="text-violet-400" />
            </div>
            <div className="text-left">
              <p className={`text-xs font-semibold ${textPrimary}`}>Voice Emergency</p>
              <p className={`text-[10px] ${textSecondary}`}>Tap to describe your emergency</p>
            </div>
            <Zap size={14} className="text-violet-400 ml-1" />
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-bold ${textPrimary}`}>Quick Dispatch</h2>
            <span className={`text-[10px] ${textSecondary}`}>Tap to alert</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  whileTap={{ scale: 0.91 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {const routeMap: Record<string, string> = {ambulance: "tracking",police: "tracking",hospital: "tracking",contacts: "contacts",};onNavigate(routeMap[action.id] || "home");}}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-full aspect-square rounded-2xl bggradienttot ${action.color} flex items-center justify-center relative overflow-hidden`}
                    style={{ boxShadow: `0 6px 24px ${action.glow}40, inset 0 1px 0 rgba(255,255,255,0.15)` }}
                  >
                    <Icon size={20} className="text-white" strokeWidth={1.8} />
                    <div className="absolute inset-0 bggradienttot from-black/20 to-white/10" />
                  </div>
                  <span className={`text-[10px] font-semibold ${textPrimary}`}>{action.label}</span>
                  <span className={`text-[9px] ${textSecondary} -mt-1`}>{action.desc}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Live Location Card */}
        <div className="px-5 mb-4">
          <div
            className={`rounded-2xl border p-4 ${cardBg} backdrop-blur-xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10"
              style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                  <Navigation size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className={`text-xs font-bold ${textPrimary}`}>Live Location</p>
                  <p className={`text-[9px] ${textSecondary}`}>GPS · High Accuracy</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-400 text-[9px] font-semibold">LOCKED</span>
              </div>
            </div>

            {/* Mini map visualization */}
            <div
              className="w-full h-24 rounded-xl mb-3 relative overflow-hidden"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #0d1117 0%, #111827 100%)"
                  : "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
                backgroundImage: `
                  linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            >
              {/* Fake roads */}
              <div className="absolute top-1/2 left-0 right-0 h-2px bg-white/10" />
              <div className="absolute top-0 bottom-0 left-1/3 w-2px bg-white/10" />
              <div className="absolute top-0 bottom-0 right-1/4 w-2px bg-white/10" />
              <div className="absolute top-1/4 left-0 right-0 h-1px bg-white/5" />

              {/* Location pin */}
              <motion.div
                className="absolute"
                style={{ left: "48%", top: "38%" }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg"
                  style={{ boxShadow: "0 0 12px rgba(59,130,246,0.7)" }}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                {/* Accuracy circle */}
                <motion.div
                  className="absolute -inset-4 rounded-full border border-blue-500/30 bg-blue-500/5"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-blue-400 shrink-0" />
              <p className={`text-xs font-medium ${textPrimary} truncate`}>{userProfile.location}</p>
            </div>
            <p className={`text-[10px] ${textSecondary} mt-0.5 font-mono`}>{userProfile.coordinates}</p>
          </div>
        </div>

        {/* AI Quick Banner */}
        <div className="px-5 mb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("ai")}
            className="w-full p-3 rounded-2xl relative overflow-hidden flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(109,40,217,0.06))",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 w-1/3 bggradienttot from-transparent via-violet-500/8 to-transparent"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-violet-400" />
            </div>
            <div className="text-left">
              <p className={`text-xs font-bold ${textPrimary}`}>AI Emergency Classification</p>
              <p className={`text-[10px] ${textSecondary}`}>Describe your emergency for smart routing</p>
            </div>
            <ChevronRight size={14} className="text-violet-400 ml-auto" />
          </motion.button>
        </div>

        {/* Nearby Emergency Services */}
        <div className="px-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-bold ${textPrimary}`}>Nearby Services</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("tracking")}
              className="flex items-center gap-1 text-red-400 text-[10px] font-semibold"
            >
              View All <ChevronRight size={12} />
            </motion.button>
          </div>

          <div className="flex flex-col gap-2">
            {nearbyServices.slice(0, 3).map((service, idx) => {
              const Icon = serviceIcons[service.type] || Building2;
              const colorClass = serviceColors[service.type] || "text-gray-400";
              const bgClass = serviceBg[service.type] || "bg-gray-500/10 border-gray-500/20";
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`flex items-center justify-between p-3 rounded-2xl border ${cardBg} backdrop-blur-xl`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${bgClass} border flex items-center justify-center`}>
                      <Icon size={16} className={colorClass} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${textPrimary}`}>{service.name}</p>
                      <p className={`text-[10px] ${textSecondary}`}>{service.distance} away</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end mb-0.5">
                      <Clock size={9} className="text-green-400" />
                      <span className="text-green-400 text-[10px] font-bold">{service.eta}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/25"
                    >
                      <Phone size={9} className="text-red-400" />
                      <span className="text-red-400 text-[9px] font-semibold">CALL</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Emergency ID */}
        <div className="px-5 mb-2">
          <div className={`flex items-center justify-between p-3 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Shield size={12} className="text-red-400" />
              </div>
              <div>
                <p className={`text-[10px] ${textSecondary}`}>Emergency ID</p>
                <p className={`text-xs font-mono font-bold ${textPrimary}`}>{userProfile.emergencyId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-[10px] ${textSecondary}`}>Blood Group</p>
              <p className="text-sm font-black text-red-400 font-orbitron">{userProfile.bloodGroup}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
