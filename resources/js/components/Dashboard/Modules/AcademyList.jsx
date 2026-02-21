import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

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
                toast.error('Erreur lors de la création.');
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
    const [page, setPage] = useState(page);
    const [showModal, setShowModal] = useState(false);
    const [selectedAcademy, setSelectedAcademy] = useState(null);
    const [actualPage, setActualPage] = useState(1);

    useEffect(() => {
        fetchTenants(actualPage);
    }, [actualPage]);

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
            <div style={{ display: 'flex', height: '400px', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontWeight: 800, color: '#94a3b8' }}>CHARGEMENT DES ACADÉMIES...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
                        Gestion des <span style={{ color: '#f59e0b' }}>Académies</span> 🛡️
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '15px', marginTop: '5px', fontWeight: 500 }}>
                        Supervisez les instances actives et gérez leurs ressources.
                    </p>
                </div>
                <button
                    className="btn-modern btn-primary-modern"
                    onClick={() => setShowModal(true)}
                    style={{ height: '50px', padding: '0 30px', borderRadius: '15px' }}
                >
                    <i className="fa fa-plus mr-2"></i> Nouvelle Académie
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '35px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '25px 30px', textAlign: 'left', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Académie</th>
                            <th style={{ padding: '25px', textAlign: 'left', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Propriétaire</th>
                            <th style={{ padding: '25px', textAlign: 'center', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Forfait</th>
                            <th style={{ padding: '25px', textAlign: 'center', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Status</th>
                            <th style={{ padding: '25px 30px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map((t) => {
                            const tierInfo = TIER_BADGES[t.plan_tier] || { label: t.plan_name, bg: '#f1f5f9', color: '#475569' };
                            return (
                                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => setSelectedAcademy(t)}>
                                    <td style={{ padding: '25px 30px' }}>
                                        <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>{t.name}</div>
                                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>/{t.slug}</div>
                                    </td>
                                    <td style={{ padding: '25px' }}>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#334155' }}>{t.owner_name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{t.owner_email}</div>
                                    </td>
                                    <td style={{ padding: '25px', textAlign: 'center' }}>
                                        <span style={{ padding: '6px 12px', borderRadius: '10px', background: tierInfo.bg, color: tierInfo.color, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
                                            {tierInfo.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '25px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: t.is_active ? '#f0fdf4' : '#f8fafc', color: t.is_active ? '#16a34a' : '#94a3b8', borderRadius: '10px', fontSize: '10px', fontWeight: 900, border: `1px solid ${t.is_active ? '#dcfce7' : '#e2e8f0'}` }}>
                                                <div style={{ width: '6px', height: '6px', background: t.is_active ? '#16a34a' : '#94a3b8', borderRadius: '50%' }}></div>
                                                {t.is_active ? 'ACTIF' : 'INACTIF'}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px 30px', textAlign: 'right' }}>
                                        <button style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: '#f8fafc', color: '#94a3b8', cursor: 'pointer' }}>
                                            <i className="fa fa-chevron-right"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {pagination && pagination.last_page > 1 && (
                    <div style={{ padding: '20px 30px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                            Affichage de {pagination.from} à {pagination.to} sur {pagination.total}
                        </span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setActualPage(actualPage - 1)}
                                disabled={actualPage === 1}
                                style={{ padding: '8px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, fontSize: '12px', cursor: actualPage === 1 ? 'not-allowed' : 'pointer', opacity: actualPage === 1 ? 0.5 : 1 }}
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setActualPage(actualPage + 1)}
                                disabled={actualPage === pagination.last_page}
                                style={{ padding: '8px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, fontSize: '12px', cursor: actualPage === pagination.last_page ? 'not-allowed' : 'pointer', opacity: actualPage === pagination.last_page ? 0.5 : 1 }}
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Slide-over Detail */}
            {selectedAcademy && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedAcademy(null)}></div>
                    <div style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '100%', maxWidth: '500px', background: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', padding: '50px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <div style={{ background: '#0f172a', padding: '8px 15px', borderRadius: '12px', color: 'white', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>Détails Académie</div>
                            <button onClick={() => setSelectedAcademy(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><i className="fa fa-times fa-lg"></i></button>
                        </div>

                        <h2 style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-1.5px' }}>{selectedAcademy.name}</h2>
                        <p style={{ color: '#f59e0b', fontWeight: 800, fontSize: '13px', marginTop: '5px' }}>ID: #{selectedAcademy.id} • Create le {new Date(selectedAcademy.created_at).toLocaleDateString()}</p>

                        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 15px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Propriétaire</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ fontWeight: 800, fontSize: '16px' }}><i className="fa fa-user mr-2 text-primary"></i> {selectedAcademy.owner_name}</div>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#3b82f6' }}><i className="fa fa-envelope mr-2"></i> {selectedAcademy.owner_email}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ margin: '0 0 10px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Forfait</p>
                                    <span style={{ fontWeight: 900, fontSize: '18px', color: '#0f172a' }}>{selectedAcademy.plan_name}</span>
                                </div>
                                <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ margin: '0 0 10px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Licence</p>
                                    <span style={{ fontWeight: 900, fontSize: '18px', color: selectedAcademy.license_status === 'active' ? '#16a34a' : '#f59e0b' }}>
                                        {selectedAcademy.license_status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 15px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Usage Actuel</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ textAlign: 'center', flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>{selectedAcademy.courses_count}</h4>
                                        <small style={{ color: '#64748b', fontWeight: 700 }}>COURS</small>
                                    </div>
                                    <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                                    <div style={{ textAlign: 'center', flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>{selectedAcademy.students_count}</h4>
                                        <small style={{ color: '#64748b', fontWeight: 700 }}>ÉTUDIANTS</small>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <a
                                    href={`/academy/${selectedAcademy.slug}`}
                                    target="_blank"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        width: '100%',
                                        height: '60px',
                                        borderRadius: '20px',
                                        background: '#0f172a',
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontWeight: 900,
                                        fontSize: '14px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    VISITER L'ACADÉMIE <i className="fa fa-external-link"></i>
                                </a>
                                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>Dernière transaction: {selectedAcademy.total_revenue}$ générés</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <AcademyModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => fetchTenants(actualPage)}
                />
            )}
        </div>
    );
};

export default AcademyList;
