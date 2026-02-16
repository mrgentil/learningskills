import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlanModal = ({ plan, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        stripe_plan_id: '',
        price: '',
        interval: 'month',
        description: '',
        max_courses: 0,
        max_students: 0,
        features: '', // We'll handle this as a newline-separated string for simplicity
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    console.log('PlanModal rendering. Plan prop:', plan);

    useEffect(() => {
        console.log('PlanModal useEffect triggered. Plan:', plan);
        if (plan) {
            // Ensure features is always an array
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
                stripe_plan_id: plan.stripe_plan_id || '',
                price: plan.price || '',
                interval: plan.interval || 'month',
                description: plan.description || '',
                max_courses: plan.max_courses ?? 0,
                max_students: plan.max_students ?? 0,
                features: featuresVal,
                is_active: !!plan.is_active
            });
        } else {
            // Reset form for create mode
            setFormData({
                name: '',
                slug: '',
                stripe_plan_id: '',
                price: '',
                interval: 'month',
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
            // Filter out empty features
            const submittedFeatures = (Array.isArray(formData.features) ? formData.features : [])
                .filter(f => f && f.trim() !== '');

            const data = {
                ...formData,
                features: submittedFeatures
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
                alert('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{plan ? 'Modifier le Plan' : 'Nouveau Plan'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nom du Plan</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                    {errors.name && <small className="text-danger">{errors.name[0]}</small>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Slug (URL)</label>
                                    <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} required />
                                    {errors.slug && <small className="text-danger">{errors.slug[0]}</small>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Prix</label>
                                    <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                                    {errors.price && <small className="text-danger">{errors.price[0]}</small>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Intervalle</label>
                                    <select className="form-select" name="interval" value={formData.interval} onChange={handleChange}>
                                        <option value="month">Mensuel</option>
                                        <option value="year">Annuel</option>
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">ID Stripe</label>
                                    <input type="text" className="form-control" name="stripe_plan_id" value={formData.stripe_plan_id} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="2"></textarea>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Max Cours (0 = illimité)</label>
                                    <input type="number" className="form-control" name="max_courses" value={formData.max_courses} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Max Étudiants (0 = illimité)</label>
                                    <input type="number" className="form-control" name="max_students" value={formData.max_students} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Fonctionnalités</label>
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
                                            <button
                                                type="button"
                                                className="btn btn-light text-danger"
                                                onClick={() => removeFeature(index)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-light text-primary mt-2"
                                    onClick={addFeature}
                                >
                                    <i className="fa fa-plus me-1"></i> Ajouter une fonctionnalité
                                </button>
                            </div>

                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} id="isActiveCheck" />
                                <label className="form-check-label" htmlFor="isActiveCheck">
                                    Actif (visible pour l'inscription)
                                </label>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
                                <button type="submit" className="btn-modern btn-primary-modern" disabled={loading}>
                                    {loading ? 'Enregistrement...' : 'Enregistrer'}
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
