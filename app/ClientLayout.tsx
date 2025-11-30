"use client";

import { ReactNode, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import ToastContainer from "../components/toast";

export default function ClientLayout({ children }: { children: ReactNode }) {
  
  // Register SW for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.error("SW registration failed:", err));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-20">{children}</div>

      <ToastContainer />

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
