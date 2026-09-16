import React from 'react';
import { Users2 } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

export const GenderDistribution: React.FC = () => {
  const { stats } = useStudents();

  const genderColors: Record<string, string> = {
    Male: '#3b82f6',
    Female: '#ec4899',
    Other: '#8b5cf6',
  };

  return (
    <div className="card">
      <div className="chart-card-header">
        <h2 className="chart-card-title">
          <Users2 size={20} color="var(--primary)" />
          Gender Distribution
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {stats.totalStudents} Students
        </span>
      </div>

      <div className="progress-list">
        {stats.genderBreakdown.map(item => (
          <div key={item.gender} className="progress-item">
            <div className="progress-header">
              <span className="progress-label">{item.gender}</span>
              <span className="progress-metric">
                {item.count} students ({item.percentage}%)
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.max(item.percentage, item.count > 0 ? 5 : 0)}%`,
                  background: genderColors[item.gender] || 'var(--primary)',
                }}
              />
            </div>
          </div>
        ))}

        {stats.genderBreakdown.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
            No gender data available.
          </p>
        )}
      </div>
    </div>
  );
};
