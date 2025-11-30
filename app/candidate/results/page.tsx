"use client";

import AppShell from "../../../components/AppShell";
import { API } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "../../../store/authStore";
import TiltCard from "../../../components/TiltCard";
import { motion } from "framer-motion";

export default function CandidateResults() {
  const { token } = useAuth();
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await API.get("/registrations?populate=*", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Only registrations with SCORES
      const filtered = res.data.data.filter(
        (item: any) => item.attributes.scores.data.length > 0
      );

      setResults(filtered);
    }
    load();
  }, [token]);

  return (
    <AppShell
      title="My Results"
      subtitle="Your final scores & placements"
    >
      {results.length === 0 && (
        <div className="text-center text-gray-600 mt-10">
          No results available yet.
          <br />
          <span className="text-sm">
            (Judges have not evaluated your events)
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {results.map((reg, i) => {
          const scoreObj = reg.attributes.scores.data[0].attributes;

          return (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <TiltCard>
                {/* Championship Name */}
                <h2 className="font-bold text-lg mb-1">
                  {
                    reg.attributes.championship.data.attributes
                      .name
                  }
                </h2>

                {/* Category */}
                <p className="text-sm text-gray-600 mb-1">
                  Category:{" "}
                  {
                    reg.attributes.age_category.data.attributes
                      .name
                  }
                </p>

                {/* Chest Number */}
                <p className="text-sm text-gray-700 mb-3">
                  Chest No: {reg.attributes.ChestNo}
                </p>

                {/* Score */}
                <div className="mt-2 flex items-center gap-3">
                  <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow">
                    Score: {scoreObj.totalScore}
                  </span>

                  {scoreObj.rank ? (
                    <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow">
                      Rank: {scoreObj.rank}
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                      No rank assigned
                    </span>
                  )}
                </div>

                {/* Details Breakdown */}
                <div className="mt-4 text-xs text-gray-600 space-y-1">
                  <p>• Difficulty: {scoreObj.difficulty}</p>
                  <p>• Execution: {scoreObj.execution}</p>
                  <p>• Artistry: {scoreObj.artistry}</p>
                  <p>• Penalty: {scoreObj.penalty}</p>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
