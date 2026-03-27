import { clsx } from "clsx";
import { PronunciationWord } from "@/types";

interface PronunciationFeedbackProps {
  words: PronunciationWord[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-[#10B981]";
  if (score >= 60) return "text-yellow-400";
  return "text-[#EF4444]";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-[#10B981]/10";
  if (score >= 60) return "bg-yellow-500/10";
  return "bg-[#EF4444]/10";
}

export default function PronunciationFeedback({ words }: PronunciationFeedbackProps) {
  if (!words.length) return null;

  return (
    <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-4">
      <p className="text-xs font-medium text-[#64748B] mb-3">Pronúncia</p>
      <div className="flex flex-wrap gap-2">
        {words.map((w, i) => (
          <div
            key={i}
            className={clsx("px-2 py-1 rounded-lg flex flex-col items-center", getScoreBg(w.accuracy_score))}
            title={w.phoneme_feedback ?? undefined}
          >
            <span className={clsx("text-sm font-medium", getScoreColor(w.accuracy_score))}>
              {w.word}
            </span>
            <span className={clsx("text-xs", getScoreColor(w.accuracy_score))}>
              {Math.round(w.accuracy_score)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
