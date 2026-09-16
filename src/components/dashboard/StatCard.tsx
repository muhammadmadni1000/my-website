import React, { type ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  helperText: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  helperText,
  icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        <span className="stat-helper">{helperText}</span>
      </div>
      <div
        className="stat-icon-wrapper"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
    </div>
  );
};
