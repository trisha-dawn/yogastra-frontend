"use client";

import AppShell from "../../../../../components/AppShell";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { API } from "../../../../../lib/api";
import { useAuth } from "../../../../../store/authStore";
import { useToastStore } from "../../../../../store/toastStore";
import { motion } from "framer-motion";

export default function RegistrationForm() {
  const { champId, catId } = useParams();
  const { token } = useAuth();
  const { addToast } = useToastStore();
  const router = useRouter();
  const [chestNo, setChestNo] = useState("");

  async function submit() {
    try {
      await API.post(
        "/registrations",
        {
          data: {
            championship: champId,
            age_category: catId,
            ChestNo: Number(chestNo),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addToast("Registration successful!", "success");
      router.push("/candidate/registrations");
    } catch (err) {
      console.log(err);
      addToast("Registration failed", "error");
    }
  }

  return (
    <AppShell title="Register">
      <div className="max-w-md mx-auto bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Chest Number
        </label>
        <input
          className="w-full p-3 border rounded-xl bg-white/60 mb-4"
          onChange={(e) => setChestNo(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
        >
          Submit
        </motion.button>
      </div>
    </AppShell>
  );
}
