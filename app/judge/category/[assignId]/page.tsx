"use client";

import AppShell from "../../../../components/AppShell";
import TiltCard from "../../../../components/TiltCard";
import { API } from "../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../../store/authStore";
import { useToastStore } from "../../../../store/toastStore";

export default function ParticipantList() {
  const { token } = useAuth();
  const { addToast } = useToastStore();
  const router = useRouter();
  const { assignId } = useParams();

  const [participants, setParticipants] = useState<any[]>([]);
  const [assignment, setAssignment] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      try {
        // Load assignment info
        const res = await API.get(
          `/judge-assignments/${assignId}?populate[championship]=*&populate[age_category]=*`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignment(res.data.data);

        // Load participants for that championship & category
        const reg = await API.get(
          `/registrations?filters[championship][id][$eq]=${
            res.data.data.attributes.championship.data.id
          }&filters[age_category][id][$eq]=${
            res.data.data.attributes.age_category.data.id
          }&populate=user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sorted = reg.data.data.sort(
          (a: any, b: any) => a.attributes.ChestNo - b.attributes.ChestNo
        );
        setParticipants(sorted);
      } catch (err) {
        console.log("Error loading participants", err);
      }
    }
    load();
  }, [assignId, token]);

  if (!assignment) return null;

  const champ = assignment.attributes.championship.data.attributes.name;
  const category = assignment.attributes.age_category.data.attributes.name;

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 5) {
        addToast("You can select maximum 5 candidates at a time.", "error");
        return prev;
      }
      return [...prev, id];
    });
  }

  function handleScoreSelected() {
    if (selectedIds.length === 0) {
      addToast("Select at least 1 candidate.", "error");
      return;
    }
    const ids = selectedIds.join(",");
    router.push(`/judge/group?ids=${ids}`);
  }

  return (
    <AppShell
      title="Participants"
      subtitle={`${champ} • ${category}`}
    >
      {/* Top info bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">
          Select 1–5 candidates and tap{" "}
          <span className="font-semibold">“Score selected”</span>.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleScoreSelected}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow"
        >
          Score selected ({selectedIds.length})
        </motion.button>
      </div>

      {/* Participant cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {participants.map((p: any, i: number) => {
          const chestNo = p.attributes.ChestNo;
          const athleteName = p.attributes.user.data.attributes.username;
          const checked = selectedIds.includes(p.id);

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <TiltCard>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(p.id)}
                    className="mt-1 w-4 h-4"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      Chest No: {chestNo}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Athlete: {athleteName}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {participants.length === 0 && (
        <p className="text-center text-gray-600 mt-6">
          No participants found in this category.
        </p>
      )}
    </AppShell>
  );
}
