import { Controller, useFormContext, get } from "react-hook-form";
import { MenuItem, TextField } from "@mui/material";

type Option = {
  id: number;
  item: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  sx?: object;
};

const MyDropDown = ({ name, label, options, required = false, sx }: Props) => {
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
          select
          fullWidth
          label={label}
          required={required}
          error={!!error}
          helperText={error?.message as string}
          sx={{
            "& .MuiFormLabel-asterisk": {
              color: "red",
            },
            ...sx,
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.item}>
              {option.item}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default MyDropDown;
