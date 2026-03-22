import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#6C63FF] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#E2E8F0]">Bem-vindo de volta</h1>
          <p className="text-[#64748B] text-sm mt-1">Entre na sua conta FluentLoop</p>
        </div>

        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-xl p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Não tem conta?{" "}
          <Link href="/signup" className="text-[#6C63FF] hover:underline font-medium">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </main>
  );
}
