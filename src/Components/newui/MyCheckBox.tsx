import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";


type MyCheckboxProps = {
  name: string;
  label: string;
  options: Array<{value:string; label:string}>;
  row?: boolean;
};

const MyCheckbox = ({
  name,
  label,
  options,
  row = false,
}: MyCheckboxProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // const options = EmploymentCheckBoxOptions[optionKey];

  return (
    <FormControl error={!!errors[name]}>
      <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>

      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <FormGroup row={row}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                label={option.label}
                control={
                  <Checkbox
                    checked={field.value?.includes(option.value)}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      if (checked) {
                        field.onChange([...field.value, option.value]);
                      } else {
                        field.onChange(
                          field.value.filter(
                            (v: string) => v !== option.value
                          )
                        );
                      }
                    }}
                  />
                }
              />
            ))}
          </FormGroup>
        )}
      />

      {errors[name] && (
        <FormHelperText>
          {errors[name]?.message as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default MyCheckbox;
