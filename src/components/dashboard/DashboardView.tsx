import React from 'react';
import { Users, UserCheck, Building2, UserX } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { StatCard } from './StatCard';
import { DepartmentDistribution } from './DepartmentDistribution';
import { GenderDistribution } from './GenderDistribution';
import { SemesterDistribution } from './SemesterDistribution';
import { RecentStudents } from './RecentStudents';

export const DashboardView: React.FC = () => {
  const { stats } = useStudents();

  const activeRate = stats.totalStudents > 0
    ? Math.round((stats.activeStudents / stats.totalStudents) * 100)
    : 0;

  const inactiveOrSuspended = stats.inactiveStudents + stats.suspendedStudents;

  return (
    <div>
      {/* Metric Cards Row */}
      <div className="stat-cards-grid">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          helperText="Registered in directory"
          icon={<Users size={24} />}
          iconBg="var(--primary-light)"
          iconColor="var(--primary)"
        />
        <StatCard
          label="Active Students"
          value={stats.activeStudents}
          helperText={`${activeRate}% currently active`}
          icon={<UserCheck size={24} />}
          iconBg="var(--success-light)"
          iconColor="var(--success)"
        />
        <StatCard
          label="Inactive / Suspended"
          value={inactiveOrSuspended}
          helperText={`${stats.inactiveStudents} inactive, ${stats.suspendedStudents} suspended`}
          icon={<UserX size={24} />}
          iconBg="var(--warning-light)"
          iconColor="var(--warning)"
        />
        <StatCard
          label="Departments"
          value={stats.departmentCount}
          helperText="Academic disciplines"
          icon={<Building2 size={24} />}
          iconBg="#fdf4ff"
          iconColor="#c026d3"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="dashboard-grid-2col">
        <DepartmentDistribution />
        <GenderDistribution />
      </div>

      {/* Semester Distribution */}
      <div style={{ marginBottom: '28px' }}>
        <SemesterDistribution />
      </div>

      {/* Recent Students Table */}
      <RecentStudents />
    </div>
  );
};
