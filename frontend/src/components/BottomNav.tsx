import { motion } from "framer-motion";
import {
  Home,
  MapPin,
  Users,
  Wifi,
  Brain,
  User,
} from "lucide-react";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "ai", label: "AI Assist", icon: Brain },
  { id: "tracking", label: "Track", icon: MapPin },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "offline", label: "Offline", icon: Wifi },
  { id: "profile", label: "Profile", icon: User },
];

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  isDark: boolean;
}

export default function BottomNav({
  activeScreen,
  onNavigate,
  isDark,
}: BottomNavProps) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-50 ${
        isDark
          ? "bg-[rgba(5,8,16,0.9)] border-t border-white/5"
          : "bg-[rgba(248,250,252,0.95)] border-t border-gray-200"
      }`}
      style={{
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
      }}
    >
      <div className="flex items-center justify-around px-1 pt-2 pb-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center gap-1 px-2 py-1 relative"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                className={`p-1.5 rounded-xl ${
                  isActive
                    ? "bg-red-500/20 text-red-400"
                    : isDark
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </motion.div>

              <span
                className={`text-[9px] font-medium ${
                  isActive
                    ? "text-red-400"
                    : isDark
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}