import { motion } from "framer-motion";
import { useState } from "react";

export function StudyingKidIllustration() {
  const [isAngry, setIsAngry] = useState(false);

  const handleHover = () => {
    setIsAngry(true);
    setTimeout(() => setIsAngry(false), 2000);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.svg
        width="300"
        height="400"
        viewBox="0 0 300 400"
        onMouseEnter={handleHover}
        className="cursor-pointer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background circle */}
        <motion.circle
          cx="150"
          cy="200"
          r="120"
          fill="rgba(139, 92, 246, 0.1)"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Body - Formal Suit */}
        <motion.rect
          x="110"
          y="180"
          width="80"
          height="100"
          rx="10"
          fill="#2563eb"
          animate={isAngry ? { fill: "#1e3a8a" } : { fill: "#2563eb" }}
        />

        {/* Tie */}
        <motion.path
          d="M 150 200 L 145 220 L 150 240 L 155 220 Z"
          fill="#dc2626"
        />

        {/* Head */}
        <motion.circle
          cx="150"
          cy="150"
          r="35"
          fill="#ffdbac"
          animate={
            isAngry
              ? { y: [0, -5, 0] }
              : { y: [0, 2, 0] }
          }
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Hair */}
        <motion.ellipse
          cx="150"
          cy="130"
          rx="38"
          ry="25"
          fill="#2c1810"
        />

        {/* Eyes */}
        <motion.g>
          <circle cx="140" cy="145" r="4" fill="#000" />
          <circle cx="160" cy="145" r="4" fill="#000" />
          
          {/* Angry eyebrows */}
          {isAngry && (
            <>
              <motion.line
                x1="133"
                y1="138"
                x2="145"
                y2="142"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.line
                x1="155"
                y1="142"
                x2="167"
                y2="138"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </>
          )}
        </motion.g>

        {/* Mouth */}
        <motion.path
          d={isAngry ? "M 140 165 Q 150 160 160 165" : "M 140 160 Q 150 165 160 160"}
          stroke="#000"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={isAngry ? { d: "M 140 165 Q 150 160 160 165" } : { d: "M 140 160 Q 150 165 160 160" }}
        />

        {/* Arms */}
        <motion.rect
          x="90"
          y="190"
          width="15"
          height="60"
          rx="7"
          fill="#2563eb"
          animate={
            isAngry
              ? { rotate: -20, originX: "95px", originY: "190px" }
              : { rotate: 10, originX: "95px", originY: "190px" }
          }
          transition={{ duration: 0.5 }}
        />
        <motion.rect
          x="195"
          y="190"
          width="15"
          height="60"
          rx="7"
          fill="#2563eb"
          animate={
            isAngry
              ? { rotate: 20, originX: "200px", originY: "190px" }
              : { rotate: -10, originX: "200px", originY: "190px" }
          }
          transition={{ duration: 0.5 }}
        />

        {/* Hands */}
        <circle cx="97" cy="250" r="8" fill="#ffdbac" />
        <circle cx="203" cy="250" r="8" fill="#ffdbac" />

        {/* Legs */}
        <rect x="125" y="280" width="18" height="70" rx="9" fill="#1e3a8a" />
        <rect x="157" y="280" width="18" height="70" rx="9" fill="#1e3a8a" />

        {/* Shoes */}
        <ellipse cx="134" cy="355" rx="12" ry="8" fill="#000" />
        <ellipse cx="166" cy="355" rx="12" ry="8" fill="#000" />

        {/* Book */}
        <motion.g
          animate={
            isAngry
              ? { y: 100, rotate: 45, opacity: 0 }
              : { y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.5 }}
        >
          {/* Book cover */}
          <rect x="120" y="220" width="60" height="45" rx="3" fill="#7c3aed" />
          {/* Book pages */}
          <rect x="122" y="222" width="56" height="41" rx="2" fill="#f5f5f5" />
          {/* Book lines */}
          <line x1="130" y1="235" x2="170" y2="235" stroke="#d1d5db" strokeWidth="1" />
          <line x1="130" y1="242" x2="170" y2="242" stroke="#d1d5db" strokeWidth="1" />
          <line x1="130" y1="249" x2="165" y2="249" stroke="#d1d5db" strokeWidth="1" />
        </motion.g>

        {/* Sparkles when studying */}
        {!isAngry && (
          <>
            <motion.circle
              cx="200"
              cy="140"
              r="3"
              fill="#fbbf24"
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="220"
              cy="160"
              r="2"
              fill="#fbbf24"
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx="210"
              cy="180"
              r="2.5"
              fill="#fbbf24"
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </>
        )}

        {/* Angry symbols */}
        {isAngry && (
          <>
            <motion.text
              x="190"
              y="130"
              fontSize="24"
              fill="#dc2626"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              💢
            </motion.text>
            <motion.text
              x="210"
              y="150"
              fontSize="20"
              fill="#dc2626"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              😠
            </motion.text>
          </>
        )}
      </motion.svg>

      {/* Tooltip */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-gray-700 font-medium">
          {isAngry ? "Don't disturb! 😤" : "Hover to disturb 📚"}
        </p>
      </motion.div>
    </div>
  );
}
