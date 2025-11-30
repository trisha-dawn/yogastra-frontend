"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../store/authStore";

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const role = user.appRole;

  const items: Record<string, { label: string; href: string; icon: string }[]> =
    {
      admin: [
        { label: "Home", href: "/admin", icon: "🏠" },
        { label: "Events", href: "/admin/championships", icon: "🎪" },
        { label: "Judges", href: "/admin/judges", icon: "⚖️" },
        { label: "Results", href: "/admin/results", icon: "🏆" },
      ],
      judge: [
        { label: "Home", href: "/judge", icon: "🏠" },
        { label: "Assignments", href: "/judge", icon: "📝" },
        { label: "Score", href: "/judge/score", icon: "🎯" },
      ],
      candidate: [
        { label: "Home", href: "/candidate", icon: "🏠" },
        { label: "Events", href: "/candidate/championships", icon: "🎪" },
        { label: "My Reg", href: "/candidate/registrations", icon: "🧾" },
        { label: "Results", href: "/candidate/results", icon: "🏆" },
      ],
    };

  const current = items[role];

  return (
    <motion.div
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[40] md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-lg"
    >
      <div className="grid grid-cols-4 text-center py-2">
        {current.map((item) => {
          const active = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center"
            >
              <motion.span
                animate={{ scale: active ? 1.25 : 1 }}
                className={`text-xl ${active ? "text-indigo-600" : "text-gray-500"}`}
              >
                {item.icon}
              </motion.span>
              <span
                className={`text-[10px] font-semibold ${
                  active ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
