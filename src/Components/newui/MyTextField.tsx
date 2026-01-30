import { Controller, useFormContext, get } from "react-hook-form";
import TextField from "@mui/material/TextField";
import type { ReactNode } from "react";
import { InputAdornment } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import PriorityHigh from "@mui/icons-material/PriorityHigh";

type MyTextFieldProps = {
  name?: string;
  label?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
  rows?: number;
  helpertext?: string;
  size?: "small" | "medium";
  sx?: object;
  fullWidth?: boolean;
  hideErrorText?: boolean;          // show tooltip instead of text
  icon?: ReactNode;

  value?: string;                   //on change for standalone mode//
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const MyTextField = ({
  name,
  label,
  required = false,
  type = "text",
  placeholder,
  inputMode,
  rows,
  size = "small",
  sx,
  value,
  onChange,
  helpertext,
  hideErrorText,
  icon,
}: MyTextFieldProps) => {
  const formContext = useFormContext();        //get React Hook Form context//

//standalone mode no react hook form//
  if (!name || !formContext) {
    return (
      <TextField
        fullWidth
        label={label}
        type={type}
        placeholder={placeholder}
        size={size}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        multiline={Boolean(rows)}
        rows={rows}
        helperText={helpertext}
        InputProps={{
          startAdornment: icon && (
            <InputAdornment position="start">{icon}</InputAdornment>
          ),
        }}
        sx={{
          "& .MuiFormLabel-asterisk": { color: "red" },
          ...sx,
        }}
      />
    );
  }

 //form mode//
  const {
    control,
    formState: { errors },
  } = formContext;

  const error = get(errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          type={type}
          placeholder={placeholder}
          required={required}
          inputRef={field.ref}
          size={size}
          inputMode={inputMode}
          multiline={Boolean(rows)}
          rows={rows}
          error={!!error}
          helperText={hideErrorText ? undefined : error?.message}

          //tooltip error mode//

          InputProps={{
            endAdornment: hideErrorText && error && (
              <InputAdornment position="end">
                <Tooltip title={error.message} arrow>
                  <span onMouseDown={(e) => e.preventDefault()}>
                    <PriorityHigh
                      fontSize="small"
                      color="error"
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                </Tooltip>
              </InputAdornment>
            ),
          }}

          sx={{
            "& .MuiFormLabel-asterisk": { color: "red" },
            ...sx,
          }}
        />
      )}
    />
  );
};

export default MyTextField;
