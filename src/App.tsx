import React from 'react';
import { StudentProvider, useStudents } from './context/StudentContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentDirectory } from './components/students/StudentDirectory';
import { StudentModal } from './components/students/StudentModal';
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { DeleteConfirmModal } from './components/students/DeleteConfirmModal';
import { Toast } from './components/common/Toast';

const MainLayout: React.FC = () => {
  const { activeView, toast } = useStudents();

  return (
    <div className="app-container">
      {/* Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main App Content */}
      <div className="main-wrapper">
        <Header />

        <main className="content-body">
          {activeView === 'dashboard' ? <DashboardView /> : <StudentDirectory />}
        </main>
      </div>

      {/* Global Modals */}
      <StudentModal />
      <StudentDetailModal />
      <DeleteConfirmModal />

      {/* Action Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export function App() {
  return (
    <StudentProvider>
      <MainLayout />
    </StudentProvider>
  );
}

export default App;
