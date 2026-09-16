import React from 'react';
import { UserPlus } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { StudentFilterBar } from './StudentFilterBar';
import { StudentTable } from './StudentTable';
import { StudentGrid } from './StudentGrid';

export const StudentDirectory: React.FC = () => {
  const {
    students,
    filteredStudents,
    viewMode,
    openAddModal,
  } = useStudents();

  return (
    <div>
      {/* Directory Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Students Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Showing {filteredStudents.length} of {students.length} registered students
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <UserPlus size={18} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <StudentFilterBar />

      {/* View Mode: Table or Grid */}
      {viewMode === 'table' ? <StudentTable /> : <StudentGrid />}
    </div>
  );
};
