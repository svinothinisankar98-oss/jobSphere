import { Controller, useFormContext, get } from "react-hook-form";
import TextField from "@mui/material/TextField";

type  MyTextFieldProps ={
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
  rows?: number;
  size?: "small" | "medium";
  sx?: object;
}

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
}: MyTextFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

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
          size={size}
          inputMode={inputMode}
          multiline={Boolean(rows)}
          rows={rows}
          error={!!error}
          helperText={error?.message as string}
          sx={{
            "& .MuiFormLabel-asterisk": {
              color: "red",
            },
            ...sx,
          }}
        />
      )}
    />
  );
};

export default MyTextField;
