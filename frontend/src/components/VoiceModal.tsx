import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Zap, Volume2 } from "lucide-react";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onNavigate: (screen: string) => void;
}

const voicePrompts = [
  "I've been in a car accident",
  "Someone is injured and unconscious",
  "Vehicle fire on the highway",
  "Medical emergency needed",
];

export default function VoiceModal({ isOpen, onClose, isDark, onNavigate }: VoiceModalProps) {
  const [stage, setStage] = useState<"idle" | "listening" | "processing" | "responding">("idle");
  const [transcript, setTranscript] = useState("");
  const [aiText, setAiText] = useState("");


  useEffect(() => {
    if (!isOpen) {
      setStage("idle");
      setTranscript("");
      setAiText("");

    }
  }, [isOpen]);

  const startListening = () => {
    setStage("listening");
    setTranscript("");
    // Simulate voice recognition
    setTimeout(() => {
      setTranscript("I've been in a car accident on Highway 101");
      setStage("processing");
      setTimeout(() => {
        setStage("responding");
        setAiText("Emergency detected. Analyzing your situation...");
      }, 1500);
    }, 2500);
  };

  const handlePromptSelect = (prompt: string) => {
    setTranscript(prompt);
    setStage("processing");
    setTimeout(() => {
      setStage("responding");
      setAiText("Emergency detected. Analyzing your situation...");
    }, 1000);
  };
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/50" : "text-gray-500";
  const cardBg = isDark ? "bg-white/[0.04] border-white/[0.07]" : "bg-gray-50 border-gray-200";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] flex items-end"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-full rounded-t-3xl overflow-hidden`}
            style={{
              background: isDark
                ? "linear-gradient(180deg, #0c1020 0%, #080c18 100%)"
                : "#fff",
              border: "1px solid rgba(239,68,68,0.2)",
              borderBottom: "none",
              maxHeight: "85vh",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <Zap size={14} className="text-violet-400" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${textPrimary} font-orbitron`}>ResQAI Voice</p>
                  <p className={`text-[10px] ${textSecondary}`}>AI Emergency Assistant</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${cardBg} border`}
              >
                <X size={14} className={textSecondary} />
              </motion.button>
            </div>

            <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: "70vh" }}>
              {/* Microphone visualization */}
              <div className="flex flex-col items-center py-6">
                <div className="relative">
                  {/* Pulse rings */}
                  {stage === "listening" && [1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute rounded-full border border-violet-500/30"
                      style={{
                        width: 80 + ring * 30,
                        height: 80 + ring * 30,
                        top: -(ring * 15),
                        left: -(ring * 15),
                      }}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, delay: ring * 0.3, repeat: Infinity }}
                    />
                  ))}

                  {/* Mic button */}
                  <motion.button
                    onClick={stage === "idle" ? startListening : undefined}
                    animate={{
                      scale: stage === "listening" ? [1, 1.05, 1] : 1,
                      boxShadow: stage === "listening"
                        ? ["0 0 20px rgba(124,58,237,0.5)", "0 0 40px rgba(124,58,237,0.8)", "0 0 20px rgba(124,58,237,0.5)"]
                        : stage === "processing"
                        ? "0 0 30px rgba(239,68,68,0.5)"
                        : stage === "responding"
                        ? "0 0 30px rgba(34,197,94,0.5)"
                        : "0 0 20px rgba(124,58,237,0.3)",
                    }}
                    transition={{ duration: 1, repeat: stage === "listening" ? Infinity : 0 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center relative"
                    style={{
                      background:
                        stage === "idle"
                          ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                          : stage === "listening"
                          ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                          : stage === "processing"
                          ? "linear-gradient(135deg, #dc2626, #991b1b)"
                          : "linear-gradient(135deg, #16a34a, #15803d)",
                    }}
                  >
                    {stage === "listening" ? (
                      <div className="flex items-end gap-0.5 h-8">
                        {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                          <motion.div
                            key={bar}
                            className="w-1.5 bg-white rounded-full"
                            animate={{ height: [4, Math.random() * 24 + 8, 4] }}
                            transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: bar * 0.05 }}
                          />
                        ))}
                      </div>
                    ) : stage === "processing" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap size={28} className="text-white" />
                      </motion.div>
                    ) : stage === "responding" ? (
                      <Volume2 size={28} className="text-white" />
                    ) : (
                      <Mic size={28} className="text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Status text */}
                <div className="mt-6 text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {stage === "idle" && (
                        <>
                          <p className={`text-base font-bold ${textPrimary}`}>Tap to Speak</p>
                          <p className={`text-xs ${textSecondary} mt-1`}>Describe your emergency situation</p>
                        </>
                      )}
                      {stage === "listening" && (
                        <>
                          <p className="text-violet-400 text-base font-bold">Listening...</p>
                          <p className={`text-xs ${textSecondary} mt-1`}>Speak clearly about your emergency</p>
                        </>
                      )}
                      {stage === "processing" && (
                        <>
                          <p className="text-red-400 text-base font-bold">Analyzing...</p>
                          <p className={`text-xs ${textSecondary} mt-1`}>AI processing your emergency</p>
                        </>
                      )}
                      {stage === "responding" && (
                        <>
                          <p className="text-green-400 text-base font-bold">Response Ready</p>
                          <p className={`text-xs ${textSecondary} mt-1`}>Help is on the way</p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Transcript */}
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 w-full p-3 rounded-2xl border ${cardBg}`}
                  >
                    <p className={`text-[10px] ${textSecondary} mb-1`}>Detected speech:</p>
                    <p className={`text-sm font-medium ${textPrimary}`}>"{transcript}"</p>
                  </motion.div>
                )}

                {/* AI Response */}
                {stage === "responding" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 w-full p-3 rounded-2xl bg-green-500/10 border border-green-500/25"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 size={12} className="text-green-400" />
                      <p className="text-green-400 text-[10px] font-bold">AI RESPONSE</p>
                      <motion.div
                        className="flex items-center gap-0.5 ml-auto"
                      >
                        {[1, 2, 3, 4].map((b) => (
                          <motion.div
                            key={b}
                            className="w-0.5 bg-green-400 rounded-full"
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 0.5, delay: b * 0.1, repeat: Infinity }}
                          />
                        ))}
                      </motion.div>
                    </div>
                    <p className={`text-xs ${textPrimary}`}>{aiText}</p>
                  </motion.div>
                )}
              </div>

              {/* Quick prompts */}
              {stage === "idle" && (
                <div>
                  <p className={`text-[11px] font-semibold ${textSecondary} mb-2 uppercase tracking-wider`}>
                    Quick Emergency Phrases
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {voicePrompts.map((prompt, i) => (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePromptSelect(prompt)}
                        className={`p-3 rounded-xl border text-left ${cardBg}`}
                      >
                        <p className={`text-[11px] font-medium ${textPrimary}`}>{prompt}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigate to AI screen */}
              {stage === "responding" && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onClose(); onNavigate("ai"); }}
                  className="w-full py-4 mt-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow: "0 0 30px rgba(220,38,38,0.4)",
                  }}
                >
                  <Zap size={16} />
                  <span>Full AI Classification</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
