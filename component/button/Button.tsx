import React from "react";
import Loader from "../loader/ButtonLoader";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loaderColor?: string;
  icon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  isLoading = false,
  loaderColor = "text-white",
  icon = null,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center px-10 py-4 
        bg-primary rounded-sm transition-all duration-200 text-white text-md font-normal
        ${disabled || isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-primary-dark"}
        ${className}
      `}
    >
      {/* Loader overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Content */}
      <span
        className={`flex w-full items-center ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="flex-1 text-center">{label}</span>
        {icon && <span className="ml-auto">{icon}</span>}
      </span>
    </button>
  );
};

export default Button;
