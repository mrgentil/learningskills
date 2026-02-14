import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlanModal from './PlanModal';

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

    const handleCreate = () => {
        setEditingPlan(null);
        setShowModal(true);
    };

    const handleEdit = (plan) => {
        console.log('handleEdit called with:', plan);
        setEditingPlan(plan);
        setShowModal(true);
    };

    const handleDelete = async (planId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) return;

        try {
            await axios.delete(`/api/admin/plans/${planId}`);
            fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Impossible de supprimer ce plan.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPlan(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        fetchPlans();
    };

    if (loading) return <div className="p-5 text-center">Chargement...</div>;

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="page-title">Plans d'Abonnement 💳</h2>
                    <p className="page-subtitle">Gérez les offres disponibles pour vos académies.</p>
                </div>
                <button className="btn-modern btn-primary-modern" onClick={handleCreate}>
                    <i className="fa fa-plus"></i> Nouveau Plan
                </button>
            </div>

            <div className="stat-card p-0" style={{ overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table mb-0" style={{ verticalAlign: 'middle' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px', borderTop: 'none' }}>Nom</th>
                                <th style={{ borderTop: 'none' }}>Prix</th>
                                <th style={{ borderTop: 'none' }}>Intervalle</th>
                                <th style={{ borderTop: 'none' }}>Limites (Cours/Étudiants)</th>
                                <th style={{ borderTop: 'none' }}>Statut</th>
                                <th style={{ borderTop: 'none', textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan) => (
                                <tr key={plan.id}>
                                    <td style={{ padding: '20px', fontWeight: 700 }}>
                                        {plan.name}
                                        <div style={{ fontSize: '11px', color: '#718096', fontWeight: 400 }}>{plan.slug}</div>
                                    </td>
                                    <td>{plan.price} $</td>
                                    <td>
                                        <span className="badge-role" style={{ background: '#e2e8f0', color: '#475569' }}>
                                            {plan.interval === 'year' ? 'Annuel' : 'Mensuel'}
                                        </span>
                                    </td>
                                    <td>
                                        {plan.max_courses === 0 ? '∞' : plan.max_courses} / {plan.max_students === 0 ? '∞' : plan.max_students}
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
                            ))}
                            {plans.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center p-5 text-muted">Aucun plan trouvé. Créez-en un !</td>
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
