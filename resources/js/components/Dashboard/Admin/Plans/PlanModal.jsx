import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TIER_OPTIONS = [
    { value: '', label: '— Aucun —' },
    { value: 'starter', label: '🟢 Starter' },
    { value: 'pro', label: '🔵 Pro' },
    { value: 'enterprise', label: '🟣 Enterprise' },
];

const PlanModal = ({ plan, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        pricing_type: 'one_time',
        tier: '',
        stripe_plan_id: '',
        price: '',
        setup_price: '',
        maintenance_price: '',
        interval: '',
        description: '',
        max_courses: 0,
        max_students: 0,
        features: [''],
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (plan) {
            let featuresVal = [];
            if (Array.isArray(plan.features)) {
                featuresVal = [...plan.features];
            } else if (typeof plan.features === 'string') {
                try {
                    const parsed = JSON.parse(plan.features);
                    if (Array.isArray(parsed)) featuresVal = parsed;
                    else featuresVal = [plan.features];
                } catch (e) {
                    featuresVal = plan.features.split('\n');
                }
            }

            setFormData({
                name: plan.name || '',
                slug: plan.slug || '',
                pricing_type: plan.pricing_type || 'one_time',
                tier: plan.tier || '',
                stripe_plan_id: plan.stripe_plan_id || '',
                price: plan.price || '',
                setup_price: plan.setup_price || '',
                maintenance_price: plan.maintenance_price || '',
                interval: plan.interval || '',
                description: plan.description || '',
                max_courses: plan.max_courses ?? 0,
                max_students: plan.max_students ?? 0,
                features: featuresVal.length > 0 ? featuresVal : [''],
                is_active: !!plan.is_active
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                pricing_type: 'one_time',
                tier: '',
                stripe_plan_id: '',
                price: '',
                setup_price: '',
                maintenance_price: '',
                interval: '',
                description: '',
                max_courses: 0,
                max_students: 0,
                features: [''],
                is_active: true,
            });
        }
    }, [plan]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (value || '')
        }));
    };

    const autoSlug = (name) => {
        return name.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: plan ? prev.slug : autoSlug(name),
        }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const submittedFeatures = (Array.isArray(formData.features) ? formData.features : [])
                .filter(f => f && f.trim() !== '');

            const data = {
                ...formData,
                features: submittedFeatures,
                tier: formData.tier || null,
                interval: formData.pricing_type === 'recurring' ? (formData.interval || 'month') : null,
                setup_price: formData.setup_price || 0,
                maintenance_price: formData.maintenance_price || null,
            };

            if (plan) {
                await axios.put(`/api/admin/plans/${plan.id}`, data);
            } else {
                await axios.post('/api/admin/plans', data);
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Une erreur est survenue.');
            }
        } finally {
            setLoading(false);
        }
    };

    const isOneTime = formData.pricing_type === 'one_time';

    return (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                    <div className="modal-header" style={{ background: 'var(--cbx-navy)', color: '#fff', borderRadius: '16px 16px 0 0', padding: '20px 24px' }}>
                        <h5 className="modal-title" style={{ fontWeight: 700 }}>
                            {plan ? '✏️ Modifier le Forfait' : '✨ Nouveau Forfait'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ padding: '24px' }}>
                        <form onSubmit={handleSubmit}>
                            {/* Type de tarification */}
                            <div className="mb-4 p-3" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <label className="form-label" style={{ fontWeight: 700, color: 'var(--cbx-navy)' }}>Type de tarification</label>
                                <div className="d-flex gap-3">
                                    <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', padding: '10px 16px', borderRadius: '8px', border: isOneTime ? '2px solid var(--cbx-navy)' : '2px solid #e2e8f0', background: isOneTime ? '#eef2ff' : '#fff', fontWeight: 600, transition: 'all 0.2s' }}>
                                        <input type="radio" name="pricing_type" value="one_time" checked={isOneTime} onChange={handleChange} style={{ display: 'none' }} />
                                        💰 Paiement unique
                                    </label>
                                    <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', padding: '10px 16px', borderRadius: '8px', border: !isOneTime ? '2px solid var(--cbx-navy)' : '2px solid #e2e8f0', background: !isOneTime ? '#eef2ff' : '#fff', fontWeight: 600, transition: 'all 0.2s' }}>
                                        <input type="radio" name="pricing_type" value="recurring" checked={!isOneTime} onChange={handleChange} style={{ display: 'none' }} />
                                        🔄 Récurrent
                                    </label>
                                </div>
                            </div>

                            {/* Nom + Slug + Tier */}
                            <div className="row">
                                <div className="col-md-5 mb-3">
                                    <label className="form-label fw-bold">Nom du Forfait</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleNameChange} required placeholder="Ex: Forfait Starter" />
                                    {errors.name && <small className="text-danger">{errors.name[0]}</small>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Slug (URL)</label>
                                    <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} required />
                                    {errors.slug && <small className="text-danger">{errors.slug[0]}</small>}
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label fw-bold">Tier</label>
                                    <select className="form-select" name="tier" value={formData.tier} onChange={handleChange}>
                                        {TIER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">{isOneTime ? 'Prix (paiement unique)' : 'Prix'}</label>
                                    <div className="input-group">
                                        <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                                        <span className="input-group-text">$ CAD</span>
                                    </div>
                                    {errors.price && <small className="text-danger">{errors.price[0]}</small>}
                                </div>

                                {isOneTime ? (
                                    <>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">Dont installation</label>
                                            <div className="input-group">
                                                <input type="number" step="0.01" className="form-control" name="setup_price" value={formData.setup_price} onChange={handleChange} placeholder="0" />
                                                <span className="input-group-text">$</span>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">Maintenance /an</label>
                                            <div className="input-group">
                                                <input type="number" step="0.01" className="form-control" name="maintenance_price" value={formData.maintenance_price} onChange={handleChange} placeholder="Optionnel" />
                                                <span className="input-group-text">$</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">Intervalle</label>
                                            <select className="form-select" name="interval" value={formData.interval} onChange={handleChange}>
                                                <option value="month">Mensuel</option>
                                                <option value="year">Annuel</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-bold">ID Stripe</label>
                                            <input type="text" className="form-control" name="stripe_plan_id" value={formData.stripe_plan_id} onChange={handleChange} />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Description</label>
                                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Description courte du forfait..."></textarea>
                            </div>

                            {/* Limits */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Max Cours (0 = illimité)</label>
                                    <input type="number" className="form-control" name="max_courses" value={formData.max_courses} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Max Étudiants (0 = illimité)</label>
                                    <input type="number" className="form-control" name="max_students" value={formData.max_students} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Fonctionnalités incluses</label>
                                <div className="features-list">
                                    {(Array.isArray(formData.features) ? formData.features : []).map((feature, index) => (
                                        <div key={index} className="d-flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                placeholder="Ex: Support prioritaire"
                                            />
                                            <button type="button" className="btn btn-light text-danger" onClick={() => removeFeature(index)}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-sm btn-light text-primary mt-2" onClick={addFeature}>
                                    <i className="fa fa-plus me-1"></i> Ajouter
                                </button>
                            </div>

                            {/* Active */}
                            <div className="form-check mb-4">
                                <input className="form-check-input" type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} id="isActiveCheck" />
                                <label className="form-check-label fw-bold" htmlFor="isActiveCheck">
                                    Actif (visible sur la plateforme)
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ borderRadius: '8px' }}>Annuler</button>
                                <button type="submit" className="btn-modern btn-primary-modern" disabled={loading}>
                                    {loading ? 'Enregistrement...' : '✅ Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;
