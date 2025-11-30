"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../store/authStore";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  if (!user) return null;

  const roleRoutes: Record<string, string> = {
    admin: "/admin",
    judge: "/judge",
    candidate: "/candidate",
  };

  const roleColors: Record<string, string> = {
    admin: "from-blue-600 to-indigo-600",
    judge: "from-green-600 to-teal-600",
    candidate: "from-purple-600 to-pink-600",
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-200 via-blue-200 to-white px-5">

      {/* Floating Blobs */}
      <motion.div
        initial={{ opacity: 0.4, scale: 1 }}
        animate={{ opacity: 0.7, scale: 1.2 }}
        transition={{ repeat: Infinity, duration: 6, repeatType: "mirror" }}
        className="absolute top-16 left-20 w-52 h-52 bg-indigo-400 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0.3, scale: 1.1 }}
        animate={{ opacity: 0.5, scale: 1.3 }}
        transition={{ repeat: Infinity, duration: 7, repeatType: "mirror" }}
        className="absolute bottom-16 right-24 w-72 h-72 bg-blue-400 rounded-full blur-[90px]"
      />

      {/* Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-xl"
      >
        <div className="text-center">
          <motion.h1
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent mb-2"
          >
            YogAstra Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-700 font-medium mb-8"
          >
            Welcome, <span className="font-semibold">{user.username}</span>
          </motion.p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(roleRoutes[user.appRole])}
          className={`w-full p-4 rounded-2xl text-white font-semibold shadow-lg bg-gradient-to-r ${
            roleColors[user.appRole]
          }`}
        >
          Go to {user.appRole.charAt(0).toUpperCase() + user.appRole.slice(1)} Panel
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full mt-6 p-3 rounded-xl bg-red-600 text-white font-semibold shadow-lg"
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
}
