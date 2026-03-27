import { Message } from "@/types";

const C = {
  surface: "#111D35",
  border: "#1E3050",
  text: "#F1F5F9",
  muted: "#94A3B8",
  primary: "#006DB2",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
};

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "70%",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          padding: "10px 14px",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          background: isUser ? C.primary : C.surface,
          color: isUser ? "#ffffff" : C.text,
          border: isUser ? "none" : `1px solid ${C.border}`,
        }}
      >
        {message.content}
      </div>

      {message.corrections && message.corrections.length > 0 && (
        <div
          style={{
            maxWidth: "70%",
            background: C.surface,
            border: `1px solid rgba(239,68,68,0.25)`,
            borderRadius: "12px",
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.error, display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
            Correções
          </p>
          {message.corrections.map((c) => (
            <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ textDecoration: "line-through", color: C.muted }}>{c.original_text}</span>
                <span style={{ color: C.success, fontWeight: 600 }}>{c.corrected_text}</span>
                <span style={{
                  fontSize: "0.6875rem",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  background: c.error_type === "grammar" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                  color: c.error_type === "grammar" ? C.error : C.warning,
                  fontWeight: 500,
                }}>
                  {c.error_type}
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>{c.explanation}</p>
            </div>
          ))}
        </div>
      )}

      <span style={{ fontSize: "0.6875rem", color: C.muted }}>
        {new Date(message.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}
