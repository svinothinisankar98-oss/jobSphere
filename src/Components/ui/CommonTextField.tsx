import React from "react";
import {
  TextField,
  InputAdornment,
  type SxProps,
  type Theme,
} from "@mui/material";

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
  rows?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: SxProps<Theme>;   // ✅ correct type
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
  sx,
  onChange,
}) => {
  const hasError = Boolean(error);

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
      sx={sx}            
      inputProps={{ inputMode }}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ),
      }}
      className={className}
      onChange={onChange}
      size="small"
      variant="outlined"
    />
  );
};

export default CommonTextField;
