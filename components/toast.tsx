"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "../store/toastStore";

const bgByType = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-slate-700",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${bgByType[toast.type]}`}
          >
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
