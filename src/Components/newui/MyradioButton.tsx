import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  row?: boolean;
};

const MyradioButton = ({
  name,
  label,
  options,
  row = true,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name];

  return (
    <FormControl error={!!error}>
      <FormLabel>{label}</FormLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            {...field}
            row={row}
            onChange={(e) => field.onChange(e.target.value)}
          >
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio  />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
        )}
      />

      {error && (
        <FormHelperText>{error.message as string}</FormHelperText>
      )}
    </FormControl>
  );
};

export default MyradioButton;
