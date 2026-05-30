import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, AlertTriangle, CheckCircle, Clock, ChevronRight,
  Navigation, Zap, ArrowLeft, Building2, Mic
} from "lucide-react";
import { nearbyServices } from "../data/mockData";

interface AIClassificationProps {
  isDark: boolean;
  onNavigate: (screen: string) => void;
}

const severityOptions = [
  {
    key: "Critical",
    color: "#ef4444",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    glow: "0 0 20px rgba(239,68,68,0.4)",
    icon: "🚨",
    label: "Life-threatening",
  },
  {
    key: "Serious",
    color: "#f97316",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    glow: "0 0 20px rgba(249,115,22,0.4)",
    icon: "⚠️",
    label: "Urgent care needed",
  },
  {
    key: "Minor",
    color: "#eab308",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    glow: "0 0 20px rgba(234,179,8,0.3)",
    icon: "ℹ️",
    label: "Non life-threatening",
  },
];

const scenarioPrompts = [
  "Major vehicle collision on highway",
  "Single-car rollover accident",
  "Pedestrian hit by vehicle",
  "Roadside breakdown at night",
  "Multi-vehicle pile-up",
];

const actionPlans: Record<string, string[]> = {
  Critical: [
    "🚨 Call 911 immediately — do not wait",
    "🚗 Turn on hazard lights & secure scene",
    "🚫 Do NOT move injured persons",
    "🩹 Apply direct pressure to bleeding wounds",
    "📍 Share exact GPS location with dispatcher",
    "🚑 Ambulance dispatched — ETA 4 minutes",
  ],
  Serious: [
    "📞 Call emergency services right away",
    "⚠️ Keep the injured person calm & still",
    "💧 Do NOT give food or water",
    "🔦 Signal oncoming traffic if on road",
    "📱 Keep line open with 911 operator",
  ],
  Minor: [
    "🚗 Move vehicle to road shoulder safely",
    "⚡ Turn on hazard lights immediately",
    "📞 Call roadside assistance",
    "🛡️ Stay inside vehicle if on highway",
    "📸 Document the scene safely",
  ],
};

export default function AIClassificationScreen({ isDark, onNavigate }: AIClassificationProps) {
  const [stage, setStage] = useState<"input" | "analyzing" | "result">("input");
  const [inputText, setInputText] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [classification, setClassification] = useState("Critical");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [_dispatchStatus, setDispatchStatus] = useState(false);

  const cardBg = isDark ? "bg-white/[0.04] border-white/[0.07]" : "bg-white/80 border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/50" : "text-gray-500";

  const startAnalysis = () => {
    if (!inputText && !selectedPrompt) return;
    setStage("analyzing");
    setAnalysisProgress(0);

    // Determine classification based on keywords
    const text = (inputText || selectedPrompt).toLowerCase();
    let cls = "Minor";
    if (text.includes("collision") || text.includes("rollover") || text.includes("pile") || text.includes("unconscious")) {
      cls = "Critical";
    } else if (text.includes("hit") || text.includes("urgent") || text.includes("serious") || text.includes("injured")) {
      cls = "Serious";
    }
    setClassification(cls);

    // Animate progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => setStage("result"), 400);
      }
      setAnalysisProgress(Math.min(prog, 100));
    }, 200);
  };

  const severityConfig = severityOptions.find((s) => s.key === classification) || severityOptions[0];
  const actions = actionPlans[classification] || actionPlans.Critical;

  return (
    <div className={`absolute inset-0 ${isDark ? "bg-[#050810]" : "bg-slate-100"} overflow-hidden`}>
      {isDark && (
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(40px)" }} />
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
            <h1 className={`text-base font-bold ${textPrimary} font-orbitron`}>AI Emergency Analysis</h1>
            <p className={`text-[10px] ${textSecondary}`}>Powered by ResQAI Intelligence</p>
          </div>
          <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Brain size={10} className="text-violet-400" />
            <span className="text-violet-400 text-[9px] font-semibold">AI ACTIVE</span>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* Input Stage */}
          {stage === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4 px-5"
            >
              {/* Voice input */}
              <div className={`rounded-2xl border p-4 ${cardBg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={14} className="text-violet-400" />
                  <p className={`text-xs font-semibold ${textPrimary}`}>Describe Your Emergency</p>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe what happened... (e.g. 'Car collision on highway, 2 people injured')"
                  className={`w-full h-24 bg-transparent text-sm resize-none outline-none ${textPrimary} placeholder:text-white/20`}
                />

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsListening(!isListening)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${
                      isListening ? "bg-red-500/20 border border-red-500/30" : "bg-violet-500/10 border border-violet-500/20"
                    }`}
                  >
                    <Mic size={12} className={isListening ? "text-red-400" : "text-violet-400"} />
                    <span className={`text-[10px] font-semibold ${isListening ? "text-red-400" : "text-violet-400"}`}>
                      {isListening ? "Listening..." : "Voice Input"}
                    </span>
                    {isListening && (
                      <div className="flex items-center gap-0.5 ml-1">
                        {[1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="w-0.5 bg-red-400 rounded-full"
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                  <span className={`text-[10px] ${textSecondary}`}>{inputText.length}/200</span>
                </div>
              </div>

              {/* Quick scenarios */}
              <div>
                <p className={`text-[11px] font-semibold ${textSecondary} mb-2 uppercase tracking-wider`}>
                  Common Emergencies
                </p>
                <div className="flex flex-col gap-2">
                  {scenarioPrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setSelectedPrompt(prompt); setInputText(prompt); }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        selectedPrompt === prompt
                          ? "border-red-500/40 bg-red-500/10"
                          : `${cardBg}`
                      }`}
                    >
                      <span className={`text-xs font-medium ${textPrimary}`}>{prompt}</span>
                      <ChevronRight size={12} className={textSecondary} />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Analyze button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={startAnalysis}
                disabled={!inputText && !selectedPrompt}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white relative overflow-hidden disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  boxShadow: "0 0 30px rgba(124,58,237,0.4)",
                }}
              >
                <Brain size={16} />
                <span>Analyze with AI</span>
                <Zap size={14} className="text-violet-300" />
              </motion.button>
            </motion.div>
          )}

          {/* Analyzing Stage */}
          {stage === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 px-8 gap-6"
            >
              {/* Scanning animation */}
              <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
                {/* Multiple rotating rings */}
                <motion.div
                  className="absolute rounded-full border-2 border-violet-500/30"
                  style={{ width: 180, height: 180 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1.5 rounded-full bg-violet-400"
                    style={{ boxShadow: "0 0 12px #7c3aed, 0 0 24px #7c3aed" }} />
                </motion.div>
                <motion.div
                  className="absolute rounded-full border border-violet-500/15"
                  style={{ width: 140, height: 140 }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-violet-300/60" />
                </motion.div>
                <motion.div
                  className="absolute rounded-full border border-red-500/20"
                  style={{ width: 100, height: 100 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-red-400/60" />
                </motion.div>

                {/* Center brain icon */}
                <motion.div
                  className="absolute w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center"
                  animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.2)", "0 0 40px rgba(124,58,237,0.5)", "0 0 20px rgba(124,58,237,0.2)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain size={36} className="text-violet-400" />
                </motion.div>

                {/* Scan beams */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-violet-500/80 to-transparent"
                    style={{
                      width: 70,
                      transformOrigin: "left center",
                      transform: `rotate(${deg}deg)`,
                    }}
                    animate={{ opacity: [0.1, 0.8, 0.1], scaleX: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>

              <div className="text-center">
                <h2 className={`text-lg font-bold ${textPrimary} font-orbitron mb-1`}>
                  Analyzing...
                </h2>
                <p className={`text-sm ${textSecondary}`}>AI processing your emergency data</p>
              </div>

              {/* Progress bar */}
              <div className="w-full">
                <div className="flex justify-between mb-2">
                  <span className={`text-[10px] ${textSecondary}`}>AI Analysis Progress</span>
                  <span className="text-violet-400 text-[10px] font-bold">{Math.round(analysisProgress)}%</span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                      boxShadow: "0 0 10px rgba(124,58,237,0.6)",
                    }}
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {/* Analysis steps */}
                <div className="flex flex-col gap-1.5 mt-4">
                  {["Location acquired", "Severity assessed", "Services identified", "Dispatch ready"].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: analysisProgress > i * 25 ? 1 : 0.3, x: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={12} className={analysisProgress > i * 25 ? "text-green-400" : textSecondary} />
                      <span className={`text-[11px] ${analysisProgress > i * 25 ? textPrimary : textSecondary}`}>{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Result Stage */}
          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 px-5"
            >
              {/* Classification Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`p-5 rounded-2xl border ${severityConfig.bg} ${severityConfig.border} relative overflow-hidden`}
                style={{ boxShadow: severityConfig.glow }}
              >
                <div className="absolute top-0 right-0 text-6xl opacity-10 leading-none p-2">
                  {severityConfig.icon}
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-[10px] font-semibold ${textSecondary} uppercase tracking-widest mb-1`}>
                      AI Classification
                    </p>
                    <h2 className={`text-3xl font-black font-orbitron ${severityConfig.text}`}>
                      {classification}
                    </h2>
                    <p className={`text-xs ${textSecondary} mt-1`}>{severityConfig.label}</p>
                  </div>
                  <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl ${severityConfig.bg} border ${severityConfig.border}`}>
                    <span className="text-2xl">{severityConfig.icon}</span>
                    <span className={`text-[9px] font-bold ${severityConfig.text}`}>ALERT</span>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className={`text-[10px] ${textSecondary}`}>AI Confidence</span>
                    <span className={`text-[10px] font-bold ${severityConfig.text}`}>94%</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                    <motion.div
                      className={`h-full rounded-full`}
                      style={{ background: severityConfig.color, width: 0 }}
                      animate={{ width: "94%" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Dispatch Status */}
              <div className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                    <Navigation size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${textPrimary}`}>Emergency Dispatch</p>
                    <p className="text-green-400 text-[10px] font-semibold">✓ Accepted & En Route</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] ${textSecondary}`}>ETA</p>
                  <div className="flex items-center gap-1">
                    <Clock size={11} className="text-red-400" />
                    <span className="text-red-400 font-bold text-sm">4 min</span>
                  </div>
                </div>
              </div>

              {/* Action Priority */}
              <div className={`p-4 rounded-2xl border ${cardBg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className={severityConfig.text} />
                  <p className={`text-xs font-bold ${textPrimary}`}>Emergency Action Plan</p>
                </div>
                <div className="flex flex-col gap-2">
                  {actions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-start gap-2 p-2.5 rounded-xl ${
                        i === 0 ? `${severityConfig.bg} border ${severityConfig.border}` : `${isDark ? "bg-white/[0.02]" : "bg-gray-50"}`
                      }`}
                    >
                      <span className="text-[10px] font-black text-white/30 mt-0.5 w-4 shrink-0">{i + 1}.</span>
                      <span className={`text-xs ${i === 0 ? textPrimary : textSecondary}`}>{action}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Nearby Hospitals */}
              <div>
                <p className={`text-[11px] font-semibold ${textSecondary} mb-2 uppercase tracking-wider`}>
                  Recommended Hospitals
                </p>
                {nearbyServices.filter(s => s.type === "Hospital").map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-xl border mb-2 ${cardBg}`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-emerald-400" />
                      <div>
                        <p className={`text-xs font-semibold ${textPrimary}`}>{h.name}</p>
                        <p className={`text-[10px] ${textSecondary}`}>{h.distance} · {h.eta} ETA</p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onNavigate("tracking")}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25"
                    >
                      <Navigation size={10} className="text-emerald-400" />
                      <span className="text-emerald-400 text-[10px] font-semibold">Track</span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Dispatch ambulance CTA */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setDispatchStatus(true); onNavigate("tracking"); }}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  boxShadow: "0 0 30px rgba(220,38,38,0.4)",
                }}
              >
                <Navigation size={16} />
                <span>Track Live Ambulance</span>
              </motion.button>

              {/* Reset */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setStage("input"); setInputText(""); setSelectedPrompt(""); }}
                className={`w-full py-3 rounded-2xl border text-xs font-semibold ${textSecondary} ${cardBg}`}
              >
                New Analysis
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
