"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase";
import { Message, PronunciationWord, Session } from "@/types";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import PronunciationFeedback from "@/components/chat/PronunciationFeedback";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { ArrowLeft, StopCircle } from "lucide-react";

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId, content, is_voice: isVoice }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let corrections: Message["corrections"] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);

          if (data === "[DONE]") break;
          if (data === "[LIMIT_REACHED]") {
            setStreamingText("");
            setMessages((prev) => [
              ...prev,
              {
                id: `limit-${Date.now()}`,
                session_id: sessionId,
                role: "assistant",
                content: "Você atingiu o limite diário de interações. Faça upgrade para continuar.",
                audio_url: null,
                corrections: [],
                created_at: new Date().toISOString(),
              },
            ]);
            return;
          }
          if (data.startsWith("[ERROR]")) {
            setStreamingText("");
            return;
          }
          if (data.startsWith("[CORRECTIONS]")) {
            try {
              corrections = JSON.parse(data.slice(13)).map((c: Record<string, string>, i: number) => ({
                id: `c-${i}`,
                original_text: c.original,
                corrected_text: c.corrected,
                error_type: c.type,
                explanation: c.explanation,
              }));
            } catch {}
            continue;
          }

          try {
            const text = JSON.parse(data);
            accumulated += text;
            setStreamingText(accumulated);
          } catch {}
        }
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        session_id: sessionId,
        role: "assistant",
        content: accumulated,
        audio_url: null,
        corrections,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticMsg.id);
        return [
          ...withoutOptimistic,
          { ...optimisticMsg, id: `user-${Date.now()}` },
          aiMessage,
        ];
      });
      setStreamingText("");
    } catch {
      setStreamingText("");
    } finally {
      setStreaming(false);
    }
  }

  async function handleTranscribe(audioBlob: Blob): Promise<string> {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const response = await fetch(`${API_URL}/v1/speech/transcribe`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) return "";
    const data = await response.json();
    if (data.words?.length > 0) {
      setPronunciationWords(data.words);
    }
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
      <div className="flex items-center justify-center min-h-screen bg-[#0F1117]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0F1117]">
      <div className="bg-[#1A1D27] border-b border-[#2D3148] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[#64748B] hover:text-[#E2E8F0] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#E2E8F0]">
            {session?.scenario_id ? "Roleplay" : "Chat livre"}
          </p>
          <p className="text-xs text-[#64748B]">{messages.length} mensagens</p>
        </div>
        {!session?.ended_at && (
          <Button
            variant="ghost"
            size="sm"
            loading={ending}
            onClick={handleEndSession}
            className="text-[#64748B] hover:text-[#EF4444]"
          >
            <StopCircle className="w-4 h-4 mr-1" />
            Encerrar
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && !streaming && (
          <div className="flex items-center justify-center flex-1 text-[#64748B] text-sm">
            Envie sua primeira mensagem para começar.
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {streaming && streamingText && (
          <div className="flex flex-col items-start gap-2">
            <div className="max-w-[70%] bg-[#1A1D27] border border-[#2D3148] rounded-xl rounded-bl-sm px-4 py-3 text-sm text-[#E2E8F0] leading-relaxed">
              {streamingText}
              <span className="inline-block w-0.5 h-4 bg-[#6C63FF] animate-pulse ml-0.5 align-middle" />
            </div>
          </div>
        )}

        {streaming && !streamingText && (
          <div className="flex items-center gap-2 text-[#64748B] text-sm">
            <Spinner size="sm" />
            <span>Respondendo...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {pronunciationWords.length > 0 && (
        <div className="px-4 pb-2">
          <PronunciationFeedback words={pronunciationWords} />
        </div>
      )}

      {!session?.ended_at && (
        <div className="p-4 border-t border-[#2D3148]">
          <ChatInput
            onSend={handleSend}
            disabled={streaming}
            onTranscribe={handleTranscribe}
          />
        </div>
      )}

      {session?.ended_at && (
        <div className="p-4 border-t border-[#2D3148] text-center text-sm text-[#64748B]">
          Sessão encerrada.
        </div>
      )}
    </div>
  );
}
