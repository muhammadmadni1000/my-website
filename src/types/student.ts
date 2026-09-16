export type StudentStatus = 'Active' | 'Inactive' | 'Suspended';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  photo: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  gender: Gender;
  status: StudentStatus;
  created_at?: string;
}

export interface StudentFormData {
  photo: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  gender: Gender;
  status: StudentStatus;
}

export interface FilterOptions {
  search: string;
  department: string;
  semester: string;
  gender: string;
  status: string;
  sortBy: 'full_name' | 'student_id' | 'department' | 'semester';
  sortOrder: 'asc' | 'desc';
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  suspendedStudents: number;
  departmentCount: number;
  departmentBreakdown: { department: string; count: number; percentage: number }[];
  genderBreakdown: { gender: string; count: number; percentage: number }[];
  semesterBreakdown: { semester: string; count: number; percentage: number }[];
}
