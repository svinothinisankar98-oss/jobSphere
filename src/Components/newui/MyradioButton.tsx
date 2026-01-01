import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

type Option = {
  label: string;
  value: string;
};

type CommonRadioGroupProps = {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

const MyradioButton = ({
  label,
  name,
  value,
  options,
  onChange,
}: CommonRadioGroupProps) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>

      <RadioGroup
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default MyradioButton;
