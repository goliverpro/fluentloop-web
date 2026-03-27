import { Scenario } from "@/types";
import Button from "@/components/ui/Button";

const C = {
  surface: "#111D35",
  border: "#1E3050",
  text: "#F1F5F9",
  muted: "#94A3B8",
  primary: "#006DB2",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
};

const CATEGORY_LABELS: Record<string, string> = {
  work: "Trabalho",
  travel: "Viagem",
  daily: "Cotidiano",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  A2: C.success,
  B1: C.warning,
  B2: C.error,
};

export default function ScenarioCard({ scenario, onStart }: { scenario: Scenario; onStart: (s: Scenario) => void }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,109,178,0.4)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <div>
          <p style={{ fontWeight: 600, color: C.text, fontSize: "0.9375rem" }}>{scenario.name}</p>
          <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "4px", lineHeight: 1.5 }}>{scenario.description}</p>
        </div>
        {!scenario.is_free && (
          <span style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "6px",
            background: "rgba(245,158,11,0.12)",
            color: C.warning,
            flexShrink: 0,
          }}>
            Pro
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{
          fontSize: "0.6875rem",
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: "6px",
          background: "rgba(0,109,178,0.10)",
          color: C.primary,
        }}>
          {CATEGORY_LABELS[scenario.category] ?? scenario.category}
        </span>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: DIFFICULTY_COLOR[scenario.difficulty] ?? C.muted }}>
          {scenario.difficulty}
        </span>
        <span style={{ fontSize: "0.75rem", color: C.muted }}>• {scenario.ai_role}</span>
      </div>

      <Button size="sm" onClick={() => onStart(scenario)} style={{ width: "100%" }}>
        Iniciar conversa
      </Button>
    </div>
  );
}
