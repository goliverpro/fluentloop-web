"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { UserProfile, Session } from "@/types";
import SessionCard from "@/components/session/SessionCard";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { MessageSquare, BookOpen, Zap, TrendingUp } from "lucide-react";

const C = {
  bg: "#0B1426",
  surface: "#111D35",
  elevated: "#162040",
  border: "#1E3050",
  text: "#F1F5F9",
  muted: "#94A3B8",
  primary: "#006DB2",
  primaryBg: "rgba(0,109,178,0.10)",
  success: "#10B981",
  successBg: "rgba(16,185,129,0.10)",
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [profileData, sessionsData] = await Promise.all([
          apiFetch<UserProfile>("/users/me"),
          apiFetch<Session[]>("/sessions/?limit=3"),
        ]);
        setProfile(profileData);
        setRecentSessions(sessionsData);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleStartFreeChat() {
    const session = await apiFetch<{ id: string }>("/sessions/", {
      method: "POST",
      body: JSON.stringify({ type: "free_chat", pillar: "speaking" }),
    });
    router.push(`/chat/${session.id}`);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Bom dia" : greetingHour < 18 ? "Boa tarde" : "Boa noite";
  const FREE_LIMIT = 10;
  const used = profile?.daily_interactions_used ?? 0;
  const remaining = profile?.plan === "pro" ? null : FREE_LIMIT - used;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%" }}>

      {/* Saudação */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "4px" }}>
          {greeting}, {profile?.name?.split(" ")[0] ?? ""}!
        </h1>
        <p style={{ fontSize: "0.875rem", color: C.muted }}>
          Pronto para praticar inglês hoje?
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Nível atual", value: profile?.level ?? "—", color: C.primary },
          {
            label: "Interações hoje",
            value: used,
            suffix: remaining !== null ? ` / ${FREE_LIMIT}` : undefined,
            color: C.text,
          },
          {
            label: "Plano",
            value: profile?.plan === "pro" ? "Pro" : "Free",
            color: profile?.plan === "pro" ? "#F59E0B" : C.muted,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "1rem 1.25rem",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "6px" }}>{stat.label}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: stat.color }}>
              {stat.value}
              {stat.suffix && (
                <span style={{ fontSize: "0.875rem", fontWeight: 400, color: C.muted }}>{stat.suffix}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Ações */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
        {/* Chat livre */}
        <div
          style={{
            background: C.surface,
            border: `1px solid rgba(0,109,178,0.35)`,
            borderRadius: "12px",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: C.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageSquare size={18} color={C.primary} />
            </div>
            <div>
              <p style={{ fontWeight: 600, color: C.text, fontSize: "0.9375rem" }}>Chat livre</p>
              <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "2px" }}>Converse sobre qualquer tema</p>
            </div>
          </div>
          <Button onClick={handleStartFreeChat} style={{ width: "100%" }}>
            Iniciar agora
          </Button>
        </div>

        {/* Cenários */}
        <Link
          href="/scenarios"
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,109,178,0.35)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: C.successBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <BookOpen size={18} color={C.success} />
            </div>
            <div>
              <p style={{ fontWeight: 600, color: C.text, fontSize: "0.9375rem" }}>Cenários</p>
              <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "2px" }}>Roleplay em situações reais</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8125rem", color: C.primary }}>
            <Zap size={13} />
            Ver cenários disponíveis
          </div>
        </Link>
      </div>

      {/* Sessões recentes */}
      {recentSessions.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <TrendingUp size={14} color={C.muted} />
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: C.muted }}>Sessões recentes</span>
            </div>
            <Link href="/history" style={{ fontSize: "0.8125rem", color: C.primary, textDecoration: "none" }}>
              Ver todas
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
