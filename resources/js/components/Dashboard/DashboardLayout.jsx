import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { UserProvider, useUser } from './UserContext';
import './Dashboard.css';

const DashboardContent = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ color: '#ff007a' }}>
                        <span className="sr-only">Chargement...</span>
                    </div>
                    <h3 className="cbx-logo" style={{ fontSize: '28px' }}>Learning<span>Skills</span></h3>
                    <p style={{ color: '#718096', fontWeight: 600 }}>Préparation de votre espace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <Sidebar role={user?.role} />
            <div className="main-content">
                <Topbar user={user} />
                <main className="content-body">
                    {children}
                </main>
            </div>
        </div>
    );
};

const DashboardLayout = ({ children }) => {
    return (
        <UserProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </UserProvider>
    );
};

export default DashboardLayout;
