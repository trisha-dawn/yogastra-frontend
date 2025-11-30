"use client";

import AppShell from "../../../components/AppShell";
import TiltCard from "../../../components/TiltCard";
import { API } from "../../../lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../store/authStore";
import { useToastStore } from "../../../store/toastStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type AsanaScores = {
  asana1: string;
  asana2: string;
  asana3: string;
  asana4: string;
};

export default function GroupScoringPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const { addToast } = useToastStore();

  const idsParam = params.get("ids") || "";
  const regIds = idsParam
    .split(",")
    .map((id) => Number(id))
    .filter(Boolean);

  const [regs, setRegs] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<number, AsanaScores>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Score options 0 -> 10 with 0.25 step
  const scoreOptions = Array.from({ length: 41 }, (_, i) =>
    (i * 0.25).toFixed(2)
  );

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const results = await Promise.all(
          regIds.map((id) =>
            API.get(`/registrations/${id}?populate=user`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        const regsData = results.map((r) => r.data.data);
        setRegs(regsData);

        // init empty scores
        const initial: Record<number, AsanaScores> = {};
        regsData.forEach((r: any) => {
          initial[r.id] = {
            asana1: "",
            asana2: "",
            asana3: "",
            asana4: "",
          };
        });
        setScores(initial);
      } catch (err) {
        console.log("Error loading group registrations", err);
        addToast("Failed to load participants.", "error");
      } finally {
        setLoading(false);
      }
    }
    if (regIds.length > 0) load();
  }, [idsParam, token]);

  function updateScore(regId: number, field: keyof AsanaScores, value: string) {
    setScores((prev) => ({
      ...prev,
      [regId]: { ...prev[regId], [field]: value },
    }));
  }

  async function handleSubmitAll() {
    if (!user) return;

    // Validate completed scores
    for (const id of regIds) {
      const s = scores[id];
      if (!s || !s.asana1 || !s.asana2 || !s.asana3 || !s.asana4) {
        addToast("Please fill all 4 asana scores for every candidate.", "error");
        return;
      }
    }

    try {
      setSubmitting(true);

      await Promise.all(
        regIds.map(async (id) => {
          const s = scores[id];
          const total =
            parseFloat(s.asana1) +
            parseFloat(s.asana2) +
            parseFloat(s.asana3) +
            parseFloat(s.asana4);

          await API.post(
            "/scores",
            {
              data: {
                judge: user.id,
                registration: id,
                asana1: parseFloat(s.asana1),
                asana2: parseFloat(s.asana2),
                asana3: parseFloat(s.asana3),
                asana4: parseFloat(s.asana4),
                totalScore: total,
              },
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );

      addToast("Scores submitted for all candidates!", "success");
      router.back();
    } catch (err) {
      console.log("Error submitting scores", err);
      addToast("Failed to submit scores.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;
  if (regs.length === 0)
    return (
      <AppShell title="Group Scoring">
        <p>No candidates found.</p>
      </AppShell>
    );

  return (
    <AppShell
      title="Group Scoring"
      subtitle="Enter scores for all candidates on this screen"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {regs.map((reg, index) => {
          const chest = reg.attributes.ChestNo;
          const name = reg.attributes.user.data.attributes.username;
          const s = scores[reg.id] || {
            asana1: "",
            asana2: "",
            asana3: "",
            asana4: "",
          };

          return (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TiltCard>
                <h2 className="font-semibold text-lg mb-1">
                  Chest No: {chest}
                </h2>
                <p className="text-sm text-gray-600 mb-3">{name}</p>

                {(["asana1", "asana2", "asana3", "asana4"] as const).map(
                  (field, idx) => (
                    <div key={field} className="mb-2">
                      <label className="block text-xs font-semibold mb-1">
                        Asana {idx + 1}
                      </label>
                      <select
                        className="w-full p-2 rounded-lg border bg-white/80 text-sm"
                        value={s[field]}
                        onChange={(e) =>
                          updateScore(reg.id, field, e.target.value)
                        }
                      >
                        <option value="">Select score</option>
                        {scoreOptions.map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: submitting ? 1 : 1.03 }}
        whileTap={{ scale: submitting ? 1 : 0.97 }}
        disabled={submitting}
        onClick={handleSubmitAll}
        className={`w-full md:w-64 py-3 rounded-2xl text-white font-semibold shadow-lg block mx-auto ${
          submitting
            ? "bg-gray-400"
            : "bg-gradient-to-r from-green-600 to-emerald-600"
        }`}
      >
        {submitting ? "Submitting..." : "Submit scores for all"}
      </motion.button>
    </AppShell>
  );
}
