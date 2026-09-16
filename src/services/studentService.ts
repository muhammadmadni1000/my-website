import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Student, StudentFormData, DashboardStats } from '../types/student';

// Helper to normalize Supabase row to frontend Student type
const mapSupabaseRow = (row: any): Student => {
  let sem = row.semester;
  if (typeof sem === 'number') {
    sem = `Semester ${sem}`;
  } else if (!sem) {
    sem = 'Semester 1';
  }

  return {
    id: row.id,
    photo: row.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row.full_name || 'student')}`,
    student_id: row.student_id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    department: row.department,
    semester: sem,
    gender: row.gender,
    status: row.status || 'Active',
    created_at: row.created_at,
  };
};

export const studentService = {
  /**
   * Fetch all students directly from Supabase
   */
  async getStudents(): Promise<Student[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.');
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42501' || error.message?.toLowerCase().includes('permission denied')) {
        throw new Error(
          'Supabase Permission Denied (42501): Please run the updated SQL in supabase/schema.sql in your Supabase SQL Editor to grant table access to the anon role.'
        );
      }
      throw new Error(error.message || 'Failed to fetch students from Supabase.');
    }

    return (data || []).map(mapSupabaseRow);
  },

  /**
   * Fetch a single student by UUID
   */
  async getStudentById(id: string): Promise<Student | null> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return mapSupabaseRow(data);
  },

  /**
   * Create a new student in Supabase
   */
  async createStudent(formData: StudentFormData): Promise<Student> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    // Try payload with photo, and fallback if photo column doesn't exist yet in user's DB
    const payload: Record<string, any> = {
      student_id: formData.student_id.trim().toUpperCase(),
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      department: formData.department,
      semester: formData.semester,
      gender: formData.gender,
      status: formData.status,
    };

    let { data, error } = await supabase
      .from('students')
      .insert([payload])
      .select()
      .single();

    // If error indicates semester requires integer or photo column missing
    if (error && error.message?.includes('column "photo" of relation "students" does not exist')) {
      delete payload.photo;
      const retry = await supabase
        .from('students')
        .insert([payload])
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    // If semester is an integer in DB (e.g. 1..8)
    if (error && (error.code === '22P02' || error.message?.includes('invalid input syntax for type integer'))) {
      const match = formData.semester.match(/\d+/);
      payload.semester = match ? parseInt(match[0], 10) : 1;
      const retry = await supabase
        .from('students')
        .insert([payload])
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      if (error.code === '23505' || error.message?.includes('unique constraint')) {
        throw new Error('A student with this Student ID or Email already exists in Supabase.');
      }
      if (error.code === '42501' || error.message?.toLowerCase().includes('permission denied')) {
        throw new Error(
          'Supabase Permission Denied: Run the SQL in supabase/schema.sql in your Supabase SQL Editor.'
        );
      }
      throw new Error(error.message || 'Failed to create student in Supabase.');
    }

    return mapSupabaseRow(data);
  },

  /**
   * Update an existing student in Supabase
   */
  async updateStudent(id: string, formData: Partial<StudentFormData>): Promise<Student> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const payload: Record<string, any> = {};
    if (formData.student_id !== undefined) payload.student_id = formData.student_id.trim().toUpperCase();
    if (formData.full_name !== undefined) payload.full_name = formData.full_name.trim();
    if (formData.email !== undefined) payload.email = formData.email.trim().toLowerCase();
    if (formData.phone !== undefined) payload.phone = formData.phone.trim();
    if (formData.department !== undefined) payload.department = formData.department;
    if (formData.semester !== undefined) payload.semester = formData.semester;
    if (formData.gender !== undefined) payload.gender = formData.gender;
    if (formData.status !== undefined) payload.status = formData.status;

    let { data, error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    // Handle column photo missing in DB
    if (error && error.message?.includes('column "photo" of relation "students" does not exist')) {
      delete payload.photo;
      const retry = await supabase
        .from('students')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    // Handle integer semester in DB
    if (error && (error.code === '22P02' || error.message?.includes('invalid input syntax for type integer'))) {
      const match = typeof formData.semester === 'string' ? formData.semester.match(/\d+/) : null;
      payload.semester = match ? parseInt(match[0], 10) : 1;
      const retry = await supabase
        .from('students')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      if (error.code === '23505' || error.message?.includes('unique constraint')) {
        throw new Error('A student with this Student ID or Email already exists.');
      }
      throw new Error(error.message || 'Failed to update student in Supabase.');
    }

    return mapSupabaseRow(data);
  },

  /**
   * Delete a student by UUID from Supabase
   */
  async deleteStudent(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message || 'Failed to delete student from Supabase.');
    }

    return true;
  },

  /**
   * Compute dynamic dashboard statistics from real Supabase records
   */
  computeStats(students: Student[]): DashboardStats {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const inactiveStudents = students.filter(s => s.status === 'Inactive').length;
    const suspendedStudents = students.filter(s => s.status === 'Suspended').length;

    // Department breakdown
    const deptMap: Record<string, number> = {};
    students.forEach(s => {
      deptMap[s.department] = (deptMap[s.department] || 0) + 1;
    });

    const departmentBreakdown = Object.entries(deptMap)
      .map(([department, count]) => ({
        department,
        count,
        percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Gender breakdown
    const genderMap: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
    students.forEach(s => {
      if (genderMap[s.gender] !== undefined) {
        genderMap[s.gender]++;
      } else {
        genderMap[s.gender] = 1;
      }
    });

    const genderBreakdown = Object.entries(genderMap).map(([gender, count]) => ({
      gender,
      count,
      percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0,
    }));

    // Semester breakdown
    const semesterMap: Record<string, number> = {};
    students.forEach(s => {
      semesterMap[s.semester] = (semesterMap[s.semester] || 0) + 1;
    });

    const semesterBreakdown = Object.entries(semesterMap)
      .map(([semester, count]) => ({
        semester,
        count,
        percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0,
      }))
      .sort((a, b) => a.semester.localeCompare(b.semester, undefined, { numeric: true }));

    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      suspendedStudents,
      departmentCount: Object.keys(deptMap).length,
      departmentBreakdown,
      genderBreakdown,
      semesterBreakdown,
    };
  },
};
