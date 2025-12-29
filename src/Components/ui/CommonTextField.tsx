import React from "react";

type Props = {
  label?: string;
  name: string;
  value: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?:string;
  inputMode?: "text" | "numeric" | "decimal";
  rows?: number; //  textarea
  onChange?: (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => void;
};

const CommonTextField: React.FC<Props> = ({
  label,
  name,
  value,
  type = "text",
  placeholder = "",
  required,
  className = "",
  inputMode,
  rows,
  error='',
  onChange,
}) => {
  const hasError = error.trim().length > 0;
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-semibold">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {rows ? (
        /* TEXTAREA */
        <textarea
          name={name}
          value={value}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className={`form-control ${className} ${hasError ? "is-invalid" : ""}`}
          onChange={onChange}
        />
      ) : (
        /* INPUT */
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
          className={`form-control ${className} ${hasError ? "is-invalid" : ""}`}
          onChange={onChange}
          
        />
      )}
      {hasError && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};

export default CommonTextField;
