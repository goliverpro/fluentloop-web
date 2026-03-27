import { clsx } from "clsx";
import { Message } from "@/types";
import Badge from "@/components/ui/Badge";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={clsx("flex flex-col gap-2", isUser ? "items-end" : "items-start")}>
      <div
        className={clsx(
          "max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-[#6C63FF] text-white rounded-br-sm"
            : "bg-[#1A1D27] text-[#E2E8F0] border border-[#2D3148] rounded-bl-sm"
        )}
      >
        {message.content}
      </div>

      {message.corrections && message.corrections.length > 0 && (
        <div className="max-w-[70%] bg-[#1A1D27] border border-[#EF4444]/30 rounded-xl p-3 flex flex-col gap-2">
          <p className="text-xs font-medium text-[#EF4444] flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
            Correções
          </p>
          {message.corrections.map((c) => (
            <div key={c.id} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="line-through text-[#64748B]">{c.original_text}</span>
                <span className="text-[#10B981] font-medium">{c.corrected_text}</span>
                <Badge variant={c.error_type === "grammar" ? "error" : "warning"}>
                  {c.error_type}
                </Badge>
              </div>
              <p className="text-xs text-[#64748B]">{c.explanation}</p>
            </div>
          ))}
        </div>
      )}

      <span className="text-xs text-[#64748B]">
        {new Date(message.created_at).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
