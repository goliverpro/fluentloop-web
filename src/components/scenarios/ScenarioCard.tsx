import { Scenario } from "@/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { clsx } from "clsx";

const CATEGORY_LABELS: Record<string, string> = {
  work: "Trabalho",
  travel: "Viagem",
  daily: "Cotidiano",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  A2: "text-[#10B981]",
  B1: "text-yellow-400",
  B2: "text-[#EF4444]",
};

interface ScenarioCardProps {
  scenario: Scenario;
  onStart: (scenario: Scenario) => void;
}

export default function ScenarioCard({ scenario, onStart }: ScenarioCardProps) {
  return (
    <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-5 flex flex-col gap-4 hover:border-[#6C63FF]/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-[#E2E8F0]">{scenario.name}</p>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{scenario.description}</p>
        </div>
        {!scenario.is_free && (
          <Badge variant="pro" className="shrink-0">
            Pro
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge>{CATEGORY_LABELS[scenario.category] ?? scenario.category}</Badge>
        <span className={clsx("text-xs font-medium", DIFFICULTY_COLORS[scenario.difficulty])}>
          {scenario.difficulty}
        </span>
        <span className="text-xs text-[#64748B] truncate">• {scenario.ai_role}</span>
      </div>

      <Button
        size="sm"
        onClick={() => onStart(scenario)}
        className="w-full"
      >
        Iniciar conversa
      </Button>
    </div>
  );
}
