import React, { ReactNode, useId, cloneElement, isValidElement } from 'react';

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
  const fieldId = useId();

  // Clone the child element and add the id prop if it's a valid React element
  const childWithId = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        id: (children as any).props?.id || fieldId,
        'aria-describedby': (children as any).props?.['aria-describedby'] || (error ? errorId : undefined),
      })
    : children;

  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-text mb-1">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <div>
        {childWithId}
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
