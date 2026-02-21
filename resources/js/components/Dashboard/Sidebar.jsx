import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from './UserContext';

const Sidebar = ({ role }) => {
    const { user } = useUser();
    // Menu definitions by role
    const menus = {
        // ... (unchanged)
        super_admin: [
            { id: 'dash', label: 'Plateforme', path: '/dashboard', icon: 'fa-globe' },
            { id: 'onboarding', label: 'Demandes Onboarding', path: '/dashboard/admin/onboarding', icon: 'fa-list-alt' },
            { id: 'tenants', label: 'Académies', path: '/dashboard/admin/tenants', icon: 'fa-university' },
            { id: 'plans', label: 'Plans & Tarifs', path: '/dashboard/admin/plans', icon: 'fa-tags' },
            { id: 'users', label: 'Utilisateurs Globaux', path: '/dashboard/admin/users', icon: 'fa-user-secret' },
            { id: 'settings', label: 'Configuration', path: '/dashboard/admin/settings', icon: 'fa-cogs' },
        ],
        owner: [
            { id: 'dash', label: 'Vue d\'ensemble', path: '/dashboard', icon: 'fa-th-large' },
            { id: 'courses', label: 'Gérer les cours', path: '/dashboard/courses', icon: 'fa-book' },
            { id: 'inst', label: 'Instructeurs', path: '/dashboard/instructors', icon: 'fa-users' },
            { id: 'students', label: 'Étudiants', path: '/dashboard/students', icon: 'fa-graduation-cap' },
            { id: 'pages', label: 'Pages CMS', path: '/dashboard/pages', icon: 'fa-file-text' },
            { id: 'pay', label: 'Paiements', path: '/dashboard/payments', icon: 'fa-credit-card' },
            { id: 'settings', label: 'Paramètres', path: '/dashboard/settings', icon: 'fa-cog' },
        ],
        // ... (rest of menus unchanged)
        admin: [
            { id: 'dash', label: 'Vue d\'ensemble', path: '/dashboard', icon: 'fa-th-large' },
            { id: 'courses', label: 'Cours', path: '/dashboard/courses', icon: 'fa-book' },
            { id: 'students', label: 'Étudiants', path: '/dashboard/students', icon: 'fa-graduation-cap' },
        ],
        instructor: [
            { id: 'dash', label: 'Tableau de bord', path: '/dashboard', icon: 'fa-th-large' },
            { id: 'courses', label: 'Mes cours', path: '/dashboard/courses', icon: 'fa-book' },
            { id: 'students', label: 'Mes Étudiants', path: '/dashboard/students', icon: 'fa-graduation-cap' },
            { id: 'quiz', label: 'Quiz & Examens', path: '/dashboard/quizzes', icon: 'fa-question-circle' },
        ],
        student: [
            { id: 'dash', label: 'Mes Etudes', path: '/dashboard', icon: 'fa-graduation-cap' },
            { id: 'courses', label: 'Catalogues', path: '/dashboard/my-courses', icon: 'fa-play-circle' },
            { id: 'progress', label: 'Ma Progression', path: '/dashboard/progress', icon: 'fa-line-chart' },
            { id: 'certs', label: 'Certificats', path: '/dashboard/certificates', icon: 'fa-certificate' },
        ]
    };

    const currentMenu = menus[role] || menus.student;

    const publicLink = user && user.academy_slug ? `/academy/${user.academy_slug}` : '/';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cbx-amber flex items-center justify-center">
                        <span className="font-display font-bold text-navy text-sm">LS</span>
                    </div>
                    <h3 className="font-display font-bold text-white m-0" style={{ fontSize: '20px', letterSpacing: '-0.5px' }}>
                        Learning<span style={{ color: 'var(--cbx-amber)' }}>Skills</span>
                    </h3>
                </div>
            </div>
            <div className="sidebar-menu">
                <div style={{ padding: '0 15px 20px' }}>
                    <a href={publicLink} target="_blank" className="btn-modern btn-accent-modern w-100 justify-content-center" style={{ fontSize: '13px', padding: '10px 15px', textDecoration: 'none' }}>
                        <i className="fa fa-external-link mr-2"></i> Voir mon Académie
                    </a>
                </div>
                <p style={{ paddingLeft: '20px', fontSize: '11px', color: '#a0aec0', fontWeight: 800, textTransform: 'uppercase', marginBottom: '15px' }}>Menu Principal</p>
                {currentMenu.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
                    >
                        <i className={`fa ${item.icon}`}></i>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid #edf2f7' }}>
                <div className="stat-card" style={{ padding: '20px', background: '#f8fafc', boxShadow: 'none' }}>
                    <p style={{ fontSize: '12px', margin: 0, fontWeight: 700 }}>Aide & Support</p>
                    <small style={{ color: '#718096' }}>Consultez la doc</small>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
