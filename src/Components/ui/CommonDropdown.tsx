import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

type Option = {
  id: number;
  item: string;
};

type Props = {
  label?: string;
  name: string;
  value: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange: (e: any) => void;
};

const CommonDropdown: React.FC<Props> = ({
  label,
  name,
  value,
  options,
  placeholder = "Select",
  required = false,
  disabled = false,
  error = "",
  className,
  style,
  onChange,
}) => {
  const hasError = Boolean(error);

  return (
    <FormControl
      fullWidth
      size="small"
      error={hasError}
      disabled={disabled}
      className={className}
      style={style}
    >
      {label && (
        <InputLabel required={required}>
          {label}
        </InputLabel>
      )}

      <Select
        name={name}
        value={value || ""}
        label={label}
        displayEmpty
        onChange={onChange}
      >
        <MenuItem value="">
          {placeholder}
        </MenuItem>

        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.item}>
            {opt.item}
          </MenuItem>
        ))}
      </Select>

      {hasError && (
        <FormHelperText>{error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default CommonDropdown;
