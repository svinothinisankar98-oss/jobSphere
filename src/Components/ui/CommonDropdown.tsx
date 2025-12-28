import React from "react";

type Option = {
  id: number;
  item: string;
};

type Props = {
  label?: string;
  name: string;
  value: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
   icon?: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const CommonDropdown: React.FC<Props> = ({
  label,
  name,
  value,
  options,
  placeholder = "Select",
  required = false,
  disabled = false,
  error,
  
  style,
  className = "form-select",
  onChange,
}) => {
  return (
    <div style={{ width: "100%" }}>
      {/* Label */}
      {label && (
        <label className="form-label fw-semibold">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      
      

      {/* Select */}
      <select
        name={name}
        value={value}
        style={style}
        className={`${className} ${error ? "is-invalid" : ""}`}
        required={required}
        disabled={disabled}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>

        {options.map((opt) => (
          <option key={opt.id} value={opt.item}>
            {opt.item}
          </option>
        ))}
      </select>

      {/* Error */}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default CommonDropdown;
