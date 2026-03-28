"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Scenario } from "@/types";
import ScenarioCard from "@/components/scenarios/ScenarioCard";
import Spinner from "@/components/ui/Spinner";

const C = {
  surface: "#111D35",
  border: "#1E3050",
  text: "#F1F5F9",
  muted: "#94A3B8",
  primary: "#006DB2",
  warning: "#F59E0B",
};

const CATEGORY_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "work", label: "Trabalho" },
  { value: "travel", label: "Viagem" },
  { value: "daily", label: "Cotidiano" },
  { value: "pro", label: "PRO" },
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
      body: JSON.stringify({ type: "roleplay", pillar: "speaking", scenario_id: scenario.id }),
    });
    router.push(`/chat/${session.id}`);
  }

  const hasPro = scenarios.some((s) => !s.is_free);
  const visibleFilters = hasPro ? CATEGORY_FILTERS : CATEGORY_FILTERS.filter((f) => f.value !== "pro");

  const filtered =
    filter === "all" ? scenarios
    : filter === "pro" ? scenarios.filter((s) => !s.is_free)
    : scenarios.filter((s) => s.category === filter);

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "4px" }}>Cenários</h1>
        <p style={{ fontSize: "0.875rem", color: C.muted }}>Escolha um cenário para praticar</p>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {visibleFilters.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "6px 16px",
                borderRadius: "8px",
                fontSize: "0.8125rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                background: active ? (f.value === "pro" ? C.warning : C.primary) : C.surface,
                color: active ? "#ffffff" : f.value === "pro" ? C.warning : C.muted,
                outline: active ? "none" : f.value === "pro" ? `1px solid rgba(245,158,11,0.3)` : `1px solid ${C.border}`,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: C.muted, fontSize: "0.875rem" }}>
          Nenhum cenário disponível nesta categoria.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {filtered.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} onStart={handleStart} />
          ))}
        </div>
      )}
    </div>
  );
}
