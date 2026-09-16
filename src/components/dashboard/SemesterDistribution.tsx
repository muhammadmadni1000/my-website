import React from 'react';
import { Layers } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

export const SemesterDistribution: React.FC = () => {
  const { stats } = useStudents();

  return (
    <div className="card">
      <div className="chart-card-header">
        <h2 className="chart-card-title">
          <Layers size={20} color="var(--primary)" />
          Semester Distribution
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {stats.semesterBreakdown.length} Active Semesters
        </span>
      </div>

      <div className="progress-list">
        {stats.semesterBreakdown.map(item => (
          <div key={item.semester} className="progress-item">
            <div className="progress-header">
              <span className="progress-label">{item.semester}</span>
              <span className="progress-metric">
                {item.count} students ({item.percentage}%)
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.max(item.percentage, item.count > 0 ? 5 : 0)}%`,
                  background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)',
                }}
              />
            </div>
          </div>
        ))}

        {stats.semesterBreakdown.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
            No semester data available.
          </p>
        )}
      </div>
    </div>
  );
};
