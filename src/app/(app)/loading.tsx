export default function AppLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: "16px",
      }}
    >
      {/* Logo animada */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 44 44"
        fill="none"
        style={{ animation: "pulse 1.2s ease-in-out infinite" }}
        aria-hidden="true"
      >
        <path
          d="M4 2H40C42.2 2 44 3.8 44 6V28C44 30.2 42.2 32 40 32H24L12 42V32H4C1.8 32 0 30.2 0 28V6C0 3.8 1.8 2 4 2Z"
          fill="#006DB2"
          fillOpacity="0.8"
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

      <p style={{ fontSize: "0.8125rem", color: "#94A3B8", letterSpacing: "0.02em" }}>
        Carregando...
      </p>
    </div>
  );
}
