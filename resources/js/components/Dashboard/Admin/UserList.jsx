import React, { useState, useEffect } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?page=${pageNumber}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.data);
                setPagination({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    total: data.total,
                    from: data.from,
                    to: data.to
                });
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = (role) => {
        const roles = {
            super_admin: { label: 'Super Admin', color: 'var(--cbx-navy)', bg: 'rgba(15, 23, 42, 0.1)' },
            owner: { label: 'Propriétaire', color: 'var(--cbx-amber)', bg: 'var(--cbx-amber-soft)' },
            instructor: { label: 'Instructeur', color: '#475569', bg: '#f1f5f9' },
            student: { label: 'Étudiant', color: '#059669', bg: '#ecfdf5' },
        };
        return roles[role] || { label: role, color: '#718096', bg: '#f7fafc' };
    };

    if (loading && users.length === 0) {
        return (
            <div className="text-center p-5">
                <i className="fa fa-spin fa-spinner fa-3x" style={{ color: 'var(--cbx-navy)' }}></i>
                <p className="mt-3">Chargement des utilisateurs...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="page-title">Utilisateurs Globaux 👤</h2>
                    <p className="page-subtitle">Gérez tous les comptes utilisateurs de la plateforme.</p>
                </div>
            </div>

            <div className="stat-card p-0" style={{ overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table mb-0" style={{ verticalAlign: 'middle' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px', borderTop: 'none' }}>Utilisateur</th>
                                <th style={{ borderTop: 'none' }}>Email</th>
                                <th style={{ borderTop: 'none' }}>Rôle</th>
                                <th style={{ borderTop: 'none' }}>Académie / Tenant</th>
                                <th style={{ borderTop: 'none', textAlign: 'center' }}>Inscriptions</th>
                                <th style={{ borderTop: 'none' }}>Inscrit le</th>
                                <th style={{ borderTop: 'none', textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">Aucun utilisateur trouvé.</td>
                                </tr>
                            )}
                            {users.map((u) => {
                                const role = getRoleLabel(u.role);
                                return (
                                    <tr key={u.id}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: 700 }}>{u.name}</div>
                                            <small className="text-muted">ID: #{u.id}</small>
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                padding: '4px 10px',
                                                borderRadius: '50px',
                                                background: role.bg,
                                                color: role.color
                                            }}>
                                                {role.label}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '14px', color: '#4a5568' }}>{u.tenant_name}</td>
                                        <td className="text-center">
                                            <span style={{ fontWeight: 700, color: '#2d3748' }}>{u.enrollments_count}</span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: '#a0aec0' }}>
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <button className="btn btn-sm btn-light mr-2" style={{ borderRadius: '8px' }} title="Voir détails"><i className="fa fa-eye"></i></button>
                                            <button className="btn btn-sm btn-light text-danger" style={{ borderRadius: '8px' }} title="Supprimer"><i className="fa fa-trash"></i></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.last_page > 1 && (
                    <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                        <div className="text-muted small">
                            Affichage de {pagination.from} à {pagination.to} sur {pagination.total} utilisateurs
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

export default UserList;
