import React from 'react';
import { Search, LayoutGrid, List, RotateCcw } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';

export const StudentFilterBar: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    departments,
    semesters,
  } = useStudents();

  const isFiltered =
    filters.search !== '' ||
    filters.department !== 'ALL' ||
    filters.semester !== 'ALL' ||
    filters.gender !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.sortBy !== 'full_name' ||
    filters.sortOrder !== 'asc';

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, student ID, email..."
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>

      {/* Department Filter */}
      <select
        className="filter-select"
        value={filters.department}
        onChange={e => setFilters(prev => ({ ...prev, department: e.target.value }))}
      >
        <option value="ALL">All Departments</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* Semester Filter */}
      <select
        className="filter-select"
        value={filters.semester}
        onChange={e => setFilters(prev => ({ ...prev, semester: e.target.value }))}
      >
        <option value="ALL">All Semesters</option>
        {semesters.map(sem => (
          <option key={sem} value={sem}>
            {sem}
          </option>
        ))}
      </select>

      {/* Gender Filter */}
      <select
        className="filter-select"
        value={filters.gender}
        onChange={e => setFilters(prev => ({ ...prev, gender: e.target.value }))}
      >
        <option value="ALL">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      {/* Status Filter */}
      <select
        className="filter-select"
        value={filters.status}
        onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
      >
        <option value="ALL">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Suspended">Suspended</option>
      </select>

      {/* Sort By */}
      <select
        className="filter-select"
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={e => {
          const [field, order] = e.target.value.split('-');
          setFilters(prev => ({
            ...prev,
            sortBy: field as any,
            sortOrder: order as any,
          }));
        }}
      >
        <option value="full_name-asc">Sort: Name (A-Z)</option>
        <option value="full_name-desc">Sort: Name (Z-A)</option>
        <option value="student_id-asc">Sort: Student ID</option>
        <option value="department-asc">Sort: Department</option>
        <option value="semester-asc">Sort: Semester</option>
      </select>

      {/* Reset Button */}
      {isFiltered && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={resetFilters}
          title="Reset all filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      )}

      {/* Table / Grid Switcher */}
      <div className="view-toggle-group" style={{ marginLeft: 'auto' }}>
        <button
          className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => setViewMode('table')}
          title="Table View"
        >
          <List size={18} />
        </button>
        <button
          className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="Grid View"
        >
          <LayoutGrid size={18} />
        </button>
      </div>
    </div>
  );
};
