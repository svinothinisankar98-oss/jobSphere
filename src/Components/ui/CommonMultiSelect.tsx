import {
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";

type Option = {
  id: number;
  item: string;
  value: string;
};

type Props = {
  label: string;
  value: string[];
  options: Option[];
  onChange: (value: string[]) => void;
  size?: "small" | "medium";
  placeholder?: string;
  sx?: object;
};

export default function CommonMultiSelect({
  label,
  value,
  options,
  onChange,
  size = "small",
  placeholder,
  sx,
}: Props) {

  const selectedIds = options
    .filter(o => value.includes(o.value))
    .map(o => o.id);

  return (
    <TextField
      select
      fullWidth
      label={label}
      size={size}
      value={selectedIds}
      placeholder={placeholder}
      onChange={(e) => {
        const ids = e.target.value as unknown as number[];

        const values = options
          .filter(o => ids.includes(o.id))
          .map(o => o.value);

        onChange(values);
      }}
      SelectProps={{
        multiple: true,
        renderValue: (selected) =>
          (selected as number[])
            .map(id => options.find(o => o.id === id)?.item)
            .join(", "),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",        
          backgroundColor: "#fff",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",

          "& fieldset": {
            borderColor: "#e0e0e0",
          },

          "&:hover fieldset": {
            borderColor: "#1976d2",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#1976d2",
            borderWidth: "2px",
          },
        },

        "& .MuiInputLabel-root": {
          fontSize: 14,
        },

        ...sx,   
      }}
    >
      {options.map(option => (
        <MenuItem key={option.id} value={option.id}>
          <Checkbox checked={selectedIds.includes(option.id)} />
          <ListItemText primary={option.item} />
        </MenuItem>
      ))}
    </TextField>
  );
}
