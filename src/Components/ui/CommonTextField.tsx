import React from "react";
import { TextField } from "@mui/material";

type Props = {
  label?: string;
  name: string;
  value: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  inputMode?: "text" | "numeric" | "decimal";
  rows?: number; // textarea
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
};

const CommonTextField: React.FC<Props> = ({
  label,
  name,
  value,
  type = "text",
  placeholder = "",
  required = false,
  className = "",
  inputMode,
  rows,
  error = "",
  onChange,
}) => {
  const hasError = error.trim().length > 0;

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      type={rows ? undefined : type}
      placeholder={placeholder}
      required={required}
      error={hasError}
      helperText={hasError ? error : ""}
      multiline={!!rows}
      rows={rows}
      inputProps={{
        inputMode,
      }}
      className={className}
      onChange={onChange}
      size="small"
      variant="outlined"
    />
  );
};

export default CommonTextField;
