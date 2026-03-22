const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getAuthHeader(): Promise<Record<string, string>> {
  const { createClient } = await import("@/lib/supabase");
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader = await getAuthHeader();

  const response = await fetch(`${API_URL}/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? "API error");
  }

  return response.json();
}
