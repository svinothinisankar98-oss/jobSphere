import React from "react";
import { TextField, InputAdornment } from "@mui/material";

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
  startIcon?: React.ReactNode; 
  endIcon?: React.ReactNode;   
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
  startIcon,
  endIcon,
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
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ) : undefined,
      }}
      className={className}
      onChange={onChange}
      size="small"
      variant="outlined"
    />
  );
};

export default CommonTextField;
