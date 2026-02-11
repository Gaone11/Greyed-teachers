import React, { ReactNode, useId } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className = '',
}) => {
  const errorId = useId();

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-text mb-1">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <div aria-describedby={error ? errorId : undefined}>
        {children}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
