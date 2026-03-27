"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  History,
  User,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/scenarios", label: "Cenários", icon: BookOpen },
  { href: "/history", label: "Histórico", icon: History },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-60 bg-[#1A1D27] border-r border-[#2D3148] flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-[#2D3148]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6C63FF] flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[#E2E8F0]">FluentLoop</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-[#6C63FF]/15 text-[#6C63FF]"
                : "text-[#64748B] hover:text-[#E2E8F0] hover:bg-[#252836]"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2D3148]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
