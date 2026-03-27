"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Session } from "@/types";
import SessionCard from "@/components/session/SessionCard";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

const C = {
  text: "#F1F5F9",
  muted: "#94A3B8",
};

const PAGE_SIZE = 20;

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadSessions = useCallback(
    async (currentOffset: number, append: boolean) => {
      try {
        const data = await apiFetch<Session[]>(`/sessions/?limit=${PAGE_SIZE}&offset=${currentOffset}`);
        if (append) setSessions((prev) => [...prev, ...data]);
        else setSessions(data);
        setHasMore(data.length === PAGE_SIZE);
      } catch {
        router.push("/login");
      }
    },
    [router]
  );

  useEffect(() => {
    loadSessions(0, false).finally(() => setLoading(false));
  }, [loadSessions]);

  async function handleLoadMore() {
    setLoadingMore(true);
    const nextOffset = offset + PAGE_SIZE;
    await loadSessions(nextOffset, true);
    setOffset(nextOffset);
    setLoadingMore(false);
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%" }}>

      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "4px" }}>Histórico</h1>
        <p style={{ fontSize: "0.875rem", color: C.muted }}>Todas as suas sessões de prática</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
          <Spinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: C.muted, fontSize: "0.875rem" }}>
          <p>Você ainda não tem sessões.</p>
          <p style={{ marginTop: "8px" }}>Comece uma conversa no dashboard!</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
          {hasMore && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button variant="secondary" loading={loadingMore} onClick={handleLoadMore}>
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
