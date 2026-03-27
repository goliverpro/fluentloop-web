"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LayoutDashboard, BookOpen, History, User, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/scenarios", label: "Cenários", icon: BookOpen },
  { href: "/history", label: "Histórico", icon: History },
  { href: "/profile", label: "Perfil", icon: User },
];

function NavLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path
        d="M4 2H40C42.2 2 44 3.8 44 6V28C44 30.2 42.2 32 40 32H24L12 42V32H4C1.8 32 0 30.2 0 28V6C0 3.8 1.8 2 4 2Z"
        fill="#006DB2"
      />
      <path
        d="M22 17C19 11 9 11 9 17C9 23 19 23 22 17C25 11 35 11 35 17C35 23 25 23 22 17Z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header
      style={{
        height: "56px",
        background: "#111D35",
        borderBottom: "1px solid #1E3050",
        display: "flex",
        alignItems: "center",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 50,
        gap: "2rem",
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <NavLogo />
        <span style={{ fontWeight: 700, fontSize: "1rem", color: "#F1F5F9", letterSpacing: "-0.01em" }}>
          FluentLoop
        </span>
      </Link>

      {/* Nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                color: active ? "#006DB2" : "#94A3B8",
                background: active ? "rgba(0,109,178,0.12)" : "transparent",
                transition: "color 0.15s, background 0.15s",
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Sair"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          borderRadius: "8px",
          border: "none",
          background: "transparent",
          color: "#94A3B8",
          fontSize: "0.8125rem",
          fontWeight: 500,
          cursor: "pointer",
          flexShrink: 0,
          transition: "color 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#EF4444";
          e.currentTarget.style.background = "rgba(239,68,68,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#94A3B8";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <LogOut size={15} />
        Sair
      </button>
    </header>
  );
}
