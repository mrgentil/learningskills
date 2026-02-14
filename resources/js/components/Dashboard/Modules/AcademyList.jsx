import React, { useState, useEffect } from 'react';

const AcademyList = () => {
    // This would normally fetch from an API like /api/admin/tenants
    const [tenants, setTenants] = useState([
        { id: 1, name: 'Main Academy', owner: 'Super Admin', plan: 'Pro', status: 'Active', created_at: '2026-01-20' },
        { id: 2, name: 'Digital Skills Center', owner: 'Jean Dupont', plan: 'Starter', status: 'Active', created_at: '2026-02-10' },
        { id: 3, name: 'Design Hub', owner: 'Marie Curie', plan: 'Enterprise', status: 'Inactive', created_at: '2026-02-12' },
    ]);

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
                                <th style={{ borderTop: 'none' }}>Statut</th>
                                <th style={{ borderTop: 'none' }}>Date Création</th>
                                <th style={{ borderTop: 'none', textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((t) => (
                                <tr key={t.id}>
                                    <td style={{ padding: '20px' }}>#{t.id}</td>
                                    <td style={{ fontWeight: 700 }}>{t.name}</td>
                                    <td>{t.owner}</td>
                                    <td><span className="badge-role" style={{ background: '#e2e8f0', color: '#475569' }}>{t.plan}</span></td>
                                    <td>
                                        <span style={{ color: t.status === 'Active' ? '#48bb78' : '#a0aec0', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.status === 'Active' ? '#48bb78' : '#a0aec0' }}></span>
                                            {t.status === 'Active' ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td>{t.created_at}</td>
                                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                        <button className="btn btn-sm btn-light mr-2" style={{ borderRadius: '8px' }}><i className="fa fa-pencil"></i></button>
                                        <button className="btn btn-sm btn-light text-danger" style={{ borderRadius: '8px' }}><i className="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AcademyList;
