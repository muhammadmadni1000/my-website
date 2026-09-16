import React, { useState, useEffect, useRef } from 'react';
import { X, UserCheck, Upload, Image as ImageIcon } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import type { StudentFormData, Gender, StudentStatus } from '../../types/student';

export const StudentModal: React.FC = () => {
  const {
    isAddModalOpen,
    closeAddModal,
    editingStudent,
    closeEditModal,
    createStudent,
    updateStudent,
    departments,
    semesters,
    students,
  } = useStudents();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = isAddModalOpen || editingStudent !== null;
  const isEditing = editingStudent !== null;

  // Form State strictly for the 9 core fields
  const [formData, setFormData] = useState<StudentFormData>({
    photo: '',
    student_id: '',
    full_name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    semester: 'Semester 1',
    gender: 'Male',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        photo: editingStudent.photo || '',
        student_id: editingStudent.student_id,
        full_name: editingStudent.full_name,
        email: editingStudent.email,
        phone: editingStudent.phone,
        department: editingStudent.department,
        semester: editingStudent.semester,
        gender: editingStudent.gender,
        status: editingStudent.status,
      });
      setErrors({});
    } else if (isAddModalOpen) {
      const nextNum = (students.length + 1).toString().padStart(3, '0');
      const year = new Date().getFullYear();
      setFormData({
        photo: '',
        student_id: `STU-${year}-${nextNum}`,
        full_name: '',
        email: '',
        phone: '',
        department: departments[0] || 'Computer Science',
        semester: 'Semester 1',
        gender: 'Male',
        status: 'Active',
      });
      setErrors({});
    }
  }, [editingStudent, isAddModalOpen, students.length, departments]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isEditing) closeEditModal();
    else closeAddModal();
  };

  // Image Upload / Selection Handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please select a valid image file.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
        setErrors(prev => {
          const updated = { ...prev };
          delete updated.photo;
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.student_id.trim()) {
      errs.student_id = 'Student ID is required';
    }
    if (!formData.full_name.trim()) {
      errs.full_name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email address format';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    }
    if (!formData.department.trim()) {
      errs.department = 'Department is required';
    }
    if (!formData.semester.trim()) {
      errs.semester = 'Semester is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Default fallback avatar if no photo is uploaded
      const finalPhoto =
        formData.photo.trim() ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          formData.full_name || 'student'
        )}`;

      const dataToSave: StudentFormData = {
        ...formData,
        photo: finalPhoto,
      };

      if (isEditing && editingStudent) {
        const success = await updateStudent(editingStudent.id, dataToSave);
        if (success) handleClose();
      } else {
        const success = await createStudent(dataToSave);
        if (success) handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserCheck size={20} />
            </div>
            <h2 className="modal-title">
              {isEditing ? 'Edit Student Details' : 'Enroll New Student'}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Student Photo Upload Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '16px',
                background: 'var(--bg-app)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-color)',
                marginBottom: '20px',
              }}
            >
              <div style={{ position: 'relative' }}>
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Preview"
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid white',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <ImageIcon size={30} />
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
                  Student Photo
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Upload an image from your device or specify an image URL.
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>Upload Image</span>
                  </button>

                  {formData.photo && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-grid">
              {/* Student ID */}
              <div className="form-group">
                <label className="form-label">Student ID *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. STU-2024-001"
                  value={formData.student_id}
                  onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                />
                {errors.student_id && <span className="form-error-msg">{errors.student_id}</span>}
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="form-group full-width">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Rivera"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                />
                {errors.full_name && <span className="form-error-msg">{errors.full_name}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@studenthub.edu"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <span className="form-error-msg">{errors.department}</span>}
              </div>

              {/* Semester */}
              <div className="form-group">
                <label className="form-label">Semester *</label>
                <select
                  className="form-select"
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value })}
                >
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                {errors.semester && <span className="form-error-msg">{errors.semester}</span>}
              </div>

              {/* Gender */}
              <div className="form-group full-width">
                <label className="form-label">Gender *</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Update Student Record'
                  : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
