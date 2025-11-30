"use client";

import AppShell from "../../../../components/AppShell";
import { API } from "../../../../lib/api";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "../../../../store/toastStore";
import { useAuth } from "../../../../store/authStore";

export default function ScorePage() {
  const { regId } = useParams();
  const params = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const { addToast } = useToastStore();

  const listString = params.get("list") || "";
  const idList = listString.split(",").map((id) => Number(id));

  const index = idList.indexOf(Number(regId));
  const prevId = idList[index - 1];
  const nextId = idList[index + 1];

  const totalParticipants = idList.length;
  const currentNumber = index + 1;

  const [reg, setReg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({
    difficulty: "",
    execution: "",
    artistry: "",
    penalty: "",
  });

  const touchStartX = useRef<number | null>(null);

  // BLOCK NAVIGATION IF NOT SUBMITTED
  function blockIfNotSubmitted(action: () => void) {
    const filled = Object.values(score).some((v) => v !== "");

    if (!filled) {
      addToast("Please enter the score first.", "error");
      return;
    }

    if (!submitted) {
      addToast("Please submit the score first.", "error");
      return;
    }

    action();
  }

  // SWIPE handlers
  function handleTouchStart(e: any) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: any) {
    if (touchStartX.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;

    if (diff > 60 && prevId) {
      blockIfNotSubmitted(() =>
        router.push(`/judge/score/${prevId}?list=${listString}`)
      );
    }

    if (diff < -60 && nextId) {
      blockIfNotSubmitted(() =>
        router.push(`/judge/score/${nextId}?list=${listString}`)
      );
    }

    touchStartX.current = null;
  }

  async function loadParticipant(id: any) {
    setLoading(true);

    const res = await API.get(`/registrations/${id}?populate=user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setReg(res.data.data);
    setScore({
      difficulty: "",
      execution: "",
      artistry: "",
      penalty: "",
    });
    setSubmitted(false);

    setLoading(false);
  }

  useEffect(() => {
    loadParticipant(regId);
  }, [regId]);

  async function submitScore() {
    try {
      const total =
        Number(score.difficulty) +
        Number(score.execution) +
        Number(score.artistry) -
        Number(score.penalty);

      await API.post(
        "/scores",
        {
          data: {
            ...score,
            totalScore: total,
            registration: regId,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addToast("Score submitted!", "success");
      setSubmitted(true);
    } catch (e) {
      addToast("Error submitting score", "error");
    }
  }

  if (loading || !reg) return null;

  return (
    <AppShell
      title="Scoring"
      subtitle={`Chest No: ${reg.attributes.ChestNo}`}
    >
      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <AnimatePresence mode="wait">
          <motion.div
            key={regId}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg space-y-6"
          >
            {/* PROGRESS INDICATOR */}
            <div className="text-center">
              <p className="font-semibold text-gray-700">
                Participant {currentNumber} / {totalParticipants}
              </p>

              <div className="w-full h-2 mt-2 bg-gray-300 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(currentNumber / totalParticipants) * 100}%`,
                  }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                />
              </div>
            </div>

            {/* SCORE INPUT FIELDS */}
            {["difficulty", "execution", "artistry", "penalty"].map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-semibold capitalize">
                  {field}
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-3 rounded-xl border bg-white/60"
                  value={score[field as keyof typeof score]}
                  onChange={(e) =>
                    setScore((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                />
              </div>
            ))}

            {/* SUBMIT */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3 rounded-xl text-white font-bold ${
                submitted
                  ? "bg-gray-500"
                  : "bg-gradient-to-r from-green-600 to-emerald-600"
              }`}
              disabled={submitted}
              onClick={submitScore}
            >
              {submitted ? "Submitted ✓" : "Submit Score"}
            </motion.button>

            {/* NAVIGATION */}
            <div className="flex justify-between gap-3 mt-4">
              {/* Prev Button */}
              <motion.button
                whileHover={{ scale: prevId ? 1.05 : 1 }}
                disabled={!prevId}
                onClick={() =>
                  blockIfNotSubmitted(() =>
                    router.push(`/judge/score/${prevId}?list=${listString}`)
                  )
                }
                className={`flex-1 py-3 rounded-xl text-white font-semibold ${
                  prevId
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600"
                    : "bg-gray-400"
                }`}
              >
                ⬅ Previous
              </motion.button>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: nextId ? 1.05 : 1 }}
                disabled={!nextId}
                onClick={() =>
                  blockIfNotSubmitted(() =>
                    router.push(`/judge/score/${nextId}?list=${listString}`)
                  )
                }
                className={`flex-1 py-3 rounded-xl text-white font-semibold ${
                  nextId
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gray-400"
                }`}
              >
                Next ➡
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
