import React, { useState, useEffect, useMemo } from "react";
import {
    Building2, User, Mail, Clock,
    CheckCircle2, Archive, Search,
    X, Shield, Sparkles, Crown,
    Users, Rocket, ChevronRight,
    ExternalLink, ArrowUpRight
} from "lucide-react";
import axios from "axios";

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

const TIER_CONFIG = {
    starter: { icon: Shield, color: "#10b981", bg: "#f0fdf4", label: "Starter" },
    pro: { icon: Sparkles, color: "#3b82f6", bg: "#eff6ff", label: "Professional" },
    enterprise: { icon: Crown, color: "#8b5cf6", bg: "#f5f3ff", label: "Enterprise" },
};

const OnboardingList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deploying, setDeploying] = useState(false);
    const [deploymentSuccess, setDeploymentSuccess] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const resp = await axios.get("/api/admin/onboarding-requests");
            setRequests(resp.data.data || []);
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/admin/onboarding-requests/${id}/status`, { status });
            fetchRequests();
            if (selectedRequest?.id === id) {
                setSelectedRequest({ ...selectedRequest, status });
            }
        } catch (err) {
            alert("Erreur");
        }
    };

    const handleDeploy = async (id) => {
        if (!confirm("Voulez-vous vraiment générer l'infrastructure pour cette académie ?")) return;

        setDeploying(true);
        try {
            const resp = await axios.post(`/api/admin/onboarding-requests/${id}/deploy`);
            setDeploymentSuccess(resp.data);
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Erreur lors du déploiement");
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

    if (loading) return (
        <div style={{ display: 'flex', height: '400px', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontWeight: 800, color: '#94a3b8' }}>CHARGEMENT DU PIPELINE...</p>
        </div>
    );

    return (
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

            {/* --- TOP SECTION: TITLES & STATUS OVERVIEW --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '2px solid #f1f5f9', paddingBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
                        Dashboard <span style={{ color: '#f59e0b' }}>Onboarding</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '15px', marginTop: '5px', fontWeight: 500 }}>
                        Suivi des nouveaux comptes et automatisation du déploiement.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '10px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#1e40af' }}>{requests.filter(r => r.status === 'new').length} NOUVEAUX</span>
                    </div>
                </div>
            </div>

            {/* --- STATS CARDS: GRID THAT ACTUALLY WORKS --- */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', marginBottom: '50px' }}>
                {[
                    { label: 'Total Leads', val: requests.length, icon: Users, color: '#3b82f6' },
                    { label: 'En Attente', val: requests.filter(r => r.status === 'new').length, icon: Clock, color: '#f59e0b' },
                    { label: 'Académies Live', val: requests.filter(r => r.status === 'deployed').length, icon: Rocket, color: '#10b981' }
                ].map((st, i) => (
                    <div key={i} style={{ flex: '1', minWidth: '300px', background: 'white', padding: '30px', borderRadius: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                        <div style={{ background: `${st.color}10`, width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                            <st.icon style={{ color: st.color, width: '24px', height: '24px' }} />
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{st.label}</p>
                        <h3 style={{ margin: 0, fontSize: '36px', fontWeight: 900, color: '#0f172a' }}>{st.val}</h3>
                    </div>
                ))}
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
                    <option value="deployed">DÉPLOYÉS</option>
                </select>
            </div>

            {/* --- MAIN TABLE: CLEAN & SPACIOUS --- */}
            <div style={{ background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '25px 35px', textAlign: 'left', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Client & Projet</th>
                            <th style={{ padding: '25px', textAlign: 'center', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Licence</th>
                            <th style={{ padding: '25px', textAlign: 'left', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>Statut</th>
                            <th style={{ padding: '25px 35px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => {
                            const config = TIER_CONFIG[req.selected_plan] || TIER_CONFIG.starter;
                            return (
                                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => setSelectedRequest(req)}>
                                    <td style={{ padding: '30px 35px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ background: config.bg, width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${config.color}20` }}>
                                                <config.icon style={{ color: config.color, width: '28px', height: '28px' }} />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 950, color: '#0f172a' }}>{req.organization_name}</h4>
                                                <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{req.contact_name} • <span style={{ opacity: 0.6 }}>{formatDate(req.created_at)}</span></p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '25px', textAlign: 'center' }}>
                                        <span style={{ padding: '8px 15px', borderRadius: '12px', background: '#0f172a', color: 'white', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
                                            {req.selected_plan}
                                        </span>
                                    </td>
                                    <td style={{ padding: '25px' }}>
                                        {req.status === 'new' ? (
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#eff6ff', color: '#2563eb', borderRadius: '10px', fontSize: '10px', fontWeight: 900, border: '1px solid #dbeafe' }}>
                                                <div style={{ width: '6px', height: '6px', background: '#2563eb', borderRadius: '50%' }}></div> NOUVEAU
                                            </div>
                                        ) : (
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '10px', fontSize: '10px', fontWeight: 900, border: '1px solid #dcfce7' }}>
                                                <Rocket style={{ width: '12px', height: '12px' }} /> DÉPLOYÉ
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '25px 35px', textAlign: 'right' }}>
                                        <button style={{ width: '45px', height: '45px', borderRadius: '15px', border: 'none', background: '#f8fafc', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ChevronRight />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* --- SLIDE-OVER PANEL: TOTAL WOW --- */}
            {selectedRequest && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(5px)' }} onClick={() => setSelectedRequest(null)}></div>
                    <div style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '100%', maxWidth: '600px', background: '#fcfdfe', boxShadow: '-20px 0 50px rgba(0,0,0,0.2)', padding: '50px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <div style={{ background: '#0f172a', padding: '10px 20px', borderRadius: '15px', color: 'white', fontSize: '11px', fontWeight: 900 }}>DÉTAILS PROSPECT</div>
                            <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X /></button>
                        </div>

                        <h2 style={{ fontSize: '38px', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-2px', lineHeight: 1 }}>{selectedRequest.organization_name}</h2>
                        <p style={{ color: '#f59e0b', fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px' }}>{selectedRequest.academy_name}</p>

                        <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', gap: '30px' }}>

                            <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 15px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Contact Principal</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User style={{ width: '18px', color: '#3b82f6' }} /></div>
                                    <span style={{ fontWeight: 800, fontSize: '16px' }}>{selectedRequest.contact_name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail style={{ width: '18px', color: '#3b82f6' }} /></div>
                                    <a href={`mailto:${selectedRequest.email}`} style={{ fontWeight: 700, fontSize: '15px', color: '#3b82f6' }}>{selectedRequest.email}</a>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ margin: '0 0 10px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Forfait</p>
                                    <span style={{ fontWeight: 900, fontSize: '18px', color: '#0f172a' }}>{selectedRequest.selected_plan.toUpperCase()}</span>
                                </div>
                                <div style={{ background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ margin: '0 0 10px', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase' }}>Certificats</p>
                                    <span style={{ fontWeight: 900, fontSize: '18px', color: '#0f172a' }}>{selectedRequest.wants_certificates ? 'OUI' : 'NON'}</span>
                                </div>
                            </div>

                            {selectedRequest.comments && (
                                <div style={{ background: '#fdf2f8', padding: '25px', borderRadius: '25px', border: '1px solid #fce7f3' }}>
                                    <p style={{ margin: '0 0 10px', fontSize: '10px', color: '#db2777', fontWeight: 900, textTransform: 'uppercase' }}>Notes Client</p>
                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#9d174d', fontStyle: 'italic' }}>"{selectedRequest.comments}"</p>
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                                <button
                                    onClick={() => handleDeploy(selectedRequest.id)}
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
                                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Action irréversible : Créera l'infrastructure technique</p>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* --- SUCCESS MODAL --- */}
            {deploymentSuccess && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)' }}></div>
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
