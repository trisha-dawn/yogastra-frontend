"use client";

import { motion } from "framer-motion";

const roleConfig: Record<
  string,
  { label: string; gradient: string; emoji: string }
> = {
  admin: {
    label: "Admin",
    gradient: "from-blue-600 to-indigo-600",
    emoji: "🛠️",
  },
  judge: {
    label: "Judge",
    gradient: "from-emerald-500 to-teal-500",
    emoji: "⚖️",
  },
  candidate: {
    label: "Athlete",
    gradient: "from-purple-500 to-pink-500",
    emoji: "🧘‍♀️",
  },
};

export default function RolePill({ role }: { role: string }) {
  const config = roleConfig[role] ?? roleConfig.candidate;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${config.gradient} shadow-lg`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </motion.div>
  );
}
