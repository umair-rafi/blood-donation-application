"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// Deterministic pseudo-random generator so server & client render identical values
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export const BloodDonationAnimation = () => {
  // Precompute particle positions once — stable across server/client renders
  const particles = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      r: 2 + rand() * 2,
      cx: 100 + rand() * 600,
      cy: 100 + rand() * 400,
      duration: 6 + rand() * 4,
      delay: rand() * 3,
      isRed: i % 3 === 0,
    }));
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-rose-300/30 rounded-full blur-3xl"
        />
      </div>

      <svg
        viewBox="0 0 800 600"
        className="w-full h-full max-w-[800px] max-h-[600px] relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions for gradients and filters */}
        <defs>
          <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient
            id="bloodGradientDark"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Blood Bag Outline with subtle breathing scale */}
        <motion.path
          d="M320 180 
             C320 160, 340 150, 360 150 
             L440 150 
             C460 150, 480 160, 480 180 
             L480 200 
             C490 200, 500 210, 500 220 
             L500 450 
             C500 480, 480 500, 450 500 
             L350 500 
             C320 500, 300 480, 300 450 
             L300 220 
             C300 210, 310 200, 320 200 
             Z"
          stroke="#e11d48"
          strokeWidth="3"
          fill="rgba(255,255,255,0.6)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "400px 325px" }}
        />
        <motion.path
          d="M320 180 
             C320 160, 340 150, 360 150 
             L440 150 
             C460 150, 480 160, 480 180 
             L480 200 
             C490 200, 500 210, 500 220 
             L500 450 
             C500 480, 480 500, 450 500 
             L350 500 
             C320 500, 300 480, 300 450 
             L300 220 
             C300 210, 310 200, 320 200 
             Z"
          fill="none"
          stroke="transparent"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.008, 1] }}
          transition={{
            duration: 3.5,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "400px 325px" }}
        />

        {/* Blood Bag Tube (Top) */}
        <motion.path
          d="M400 150 L400 100"
          stroke="#e11d48"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        />

        {/* Blood Bag Tube (Bottom) */}
        <motion.path
          d="M400 500 L400 550"
          stroke="#e11d48"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        />

        {/* Animated Blood Fill Inside Bag */}
        <motion.path
          d="M305 450 
             C305 475, 325 495, 350 495 
             L450 495 
             C475 495, 495 475, 495 450 
             L495 350 
             C495 350, 480 340, 460 345 
             C440 350, 420 335, 400 340 
             C380 345, 360 335, 340 340 
             C320 345, 305 350, 305 350 
             Z"
          fill="url(#bloodGradient)"
          opacity="0.85"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 0.85 }}
          transition={{
            duration: 4,
            delay: 2,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 1,
          }}
        />

        {/* Blood Surface Wave */}
        <motion.path
          d="M305 350 Q350 340 400 350 T495 350"
          stroke="#fca5a5"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          animate={{
            d: [
              "M305 350 Q350 340 400 350 T495 350",
              "M305 350 Q350 360 400 350 T495 350",
              "M305 350 Q350 340 400 350 T495 350",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Blood Drops Falling from Top Tube */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.path
            key={`drop-${i}`}
            d="M400 105 C400 105, 395 115, 395 120 C395 125, 400 128, 400 128 C400 128, 405 125, 405 120 C405 115, 400 105, 400 105"
            fill="#ef4444"
            filter="url(#glow)"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              y: [0, 280, 300],
              opacity: [0, 1, 1, 0],
              scale: [0.3, 1, 1, 0.8],
            }}
            transition={{
              duration: 2.5,
              delay: 3 + i * 0.8,
              repeat: Infinity,
              ease: "easeIn",
              times: [0, 0.7, 0.9, 1],
            }}
          />
        ))}

        {/* Splash Ripples when drops hit */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.ellipse
            key={`ripple-${i}`}
            cx="400"
            cy="350"
            rx="20"
            ry="5"
            stroke="#fca5a5"
            strokeWidth="1.5"
            fill="none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 2, 3],
              rx: [10, 40, 60],
            }}
            transition={{
              duration: 1.5,
              delay: 4.5 + i * 0.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Blood Drop Logo on Bag, with a soft pulsing glow */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6, type: "spring" }}
        >
          <motion.path
            d="M400 280 C400 280, 385 300, 385 315 C385 328, 391 335, 400 335 C409 335, 415 328, 415 315 C415 300, 400 280, 400 280"
            fill="white"
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <path
            d="M400 295 L400 320 M390 310 L400 320 L410 310"
            stroke="#dc2626"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>

        {/* Floating Blood Drops Around the Scene */}
        {[
          { x: 200, y: 100, delay: 0 },
          { x: 600, y: 150, delay: 1.2 },
          { x: 250, y: 400, delay: 2.4 },
          { x: 650, y: 350, delay: 0.8 },
          { x: 180, y: 250, delay: 1.6 },
          { x: 620, y: 450, delay: 3.2 },
        ].map((pos, i) => (
          <motion.path
            key={`float-${i}`}
            d={`M${pos.x} ${pos.y} 
                C${pos.x} ${pos.y}, 
                ${pos.x - 5} ${pos.y + 10}, 
                ${pos.x - 5} ${pos.y + 15} 
                C${pos.x - 5} ${pos.y + 20}, 
                ${pos.x} ${pos.y + 23}, 
                ${pos.x} ${pos.y + 23} 
                C${pos.x} ${pos.y + 23}, 
                ${pos.x + 5} ${pos.y + 20}, 
                ${pos.x + 5} ${pos.y + 15} 
                C${pos.x + 5} ${pos.y + 10}, 
                ${pos.x} ${pos.y}, 
                ${pos.x} ${pos.y}`}
            fill={i % 2 === 0 ? "#fecaca" : "#f87171"}
            initial={{ opacity: 0.3 }}
            animate={{
              y: [0, -18, 0],
              x: [0, i % 2 === 0 ? 4 : -4, 0],
              opacity: [0.3, 0.65, 0.3],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              delay: pos.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Heartbeat / ECG Line */}
        <motion.path
          d="M150 520 L250 520 L270 520 L280 480 L300 560 L320 500 L340 520 L450 520"
          stroke="#e11d48"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 3 }}
        />

        {/* Animated ECG Pulse traveling along the line */}
        <motion.circle
          r="4"
          fill="#ef4444"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2.5,
            delay: 4,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1],
          }}
        >
          <animateMotion
            dur="2.5s"
            begin="4s"
            repeatCount="indefinite"
            path="M150 520 L250 520 L270 520 L280 480 L300 560 L320 500 L340 520 L450 520"
          />
        </motion.circle>

        {/* Cross Medical Symbols Floating */}
        {[
          { x: 180, y: 200, size: 24, delay: 0 },
          { x: 620, y: 280, size: 20, delay: 1.5 },
          { x: 220, y: 480, size: 18, delay: 3 },
          { x: 580, y: 120, size: 22, delay: 2 },
        ].map((cross, i) => (
          <motion.g
            key={`cross-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.15, 0.35, 0.15],
              scale: [0.8, 1.2, 0.8],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              delay: cross.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <rect
              x={cross.x - cross.size / 4}
              y={cross.y - cross.size / 2}
              width={cross.size / 2}
              height={cross.size}
              rx={2}
              fill="#f43f5e"
              opacity={0.6}
            />
            <rect
              x={cross.x - cross.size / 2}
              y={cross.y - cross.size / 4}
              width={cross.size}
              height={cross.size / 2}
              rx={2}
              fill="#f43f5e"
              opacity={0.6}
            />
          </motion.g>
        ))}

        {/* Flowing Blood Vessel Lines */}
        <motion.path
          d="M100 300 Q200 280 300 320 T500 300"
          stroke="#fecaca"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 8"
          animate={{ strokeDashoffset: [0, -16] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          opacity={0.5}
        />
        <motion.path
          d="M700 200 Q600 220 500 180 T300 200"
          stroke="#fecaca"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 8"
          animate={{ strokeDashoffset: [0, 16] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          opacity={0.4}
        />

        {/* Small Particles / Cells Flowing — positions precomputed via useMemo, no Math.random() at render */}
        {particles.map((p) => (
          <motion.circle
            key={`cell-${p.id}`}
            r={p.r}
            fill={p.isRed ? "#ef4444" : "#fca5a5"}
            cx={p.cx}
            cy={p.cy}
            initial={{ opacity: 0.3 }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Text: "One donation saves 3 lives" */}
        <motion.text
          x="400"
          y="580"
          textAnchor="middle"
          fill="#be123c"
          fontSize="14"
          fontWeight="600"
          fontFamily="system-ui, sans-serif"
          letterSpacing="2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.6, 0.6, 0.6], y: 0 }}
          transition={{ delay: 4, duration: 1 }}
        >
          ONE DONATION SAVES 3 LIVES
        </motion.text>
      </svg>
    </div>
  );
};
