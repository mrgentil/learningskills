import React, { useState, useEffect, useMemo } from "react";
import {
    Building2, User, Mail, Clock,
    CheckCircle2, Archive, Search,
    X, Shield, Sparkles, Crown,
    Users, Rocket, ChevronRight,
    ExternalLink, ArrowUpRight
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

/**
 * NATIVE DATE FORMATTER
 */
const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(dateString));
    } catch (e) {
        return dateString;
    }
};

const OnboardingList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deploying, setDeploying] = useState(false);
    const [pagination, setPagination] = useState(null);
    const [actualPage, setActualPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [deploymentSuccess, setDeploymentSuccess] = useState(null);

    useEffect(() => {
        fetchRequests(actualPage);
    }, [actualPage]);

    const fetchRequests = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/admin/onboarding-requests?page=${pageNumber}`);
            if (res.status === 200) {
                const data = res.data;
                setRequests(data.data);
                setPagination({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    total: data.total,
                    from: data.from,
                    to: data.to
                });
            }
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (!isEditing) {
            setEditData({ ...selectedRequest });
        }
        setIsEditing(!isEditing);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await axios.patch(`/api/admin/onboarding-requests/${selectedRequest.id}`, editData);
            if (res.status === 200) {
                setSelectedRequest(res.data);
                setRequests(requests.map(r => r.id === res.data.id ? res.data : r));
                setIsEditing(false);
                toast.success('Demande mise à jour avec succès');
            }
        } catch (error) {
            console.error('Save failed:', error);
            toast.error('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            const res = await axios.put(`/api/admin/onboarding-requests/${selectedRequest.id}/status`, { status });
            if (res.status === 200) {
                setSelectedRequest(res.data);
                setRequests(requests.map(r => r.id === res.data.id ? res.data : r));
                toast.success(`Statut mis à jour : ${status}`);
            }
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du statut');
        }
    };

    const handleDeploy = async () => {
        if (!confirm("Voulez-vous vraiment générer l'infrastructure pour cette académie ?")) return;
        setDeploying(true);
        try {
            const res = await axios.post(`/api/admin/onboarding-requests/${selectedRequest.id}/deploy`);
            if (res.status === 200) {
                setDeploymentSuccess(res.data);
                toast.success('Académie déployée avec succès !');
                setSelectedRequest(null);
                fetchRequests(actualPage);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors du déploiement');
        } finally {
            setDeploying(false);
        }
    };

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = req.organization_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || req.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchTerm, statusFilter]);

    if (loading && requests.length === 0) {
        return (
            <div style={{ display: 'flex', height: '400px', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontWeight: 800, color: '#94a3b8' }}>CHARGEMENT DES DEMANDES...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
                        Demandes d'<span style={{ color: '#3b82f6' }}>Onboarding</span> 🚀
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '15px', marginTop: '5px', fontWeight: 500 }}>
                        Gérez les prospects et déployez de nouvelles académies.
                    </p>
                </div>
            </div>

            {/* --- FILTERS AREA --- */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', background: '#0f172a', padding: '15px', borderRadius: '25px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '15px', top: '15px', width: '18px', height: '18px', color: '#475569' }} />
                    <input
                        type="text"
                        placeholder="Rechercher une organisation..."
                        style={{ width: '100%', height: '48px', paddingLeft: '50px', borderRadius: '18px', border: 'none', background: '#1e293b', color: 'white', fontWeight: 600, fontSize: '14px', outline: 'none' }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    style={{ height: '48px', padding: '0 20px', borderRadius: '18px', border: 'none', background: '#1e293b', color: 'white', fontWeight: 800, fontSize: '12px', cursor: 'pointer', outline: 'none' }}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="all">TOUS STATUTS</option>
                    <option value="new">NOUVEAUX</option>
                    <option value="contacted">CONTACTÉS</option>
                    <option value="scheduled">PLANIFIÉS</option>
                    <option value="deployed">DÉPLOYÉS</option>
                </select>
            </div>

            <div style={{ background: 'white', borderRadius: '35px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '25px 30px', textAlign: 'left', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Prospect</th>
                            <th style={{ padding: '25px', textAlign: 'left', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Académie</th>
                            <th style={{ padding: '25px', textAlign: 'center', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Forfait</th>
                            <th style={{ padding: '25px', textAlign: 'center', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Status</th>
                            <th style={{ padding: '25px 30px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => { setSelectedRequest(r); setIsEditing(false); }}>
                                <td style={{ padding: '25px 30px' }}>
                                    <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>{r.contact_name}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{r.email}</div>
                                </td>
                                <td style={{ padding: '25px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#334155' }}>{r.academy_name}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{r.organization_name}</div>
                                </td>
                                <td style={{ padding: '25px', textAlign: 'center' }}>
                                    <span style={{ padding: '6px 12px', borderRadius: '10px', background: '#eff6ff', color: '#1e40af', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
                                        {r.selected_plan}
                                    </span>
                                </td>
                                <td style={{ padding: '25px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: r.status === 'deployed' ? '#f0fdf4' : '#f8fafc', color: r.status === 'deployed' ? '#16a34a' : '#94a3b8', borderRadius: '10px', fontSize: '10px', fontWeight: 900, border: `1px solid ${r.status === 'deployed' ? '#dcfce7' : '#e2e8f0'}` }}>
                                            <div style={{ width: '6px', height: '6px', background: r.status === 'deployed' ? '#16a34a' : '#94a3b8', borderRadius: '50%' }}></div>
                                            {r.status === 'new' ? 'NOUVEAU' : r.status === 'contacted' ? 'CONTACTÉ' : r.status === 'deployed' ? 'DÉPLOYÉ' : r.status.toUpperCase()}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '25px 30px', textAlign: 'right' }}>
                                    <button style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: '#f8fafc', color: '#94a3b8', cursor: 'pointer' }}>
                                        <ChevronRight />
                                    </button>
                                </td>
                            </tr>
                        ))}
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
            {selectedRequest && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedRequest(null)}></div>
                    <div style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '100%', maxWidth: '600px', background: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', padding: '50px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ background: '#0f172a', padding: '8px 15px', borderRadius: '12px', color: 'white', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>Détails Prospect</div>
                                <button
                                    onClick={handleEditToggle}
                                    style={{ background: isEditing ? '#f59e0b' : '#f1f5f9', border: 'none', padding: '8px 15px', borderRadius: '12px', color: isEditing ? 'white' : '#64748b', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}
                                >
                                    {isEditing ? 'ANNULER' : 'MODIFIER'}
                                </button>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X /></button>
                        </div>

                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 950, color: '#0f172a', margin: 0 }}>Édition Concierge</h2>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '5px' }}>NOM ACADÉMIE</label>
                                        <input type="text" name="academy_name" value={editData.academy_name} onChange={handleEditChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 700 }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '5px' }}>FORFAIT</label>
                                        <select name="selected_plan" value={editData.selected_plan} onChange={handleEditChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 700 }}>
                                            <option value="starter">Starter</option>
                                            <option value="pro">Pro</option>
                                            <option value="enterprise">Enterprise</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '5px' }}>DOMAINE PERSONNALISÉ</label>
                                    <input type="text" name="domain_name" value={editData.domain_name || ''} onChange={handleEditChange} placeholder="ex: formation.client.com" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 700 }} />
                                    <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input type="checkbox" name="custom_domain" checked={editData.custom_domain} onChange={handleEditChange} id="cd_check" />
                                        <label htmlFor="cd_check" style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Activer le domaine personnalisé</label>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '5px' }}>DATE DE LANCEMENT</label>
                                        <input type="date" name="target_launch_date" value={editData.target_launch_date ? editData.target_launch_date.split('T')[0] : ''} onChange={handleEditChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 700 }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '5px' }}>STATUT</label>
                                        <select name="status" value={editData.status} onChange={handleEditChange} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 700 }}>
                                            <option value="new">Nouveau</option>
                                            <option value="contacted">Contacté</option>
                                            <option value="scheduled">Planifié</option>
                                            <option value="archived">Archivé</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '5px' }}>NOTES & COMMENTAIRES</label>
                                    <textarea name="comments" value={editData.comments || ''} onChange={handleEditChange} rows="4" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 700 }}></textarea>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{ width: '100%', height: '60px', borderRadius: '20px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 900, fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}
                                >
                                    {saving ? 'ENREGISTREMENT...' : 'ENREGISTRER LES MODIFICATIONS'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-1.5px' }}>{selectedRequest.academy_name}</h2>
                                <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: '13px', marginTop: '5px' }}>PAR {selectedRequest.organization_name} • Reçue le {formatDate(selectedRequest.created_at)}</p>

                                <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', gap: '30px' }}>

                                    {/* Section 1: Contact & Identité */}
                                    <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                                        <p style={{ margin: '0 0 15px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Contact & Identité</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Contact</small>
                                                <span style={{ fontWeight: 800, fontSize: '15px' }}>{selectedRequest.contact_name}</span>
                                            </div>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Email</small>
                                                <a href={`mailto:${selectedRequest.email}`} style={{ fontWeight: 700, fontSize: '14px', color: '#3b82f6' }}>{selectedRequest.email}</a>
                                            </div>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Téléphone</small>
                                                <span style={{ fontWeight: 700, fontSize: '14px' }}>{selectedRequest.phone || '—'}</span>
                                            </div>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Timezone</small>
                                                <span style={{ fontWeight: 700, fontSize: '14px' }}>{selectedRequest.timezone || 'UTC'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Branding & Domaine */}
                                    <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                                        <p style={{ margin: '0 0 15px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Branding & Digital</p>
                                        <div style={{ marginBottom: '15px' }}>
                                            <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Domaine Souhaité</small>
                                            <span style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
                                                {selectedRequest.custom_domain ? (
                                                    <span style={{ color: '#10b981' }}>Perso: {selectedRequest.domain_name}</span>
                                                ) : (
                                                    <span style={{ color: '#64748b' }}>Sous-domaine Skills</span>
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Logo fourni</small>
                                            {selectedRequest.logo_path ? (
                                                <div style={{ marginTop: '10px', width: '80px', height: '80px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img src={`/storage/${selectedRequest.logo_path}`} alt="Logo Prospect" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                </div>
                                            ) : (
                                                <span style={{ fontStyle: 'italic', fontSize: '13px', color: '#94a3b8' }}>Aucun logo</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Section 3: Programme & Audience */}
                                    <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                                        <p style={{ margin: '0 0 15px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Programme & Audience</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Audience Estimée</small>
                                                <span style={{ fontWeight: 800, fontSize: '15px' }}>{selectedRequest.estimated_learners || '—'}</span>
                                            </div>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Mode d'Inscription</small>
                                                <span style={{ fontWeight: 800, fontSize: '15px' }}>{selectedRequest.registration_mode || '—'}</span>
                                            </div>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Vente de cours</small>
                                                <span style={{ fontWeight: 800, fontSize: '15px' }}>{selectedRequest.will_sell_courses ? 'OUI' : 'NON'}</span>
                                            </div>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Certificats</small>
                                                <span style={{ fontWeight: 800, fontSize: '15px' }}>{selectedRequest.wants_certificates ? 'OUI' : 'NON'}</span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Programmes & Fonctionnalités</small>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                                {selectedRequest.training_types?.map((t, i) => (
                                                    <span key={`tr-${i}`} style={{ background: '#eff6ff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>{t}</span>
                                                ))}
                                                {selectedRequest.content_types?.map((type, i) => (
                                                    <span key={`ct-${i}`} style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>{type}</span>
                                                ))}
                                                {selectedRequest.enabled_features?.map((f, i) => (
                                                    <span key={`feat-${i}`} style={{ background: '#fdf2f8', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#db2777' }}>✨ {f}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 4: Lancement & Notes */}
                                    <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                        <p style={{ margin: '0 0 15px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Lancement</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Objectif</small>
                                                <span style={{ fontWeight: 800, fontSize: '14px' }}>{selectedRequest.target_launch_date ? formatDate(selectedRequest.target_launch_date) : 'À définir'}</span>
                                            </div>
                                            <div>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>État Contenu</small>
                                                <span style={{ fontWeight: 800, fontSize: '14px' }}>{selectedRequest.content_readiness || '—'}</span>
                                            </div>
                                        </div>
                                        {selectedRequest.comments && (
                                            <>
                                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700, marginBottom: '5px' }}>Notes Client</small>
                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>"{selectedRequest.comments}"</p>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                                        {selectedRequest.status === 'deployed' ? (
                                            <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: '20px', border: '2px solid #bbf7d0' }}>
                                                <p style={{ margin: 0, color: '#166534', fontWeight: 900 }}>ACADÉMIE DÉPLOYÉE ✅</p>
                                                <a href={selectedRequest.academy_url} target="_blank" style={{ color: '#16a34a', fontSize: '12px', fontWeight: 700 }}>{selectedRequest.academy_url}</a>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    <button
                                                        onClick={() => handleUpdateStatus('contacted')}
                                                        style={{ height: '50px', borderRadius: '15px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                                                    >
                                                        STATUT: CONTACTÉ
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus('archived')}
                                                        style={{ height: '50px', borderRadius: '15px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                                                    >
                                                        ARCHIVER
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={handleDeploy}
                                                    disabled={deploying}
                                                    style={{
                                                        width: '100%',
                                                        height: '70px',
                                                        borderRadius: '25px',
                                                        background: deploying ? '#94a3b8' : '#0f172a',
                                                        color: 'white',
                                                        fontSize: '14px',
                                                        fontWeight: 900,
                                                        cursor: deploying ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '15px',
                                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                        border: 'none',
                                                        opacity: deploying ? 0.7 : 1
                                                    }}
                                                >
                                                    {deploying ? 'PROVISIONING EN COURS...' : <><Rocket /> DÉPLOYER L'ACADÉMIE</>}
                                                </button>
                                                {selectedRequest.status !== 'deployed' && <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Action irréversible : Créera l'infrastructure technique</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* --- SUCCESS MODAL --- */}
            {deploymentSuccess && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)' }} onClick={() => setDeploymentSuccess(null)}></div>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', background: 'white', borderRadius: '40px', padding: '50px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ width: '80px', height: '80px', background: '#ecfdf5', color: '#10b981', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                            <CheckCircle2 style={{ width: '40px', height: '40px' }} />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 950, color: '#0f172a', marginBottom: '10px', letterSpacing: '-1px' }}>Félicitations !</h2>
                        <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '40px' }}>L'académie a été provisionnée avec succès.</p>

                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '25px', textAlign: 'left', marginBottom: '40px', border: '1px solid #e2e8f0' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Accès Administrateur</p>
                            <div style={{ marginBottom: '15px' }}>
                                <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>URL de l'Académie</small>
                                <a href={deploymentSuccess.tenant_url} target="_blank" style={{ color: '#3b82f6', fontWeight: 800, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {deploymentSuccess.tenant_url} <ExternalLink size={14} />
                                </a>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                                <div>
                                    <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>Email</small>
                                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{deploymentSuccess.credentials.email}</span>
                                </div>
                                <div>
                                    <small style={{ display: 'block', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>MDP (Temp)</small>
                                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#f59e0b' }}>{deploymentSuccess.credentials.password}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => { setDeploymentSuccess(null); setSelectedRequest(null); }}
                            style={{ width: '100%', height: '60px', borderRadius: '20px', background: '#0f172a', color: 'white', fontWeight: 900, border: 'none', cursor: 'pointer' }}
                        >
                            RETOUR AU PIPELINE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingList;
