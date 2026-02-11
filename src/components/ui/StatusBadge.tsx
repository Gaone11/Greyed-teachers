import React from 'react';

type Status = 'draft' | 'ready' | 'taught' | 'published' | 'completed' | 'sent' | 'active' | 'inactive';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; classes: string }> = {
  draft: {
    label: 'Draft',
    classes: 'bg-premium-neutral-100 text-premium-neutral-600 border-premium-neutral-200',
  },
  ready: {
    label: 'Ready',
    classes: 'bg-accent/10 text-accent-dark border-accent/20',
  },
  taught: {
    label: 'Taught',
    classes: 'bg-success/10 text-success border-success/20',
  },
  published: {
    label: 'Published',
    classes: 'bg-primary/10 text-primary border-primary/20',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-success/10 text-success border-success/20',
  },
  sent: {
    label: 'Sent',
    classes: 'bg-success/10 text-success border-success/20',
  },
  active: {
    label: 'Active',
    classes: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    classes: 'bg-premium-neutral-100 text-premium-neutral-500 border-premium-neutral-200',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
