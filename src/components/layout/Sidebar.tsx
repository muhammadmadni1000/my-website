import React from 'react';
import { LayoutDashboard, Users, GraduationCap, Database } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, students } = useStudents();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-badge">
          <GraduationCap size={26} />
        </div>
        <div className="logo-title">
          <span>StudentHub</span>
          <span className="logo-tag">Portal v1.0</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Navigation</div>

        <button
          className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${activeView === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveView('directory')}
        >
          <Users size={20} />
          <span>Students Directory</span>
          <span className="nav-count">{students.length}</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-card">
          <div className="system-status-indicator">
            <span className="pulse-dot" />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Database Ready'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.725rem' }}>
            <Database size={13} />
            <span>Academic Year 2024–2025</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
