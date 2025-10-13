import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
  label?: string;
  centered?: boolean;
  variant?: "spinner" | "dots" | "pulse";
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "text-blue-600",
  className = "",
  label = "Loading...",
  centered = true,
  variant = "spinner",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const renderSpinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${color}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      data-testid="spinner-svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const renderDots = () => (
    <div className={`flex items-center justify-center space-x-1 ${sizeClasses[size]}`}>
      <div className={`animate-bounce delay-75 rounded-full bg-current ${getDotSize()}`}></div>
      <div className={`animate-bounce delay-150 rounded-full bg-current ${getDotSize()}`}></div>
      <div className={`animate-bounce delay-300 rounded-full bg-current ${getDotSize()}`}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`animate-pulse rounded-full bg-current ${sizeClasses[size]}`}></div>
  );

  const getDotSize = () => {
    switch (size) {
      case "sm": return "h-1 w-1";
      case "md": return "h-1.5 w-1.5";
      case "lg": return "h-2 w-2";
      case "xl": return "h-3 w-3";
      default: return "h-1.5 w-1.5";
    }
  };

  const getLoader = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "spinner":
      default:
        return renderSpinner();
    }
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 ${centered ? "w-full" : ""} ${className}`}
      role="status"
      aria-label={label}
    >
      {getLoader()}
      {label && (
        <span className={`sr-only ${centered ? "ml-2" : ""}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Loader;