import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Navigation, Phone, CheckCircle, AlertTriangle } from "lucide-react";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrack: () => void;
  isDark: boolean;
}

const steps = [
  { label: "Location transmitted", delay: 0 },
  { label: "Emergency services alerted", delay: 800 },
  { label: "Contacts notified", delay: 1600 },
  { label: "Ambulance dispatched", delay: 2400 },
];

export default function SOSModal({ isOpen, onClose, onTrack, isDark }: SOSModalProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [count, setCount] = useState(5);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCompletedSteps([]);
      setCount(5);
      setDispatched(false);
      return;
    }

    // Animate steps
    steps.forEach((step, i) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, i]);
      }, step.delay + 500);
    });

    // Mark dispatched
    setTimeout(() => setDispatched(true), 3500);

    // Countdown
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/50" : "text-gray-500";
  const cardBg = isDark ? "bg-white/[0.05] border-white/[0.1]" : "bg-gray-50 border-gray-200";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[200] flex items-center justify-center px-5"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(15px)" }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full rounded-3xl overflow-hidden"
            style={{
              background: isDark
                ? "linear-gradient(180deg, #0f0f1f 0%, #0a0a18 100%)"
                : "#fff",
              border: "1px solid rgba(239,68,68,0.4)",
              boxShadow: "0 0 60px rgba(239,68,68,0.3), 0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Red top bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: "linear-gradient(90deg, #dc2626, #ef4444, #dc2626)" }}
            >
              <motion.div
                className="h-full bg-white/30"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      boxShadow: ["0 0 20px rgba(239,68,68,0.5)", "0 0 40px rgba(239,68,68,0.8)", "0 0 20px rgba(239,68,68,0.5)"],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center"
                  >
                    <Shield size={22} className="text-white" />
                  </motion.div>
                  <div>
                    <p className={`text-base font-black font-orbitron ${textPrimary}`}>SOS ACTIVATED</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-red-500"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                      <p className="text-red-400 text-[10px] font-bold">EMERGENCY BROADCAST ACTIVE</p>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${cardBg} border`}
                >
                  <X size={12} className={textSecondary} />
                </motion.button>
              </div>

              {/* Alert banner */}
              <motion.div
                className="p-3 rounded-2xl bg-red-500/10 border border-red-500/25 mb-4 flex items-center gap-2"
                animate={{ borderColor: ["rgba(239,68,68,0.25)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.25)"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AlertTriangle size={16} className="text-red-400 shrink-0" />
                <p className="text-red-300 text-xs font-semibold">
                  Emergency services have been notified. Help is on the way.
                </p>
              </motion.div>

              {/* Steps */}
              <div className="flex flex-col gap-2 mb-4">
                {steps.map((step, i) => {
                  const done = completedSteps.includes(i);
                  return (
                    <motion.div
                      key={i}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        done
                          ? "bg-green-500/10 border border-green-500/20"
                          : `${cardBg} border`
                      }`}
                    >
                      <motion.div
                        animate={done ? { scale: [0.5, 1.1, 1] } : {}}
                        transition={{ duration: 0.4 }}
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          done ? "bg-green-500/20" : isDark ? "bg-white/5" : "bg-gray-100"
                        }`}
                      >
                        {done ? (
                          <CheckCircle size={12} className="text-green-400" />
                        ) : (
                          <motion.div
                            className={`w-2 h-2 rounded-full ${isDark ? "bg-white/20" : "bg-gray-300"}`}
                            animate={i === completedSteps.length ? { opacity: [0.5, 1, 0.5] } : {}}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      <p className={`text-xs font-medium ${done ? textPrimary : textSecondary}`}>{step.label}</p>
                      {done && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="ml-auto"
                        >
                          <span className="text-green-400 text-[9px] font-bold">✓ DONE</span>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* ETA & countdown */}
              {dispatched && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4 flex items-center justify-between"
                >
                  <div>
                    <p className={`text-[10px] ${textSecondary}`}>police ETA</p>
                    <p className={`text-xl font-black font-orbitron text-blue-400`}>4:00 min</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] ${textSecondary}`}>patrol Unit</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>pol-911</p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/25">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-[10px] font-bold">PATROL ACTIVE</span>
                  </div>
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { onClose(); onTrack(); }}
                  className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow: "0 0 20px rgba(220,38,38,0.35)",
                  }}
                >
                  <Navigation size={14} />
                  <span>Track Live</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-14 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/25"
                >
                  <Phone size={16} className="text-red-400" />
                </motion.button>
              </div>

              {count > 0 && !dispatched && (
                <p className={`text-center text-[10px] ${textSecondary} mt-3`}>
                  Auto-dispatching in <span className="text-red-400 font-bold">{count}s</span>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
