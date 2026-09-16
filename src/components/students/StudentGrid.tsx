import React from 'react';
import { Eye, Edit2, Trash2, Mail, Phone, BookOpen, Layers, UserCheck, SearchX } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { Badge } from '../common/Badge';

export const StudentGrid: React.FC = () => {
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
    <div className="students-grid">
      {filteredStudents.map(student => (
        <div key={student.id} className="student-card">
          <div className="student-card-header">
            <img
              src={
                student.photo ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  student.full_name
                )}`
              }
              alt={student.full_name}
              className="card-avatar"
            />
            <div className="student-card-meta">
              <h3 className="student-card-name">{student.full_name}</h3>
              <div className="student-card-id">{student.student_id}</div>
              <div style={{ marginTop: '6px' }}>
                <Badge status={student.status} />
              </div>
            </div>
          </div>

          <div className="student-card-details">
            <div className="card-detail-row">
              <span className="card-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <BookOpen size={14} /> Department
              </span>
              <span style={{ fontWeight: 600 }}>{student.department}</span>
            </div>

            <div className="card-detail-row">
              <span className="card-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Layers size={14} /> Semester
              </span>
              <span style={{ fontWeight: 500 }}>{student.semester}</span>
            </div>

            <div className="card-detail-row">
              <span className="card-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <UserCheck size={14} /> Gender
              </span>
              <span style={{ fontWeight: 500 }}>{student.gender}</span>
            </div>

            <div className="card-detail-row">
              <span className="card-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={14} /> Email
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  maxWidth: '160px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {student.email}
              </span>
            </div>

            <div className="card-detail-row">
              <span className="card-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={14} /> Phone
              </span>
              <span style={{ fontSize: '0.8rem' }}>{student.phone}</span>
            </div>
          </div>

          <div className="student-card-footer">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => openViewModal(student)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Eye size={14} />
              <span>Details</span>
            </button>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="action-btn edit"
                title="Edit Student"
                onClick={() => openEditModal(student)}
              >
                <Edit2 size={15} />
              </button>
              <button
                className="action-btn delete"
                title="Delete Student"
                onClick={() => openDeleteModal(student)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
