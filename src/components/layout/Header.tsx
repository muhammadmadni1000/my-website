import React from 'react';
import { UserPlus, Calendar } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

export const Header: React.FC = () => {
  const { activeView, openAddModal } = useStudents();

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="header-page-title">
          {activeView === 'dashboard' ? 'Dashboard Overview' : 'Students Directory'}
        </h1>
        <div className="header-term-tag">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            Fall Semester 2024
          </span>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn btn-primary" onClick={openAddModal}>
          <UserPlus size={18} />
          <span>Add Student</span>
        </button>
      </div>
    </header>
  );
};
