"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { API } from "../../lib/api";
import { useAuth } from "../../store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();

    try {
      const res = await API.post("/auth/local", {
        identifier: email,
        password: password,
      });

      const { jwt, user } = res.data;

      login(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          appRole: user.appRole,
        },
        jwt
      );

      router.push("/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-200 via-blue-200 to-white">

      {/* Floating Blobs */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.3 }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", repeatType: "mirror" }}
        className="absolute top-10 left-20 w-40 h-40 bg-indigo-400 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", repeatType: "mirror" }}
        className="absolute bottom-10 right-20 w-56 h-56 bg-blue-400 rounded-full blur-3xl"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10 w-[90%] max-w-md"
      >
        <motion.h1
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent"
        >
          YogAstra
        </motion.h1>

        <p className="text-center text-gray-700 mb-8 font-medium">
          Enter your credentials to login
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-gray-800 font-semibold mb-1 block">Email</label>
            <input
              className="w-full p-3 rounded-xl bg-white/40 border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-700 text-gray-900"
              placeholder="example@gmail.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-800 font-semibold mb-1 block">Password</label>
            <input
              className="w-full p-3 rounded-xl bg-white/40 border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-700 text-gray-900"
              placeholder="••••••••"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold tracking-wide shadow-lg"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
