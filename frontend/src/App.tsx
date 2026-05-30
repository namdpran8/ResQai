import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "./components/BottomNav";
import ParticleBackground from "./components/ParticleBackground";
import OnboardingScreen from "./screens/OnboardingScreen";
import HomeScreen from "./screens/HomeScreen";
import AIClassificationScreen from "./screens/AIClassificationScreen";
import TrackingScreen from "./screens/TrackingScreen";
import ContactsScreen from "./screens/ContactsScreen";
import OfflineScreen from "./screens/OfflineScreen";
import ProfileScreen from "./screens/ProfileScreen";
import VoiceModal from "./components/VoiceModal";
import SOSModal from "./components/SOSModal";

type Screen =
  | "home"
  | "ai"
  | "tracking"
  | "contacts"
  | "offline"
  | "profile";

const screenOrder: Screen[] = [
  "home",
  "ai",
  "tracking",
  "contacts",
  "offline",
  "profile",
];

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [previousScreen, setPreviousScreen] = useState<Screen>("home");
  const [isDark, setIsDark] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  const handleNavigate = (screen: string) => {
    const validScreens: Screen[] = [
      "home",
      "ai",
      "tracking",
      "contacts",
      "offline",
      "profile",
    ];
  

    if (validScreens.includes(screen as Screen)) {
      setPreviousScreen(activeScreen);
      setActiveScreen(screen as Screen);
    }
  };

  const screenIdx = screenOrder.indexOf(activeScreen);
  const prevIdx = screenOrder.indexOf(previousScreen);
  const direction = screenIdx >= prevIdx ? 1 : -1;

  const screenVariants = {
    initial: (dir: number) => ({
      x: dir * 50,
      opacity: 0,
      scale: 0.97,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 280,
        damping: 28,
      },
    },
    exit: (dir: number) => ({
      x: -dir * 40,
      opacity: 0,
      scale: 0.97,
      transition: { duration: 0.2 },
    }),
  };

  const bg = isDark
    ? "bg-[#050810]"
    : "bg-gradient-to-br from-slate-100 to-gray-200";

  return (
    <div
      className={`w-full h-screen flex items-center justify-center ${
        isDark ? "bg-[#020305]" : "bg-slate-200"
      }`}
    >
      <div
        className={`relative overflow-hidden ${bg}`}
        style={{
          width: "min(430px, 100vw)",
          height: "min(932px, 100vh)",
          borderRadius: "min(44px, 0px)",
        }}
      >
        {isDark && !onboarded && <ParticleBackground />}

        <AnimatePresence mode="wait">
          {!onboarded && (
            <motion.div
              key="onboarding"
              className="absolute inset-0 z-[300]"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <OnboardingScreen
                onComplete={() => setOnboarded(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {onboarded && (
          <>
            <div
              className="relative overflow-hidden"
              style={{ height: "calc(100% - 68px)" }}
            >
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeScreen}
                  custom={direction}
                  variants={screenVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0"
                >
                  {activeScreen === "home" && (
                    <HomeScreen
                      isDark={isDark}
                      onToggleDark={() =>
                        setIsDark(!isDark)
                      }
                      onSOSPress={() => setSosOpen(true)}
                      onVoicePress={() =>
                        setVoiceOpen(true)
                      }
                      onNavigate={handleNavigate}
                    />
                  )}

                  {activeScreen === "ai" && (
                    <AIClassificationScreen
                      isDark={isDark}
                      onNavigate={handleNavigate}
                    />
                  )}

                  {activeScreen === "tracking" && (
                    <TrackingScreen
                      isDark={isDark}
                      onNavigate={handleNavigate}
                    />
                  )}

                  {activeScreen === "contacts" && (
                    <ContactsScreen
                      isDark={isDark}
                      onNavigate={handleNavigate}
                    />
                  )}

                  {activeScreen === "offline" && (
                    <OfflineScreen
                      isDark={isDark}
                      onNavigate={handleNavigate}
                    />
                  )}

                  {activeScreen === "profile" && (
                    <ProfileScreen
                      isDark={isDark}
                      onNavigate={handleNavigate}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <BottomNav
              activeScreen={activeScreen}
              onNavigate={handleNavigate}
              isDark={isDark}
            />

            <VoiceModal
              isOpen={voiceOpen}
              onClose={() => setVoiceOpen(false)}
              isDark={isDark}
              onNavigate={(screen) => {
                setVoiceOpen(false);
                handleNavigate(screen);
              }}
            />

            <SOSModal
              isOpen={sosOpen}
              onClose={() => setSosOpen(false)}
              onTrack={() => {
                setSosOpen(false);
                handleNavigate("tracking");
              }}
              isDark={isDark}
            />
          </>
        )}
      </div>
    </div>
  );
}