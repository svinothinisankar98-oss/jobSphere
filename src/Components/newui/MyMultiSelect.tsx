import { Controller, useFormContext } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";

type Option = {
  id: string | number;
  item: string;
};

type Props = {
  name: string;           //RHF field name//
  label: string;
  options: Option[];        //dropdown items//
  required?: boolean;
  placeholder?: string;
  size?: "small" | "medium";
  sx?: object;
};

export default function MyMultiSelect({
  name,
  label,
  options,
  required,
  placeholder,
  size = "small",
  sx,
}: Props) {

  // react hook form integration//

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          select
          fullWidth
          label={label}
          required={required}
          size={size}
          value={field.value ?? []}
          onChange={(e) => field.onChange(e.target.value)}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          placeholder={placeholder}
          sx={{
            "& .MuiFormLabel-asterisk": { color: "red" },
            ...sx,
          }}
          SelectProps={{           //Showing selected labels//
            multiple: true,
            renderValue: (selected) =>
              (selected as (string | number)[])
                .map(
                  (id) =>
                    options.find((o) => o.id === id)?.item
                )
                .join(", "),
          }}
        >

          
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox
                checked={(field.value ?? []).includes(option.id)}        // Selected values handling//
              />
              <ListItemText primary={option.item} />
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
