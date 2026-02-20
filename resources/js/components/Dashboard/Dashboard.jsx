import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import AcademyList from './Modules/AcademyList';
import CourseList from './Modules/CourseList';
import CourseBuilder from './Modules/CourseBuilder';
import StudentList from './Modules/StudentList';
import MyCourses from './Modules/MyCourses';
import CertificateList from './Modules/CertificateList';
import PlanList from './Admin/Plans/PlanList';
import AcademySettings from './Owner/AcademySettings';
import InstructorList from './Owner/InstructorList';
import PageList from './Owner/PageList';
import PageEditor from './Owner/PageEditor';
import UserList from './Admin/UserList';

const Dashboard = () => {
    console.log('Dashboard component rendering...');
    return (
        <Router>
            <DashboardLayout>
                <Routes>
                    <Route path="/dashboard" element={<DashboardHome />} />

                    {/* Academy Management (Owner/Instructor) */}
                    <Route path="/dashboard/courses" element={<CourseList />} />
                    <Route path="/dashboard/courses/:courseId/builder" element={<CourseBuilder />} />
                    <Route path="/dashboard/students" element={<StudentList />} />
                    <Route path="/dashboard/instructors" element={<InstructorList />} />
                    <Route path="/dashboard/pages" element={<PageList />} />
                    <Route path="/dashboard/pages/create" element={<PageEditor />} />
                    <Route path="/dashboard/pages/:id/edit" element={<PageEditor />} />
                    <Route path="/dashboard/payments" element={<div><h2>Historique des Paiements</h2><p>L'historique des paiements sera bientôt disponible.</p></div>} />
                    <Route path="/dashboard/settings" element={<AcademySettings />} />

                    {/* Platform Management (Super Admin) */}
                    <Route path="/dashboard/admin/tenants" element={<AcademyList />} />
                    <Route path="/dashboard/admin/plans" element={<PlanList />} />
                    <Route path="/dashboard/admin/users" element={<UserList />} />
                    <Route path="/dashboard/admin/settings" element={<div><h2>Config Plateforme</h2><p>Module en cours de développement.</p></div>} />

                    {/* Student Workspace */}
                    <Route path="/dashboard/my-courses" element={<MyCourses />} />
                    <Route path="/dashboard/progress" element={<div><h2>Ma Progression</h2><p>Visualisez vos résultats.</p></div>} />
                    <Route path="/dashboard/certificates" element={<CertificateList />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </DashboardLayout>
        </Router>
    );
};

export default Dashboard;
