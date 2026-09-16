import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { Student, StudentFormData, FilterOptions, DashboardStats } from '../types/student';
import { studentService } from '../services/studentService';

interface StudentContextType {
  students: Student[];
  filteredStudents: Student[];
  loading: boolean;
  activeView: 'dashboard' | 'directory';
  setActiveView: (view: 'dashboard' | 'directory') => void;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  stats: DashboardStats;
  
  // Modals
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  
  editingStudent: Student | null;
  openEditModal: (student: Student) => void;
  closeEditModal: () => void;
  
  viewingStudent: Student | null;
  openViewModal: (student: Student) => void;
  closeViewModal: () => void;
  
  deletingStudent: Student | null;
  openDeleteModal: (student: Student) => void;
  closeDeleteModal: () => void;
  
  // Actions
  createStudent: (formData: StudentFormData) => Promise<boolean>;
  updateStudent: (id: string, formData: Partial<StudentFormData>) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  refreshStudents: () => Promise<void>;
  
  // Feedback
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  departments: string[];
  semesters: string[];
}

const defaultFilters: FilterOptions = {
  search: '',
  department: 'ALL',
  semester: 'ALL',
  gender: 'ALL',
  status: 'ALL',
  sortBy: 'full_name',
  sortOrder: 'asc',
};

const ALL_SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err: any) {
      console.error('Error fetching students from Supabase:', err);
      showToast(err.message || 'Error connecting to Supabase database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const departments = useMemo(() => {
    const defaultDepts = [
      'Computer Science',
      'Data Science',
      'Mechanical Engineering',
      'Electrical Engineering',
      'Civil Engineering',
      'Biomedical Science',
      'Business Administration',
      'Economics',
      'Psychology',
      'Fine Arts & Design',
      'Physics',
    ];
    const present = students.map(s => s.department);
    return Array.from(new Set([...defaultDepts, ...present])).sort();
  }, [students]);

  const semesters = ALL_SEMESTERS;

  // Filter & sort real students
  const filteredStudents = useMemo(() => {
    return students
      .filter(student => {
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const name = student.full_name.toLowerCase();
          const email = student.email.toLowerCase();
          const id = student.student_id.toLowerCase();
          const dept = student.department.toLowerCase();
          if (!name.includes(q) && !email.includes(q) && !id.includes(q) && !dept.includes(q)) {
            return false;
          }
        }

        if (filters.department !== 'ALL' && student.department !== filters.department) {
          return false;
        }

        if (filters.semester !== 'ALL' && student.semester !== filters.semester) {
          return false;
        }

        if (filters.gender !== 'ALL' && student.gender !== filters.gender) {
          return false;
        }

        if (filters.status !== 'ALL' && student.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (filters.sortBy === 'full_name') {
          comp = a.full_name.localeCompare(b.full_name);
        } else if (filters.sortBy === 'student_id') {
          comp = a.student_id.localeCompare(b.student_id);
        } else if (filters.sortBy === 'department') {
          comp = a.department.localeCompare(b.department);
        } else if (filters.sortBy === 'semester') {
          comp = a.semester.localeCompare(b.semester, undefined, { numeric: true });
        }

        return filters.sortOrder === 'asc' ? comp : -comp;
      });
  }, [students, filters]);

  const stats = useMemo(() => {
    return studentService.computeStats(students);
  }, [students]);

  const createStudent = async (formData: StudentFormData): Promise<boolean> => {
    try {
      const created = await studentService.createStudent(formData);
      setStudents(prev => [created, ...prev]);
      showToast(`Student ${created.full_name} created successfully in Supabase!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to create student.', 'error');
      return false;
    }
  };

  const updateStudent = async (id: string, formData: Partial<StudentFormData>): Promise<boolean> => {
    try {
      const updated = await studentService.updateStudent(id, formData);
      setStudents(prev => prev.map(s => (s.id === id ? updated : s)));
      showToast(`Student record for ${updated.full_name} updated in Supabase!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update student.', 'error');
      return false;
    }
  };

  const deleteStudent = async (id: string): Promise<boolean> => {
    try {
      await studentService.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast('Student deleted from Supabase.', 'info');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to delete student.', 'error');
      return false;
    }
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        filteredStudents,
        loading,
        activeView,
        setActiveView,
        viewMode,
        setViewMode,
        filters,
        setFilters,
        resetFilters,
        stats,
        isAddModalOpen,
        openAddModal: () => setIsAddModalOpen(true),
        closeAddModal: () => setIsAddModalOpen(false),
        editingStudent,
        openEditModal: (s: Student) => setEditingStudent(s),
        closeEditModal: () => setEditingStudent(null),
        viewingStudent,
        openViewModal: (s: Student) => setViewingStudent(s),
        closeViewModal: () => setViewingStudent(null),
        deletingStudent,
        openDeleteModal: (s: Student) => setDeletingStudent(s),
        closeDeleteModal: () => setDeletingStudent(null),
        createStudent,
        updateStudent,
        deleteStudent,
        refreshStudents: loadStudents,
        toast,
        showToast,
        departments,
        semesters,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
