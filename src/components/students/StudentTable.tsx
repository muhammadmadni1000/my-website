import React from 'react';
import { Eye, Edit2, Trash2, SearchX } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { Badge } from '../common/Badge';

export const StudentTable: React.FC = () => {
  const {
    filteredStudents,
    openViewModal,
    openEditModal,
    openDeleteModal,
    resetFilters,
  } = useStudents();

  if (filteredStudents.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <SearchX size={28} />
        </div>
        <h3 className="empty-title">No matching students found</h3>
        <p className="empty-desc">
          Try adjusting your search criteria or resetting filters to see the full directory.
        </p>
        <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Gender</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>
                  <div className="student-info-cell">
                    <img
                      src={
                        student.photo ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          student.full_name
                        )}`
                      }
                      alt={student.full_name}
                      className="student-avatar"
                    />
                    <div>
                      <div className="student-name-text">{student.full_name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{student.student_id}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.department}</td>
                <td>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-subtle)',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}
                  >
                    {student.semester}
                  </span>
                </td>
                <td>{student.gender}</td>
                <td>
                  <Badge status={student.status} />
                </td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="action-btn"
                      title="View Student Details"
                      onClick={() => openViewModal(student)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn edit"
                      title="Edit Student"
                      onClick={() => openEditModal(student)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete Student"
                      onClick={() => openDeleteModal(student)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
