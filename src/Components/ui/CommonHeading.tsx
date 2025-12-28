import React from "react";
import type { JSX } from "react/jsx-dev-runtime";

type CommonHeadingProps = {
  title: string;
  subtitle?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  center?: boolean;
  className?: string;
};

const CommonHeading: React.FC<CommonHeadingProps> = ({
  title,
  subtitle,
  level = 3,
  center = false,
  className = "",
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <div className={`mb-4 ${center ? "text-center" : ""} ${className}`}>
      <HeadingTag className="fw-bold mb-1">{title}</HeadingTag>

      {subtitle && (
        <p className="text-muted mb-0">{subtitle}</p>
      )}
    </div>
  );
};

export default CommonHeading;
