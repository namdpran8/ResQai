import { motion } from "framer-motion";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
  opacity: Math.random() * 0.3 + 0.05,
}));

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ambient glow orbs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #dc2626 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-8"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-[40%] right-[-5%] w-[30%] h-[30%] rounded-full opacity-6"
        style={{
          background: "radial-gradient(circle, #1d4ed8 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-red-500"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
