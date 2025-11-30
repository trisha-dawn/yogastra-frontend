"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  role: "admin" | "judge" | "candidate";
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const menuItemsByRole: Record<
  SidebarProps["role"],
  { label: string; href: string }[]
> = {
  admin: [
    { label: "Overview", href: "/admin" },
    { label: "Championships", href: "/admin/championships" },
    { label: "Judges", href: "/admin/judges" },
    { label: "Results", href: "/admin/results" },
  ],
  judge: [
    { label: "Assignments", href: "/judge" },
    { label: "Score Panel", href: "/judge/score" },
  ],
  candidate: [
    { label: "Dashboard", href: "/candidate" },
    { label: "Championships", href: "/candidate/championships" },
    { label: "My Registrations", href: "/candidate/registrations" },
    { label: "My Results", href: "/candidate/results" },
  ],
};

export default function Sidebar({
  role,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const items = menuItemsByRole[role];

  const sidebarContent = (
    <div className="h-full flex flex-col p-4 w-64 bg-white/90 backdrop-blur-xl border-r border-white/40 shadow-xl">
      <div
        className="flex items-center gap-3 mb-6 cursor-pointer"
        onClick={() => {
          router.push("/dashboard");
          setMobileOpen(false);
        }}
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
          YA
        </div>
        <div>
          <p className="text-sm font-semibold">YogAstra</p>
          <p className="text-xs text-gray-500">Scoring System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <motion.button
              key={item.href}
              whileHover={{ x: 4 }}
              className={`w-full text-left px-3 py-2 text-sm rounded-xl ${
                active
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-white/60"
              }`}
              onClick={() => {
                router.push(item.href);
                setMobileOpen(false);
              }}
            >
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      <button
        onClick={() => {
          onLogout();
          setMobileOpen(false);
        }}
        className="mt-4 text-sm text-gray-600 hover:text-red-600"
      >
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">{sidebarContent}</div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-[40]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar Drawer */}
            <motion.div
              className="fixed left-0 top-0 bottom-0 z-[50]"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", bounce: 0 }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
