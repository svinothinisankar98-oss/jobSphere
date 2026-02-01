import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

type Props = {
  name: string;
  label: string;
  required?: boolean;
  minRows?: number;
  maxRows?: number;
  sx?:object;
};

export default function MyTextarea({
  name,
  label,
  required,
  minRows = 3,
  maxRows = 6,
  sx
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          multiline
          minRows={minRows}
          maxRows={maxRows}
          value={field.value ?? ""}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          fullWidth
          required={required}

          sx={{
          "& .MuiFormLabel-asterisk": { color: "red" },
          ...sx,
        }}
        />
      )}
    />
  );
}
