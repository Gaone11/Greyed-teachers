import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'accent' | 'success' | 'error';
  className?: string;
}

const colorMap = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    trend: 'text-primary',
  },
  accent: {
    bg: 'bg-accent/10',
    icon: 'text-accent-dark',
    trend: 'text-accent-dark',
  },
  success: {
    bg: 'bg-success/10',
    icon: 'text-success',
    trend: 'text-success',
  },
  error: {
    bg: 'bg-error/10',
    icon: 'text-error',
    trend: 'text-error',
  },
};

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  color = 'primary',
  className = '',
}) => {
  const colors = colorMap[color];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className={`${colors.bg} p-2.5 rounded-lg`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.direction === 'up' ? 'text-success' : 'text-error'}`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-text">{value}</p>
        <p className="text-sm text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
