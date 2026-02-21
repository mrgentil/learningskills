import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlanModal from './PlanModal';

const TIER_BADGES = {
    starter: { label: '🟢 Starter', bg: '#dcfce7', color: '#166534' },
    pro: { label: '🔵 Pro', bg: '#dbeafe', color: '#1e40af' },
    enterprise: { label: '🟣 Enterprise', bg: '#f3e8ff', color: '#6b21a8' },
};

const PlanList = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/plans');
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleCreate = () => { setEditingPlan(null); setShowModal(true); };
    const handleEdit = (plan) => { setEditingPlan(plan); setShowModal(true); };
    const handleCloseModal = () => { setShowModal(false); setEditingPlan(null); };
    const handleSuccess = () => { handleCloseModal(); fetchPlans(); };

    const handleDelete = async (planId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce forfait ?')) return;
        try {
            await axios.delete(`/api/admin/plans/${planId}`);
            fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Impossible de supprimer ce forfait.');
        }
    };

    if (loading) return <div className="p-5 text-center">Chargement...</div>;

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="page-title">Forfaits & Licences 💳</h2>
                    <p className="page-subtitle">Gérez les offres disponibles pour vos clients.</p>
                </div>
                <button className="btn-modern btn-primary-modern" onClick={handleCreate}>
                    <i className="fa fa-plus"></i> Nouveau Forfait
                </button>
            </div>

            <div className="stat-card p-0" style={{ overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table mb-0" style={{ verticalAlign: 'middle' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px', borderTop: 'none' }}>Forfait</th>
                                <th style={{ borderTop: 'none' }}>Tier</th>
                                <th style={{ borderTop: 'none' }}>Type</th>
                                <th style={{ borderTop: 'none' }}>Prix</th>
                                <th style={{ borderTop: 'none' }}>Limites</th>
                                <th style={{ borderTop: 'none' }}>Statut</th>
                                <th style={{ borderTop: 'none', textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan) => {
                                const tierInfo = TIER_BADGES[plan.tier] || null;
                                const isOneTime = plan.pricing_type === 'one_time' || !plan.pricing_type;

                                return (
                                    <tr key={plan.id}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: 700 }}>{plan.name}</div>
                                            <div style={{ fontSize: '11px', color: '#718096', fontWeight: 400 }}>{plan.slug}</div>
                                        </td>
                                        <td>
                                            {tierInfo ? (
                                                <span className="badge-role" style={{ background: tierInfo.bg, color: tierInfo.color, fontWeight: 700, fontSize: '12px' }}>
                                                    {tierInfo.label}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#a0aec0', fontSize: '12px' }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="badge-role" style={{
                                                background: isOneTime ? '#fef3c7' : '#e2e8f0',
                                                color: isOneTime ? '#92400e' : '#475569',
                                                fontWeight: 600,
                                                fontSize: '12px'
                                            }}>
                                                {isOneTime ? '💰 Unique' : `🔄 ${plan.interval === 'year' ? 'Annuel' : 'Mensuel'}`}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '15px' }}>
                                                {Number(plan.price).toLocaleString()} $
                                            </div>
                                            {isOneTime && plan.maintenance_price > 0 && (
                                                <div style={{ fontSize: '11px', color: '#718096' }}>
                                                    + {Number(plan.maintenance_price).toLocaleString()} $/an maint.
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '13px' }}>
                                                {plan.max_courses === 0 ? '∞' : plan.max_courses} cours
                                                {' / '}
                                                {plan.max_students === 0 ? '∞' : plan.max_students} étudiants
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: plan.is_active ? '#48bb78' : '#a0aec0', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: plan.is_active ? '#48bb78' : '#a0aec0' }}></span>
                                                {plan.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <button className="btn btn-sm btn-light mr-2" onClick={() => handleEdit(plan)} style={{ borderRadius: '8px' }}>
                                                <i className="fa fa-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(plan.id)} style={{ borderRadius: '8px' }}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {plans.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center p-5 text-muted">Aucun forfait trouvé. Créez-en un !</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <PlanModal
                    plan={editingPlan}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default PlanList;
