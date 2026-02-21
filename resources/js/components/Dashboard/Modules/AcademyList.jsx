import React, { useState, useEffect } from 'react';

const AcademyList = () => {
    const [tenants, setTenants] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTenants(page);
    }, [page]);

    const fetchTenants = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/tenants?page=${pageNumber}`);
            if (res.ok) {
                const data = await res.json();
                setTenants(data.data);
                setPagination({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    total: data.total,
                    from: data.from,
                    to: data.to
                });
            }
        } catch (err) {
            console.error('Failed to fetch tenants:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && tenants.length === 0) {
        return (
            <div className="text-center p-5">
                <i className="fa fa-spin fa-spinner fa-3x" style={{ color: 'var(--cbx-navy)' }}></i>
                <p className="mt-3">Chargement des académies...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="page-title">Gestion des Académies 🛡️</h2>
                    <p className="page-subtitle">Pilotez toutes les instances de votre plateforme SaaS.</p>
                </div>
                <button className="btn-modern btn-primary-modern">
                    <i className="fa fa-plus"></i> Nouvelle Académie
                </button>
            </div>

            <div className="stat-card p-0" style={{ overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table mb-0" style={{ verticalAlign: 'middle' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px', borderTop: 'none' }}>ID</th>
                                <th style={{ borderTop: 'none' }}>Nom de l'Académie</th>
                                <th style={{ borderTop: 'none' }}>Propriétaire</th>
                                <th style={{ borderTop: 'none' }}>Plan</th>
                                <th style={{ borderTop: 'none', textAlign: 'center' }}>Cours/Étudiants</th>
                                <th style={{ borderTop: 'none' }}>Statut</th>
                                <th style={{ borderTop: 'none', textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                            {tenants.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">Aucune académie trouvée.</td>
                                </tr>
                            )}
                            {tenants.map((t) => (
                                <tr key={t.id}>
                                    <td style={{ padding: '20px' }}>#{t.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>{t.name}</div>
                                        <small className="text-muted">/{t.slug}</small>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{t.owner_name}</div>
                                        <div style={{ fontSize: '12px', color: '#a0aec0' }}>{t.owner_email}</div>
                                    </td>
                                    <td><span className="badge-role" style={{ background: '#e2e8f0', color: '#475569' }}>{t.plan_name}</span></td>
                                    <td className="text-center">
                                        <div style={{ fontSize: '13px' }}>
                                            <span className="mr-2"><i className="fa fa-book mr-1" style={{ color: 'var(--cbx-navy-light)' }}></i>{t.courses_count}</span>
                                            <span><i className="fa fa-graduation-cap mr-1" style={{ color: 'var(--cbx-amber)' }}></i>{t.students_count}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ color: t.is_active ? '#48bb78' : '#a0aec0', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.is_active ? '#48bb78' : '#a0aec0' }}></span>
                                            {t.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                        <button className="btn btn-sm btn-light mr-2" style={{ borderRadius: '8px' }}><i className="fa fa-pencil"></i></button>
                                        <button className="btn btn-sm btn-light text-danger" style={{ borderRadius: '8px' }}><i className="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.last_page > 1 && (
                    <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                        <div className="text-muted small">
                            Affichage de {pagination.from} à {pagination.to} sur {pagination.total} académies
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-light"
                                disabled={page === 1 || loading}
                                onClick={() => setPage(page - 1)}
                                style={{ borderRadius: '8px', fontWeight: 600 }}
                            >
                                <i className="fa fa-chevron-left mr-1"></i> Précédent
                            </button>
                            <button
                                className="btn btn-sm btn-light"
                                disabled={page === pagination.last_page || loading}
                                onClick={() => setPage(page + 1)}
                                style={{ borderRadius: '8px', fontWeight: 600 }}
                            >
                                Suivant <i className="fa fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademyList;

