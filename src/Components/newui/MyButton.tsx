import React from "react";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";

type ButtonProps = {
  label: string;
  type?: "button" | "submit" | "reset";
  sx?: object;

  // MUI variants
  variant?: "contained" | "outlined" | "text";

  // MUI colors
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";

  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  maxWidth?: number;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: string | React.ReactNode;
};

const MyButton: React.FC<ButtonProps> = ({
  label,
  type = "button",
  variant = "outlined",
  color = "primary",
  size = "medium",
  disabled = false,
  className = "",
  onClick,
  icon,
  maxWidth,
  sx,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
      startIcon={
  typeof icon === "string" ? <Icon>{icon}</Icon> : icon
}
      sx={{
        textTransform: "none",
        ...sx,
        maxWidth,
      }}
    >
      {label}
    </Button>
  );
};

export default MyButton;
