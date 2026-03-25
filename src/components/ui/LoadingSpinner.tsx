"use client";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function LoadingSpinner({
  fullPage = true,
  size = "md",
  label,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size]} border-neon-blue border-t-transparent rounded-full animate-spin`}
      />
      {label && (
        <span className="text-sm text-editor-muted">{label}</span>
      )}
      {!label && fullPage && (
        <span className="text-sm font-mono text-editor-muted">
          CSS <span className="text-neon-blue">Dojo</span>
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
