import React from "react";

type CommonFileUploadProps = {
  label?: string;
  name: string;
  required?: boolean;
  accept?: string;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CommonFileUpload: React.FC<CommonFileUploadProps> = ({
  label,
  name,
  required = false,
  accept,
  error,
  onChange,
  inputRef,
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-semibold">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}

      <input
        type="file"
        name={name}
        ref={inputRef}
        className={`form-control ${error ? "is-invalid" : ""}`}
        required={required}
        accept={accept}
        onChange={onChange}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default CommonFileUpload;
