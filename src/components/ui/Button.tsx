import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-surface-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
