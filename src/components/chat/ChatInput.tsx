"use client";

import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import VoiceButton from "./VoiceButton";

interface ChatInputProps {
  onSend: (content: string, isVoice: boolean) => void;
  disabled?: boolean;
  onTranscribe?: (audioBlob: Blob) => Promise<string>;
}

export default function ChatInput({ onSend, disabled, onTranscribe }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [transcribing, setTranscribing] = useState(false);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, false);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleVoiceRecorded(audioBlob: Blob) {
    if (!onTranscribe) return;
    setTranscribing(true);
    try {
      const text = await onTranscribe(audioBlob);
      if (text) {
        onSend(text, true);
      }
    } finally {
      setTranscribing(false);
    }
  }

  return (
    <div className="flex items-end gap-3 bg-[#1A1D27] border border-[#2D3148] rounded-xl p-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite em inglês... (Enter para enviar)"
        disabled={disabled || transcribing}
        rows={1}
        className="flex-1 bg-transparent text-sm text-[#E2E8F0] placeholder-[#64748B] resize-none focus:outline-none max-h-32 overflow-y-auto"
      />
      <div className="flex items-center gap-2">
        {onTranscribe && (
          <VoiceButton onRecorded={handleVoiceRecorded} disabled={disabled || transcribing} />
        )}
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="w-8 h-8 rounded-lg bg-[#6C63FF] hover:bg-[#5a52d5] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
