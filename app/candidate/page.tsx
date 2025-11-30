"use client";

import AppShell from "../../components/AppShell";
import TiltCard from "../../components/TiltCard";
import { useAuth } from "../../store/authStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <AppShell
      title="Athlete Dashboard"
      subtitle="Manage your championships, registrations and results."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <TiltCard>
          <h2 className="font-semibold text-lg mb-1">Welcome</h2>
          <p className="text-sm text-gray-600 mb-4">
            Hello {user?.username}, ready for the next event?
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/candidate/championships")}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
          >
            View Championships
          </motion.button>
        </TiltCard>

        <TiltCard>
          <h2 className="font-semibold text-lg mb-1">My Registrations</h2>
          <p className="text-sm text-gray-600 mb-4">
            Check your registered categories.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/candidate/registrations")}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
          >
            View Registrations
          </motion.button>
        </TiltCard>

        <TiltCard>
          <h2 className="font-semibold text-lg mb-1">Result Board</h2>
          <p className="text-sm text-gray-600 mb-4">
            View your scores and placements.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/candidate/results")}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
          >
            View Results
          </motion.button>
        </TiltCard>

      </div>
    </AppShell>
  );
}
