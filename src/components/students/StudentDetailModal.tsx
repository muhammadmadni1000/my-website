import React from 'react';
import { X, Edit2, Trash2, Mail, Phone, BookOpen, Layers, UserCheck } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { Badge } from '../common/Badge';

export const StudentDetailModal: React.FC = () => {
  const {
    viewingStudent,
    closeViewModal,
    openEditModal,
    openDeleteModal,
  } = useStudents();

  if (!viewingStudent) return null;

  const handleEdit = () => {
    const student = viewingStudent;
    closeViewModal();
    openEditModal(student);
  };

  const handleDelete = () => {
    const student = viewingStudent;
    closeViewModal();
    openDeleteModal(student);
  };

  return (
    <div className="modal-overlay" onClick={closeViewModal}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Student Profile</h2>
          <button className="modal-close-btn" onClick={closeViewModal}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Profile Hero with Photo, Full Name, ID, and Status */}
          <div className="profile-hero">
            <img
              src={
                viewingStudent.photo ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  viewingStudent.full_name
                )}`
              }
              alt={viewingStudent.full_name}
              className="profile-avatar-large"
            />
            <div className="profile-hero-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 className="profile-name">{viewingStudent.full_name}</h3>
                <Badge status={viewingStudent.status} />
              </div>
              <div className="profile-sub" style={{ fontFamily: 'monospace' }}>
                ID: {viewingStudent.student_id}
              </div>
              <div className="profile-sub">
                {viewingStudent.department} &bull; {viewingStudent.semester}
              </div>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="profile-info-grid">
            <div className="profile-info-card">
              <div className="profile-info-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <BookOpen size={14} /> Department
              </div>
              <div className="profile-info-val">{viewingStudent.department}</div>
            </div>

            <div className="profile-info-card">
              <div className="profile-info-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Layers size={14} /> Semester
              </div>
              <div className="profile-info-val">{viewingStudent.semester}</div>
            </div>

            <div className="profile-info-card">
              <div className="profile-info-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <UserCheck size={14} /> Gender
              </div>
              <div className="profile-info-val">{viewingStudent.gender}</div>
            </div>

            <div className="profile-info-card">
              <div className="profile-info-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={14} /> Phone
              </div>
              <div className="profile-info-val">{viewingStudent.phone}</div>
            </div>

            <div className="profile-info-card" style={{ gridColumn: '1 / -1' }}>
              <div className="profile-info-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={14} /> Institutional Email
              </div>
              <div className="profile-info-val">{viewingStudent.email}</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeViewModal}>
            Close
          </button>
          <button className="btn btn-secondary" onClick={handleEdit}>
            <Edit2 size={16} />
            <span>Edit Record</span>
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
            <span>Delete Student</span>
          </button>
        </div>
      </div>
    </div>
  );
};
