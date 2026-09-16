import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

export const DeleteConfirmModal: React.FC = () => {
  const { deletingStudent, closeDeleteModal, deleteStudent } = useStudents();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!deletingStudent) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteStudent(deletingStudent.id);
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeDeleteModal}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '480px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-body" style={{ textAlign: 'center', paddingTop: '32px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <AlertTriangle size={32} />
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Delete Student Record?
          </h3>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '16px',
            }}
          >
            <img
              src={
                deletingStudent.photo ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  deletingStudent.full_name
                )}`
              }
              alt={deletingStudent.full_name}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{deletingStudent.full_name}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              ({deletingStudent.student_id})
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
            Are you sure you want to permanently delete this student record? This action will remove the student from the directory and database.
          </p>

          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: '#991b1b',
              textAlign: 'left',
              marginBottom: '20px',
            }}
          >
            This action cannot be undone.
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeDeleteModal}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Student'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
