"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "../store/authStore";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import PageTransition from "./PageTransition";
import RolePill from "./RolePill";
import PullToRefresh from "./PullToRefresh";
import { motion } from "framer-motion";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AppShell({ title, subtitle, children }: AppShellProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  // Swipe detection to open sidebar
  function handleTouchStart(e: any) {
    const x = e.touches[0].clientX;
    if (x < 25) {
      setMobileOpen(true);
    }
  }

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR (Desktop + Mobile Drawer) */}
      <Sidebar
        role={user.appRole}
        onLogout={() => {
          logout();
          router.push("/login");
        }}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN CONTENT */}
      <motion.main
        onTouchStart={handleTouchStart}
        className="flex-1 p-5 md:p-6 pb-20 md:pb-6"
      >
        {/* MOBILE TOP BAR */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <button onClick={() => setMobileOpen(true)}>
            <div className="w-8 h-8 flex flex-col justify-between p-1.5">
              <span className="block h-1 bg-gray-700 rounded"></span>
              <span className="block h-1 bg-gray-700 rounded"></span>
              <span className="block h-1 bg-gray-700 rounded"></span>
            </div>
          </button>

          <RolePill role={user.appRole} />
        </div>

        {/* DESKTOP HEADER */}
        <PageTransition>
          <header className="hidden md:flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            <RolePill role={user.appRole} />
          </header>

          {/* CONTENT WITH PULL TO REFRESH (MOBILE) */}
          <PullToRefresh>{children}</PullToRefresh>
        </PageTransition>
      </motion.main>
    </div>
  );
}
