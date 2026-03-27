"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase";
import { Message, PronunciationWord, Session } from "@/types";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import PronunciationFeedback from "@/components/chat/PronunciationFeedback";
import Spinner from "@/components/ui/Spinner";
import { ArrowLeft, StopCircle } from "lucide-react";

const C = {
  bg: "#0B1426",
  surface: "#111D35",
  elevated: "#162040",
  border: "#1E3050",
  text: "#F1F5F9",
  muted: "#94A3B8",
  primary: "#006DB2",
  error: "#EF4444",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [pronunciationWords, setPronunciationWords] = useState<PronunciationWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    apiFetch<Session & { messages: Message[] }>(`/sessions/${sessionId}`)
      .then((data) => {
        const { messages: msgs, ...sessionData } = data;
        setSession(sessionData as Session);
        setMessages(msgs ?? []);
      })
      .catch(() => router.push("/dashboard"))
      .finally(() => setLoading(false));
  }, [sessionId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  async function getAuthToken(): Promise<string> {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  }

  async function handleSend(content: string, isVoice: boolean) {
    setStreaming(true);
    setStreamingText("");

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      role: "user",
      content,
      audio_url: null,
      corrections: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/v1/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ session_id: sessionId, content, is_voice: isVoice }),
      });

      if (!response.ok || !response.body) throw new Error("Stream failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let corrections: Message["corrections"] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          if (data === "[LIMIT_REACHED]") {
            setStreamingText("");
            setMessages((prev) => [...prev, {
              id: `limit-${Date.now()}`, session_id: sessionId, role: "assistant",
              content: "Você atingiu o limite diário de interações. Faça upgrade para continuar.",
              audio_url: null, corrections: [], created_at: new Date().toISOString(),
            }]);
            return;
          }
          if (data.startsWith("[ERROR]")) { setStreamingText(""); return; }
          if (data.startsWith("[CORRECTIONS]")) {
            try {
              corrections = JSON.parse(data.slice(13)).map((c: Record<string, string>, i: number) => ({
                id: `c-${i}`, original_text: c.original, corrected_text: c.corrected,
                error_type: c.type, explanation: c.explanation,
              }));
            } catch {}
            continue;
          }
          try { const text = JSON.parse(data); accumulated += text; setStreamingText(accumulated); } catch {}
        }
      }

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticMsg.id);
        return [...withoutOptimistic,
          { ...optimisticMsg, id: `user-${Date.now()}` },
          { id: `ai-${Date.now()}`, session_id: sessionId, role: "assistant", content: accumulated, audio_url: null, corrections, created_at: new Date().toISOString() },
        ];
      });
      setStreamingText("");
      playTts(accumulated);
    } catch {
      setStreamingText("");
    } finally {
      setStreaming(false);
    }
  }

  async function playTts(text: string) {
    if (!text.trim()) return;
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/v1/speech/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text, voice: "alloy" }),
      });
      if (!response.ok) return;
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => URL.revokeObjectURL(url);
    } catch {}
  }

  async function handleTranscribe(audioBlob: Blob): Promise<string> {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    const response = await fetch(`${API_URL}/v1/speech/transcribe`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData,
    });
    if (!response.ok) return "";
    const data = await response.json();
    if (data.words?.length > 0) setPronunciationWords(data.words);
    return data.text ?? "";
  }

  async function handleEndSession() {
    setEnding(true);
    try {
      await apiFetch(`/sessions/${sessionId}/end`, { method: "PATCH" });
      router.push("/history");
    } finally {
      setEnding(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, background: C.bg }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", background: C.bg }}>

      {/* Header da sessão */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "10px 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexShrink: 0,
      }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: C.muted,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "4px",
            borderRadius: "6px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: C.text }}>
            {session?.scenario_id ? "Roleplay" : "Chat livre"}
          </p>
          <p style={{ fontSize: "0.75rem", color: C.muted }}>{messages.length} mensagens</p>
        </div>

        {!session?.ended_at && (
          <button
            onClick={handleEndSession}
            disabled={ending}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: C.muted,
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: ending ? "not-allowed" : "pointer",
              opacity: ending ? 0.5 : 1,
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.error;
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.muted;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <StopCircle size={15} />
            Encerrar
          </button>
        )}
      </div>

      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messages.length === 0 && !streaming && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 0", color: C.muted, fontSize: "0.875rem" }}>
              Envie sua primeira mensagem para começar.
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {streaming && streamingText && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
              <div style={{
                maxWidth: "70%",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "16px 16px 16px 4px",
                padding: "10px 14px",
                fontSize: "0.875rem",
                color: C.text,
                lineHeight: 1.6,
              }}>
                {streamingText}
                <span style={{
                  display: "inline-block",
                  width: "2px",
                  height: "14px",
                  background: C.primary,
                  marginLeft: "2px",
                  verticalAlign: "middle",
                  animation: "pulse 1s ease-in-out infinite",
                }} />
              </div>
            </div>
          )}

          {streaming && !streamingText && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.muted, fontSize: "0.875rem" }}>
              <Spinner size="sm" />
              <span>Respondendo...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Feedback de pronúncia */}
      {pronunciationWords.length > 0 && (
        <div style={{ padding: "0 1.5rem 8px", maxWidth: "700px", margin: "0 auto", width: "100%" }}>
          <PronunciationFeedback words={pronunciationWords} />
        </div>
      )}

      {/* Input */}
      {!session?.ended_at && (
        <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <ChatInput onSend={handleSend} disabled={streaming} onTranscribe={handleTranscribe} />
          </div>
        </div>
      )}

      {session?.ended_at && (
        <div style={{
          padding: "1rem",
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
          fontSize: "0.875rem",
          color: C.muted,
          flexShrink: 0,
        }}>
          Sessão encerrada.
        </div>
      )}
    </div>
  );
}
