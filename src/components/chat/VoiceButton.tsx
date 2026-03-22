"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import { clsx } from "clsx";

interface VoiceButtonProps {
  onRecorded: (audioBlob: Blob) => void;
  disabled?: boolean;
}

type RecordingState = "idle" | "recording";

export default function VoiceButton({ onRecorded, disabled }: VoiceButtonProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecorded(blob);
        stream.getTracks().forEach((t) => t.stop());
        setState("idle");
      };

      recorder.start();
      setState("recording");
    } catch {
      console.error("Microphone access denied");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function handleClick() {
    if (state === "idle") {
      startRecording();
    } else {
      stopRecording();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={state === "recording" ? "Parar gravação" : "Gravar voz"}
      className={clsx(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        state === "recording"
          ? "bg-[#EF4444] hover:bg-red-600 animate-pulse"
          : "bg-[#2D3148] hover:bg-[#3D4168] text-[#64748B] hover:text-[#E2E8F0]"
      )}
    >
      {state === "recording" ? (
        <Square className="w-3 h-3 text-white" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
