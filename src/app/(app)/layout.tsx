import TopNav from "@/components/layout/TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0B1426", display: "flex", flexDirection: "column" }}>
      <TopNav />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
