import React from 'react';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { Badge } from '../common/Badge';

export const RecentStudents: React.FC = () => {
  const { students, setActiveView, openViewModal } = useStudents();
  const recent = students.slice(0, 5);

  return (
    <div className="card">
      <div className="chart-card-header">
        <h2 className="chart-card-title">
          <Sparkles size={20} color="var(--primary)" />
          Recent Enrollments
        </h2>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setActiveView('directory')}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>View All Directory</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Email</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(student => (
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
                  <button
                    className="action-btn"
                    title="View Profile"
                    onClick={() => openViewModal(student)}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {recent.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                  No students enrolled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
