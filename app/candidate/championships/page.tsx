"use client";

import AppShell from "../../../components/AppShell";
import TiltCard from "../../../components/TiltCard";
import { API } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ChampionshipList() {
  const [list, setList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await API.get("/championships?populate=*");
      setList(res.data.data);
    }
    load();
  }, []);

  return (
    <AppShell title="Championships" subtitle="Available events for registration">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TiltCard>
              <h2 className="text-lg font-semibold mb-1">
                {item.attributes.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Location: {item.attributes.location}
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  router.push(`/candidate/championships/${item.id}`)
                }
                className="w-full py-2 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                View Details
              </motion.button>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
