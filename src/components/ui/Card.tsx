import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6 md:p-8',
};

const variantMap = {
  default: 'bg-white rounded-xl shadow-sm',
  elevated: 'bg-white rounded-xl shadow-premium hover:shadow-premiumHover transition-shadow',
  outlined: 'bg-white rounded-xl border border-premium-neutral-200',
};

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={`${variantMap[variant]} ${paddingMap[padding]} ${onClick ? 'text-left w-full cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Tag>
  );
};

export default Card;
