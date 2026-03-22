export type Level = "A2" | "B1" | "B2";
export type Plan = "free" | "pro";
export type SessionType = "free_chat" | "roleplay";
export type Pillar = "writing" | "speaking" | "comprehension";
export type MessageRole = "user" | "assistant";
export type ErrorType = "grammar" | "vocabulary" | "pronunciation";
export type ScenarioCategory = "work" | "travel" | "daily";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  level: Level;
  plan: Plan;
  daily_interactions_used: number;
  daily_reset_at: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  ai_role: string;
  category: ScenarioCategory;
  difficulty: Level;
  is_free: boolean;
}

export interface Session {
  id: string;
  type: SessionType;
  pillar: Pillar;
  scenario_id: string | null;
  scenario_name: string | null;
  started_at: string;
  ended_at: string | null;
  total_messages: number;
  error_rate: number | null;
}

export interface Correction {
  id: string;
  original_text: string;
  corrected_text: string;
  error_type: ErrorType;
  explanation: string;
}

export interface PronunciationWord {
  word: string;
  position: number;
  accuracy_score: number;
  phoneme_feedback: string | null;
}

export interface Message {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  audio_url: string | null;
  corrections: Correction[];
  created_at: string;
}
