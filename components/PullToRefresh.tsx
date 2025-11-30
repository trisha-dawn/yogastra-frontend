"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PullToRefresh({ children }: any) {
  const router = useRouter();
  const [pull, setPull] = useState(0);

  function onTouchMove(e: any) {
    if (window.scrollY === 0) {
      const pullDistance = Math.min(e.touches[0].clientY, 80);
      setPull(pullDistance);
    }
  }

  function onTouchEnd() {
    if (pull > 60) {
      router.refresh();
    }
    setPull(0);
  }

  return (
    <div
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative"
    >
      <motion.div
        animate={{ height: pull }}
        className="bg-indigo-400 text-white text-center text-xs"
      >
        {pull > 10 && "↻ Pull to refresh"}
      </motion.div>

      {children}
    </div>
  );
}
