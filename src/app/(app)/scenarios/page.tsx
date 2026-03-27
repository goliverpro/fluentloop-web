"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Scenario } from "@/types";
import Header from "@/components/layout/Header";
import ScenarioCard from "@/components/scenarios/ScenarioCard";
import Spinner from "@/components/ui/Spinner";

const CATEGORY_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "work", label: "Trabalho" },
  { value: "travel", label: "Viagem" },
  { value: "daily", label: "Cotidiano" },
];

export default function ScenariosPage() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Scenario[]>("/scenarios/")
      .then(setScenarios)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleStart(scenario: Scenario) {
    const session = await apiFetch<{ id: string }>("/sessions/", {
      method: "POST",
      body: JSON.stringify({
        type: "roleplay",
        pillar: "speaking",
        scenario_id: scenario.id,
      }),
    });
    router.push(`/chat/${session.id}`);
  }

  const filtered =
    filter === "all" ? scenarios : scenarios.filter((s) => s.category === filter);

  return (
    <>
      <Header title="Cenários" subtitle="Escolha um cenário para praticar" />

      <div className="flex gap-2 mb-6">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-[#6C63FF] text-white"
                : "bg-[#1A1D27] text-[#64748B] hover:text-[#E2E8F0] border border-[#2D3148]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#64748B]">
          <p>Nenhum cenário disponível nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} onStart={handleStart} />
          ))}
        </div>
      )}
    </>
  );
}
