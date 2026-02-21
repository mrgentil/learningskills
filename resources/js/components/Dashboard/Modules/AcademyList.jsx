import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TIER_BADGES = {
    starter: { label: '🟢 Starter', bg: '#dcfce7', color: '#166534' },
    pro: { label: '🔵 Pro', bg: '#dbeafe', color: '#1e40af' },
    enterprise: { label: '🟣 Enterprise', bg: '#f3e8ff', color: '#6b21a8' },
};

const LICENSE_BADGES = {
    active: { label: '✅ Active', bg: '#dcfce7', color: '#166534' },
    none: { label: '⚠️ Aucune', bg: '#fef3c7', color: '#92400e' },
};

const AcademyModal = ({ onClose, onSuccess }) => {
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        plan_id: '',
        owner_name: '',
        owner_email: '',
        notes: '',
        license_duration_months: 12,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);

    useEffect(() => {
        axios.get('/api/admin/plans').then(res => {
            setPlans(res.data.filter(p => p.is_active));
        });
    }, []);

    const autoSlug = (name) => {
        return name.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData(prev => ({ ...prev, name, slug: autoSlug(name) }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await axios.post('/api/admin/tenants', formData);
            setResult(res.data);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Erreur lors de la création.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                        <div className="modal-header" style={{ background: '#166534', color: '#fff', borderRadius: '16px 16px 0 0', padding: '20px 24px' }}>
                            <h5 className="modal-title" style={{ fontWeight: 700 }}>✅ Académie créée !</h5>
                        </div>
                        <div className="modal-body p-4">
                            <div className="p-3 mb-3" style={{ background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                <p className="mb-1"><strong>Académie :</strong> {result.tenant.name}</p>
                                <p className="mb-1"><strong>Propriétaire :</strong> {result.tenant.owner?.name} ({result.tenant.owner?.email})</p>
                                <p className="mb-0"><strong>Plan :</strong> {result.tenant.plan?.name}</p>
                            </div>
                            {result.temporary_password && (
                                <div className="p-3" style={{ background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                    <p className="mb-1" style={{ fontWeight: 700, color: '#92400e' }}>⚠️ Nouveau compte créé</p>
                                    <p className="mb-0" style={{ fontSize: '13px' }}>
                                        Mot de passe temporaire : <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{result.temporary_password}</code>
                                        <br /><small>Le propriétaire devra le changer à sa première connexion.</small>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px' }}>
                            <button className="btn-modern btn-primary-modern" onClick={() => { onSuccess(); onClose(); }}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                    <div className="modal-header" style={{ background: 'var(--cbx-navy)', color: '#fff', borderRadius: '16px 16px 0 0', padding: '20px 24px' }}>
                        <h5 className="modal-title" style={{ fontWeight: 700 }}>🏫 Nouvelle Académie</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ padding: '24px' }}>
                        <form onSubmit={handleSubmit}>
                            {/* Academy info */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Nom de l'Académie</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleNameChange} required placeholder="Ex: École Montréal" />
                                    {errors.name && <small className="text-danger">{errors.name[0]}</small>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Slug (URL)</label>
                                    <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} required />
                                    {errors.slug && <small className="text-danger">{errors.slug[0]}</small>}
                                </div>
                            </div>

                            {/* Owner info */}
                            <div className="p-3 mb-3" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <label className="form-label fw-bold" style={{ color: 'var(--cbx-navy)' }}>👤 Propriétaire</label>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <input type="text" className="form-control" name="owner_name" value={formData.owner_name} onChange={handleChange} required placeholder="Nom complet" />
                                        {errors.owner_name && <small className="text-danger">{errors.owner_name[0]}</small>}
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <input type="email" className="form-control" name="owner_email" value={formData.owner_email} onChange={handleChange} required placeholder="email@exemple.com" />
                                        {errors.owner_email && <small className="text-danger">{errors.owner_email[0]}</small>}
                                    </div>
                                </div>
                                <small className="text-muted">Si l'email existe déjà, le compte existant sera associé. Sinon, un nouveau compte sera créé.</small>
                            </div>

                            {/* Plan + License */}
                            <div className="row">
                                <div className="col-md-8 mb-3">
                                    <label className="form-label fw-bold">Forfait</label>
                                    <select className="form-select" name="plan_id" value={formData.plan_id} onChange={handleChange} required>
                                        <option value="">— Sélectionner un forfait —</option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} — {Number(p.price).toLocaleString()} $ {p.tier ? `(${p.tier})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.plan_id && <small className="text-danger">{errors.plan_id[0]}</small>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Durée licence (mois)</label>
                                    <input type="number" className="form-control" name="license_duration_months" value={formData.license_duration_months} onChange={handleChange} min="1" max="120" />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Notes internes</label>
                                <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} rows="2" placeholder="Notes sur le client..."></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ borderRadius: '8px' }}>Annuler</button>
                                <button type="submit" className="btn-modern btn-primary-modern" disabled={loading}>
                                    {loading ? 'Création en cours...' : '🚀 Créer l\'Académie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AcademyList = () => {
    const [tenants, setTenants] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);

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
                    <p className="page-subtitle">Déployez et gérez les instances de votre plateforme.</p>
                </div>
                <button className="btn-modern btn-primary-modern" onClick={() => setShowModal(true)}>
                    <i className="fa fa-plus"></i> Nouvelle Académie
                </button>
            </div>

            <div className="stat-card p-0" style={{ overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table mb-0" style={{ verticalAlign: 'middle' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px', borderTop: 'none' }}>Académie</th>
                                <th style={{ borderTop: 'none' }}>Propriétaire</th>
                                <th style={{ borderTop: 'none' }}>Forfait</th>
                                <th style={{ borderTop: 'none' }}>Licence</th>
                                <th style={{ borderTop: 'none', textAlign: 'center' }}>Cours / Étudiants</th>
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
                            {tenants.map((t) => {
                                const tierInfo = TIER_BADGES[t.plan_tier] || null;
                                const licenseInfo = LICENSE_BADGES[t.license_status] || LICENSE_BADGES.none;

                                return (
                                    <tr key={t.id}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: 700 }}>{t.name}</div>
                                            <small className="text-muted">/{t.slug}</small>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{t.owner_name}</div>
                                            <div style={{ fontSize: '12px', color: '#a0aec0' }}>{t.owner_email}</div>
                                        </td>
                                        <td>
                                            {tierInfo ? (
                                                <span className="badge-role" style={{ background: tierInfo.bg, color: tierInfo.color, fontWeight: 700, fontSize: '12px' }}>
                                                    {tierInfo.label}
                                                </span>
                                            ) : (
                                                <span className="badge-role" style={{ background: '#e2e8f0', color: '#475569' }}>{t.plan_name}</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="badge-role" style={{ background: licenseInfo.bg, color: licenseInfo.color, fontWeight: 600, fontSize: '12px' }}>
                                                {licenseInfo.label}
                                            </span>
                                            {t.license_expires && (
                                                <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>
                                                    exp. {t.license_expires}
                                                </div>
                                            )}
                                        </td>
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.last_page > 1 && (
                    <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                        <div className="text-muted small">
                            Affichage de {pagination.from} à {pagination.to} sur {pagination.total} académies
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-light" disabled={page === 1 || loading} onClick={() => setPage(page - 1)} style={{ borderRadius: '8px', fontWeight: 600 }}>
                                <i className="fa fa-chevron-left mr-1"></i> Précédent
                            </button>
                            <button className="btn btn-sm btn-light" disabled={page === pagination.last_page || loading} onClick={() => setPage(page + 1)} style={{ borderRadius: '8px', fontWeight: 600 }}>
                                Suivant <i className="fa fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <AcademyModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => fetchTenants(page)}
                />
            )}
        </div>
    );
};

export default AcademyList;
