import React from "react";

type ButtonProps = {
  label: string;
  type?: "button" | "submit" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: string;
};

const CommonButton: React.FC<ButtonProps> = ({
  label,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
  icon, // optional
}) => {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${className} d-flex align-items-center justify-content-center gap-2`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <i className={icon}></i>}
      <span>{label}</span>
    </button>
  );
};

export default CommonButton;
