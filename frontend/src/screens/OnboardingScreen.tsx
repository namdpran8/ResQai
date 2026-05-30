import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, MapPin, ChevronRight, Brain } from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";

const slides = [
  {
    icon: Shield,
    color: "#ef4444",
    title: "AI-Powered\nEmergency Response",
    subtitle: "ResQAI instantly analyzes your emergency and dispatches the right help within seconds.",
    gradient: "from-red-500/20 to-orange-500/10",
  },
  {
    icon: Brain,
    color: "#a855f7",
    title: "Smart Emergency\nClassification",
    subtitle: "Our AI understands your situation and prioritizes response — Critical, Serious, or Minor.",
    gradient: "from-purple-500/20 to-blue-500/10",
  },
  {
    icon: MapPin,
    color: "#3b82f6",
    title: "Live Location\nTracking",
    subtitle: "Real-time GPS tracking lets emergency services find you instantly — even offline.",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Zap,
    color: "#ef4444",
    title: "One Touch\nSOS Dispatch",
    subtitle: "Press SOS to alert emergency services, notify your contacts, and start AI assistance.",
    gradient: "from-red-500/20 to-pink-500/10",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div className="absolute inset-0 bg-[#050810] overflow-hidden">
      <ParticleBackground />

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onComplete}
        className="absolute top-12 right-6 z-50 text-white/40 text-sm font-medium"
      >
        Skip
      </motion.button>

      <div className="relative z-10 h-full flex flex-col">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-6 pt-14"
        >
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <Shield size={16} className="text-red-400" />
          </div>
          <span className="font-orbitron text-white font-bold text-lg tracking-wider">ResQAI</span>
        </motion.div>

        {/* Slide content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon orb */}
              <div className="relative mb-10">
                {/* Outer rings */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-white/10"
                  style={{ width: 180, height: 180, margin: "-40px" }}
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-0 rounded-full border border-white/5"
                  style={{ width: 220, height: 220, margin: "-60px" }}
                />

                {/* Icon container */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${slide.gradient} border border-white/10 flex items-center justify-center relative`}
                  style={{
                    boxShadow: `0 0 60px ${slide.color}30, 0 0 120px ${slide.color}10`,
                  }}
                >
                  <Icon size={52} style={{ color: slide.color }} strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Text */}
              <motion.h1
                className="text-white font-orbitron font-bold text-3xl leading-tight mb-4 whitespace-pre-line"
                style={{ textShadow: `0 0 30px ${slide.color}40` }}
              >
                {slide.title}
              </motion.h1>
              <p className="text-white/50 text-base leading-relaxed max-w-xs">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom section */}
        <div className="px-8 pb-12">
          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {slides.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === current ? 24 : 6,
                  backgroundColor: i === current ? "#ef4444" : "rgba(255,255,255,0.2)",
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 rounded-full cursor-pointer"
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              />
            ))}
          </div>

          {/* Next button */}
          <motion.button
            onClick={goNext}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 0 30px rgba(220,38,38,0.4), 0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-white/10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ clipPath: "polygon(0 0, 30% 0, 50% 100%, 20% 100%)" }}
            />
            <span>{current === slides.length - 1 ? "Get Started" : "Continue"}</span>
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
