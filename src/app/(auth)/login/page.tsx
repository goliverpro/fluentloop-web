import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

function LoopIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Speech bubble */}
      <path
        d="M4 2H40C42.2 2 44 3.8 44 6V28C44 30.2 42.2 32 40 32H24L12 42V32H4C1.8 32 0 30.2 0 28V6C0 3.8 1.8 2 4 2Z"
        fill="white"
        fillOpacity="0.15"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Símbolo do infinito */}
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

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* ── Esquerda — formulário ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: "3rem 2rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "0.25rem",
            }}
          >
            Bem-vindo de volta
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#94a3b8",
              marginBottom: "2rem",
            }}
          >
            Entre na sua conta para continuar praticando
          </p>

          <Suspense>
            <LoginForm />
          </Suspense>

          <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "1.5rem", paddingTop: "1.5rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
              Não tem conta?{" "}
              <Link
                href="/signup"
                style={{ color: "#006DB2", fontWeight: 600, textDecoration: "none" }}
              >
                Crie agora
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Direita — branding ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #006DB2 0%, #005490 100%)",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Círculos decorativos */}
        <div
          style={{
            position: "absolute",
            top: "-6rem",
            right: "-6rem",
            width: "20rem",
            height: "20rem",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-8rem",
            left: "-4rem",
            width: "24rem",
            height: "24rem",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Conteúdo */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "320px",
          }}
        >
          <LoopIcon />

          <h2
            style={{
              marginTop: "1.5rem",
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            FluentLoop
          </h2>

          <p
            style={{
              marginTop: "1rem",
              fontSize: "1.125rem",
              lineHeight: "1.6",
              fontWeight: 500,
              color: "rgba(255,255,255,0.80)",
            }}
          >
            A melhor experiência de aprendizado de inglês que você já teve na sua vida.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "3rem" }}>
            <div style={{ width: "2rem", height: "0.375rem", borderRadius: "999px", background: "#ffffff" }} />
            <div style={{ width: "0.5rem", height: "0.375rem", borderRadius: "999px", background: "rgba(255,255,255,0.4)" }} />
            <div style={{ width: "0.5rem", height: "0.375rem", borderRadius: "999px", background: "rgba(255,255,255,0.4)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
