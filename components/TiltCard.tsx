"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
}

export default function TiltCard({ children }: TiltCardProps) {
  return (
    <motion.div
      whileHover={{ rotateX: 6, rotateY: -6, y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="bg-white/60 backdrop-blur-lg border border-white/80 rounded-2xl shadow-lg p-4"
    >
      {children}
    </motion.div>
  );
}
