import React, { useState, useEffect } from 'react';

const CertificateList = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/user/certificates')
            .then(res => res.json())
            .then(data => {
                setCertificates(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setCertificates([]);
                setLoading(false);
            });
    }, []);

    const formatDate = (d) => {
        if (!d) return '-';
        return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return <div className="text-center p-5"><i className="fa fa-spin fa-spinner fa-2x"></i></div>;
    }

    return (
        <div className="fade-in">
            <div className="mb-4">
                <h2 className="page-title">Mes Certificats</h2>
                <p className="page-subtitle mb-0">Téléchargez ou imprimez vos diplômes de fin de formation.</p>
            </div>

            <div className="stat-card p-0" style={{ overflow: 'hidden', borderRadius: 16 }}>
                {certificates.length === 0 ? (
                    <div className="text-center py-5 px-4">
                        <i className="fa fa-certificate fa-4x mb-3" style={{ color: '#e2e8f0' }}></i>
                        <h5 className="font-weight-bold mb-2">Aucun certificat pour le moment</h5>
                        <p className="text-muted mb-4">
                            Terminez un cours à 100 % pour obtenir votre certificat. Les certificats apparaîtront ici automatiquement.
                        </p>
                        <a href="/dashboard/my-courses" className="btn-modern btn-primary-modern">
                            <i className="fa fa-graduation-cap mr-2"></i> Voir mes cours
                        </a>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table mb-0 certificates-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '16px 20px' }}>Formation</th>
                                    <th>Académie</th>
                                    <th>Délivré le</th>
                                    <th style={{ width: 180, textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certificates.map((c) => (
                                    <tr key={c.id}>
                                        <td style={{ padding: '16px 20px', fontWeight: 700 }}>{c.course_title}</td>
                                        <td className="text-muted">{c.academy_name}</td>
                                        <td>{formatDate(c.issued_at)}</td>
                                        <td className="text-end">
                                            <a
                                                href={c.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-primary"
                                                style={{ borderRadius: 8 }}
                                            >
                                                <i className="fa fa-eye mr-1"></i> Voir
                                            </a>
                                            <a
                                                href={c.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-light ml-1"
                                                style={{ borderRadius: 8 }}
                                                title="Ouvrir puis Ctrl+P pour imprimer / PDF"
                                            >
                                                <i className="fa fa-download"></i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                .certificates-table thead { background: #f8fafc; }
                .certificates-table thead th { padding: 14px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 800; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
                .certificates-table tbody td { padding: 14px 20px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
                .certificates-table tbody tr:hover { background: #f8fafc; }
            `}</style>
        </div>
    );
};

export default CertificateList;
