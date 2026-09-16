import React from 'react';
import { Building2 } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

export const DepartmentDistribution: React.FC = () => {
  const { stats } = useStudents();
  const topDepartments = stats.departmentBreakdown.slice(0, 5);

  return (
    <div className="card">
      <div className="chart-card-header">
        <h2 className="chart-card-title">
          <Building2 size={20} color="var(--primary)" />
          Department Distribution
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {stats.departmentCount} Academic Divisions
        </span>
      </div>

      <div className="progress-list">
        {topDepartments.map(item => (
          <div key={item.department} className="progress-item">
            <div className="progress-header">
              <span className="progress-label">{item.department}</span>
              <span className="progress-metric">
                {item.count} students ({item.percentage}%)
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.max(item.percentage, 5)}%` }}
              />
            </div>
          </div>
        ))}

        {topDepartments.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
            No department data available.
          </p>
        )}
      </div>
    </div>
  );
};
