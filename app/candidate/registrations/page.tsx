"use client";

import AppShell from "../../../components/AppShell";
import { API } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "../../../store/authStore";
import TiltCard from "../../../components/TiltCard";
import { motion } from "framer-motion";

export default function MyRegistrations() {
  const { token } = useAuth();
  const [regs, setRegs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await API.get("/registrations?populate=*", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegs(res.data.data);
    }
    load();
  }, [token]);

  return (
    <AppShell title="My Registrations" subtitle="Your registered categories">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regs.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TiltCard>
              <h2 className="font-semibold mb-1">
                {r.attributes.championship.data.attributes.name}
              </h2>
              <p className="text-sm text-gray-600">
                Category:{" "}
                {
                  r.attributes.age_category.data.attributes.name
                }
              </p>
              <p className="mt-1 text-sm">Chest No: {r.attributes.ChestNo}</p>

              {r.attributes.scores.data.length > 0 ? (
                <p className="mt-2 text-green-700 font-semibold">
                  Score:{" "}
                  {
                    r.attributes.scores.data[0].attributes.totalScore
                  }
                </p>
              ) : (
                <p className="mt-2 text-gray-500 italic">Awaiting scoring…</p>
              )}
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
