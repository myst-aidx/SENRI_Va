import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function ChatLoading() {
  return (
    <div className="flex justify-start">
      <div className="bg-purple-900/50 rounded-lg p-4 flex items-center space-x-2">
        <motion.div
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            >
              <Star className="w-4 h-4 text-purple-300" />
            </motion.div>
          ))}
        </motion.div>
        <span className="text-purple-300">考え中...</span>
      </div>
    </div>
  );
} 