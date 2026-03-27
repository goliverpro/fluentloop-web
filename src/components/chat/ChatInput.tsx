"use client";

import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import VoiceButton from "./VoiceButton";

const C = {
  surface: "#111D35",
  elevated: "#162040",
  border: "#1E3050",
  text: "#F1F5F9",
  muted: "#94A3B8",
  primary: "#006DB2",
};

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
      if (text) onSend(text, true);
    } finally {
      setTranscribing(false);
    }
  }

  const canSend = !!value.trim() && !disabled && !transcribing;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "10px",
        background: C.elevated,
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        padding: "10px 12px",
      }}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite em inglês... (Enter para enviar)"
        disabled={disabled || transcribing}
        rows={1}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          fontSize: "0.875rem",
          color: C.text,
          maxHeight: "8rem",
          overflowY: "auto",
          lineHeight: 1.5,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {onTranscribe && (
          <VoiceButton onRecorded={handleVoiceRecorded} disabled={disabled || transcribing} />
        )}
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            border: "none",
            background: canSend ? C.primary : "rgba(0,109,178,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: canSend ? "pointer" : "not-allowed",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
        >
          <Send size={15} color="#ffffff" />
        </button>
      </div>
    </div>
  );
}
