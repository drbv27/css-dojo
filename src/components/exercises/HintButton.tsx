"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface HintButtonProps {
  hint: string;
}

export default function HintButton({ hint }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20 rounded-lg hover:bg-neon-yellow/20 transition-colors text-sm font-medium"
      >
        <Lightbulb className="w-4 h-4" />
        {isOpen ? "Ocultar pista" : "Pista"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 px-4 py-3 bg-neon-yellow/5 border border-neon-yellow/10 rounded-lg text-sm text-neon-yellow/90">
              {hint}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
