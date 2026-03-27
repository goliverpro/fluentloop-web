"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { UserProfile } from "@/types";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";

const LEVELS = ["A2", "B1", "B2"] as const;

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
      .then((p) => {
        setProfile(p);
        setName(p.name ?? "");
      })
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
      <div className="flex items-center justify-center min-h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Header title="Perfil" subtitle="Gerencie suas informações e preferências" />

      <div className="flex flex-col gap-6 max-w-lg">
        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-6">
          <h2 className="text-sm font-medium text-[#64748B] mb-4">Informações pessoais</h2>
          <form onSubmit={handleSaveName} className="flex flex-col gap-4">
            <Input
              id="name"
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
            <Input
              id="email"
              label="Email"
              value={profile?.email ?? ""}
              disabled
              className="opacity-60"
            />
            <Button type="submit" loading={saving} size="sm" className="self-start">
              {saved ? "Salvo!" : "Salvar"}
            </Button>
          </form>
        </div>

        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-6">
          <h2 className="text-sm font-medium text-[#64748B] mb-4">Nível de inglês</h2>
          <div className="flex gap-3">
            {LEVELS.map((level) => (
              <button
                key={level}
                disabled={levelSaving}
                onClick={() => handleLevelChange(level)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors border ${
                  profile?.level === level
                    ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                    : "bg-transparent border-[#2D3148] text-[#64748B] hover:border-[#6C63FF]/50 hover:text-[#E2E8F0]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#64748B] mt-3">
            O nível também avança automaticamente quando você mantém baixa taxa de erros.
          </p>
        </div>

        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-6">
          <h2 className="text-sm font-medium text-[#64748B] mb-4">Plano</h2>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={profile?.plan === "pro" ? "pro" : "default"} className="text-sm px-3 py-1">
                {profile?.plan === "pro" ? "Pro" : "Free"}
              </Badge>
              {profile?.plan === "free" && (
                <p className="text-xs text-[#64748B] mt-2">
                  10 interações por dia no plano gratuito.
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
              >
                Fazer upgrade
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
