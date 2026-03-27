interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: 16,
  md: 24,
  lg: 36,
};

export default function Spinner({ size = "md" }: SpinnerProps) {
  const s = SIZES[size];
  const stroke = size === "sm" ? 2.5 : 3;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 36 36"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
      aria-label="Carregando"
    >
      {/* Trilha */}
      <circle
        cx="18"
        cy="18"
        r="14"
        stroke="#1E3050"
        strokeWidth={stroke * 1.5}
      />
      {/* Arco animado */}
      <circle
        cx="18"
        cy="18"
        r="14"
        stroke="#006DB2"
        strokeWidth={stroke * 1.5}
        strokeLinecap="round"
        strokeDasharray="22 66"
        strokeDashoffset="0"
      />
    </svg>
  );
}
