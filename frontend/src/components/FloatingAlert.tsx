import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const alerts = [
  { id: 1, message: "🚗 Accident reported on I-95 N near exit 14", time: "2m ago" },
  { id: 2, message: "🚒 Fire department active on Broadway", time: "5m ago" },
  { id: 3, message: "⚠️ Road closure: Main St & 5th Ave intersection", time: "8m ago" },
];

interface FloatingAlertProps {
  isDark: boolean;
}

export default function FloatingAlert({ isDark }: FloatingAlertProps) {
  const [currentAlert, setCurrentAlert] = useState(0);
  const [visible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  const alert = alerts[currentAlert];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAlert}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex items-center gap-2"
      >
        <p className={`text-[10px] ${isDark ? "text-amber-300/80" : "text-amber-700"} flex-1 truncate`}>
          {alert.message}
        </p>
        <span className={`text-[9px] ${isDark ? "text-white/30" : "text-gray-400"} shrink-0`}>{alert.time}</span>
      </motion.div>
    </AnimatePresence>
  );
}
