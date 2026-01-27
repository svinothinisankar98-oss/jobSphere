import { Controller, useFormContext, get } from "react-hook-form";
import TextField from "@mui/material/TextField";

type MyTextFieldProps = {
  name?: string; //
  label?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
  rows?: number;
  helpertext?: string;
  size?: "small" | "medium";
  sx?: object;
  fullWidth?:boolean;
  hideErrorText?: boolean;

  
  value?: string;
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
  hideErrorText
  
}: MyTextFieldProps) => {
  const formContext = useFormContext(); 

  // standalone mode//
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
            // helperText={error?.message || " "}
             helperText={hideErrorText ? undefined : error?.message}
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
