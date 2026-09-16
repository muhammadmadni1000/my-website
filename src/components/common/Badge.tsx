import React from 'react';
import type { StudentStatus } from '../../types/student';

interface BadgeProps {
  status: StudentStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusClass = `badge-${status.toLowerCase()}`;
  return (
    <span className={`badge ${statusClass}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
};
