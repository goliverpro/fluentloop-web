import Link from "next/link";
import { Session } from "@/types";
import Badge from "@/components/ui/Badge";
import { MessageSquare, Clock } from "lucide-react";

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

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const errorRateVariant =
    session.error_rate === null
      ? "default"
      : session.error_rate < 20
      ? "success"
      : session.error_rate < 40
      ? "warning"
      : "error";

  return (
    <Link
      href={`/chat/${session.id}`}
      className="block bg-[#1A1D27] border border-[#2D3148] rounded-xl p-4 hover:border-[#6C63FF]/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-medium text-[#E2E8F0] text-sm">
            {session.scenario_name ?? "Chat livre"}
          </p>
          <p className="text-xs text-[#64748B] mt-0.5">
            {new Date(session.started_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge>{PILLAR_LABELS[session.pillar] ?? session.pillar}</Badge>
      </div>

      <div className="flex items-center gap-3 text-xs text-[#64748B]">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {session.total_messages ?? 0} msgs
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDuration(session.started_at, session.ended_at)}
        </span>
        {session.error_rate !== null && (
          <Badge variant={errorRateVariant}>{session.error_rate}% erros</Badge>
        )}
      </div>
    </Link>
  );
}
