"use client";

import AppShell from "../../../../components/AppShell";
import { API } from "../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TiltCard from "../../../../components/TiltCard";

export default function ChampionshipDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [champ, setChamp] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await API.get(`/championships/${id}?populate=age_categories`);
      setChamp(res.data.data);
    }
    load();
  }, [id]);

  if (!champ) return <div>Loading...</div>;

  const categories = champ.attributes.age_categories.data;

  return (
    <AppShell
      title={champ.attributes.name}
      subtitle="Select your age category to register"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat: any, index: number) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TiltCard>
              <h2 className="text-lg font-semibold mb-1">
                {cat.attributes.name}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Age: {cat.attributes.minAge} - {cat.attributes.maxAge}
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  router.push(`/candidate/register/${id}/${cat.id}`)
                }
                className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
              >
                Register
              </motion.button>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
