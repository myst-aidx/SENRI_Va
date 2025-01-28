import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Compass, Moon } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  className?: string;
}

export default function LoadingSpinner({ message = 'タロットカードからのメッセージを受け取っています...', size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
      >
        {/* 背景グラデーション */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(126, 34, 206, 0.3) 0%, rgba(49, 46, 129, 0.9) 100%)',
            filter: 'blur(20px)'
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* 九つの星のエフェクト */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
                rotate: 0
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: 360,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            >
              <Star
                className="text-purple-300"
                size={20 + Math.random() * 20}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.8))'
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* 中央の魔法陣 */}
        <div className="relative">
          {/* 外側の魔法陣 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg className="w-96 h-96 text-purple-400/60" viewBox="0 0 200 200">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* 外側の円 */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" filter="url(#glow)" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" filter="url(#glow)" />
              
              {/* 九星の配置 */}
              {Array.from({ length: 9 }).map((_, i) => {
                const angle = (i * 40) * Math.PI / 180;
                const x = 100 + Math.cos(angle) * 70;
                const y = 100 + Math.sin(angle) * 70;
                return (
                  <g key={i} filter="url(#glow)">
                    <circle cx={x} cy={y} r="5" fill="currentColor" />
                    <line
                      x1="100"
                      y1="100"
                      x2={x}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </g>
                );
              })}
              
              {/* 五行の象徴 */}
              <path
                d="M100 5 L195 100 L100 195 L5 100 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                filter="url(#glow)"
              />
            </svg>
          </motion.div>

          {/* 内側の魔法陣 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: -360 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg className="w-72 h-72 text-purple-300/60" viewBox="0 0 200 200">
              {/* 五行の相生相剋を表す記号 */}
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" filter="url(#glow)" />
              <path
                d="M100 40 L160 100 L100 160 L40 100 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                filter="url(#glow)"
              />
              {/* 方位を示す記号 */}
              {['北', '東', '南', '西'].map((direction, i) => {
                const angle = (i * 90) * Math.PI / 180;
                const x = 100 + Math.cos(angle) * 45;
                const y = 100 + Math.sin(angle) * 45;
                return (
                  <text
                    key={direction}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="currentColor"
                    fontSize="12"
                    filter="url(#glow)"
                  >
                    {direction}
                  </text>
                );
              })}
            </svg>
          </motion.div>

          {/* 中心の星 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star
              className="text-purple-300"
              size={48}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(167, 139, 250, 0.8))'
              }}
            />
          </motion.div>
        </div>

        {/* メッセージ */}
        <motion.p
          className="mt-12 text-2xl font-medium text-purple-200"
          style={{
            textShadow: '0 0 10px rgba(167, 139, 250, 0.5)',
            letterSpacing: '0.1em'
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            textShadow: [
              '0 0 10px rgba(167, 139, 250, 0.5)',
              '0 0 20px rgba(167, 139, 250, 0.8)',
              '0 0 10px rgba(167, 139, 250, 0.5)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>

        {/* 装飾的な方位のアイコン */}
        <div className="absolute top-20 left-20">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1]
            }}
            transition={{
              rotate: {
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Compass className="w-16 h-16 text-purple-300/60" style={{ filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))' }} />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-20">
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.5, 1]
            }}
            transition={{
              rotate: {
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Moon className="w-16 h-16 text-purple-300/60" style={{ filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))' }} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 