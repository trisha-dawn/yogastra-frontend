"use client";

import AppShell from "../../components/AppShell";
import TiltCard from "../../components/TiltCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const dummyData = [
  { id: 1, name: "SEA Hawk Cup 2.0", location: "Digha", status: "upcoming" },
  { id: 2, name: "District Championship", location: "Howrah", status: "ongoing" },
  { id: 3, name: "State Selection", location: "Kolkata", status: "completed" },
];

const statusColor: Record<string, string> = {
  upcoming: "bg-amber-100 text-amber-800",
  ongoing: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-700",
};

export default function AdminDashboard() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");

  const filtered = dummyData.filter(
    (c) => statusFilter === "all" || c.status === statusFilter
  );

  return (
    <AppShell
      title="Admin Overview"
      subtitle="Manage championships, judges and results."
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <TiltCard>
          <p className="text-xs text-gray-500 mb-1">Total Championships</p>
          <p className="text-2xl font-bold">{dummyData.length}</p>
        </TiltCard>
        <TiltCard>
          <p className="text-xs text-gray-500 mb-1">Upcoming</p>
          <p className="text-2xl font-bold">
            {dummyData.filter((c) => c.status === "upcoming").length}
          </p>
        </TiltCard>
        <TiltCard>
          <p className="text-xs text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold">
            {dummyData.filter((c) => c.status === "completed").length}
          </p>
        </TiltCard>
      </div>

      {/* Table + Animated Dropdown */}
      <div className="bg-white/70 backdrop-blur-lg border border-white/80 rounded-2xl shadow-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Championships</h2>

          {/* Animated dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="px-3 py-1.5 text-sm rounded-lg border bg-white/70 hover:bg-white"
            >
              Status:{" "}
              <span className="font-semibold capitalize">{statusFilter}</span>
            </button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 mt-1 w-40 bg-white border rounded-xl shadow-lg text-sm z-20"
                >
                  {["all", "upcoming", "ongoing", "completed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s as any);
                        setFilterOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 capitalize"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modern table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0 hover:bg-slate-50/80">
                  <td className="py-2 pr-4">{c.name}</td>
                  <td className="py-2 pr-4 text-gray-600">{c.location}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="py-4 text-center text-gray-500 text-xs" colSpan={3}>
                    No championships match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
