"use client";

import AppShell from "../../components/AppShell";
import TiltCard from "../../components/TiltCard";
import { useAuth } from "../../store/authStore";
import { API } from "../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function JudgeAssignments() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await API.get(
        `/judge-assignments?filters[judge][id][$eq]=${user.id}&populate=*`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAssignments(res.data.data);
    }
    load();
  }, [token, user]);

  return (
    <AppShell title="Judge Panel" subtitle="Your assigned categories">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TiltCard>
              <h2 className="text-lg font-semibold">
                {a.attributes.championship.data.attributes.name}
              </h2>

              <p className="text-sm text-gray-600">
                {a.attributes.age_category.data.attributes.name}
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                onClick={() =>
                  router.push(`/judge/category/${a.id}`)
                }
              >
                View Participants
              </motion.button>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
