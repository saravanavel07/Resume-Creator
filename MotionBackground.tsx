import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  FileCheck,
  FileCode,
  Award,
  Target,
  Sparkles,
  CheckCircle,
  FileSpreadsheet,
  Zap,
  Star,
  Check,
} from 'lucide-react';

export const MotionBackground: React.FC = () => {
  // Floating background symbols
  const floatingSymbols = [
    { Icon: FileText, size: 40, top: '10%', left: '7%', duration: 18, delay: 0 },
    { Icon: FileCheck, size: 46, top: '22%', left: '86%', duration: 22, delay: 1.5 },
    { Icon: FileCode, size: 34, top: '68%', left: '5%', duration: 16, delay: 1 },
    { Icon: Award, size: 42, top: '78%', left: '89%', duration: 20, delay: 2.5 },
    { Icon: Target, size: 36, top: '42%', left: '92%', duration: 19, delay: 3 },
    { Icon: Sparkles, size: 28, top: '14%', left: '74%', duration: 14, delay: 0.5 },
    { Icon: CheckCircle, size: 32, top: '84%', left: '18%', duration: 21, delay: 4 },
    { Icon: FileSpreadsheet, size: 36, top: '50%', left: '8%', duration: 23, delay: 2 },
    { Icon: Zap, size: 26, top: '32%', left: '15%', duration: 15, delay: 3.5 },
  ];

  // Tiny moving particles and dots
  const tinyParticles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    top: `${(i * 17) % 90 + 5}%`,
    left: `${(i * 23) % 92 + 4}%`,
    size: (i % 3) + 2, // 2px to 4px
    duration: 10 + (i % 12),
    delay: (i % 6) * 0.8,
    opacity: 0.15 + (i % 4) * 0.1,
    color: i % 2 === 0 ? 'bg-red-500' : 'bg-red-400',
  }));

  // Floating geometric ring objects
  const geometricObjects = [
    { top: '18%', left: '48%', size: 'w-16 h-16', duration: 25, delay: 0 },
    { top: '62%', left: '72%', size: 'w-24 h-24', duration: 30, delay: 2 },
    { top: '80%', left: '38%', size: 'w-20 h-20', duration: 22, delay: 1 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0b0c10]">
      {/* Dark Ambient Radial Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-900/15 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-red-950/10 rounded-full blur-[160px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-900/15 rounded-full blur-[120px]" />

      {/* Floating Geometric Rings */}
      {geometricObjects.map((geo, idx) => (
        <motion.div
          key={`geo-${idx}`}
          className={`absolute rounded-full border border-red-800/10 ${geo.size}`}
          style={{ top: geo.top, left: geo.left }}
          animate={{
            scale: [1, 1.25, 1],
            rotate: [0, 180, 360],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: geo.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: geo.delay,
          }}
        />
      ))}

      {/* Floating Animated Symbols */}
      {floatingSymbols.map((item, idx) => {
        const IconComponent = item.Icon;
        return (
          <motion.div
            key={idx}
            className="absolute text-red-500/10 hover:text-red-500/20 transition-colors"
            style={{ top: item.top, left: item.left }}
            animate={{
              y: [0, -22, 0, 22, 0],
              x: [0, 12, 0, -12, 0],
              rotate: [0, 8, -8, 0],
              opacity: [0.08, 0.22, 0.08],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <IconComponent size={item.size} />
          </motion.div>
        );
      })}

      {/* Moving Tiny Objects & Floating Particles */}
      {tinyParticles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className={`absolute rounded-full shadow-sm shadow-red-500/50 ${particle.color}`}
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -40, 0, 30, 0],
            x: [0, 20, -15, 10, 0],
            scale: [1, 1.6, 0.8, 1.2, 1],
            opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.4, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* Subtle Scanline Grid Effect */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(220, 38, 38, 0.3) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
    </div>
  );
};
