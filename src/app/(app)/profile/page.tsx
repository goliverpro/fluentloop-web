"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { UserProfile } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { User } from "lucide-react";

const C = {
  surface: "#111D35",
  elevated: "#162040",
  border: "#1E3050",
  text: "#F1F5F9",
  muted: "#94A3B8",
  primary: "#006DB2",
  warning: "#F59E0B",
  success: "#10B981",
};

const LEVELS = ["A2", "B1", "B2"] as const;

const LEVEL_INFO: Record<string, { label: string; color: string; bg: string }> = {
  A2: { label: "Iniciante",    color: C.success,  bg: "rgba(16,185,129,0.10)" },
  B1: { label: "Intermediário", color: C.warning,  bg: "rgba(245,158,11,0.10)" },
  B2: { label: "Avançado",     color: "#EF4444",  bg: "rgba(239,68,68,0.10)" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "1.5rem" }}>
      <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1.25rem" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [levelSaving, setLevelSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<UserProfile>("/users/me")
      .then((p) => { setProfile(p); setName(p.name ?? ""); })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const updated = await apiFetch<UserProfile>("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
    setProfile(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  async function handleLevelChange(level: string) {
    setLevelSaving(true);
    const updated = await apiFetch<UserProfile>("/users/me/level", {
      method: "PATCH",
      body: JSON.stringify({ level }),
    });
    setProfile(updated);
    setLevelSaving(false);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "4px" }}>Perfil</h1>
        <p style={{ fontSize: "0.875rem", color: C.muted }}>Gerencie suas informações e preferências</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "520px" }}>

        {/* Avatar + nome rápido */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "rgba(0,109,178,0.15)",
            border: `2px solid rgba(0,109,178,0.30)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <User size={22} color={C.primary} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: C.text, fontSize: "1rem" }}>{profile?.name || "—"}</p>
            <p style={{ fontSize: "0.8125rem", color: C.muted, marginTop: "2px" }}>{profile?.email}</p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span style={{
              fontSize: "0.75rem", fontWeight: 600,
              padding: "3px 10px", borderRadius: "6px",
              background: profile?.plan === "pro" ? "rgba(245,158,11,0.12)" : C.elevated,
              color: profile?.plan === "pro" ? C.warning : C.muted,
              border: `1px solid ${profile?.plan === "pro" ? "rgba(245,158,11,0.25)" : C.border}`,
            }}>
              {profile?.plan === "pro" ? "Pro" : "Free"}
            </span>
          </div>
        </div>

        {/* Informações pessoais */}
        <Section title="Informações pessoais">
          <form onSubmit={handleSaveName} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input
              id="name"
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              variant="dark"
            />
            <Input
              id="email"
              label="Email"
              value={profile?.email ?? ""}
              disabled
              variant="dark"
              style={{ opacity: 0.5 }}
            />
            <div>
              <Button type="submit" loading={saving} size="sm"
                {...(saved ? { style: { background: "rgba(16,185,129,0.85)" } } : {})}
              >
                {saved ? "Salvo!" : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </Section>

        {/* Nível */}
        <Section title="Nível de inglês">
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            {LEVELS.map((level) => {
              const info = LEVEL_INFO[level];
              const active = profile?.level === level;
              return (
                <button
                  key={level}
                  disabled={levelSaving}
                  onClick={() => handleLevelChange(level)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: levelSaving ? "not-allowed" : "pointer",
                    opacity: levelSaving ? 0.6 : 1,
                    transition: "all 0.15s",
                    border: `1.5px solid ${active ? info.color : C.border}`,
                    background: active ? info.bg : "transparent",
                    color: active ? info.color : C.muted,
                  }}
                >
                  {level}
                  <span style={{ display: "block", fontSize: "0.6875rem", fontWeight: 400, marginTop: "2px", color: active ? info.color : C.muted, opacity: 0.8 }}>
                    {info.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: "0.75rem", color: C.muted, lineHeight: 1.5 }}>
            O nível também avança automaticamente quando você mantém baixa taxa de erros.
          </p>
        </Section>

        {/* Plano */}
        <Section title="Plano">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <p style={{ fontWeight: 600, color: C.text, fontSize: "0.9375rem" }}>
                {profile?.plan === "pro" ? "Plano Pro" : "Plano Free"}
              </p>
              {profile?.plan === "free" && (
                <p style={{ fontSize: "0.8125rem", color: C.muted, marginTop: "4px" }}>
                  10 interações por dia. Faça upgrade para ilimitado.
                </p>
              )}
            </div>
            {profile?.plan === "free" && (
              <Button
                size="sm"
                onClick={() =>
                  apiFetch<{ url: string }>("/billing/checkout", {
                    method: "POST",
                    body: JSON.stringify({ plan_type: "monthly" }),
                  }).then((r) => (window.location.href = r.url))
                }
                style={{ flexShrink: 0 }}
              >
                Fazer upgrade
              </Button>
            )}
          </div>
        </Section>

      </div>
    </div>
  );
}
