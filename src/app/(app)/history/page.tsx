"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Session } from "@/types";
import Header from "@/components/layout/Header";
import SessionCard from "@/components/session/SessionCard";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

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
        const data = await apiFetch<Session[]>(
          `/sessions/?limit=${PAGE_SIZE}&offset=${currentOffset}`
        );
        if (append) {
          setSessions((prev) => [...prev, ...data]);
        } else {
          setSessions(data);
        }
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
    <>
      <Header title="Histórico" subtitle="Todas as suas sessões de prática" />

      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <Spinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-[#64748B]">
          <p>Você ainda não tem sessões.</p>
          <p className="text-sm mt-2">Comece uma conversa no dashboard!</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-6">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button variant="secondary" loading={loadingMore} onClick={handleLoadMore}>
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
