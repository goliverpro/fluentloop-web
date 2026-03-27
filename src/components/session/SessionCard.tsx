import Link from "next/link";
import { Session } from "@/types";
import { MessageSquare, Clock } from "lucide-react";

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

const PILLAR_LABELS: Record<string, string> = {
  speaking: "Fala",
  writing: "Escrita",
  comprehension: "Compreensão",
};

function formatDuration(start: string, end: string | null): string {
  if (!end) return "Em andamento";
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.floor(diff / 60000);
  return mins < 1 ? "< 1 min" : `${mins} min`;
}

function errorColor(rate: number | null) {
  if (rate === null) return C.muted;
  if (rate < 20) return C.success;
  if (rate < 40) return C.warning;
  return C.error;
}

export default function SessionCard({ session }: { session: Session }) {
  return (
    <Link
      href={`/chat/${session.id}`}
      style={{
        display: "block",
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        textDecoration: "none",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,109,178,0.4)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "8px" }}>
        <div>
          <p style={{ fontWeight: 600, color: C.text, fontSize: "0.875rem" }}>
            {session.scenario_name ?? "Chat livre"}
          </p>
          <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "2px" }}>
            {new Date(session.started_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
        <span style={{
          fontSize: "0.6875rem",
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: "6px",
          background: "rgba(0,109,178,0.12)",
          color: C.primary,
          flexShrink: 0,
        }}>
          {PILLAR_LABELS[session.pillar] ?? session.pillar}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.75rem", color: C.muted }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <MessageSquare size={12} />
          {session.total_messages ?? 0} msgs
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Clock size={12} />
          {formatDuration(session.started_at, session.ended_at)}
        </span>
        {session.error_rate !== null && (
          <span style={{ color: errorColor(session.error_rate), fontWeight: 500 }}>
            {session.error_rate}% erros
          </span>
        )}
      </div>
    </Link>
  );
}
