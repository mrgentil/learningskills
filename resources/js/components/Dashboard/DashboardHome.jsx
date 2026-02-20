import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DashboardHome = () => {
    const { user } = useUser();
    const displayName = user?.name || 'Administrateur';

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/stats', {
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' },
        })
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load stats:', err);
                setLoading(false);
            });
    }, []);

    // Chart Data — connected to API
    const salesData = {
        labels: stats?.chart_revenue?.labels || [],
        datasets: [
            {
                label: 'Activité',
                data: stats?.chart_revenue?.data || [],
                fill: true,
                backgroundColor: 'rgba(255, 0, 122, 0.1)',
                borderColor: '#ff007a',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#ff007a',
            },
        ],
    };

    const studentsData = {
        labels: stats?.chart_students?.labels || [],
        datasets: [
            {
                label: 'Nouvelles Inscriptions',
                data: stats?.chart_students?.data || [],
                backgroundColor: '#2575fc',
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const currentCards = stats?.cards || [];
    const quota = stats?.quota;

    const renderPlanCard = () => {
        const role = stats?.role ?? user?.role;
        if (!quota || role === 'super_admin' || role === 'student') return null;
        const { plan_name, courses_used, courses_limit, students_used, students_limit, license_active } = quota;
        const coursesText = courses_limit != null ? `${courses_used} / ${courses_limit} cours` : `${courses_used} cours`;
        const studentsText = students_limit != null ? `${students_used} / ${students_limit} étudiants` : `${students_used} étudiants`;

        return (
            <div className="stat-card mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <span style={{ fontSize: '12px', opacity: 0.9, textTransform: 'uppercase', fontWeight: 700 }}>Votre plan</span>
                    {license_active && (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.3)', color: '#fff' }}>Licence active</span>
                    )}
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: 8 }}>{plan_name}</div>
                <div style={{ fontSize: '13px', opacity: 0.95 }}>
                    <div><i className="fa fa-book mr-2" style={{ width: 18 }}></i>{coursesText}</div>
                    <div className="mt-1"><i className="fa fa-users mr-2" style={{ width: 18 }}></i>{studentsText}</div>
                </div>
                <a href="/#cbx-pricing" className="btn btn-sm mt-3" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', border: 'none', fontWeight: 600 }}>
                    Changer de plan
                </a>
            </div>
        );
    };

    const renderHeader = () => {
        if (user?.role === 'super_admin') {
            return (
                <div className="col-md-8">
                    <h2 className="page-title">Administration Globale 🛡️</h2>
                    <p className="page-subtitle">Vue d'ensemble de la performance de la plateforme LearningSkills.</p>
                </div>
            );
        }
        if (user?.role === 'student') {
            return (
                <div className="col-md-8">
                    <h2 className="page-title">Bonjour, {displayName} ! 🎓</h2>
                    <p className="page-subtitle">Continuez votre apprentissage là où vous l'avez laissé.</p>
                </div>
            );
        }
        return (
            <div className="col-md-8">
                <h2 className="page-title">Bienvenue, {displayName} ! ✨</h2>
                <p className="page-subtitle">Voici l'état actuel de votre académie pour ce mois-ci.</p>
            </div>
        );
    };

    const renderAction = () => {
        if (user?.role === 'super_admin') {
            return (
                <button className="btn-modern btn-primary-modern">
                    <i className="fa fa-plus"></i> Créer un Plan
                </button>
            );
        }
        if (user?.role === 'student') {
            return (
                <button className="btn-modern btn-primary-modern">
                    <i className="fa fa-search"></i> Explorer les Cours
                </button>
            );
        }
        return (
            <button className="btn-modern btn-primary-modern">
                <i className="fa fa-plus"></i> Nouveau Cours
            </button>
        );
    };

    if (loading) {
        return (
            <div className="fade-in text-center" style={{ padding: '100px 0' }}>
                <i className="fa fa-spinner fa-spin fa-3x" style={{ color: '#ff007a' }}></i>
                <p style={{ marginTop: '20px', color: '#a0aec0' }}>Chargement du tableau de bord...</p>
            </div>
        );
    }

    const renderRecentActivity = () => {
        const role = stats?.role ?? user?.role;
        const recentData = stats?.recent_data || [];

        if (role === 'super_admin') {
            return (
                <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ fontWeight: 700, margin: 0 }}>Académies Récentes</h4>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr style={{ fontSize: '12px', color: '#a0aec0' }}>
                                    <th>Académie</th>
                                    <th>Propriétaire</th>
                                    <th>Créée</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentData.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center py-4">Aucune académie trouvée.</td></tr>
                                ) : (
                                    recentData.map((item, idx) => (
                                        <tr key={idx} style={{ fontSize: '14px' }}>
                                            <td style={{ fontWeight: 700 }}>{item.name}</td>
                                            <td>{item.owner}</td>
                                            <td className="text-muted">{item.created_at}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (role === 'owner') {
            return (
                <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ fontWeight: 700, margin: 0 }}>Inscriptions Récentes</h4>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr style={{ fontSize: '12px', color: '#a0aec0' }}>
                                    <th>Étudiant</th>
                                    <th>Cours</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentData.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center py-4">Aucune inscription récente.</td></tr>
                                ) : (
                                    recentData.map((item, idx) => (
                                        <tr key={idx} style={{ fontSize: '14px' }}>
                                            <td style={{ fontWeight: 700 }}>{item.student}</td>
                                            <td>{item.course}</td>
                                            <td className="text-muted">{item.date}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (role === 'student') {
            return (
                <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ fontWeight: 700, margin: 0 }}>Mes Cours Récents</h4>
                    </div>
                    <div className="list-group list-group-flush">
                        {recentData.length === 0 ? (
                            <div className="text-center py-4 text-muted">Vous n'êtes inscrit à aucun cours.</div>
                        ) : (
                            recentData.map((item, idx) => (
                                <div key={idx} className="list-group-item d-flex align-items-center px-0 py-3">
                                    <div style={{
                                        width: 60, height: 45, borderRadius: 8,
                                        backgroundImage: `url(${item.thumbnail || 'https://via.placeholder.com/60x45'})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center', marginRight: 15
                                    }} />
                                    <div className="flex-grow-1">
                                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{item.title}</div>
                                        <div className="progress mt-2" style={{ height: 6, borderRadius: 3, width: '100%' }}>
                                            <div className="progress-bar" style={{ width: `${item.progress}%`, background: 'var(--cbx-pink)' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 15, fontWeight: 800, fontSize: '13px', color: 'var(--cbx-pink)' }}>
                                        {item.progress}%
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ fontWeight: 700, margin: 0 }}>Activité récente</h4>
                </div>
                <div className="activity-list text-center py-4 text-muted">
                    <i className="fa fa-inbox fa-3x mb-3"></i>
                    <p>Aucune activité particulière.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="fade-in">
            <div className="row mb-5 align-items-center">
                {renderHeader()}
                <div className="col-md-4 text-md-right">
                    {renderAction()}
                </div>
            </div>

            {renderPlanCard() && (
                <div className="row mb-4">
                    <div className="col-12">
                        {renderPlanCard()}
                    </div>
                </div>
            )}

            <div className="row">
                {currentCards.map((stat, idx) => (
                    <div className="col-lg-3 col-md-6 mb-4" key={idx}>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                <i className={`fa ${stat.icon}`}></i>
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {(stats?.chart_revenue?.data?.length > 0 || stats?.chart_students?.data?.length > 0) && (
                <div className="row mt-4">
                    <div className="col-lg-8 mb-4">
                        <div className="stat-card" style={{ minHeight: '400px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 style={{ fontWeight: 700, margin: 0 }}>
                                    {user?.role === 'super_admin' ? 'Activité Plateforme' : 'Activité Mensuelle'}
                                </h4>
                                <div className="badge-role">7 derniers mois</div>
                            </div>
                            <div style={{ height: '300px' }}>
                                <Line data={salesData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <div className="stat-card h-100">
                            <h4 style={{ fontWeight: 700, marginBottom: '25px' }}>
                                {user?.role === 'super_admin' ? 'Nouvelles Académies' : 'Inscriptions'}
                            </h4>
                            <div style={{ height: '200px' }}>
                                <Bar data={studentsData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row mt-2">
                <div className="col-lg-8 mb-4">
                    {renderRecentActivity()}
                </div>
                <div className="col-lg-4 mb-4">
                    <div className="quick-tips-card h-100 d-flex flex-column">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <i className="fa fa-lightbulb-o fa-2x"></i>
                            <h4 style={{ fontWeight: 700, margin: 0 }}>Conseils Expert</h4>
                        </div>
                        <ul style={{ padding: 0, listStyle: 'none', lineHeight: '2' }}>
                            <li className="mb-3 d-flex gap-2">
                                <i className="fa fa-check-circle mt-1" style={{ color: '#fff', opacity: 0.7 }}></i>
                                <span>Optimisez vos descriptions de cours pour le SEO.</span>
                            </li>
                            <li className="mb-3 d-flex gap-2">
                                <i className="fa fa-check-circle mt-1" style={{ color: '#fff', opacity: 0.7 }}></i>
                                <span>Ajoutez des modules et leçons pour structurer vos cours.</span>
                            </li>
                            <li className="mb-3 d-flex gap-2">
                                <i className="fa fa-check-circle mt-1" style={{ color: '#fff', opacity: 0.7 }}></i>
                                <span>Invitez des instructeurs pour enrichir votre catalogue.</span>
                            </li>
                        </ul>
                        <button className="btn btn-light w-100 py-3 mt-auto" style={{ borderRadius: '12px', fontWeight: 700, color: '#2575fc' }}>
                            En savoir plus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;

