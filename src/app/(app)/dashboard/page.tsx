"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { UserProfile, Session } from "@/types";
import Header from "@/components/layout/Header";
import SessionCard from "@/components/session/SessionCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { MessageSquare, BookOpen, Zap } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Bom dia" : greetingHour < 18 ? "Boa tarde" : "Boa noite";

  const FREE_LIMIT = 10;
  const used = profile?.daily_interactions_used ?? 0;
  const remaining = profile?.plan === "pro" ? null : FREE_LIMIT - used;

  return (
    <>
      <Header
        title={`${greeting}, ${profile?.name?.split(" ")[0] ?? "there"}!`}
        subtitle="Pronto para praticar inglês hoje?"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-4">
          <p className="text-xs text-[#64748B] mb-1">Nível atual</p>
          <p className="text-2xl font-bold text-[#6C63FF]">{profile?.level}</p>
        </div>
        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-4">
          <p className="text-xs text-[#64748B] mb-1">Interações hoje</p>
          <p className="text-2xl font-bold text-[#E2E8F0]">
            {used}
            {remaining !== null && (
              <span className="text-sm text-[#64748B] font-normal"> / {FREE_LIMIT}</span>
            )}
          </p>
        </div>
        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-4">
          <p className="text-xs text-[#64748B] mb-1">Plano</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={profile?.plan === "pro" ? "pro" : "default"}>
              {profile?.plan === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1A1D27] border border-[#6C63FF]/30 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#6C63FF]" />
            </div>
            <div>
              <p className="font-medium text-[#E2E8F0]">Chat livre</p>
              <p className="text-xs text-[#64748B]">Converse sobre qualquer tema</p>
            </div>
          </div>
          <Button onClick={handleStartFreeChat} className="w-full">
            Iniciar agora
          </Button>
        </div>

        <Link
          href="/scenarios"
          className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-6 flex flex-col gap-4 hover:border-[#6C63FF]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <p className="font-medium text-[#E2E8F0]">Cenários</p>
              <p className="text-xs text-[#64748B]">Roleplay em situações reais</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#6C63FF]">
            <Zap className="w-3 h-3" />
            Ver cenários disponíveis
          </div>
        </Link>
      </div>

      {recentSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[#64748B]">Sessões recentes</h2>
            <Link href="/history" className="text-xs text-[#6C63FF] hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
