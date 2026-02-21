import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';

const InstructorList = () => {
    const { user } = useUser();
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [inviting, setInviting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await fetch('/api/academy/instructors', {
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setInstructors(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviting(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('/api/academy/instructors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ email: inviteEmail, name: inviteName })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message });
                setInviteEmail('');
                setInviteName('');
                fetchInstructors(); // Refresh list
            } else {
                setError(data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Erreur lors de l\'invitation.'));
            }
        } catch (err) {
            setError('Erreur de connexion.');
        } finally {
            setInviting(false);
        }
    };

    const handleRemove = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir retirer cet instructeur ?')) return;

        try {
            const response = await fetch(`/api/academy/instructors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                setInstructors(instructors.filter(i => i.id !== id));
                setMessage({ type: 'success', text: 'Instructeur retiré avec succès.' });
            } else {
                const data = await response.json();
                setError(data.error || 'Erreur lors de la suppression.');
            }
        } catch (err) {
            setError('Erreur de connexion.');
        }
    };

    if (loading) return (
        <div className="text-center p-5">
            <i className="fa fa-circle-o-notch fa-spin fa-3x" style={{ color: 'var(--cbx-navy)' }}></i>
            <p className="mt-3 text-muted">Chargement de l'équipe...</p>
        </div>
    );

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 dashboard-header">
                <div>
                    <h2 className="page-title">Gestion des Instructeurs 👨‍🏫</h2>
                    <p className="page-subtitle">Ajoutez des membres à votre équipe pédagogique et gérez les accès.</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card-modern shadow-soft border-0 mb-4">
                        <div className="card-body-modern p-4">
                            <h5 className="font-weight-bold mb-4 text-dark"><i className="fa fa-users mr-2" style={{ color: 'var(--cbx-navy)' }}></i> Équipe Actuelle</h5>

                            {message && <div className={`alert alert-${message.type} mb-4`}>{message.text}</div>}
                            {error && <div className="alert alert-danger mb-4">{error}</div>}

                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="bg-light text-muted">
                                        <tr>
                                            <th className="border-0 rounded-start pl-3">Nom</th>
                                            <th className="border-0">Email</th>
                                            <th className="border-0">Rôle</th>
                                            <th className="border-0">Date d'ajout</th>
                                            <th className="border-0 rounded-end text-end pr-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {instructors.map(instructor => (
                                            <tr key={instructor.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                <td className="pl-3 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="user-avatar-sm mr-3 shadow-sm" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--cbx-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                                                            {instructor.name.charAt(0)}
                                                        </div>
                                                        <span className="font-weight-bold text-dark">{instructor.name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-secondary">{instructor.email}</td>
                                                <td>
                                                    <span className={`badge py-2 px-3 rounded-pill text-uppercase ${instructor.role === 'owner' ? '' : ''}`} style={{ fontSize: '10px', letterSpacing: '1px', background: instructor.role === 'owner' ? 'var(--cbx-amber-soft)' : '#f1f5f9', color: instructor.role === 'owner' ? 'var(--cbx-amber)' : '#64748b', border: instructor.role === 'owner' ? '1px solid var(--cbx-amber)' : '1px solid #e2e8f0', fontWeight: 800 }}>
                                                        {instructor.role === 'owner' ? 'Propriétaire' : 'Instructeur'}
                                                    </span>
                                                </td>
                                                <td className="text-muted small">{instructor.joined_at}</td>
                                                <td className="text-end pr-3">
                                                    {instructor.role !== 'owner' && instructor.id !== user.id && (
                                                        <button
                                                            onClick={() => handleRemove(instructor.id)}
                                                            className="btn btn-sm btn-light text-danger shadow-sm border-0"
                                                            title="Retirer cet instructeur"
                                                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {instructors.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">
                                                    <i className="fa fa-user-times fa-2x mb-3 d-block opacity-50"></i>
                                                    Aucun instructeur trouvé. Invitez votre premier membre à droite !
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card-modern shadow-soft border-0 sticky-top" style={{ top: '20px', zIndex: 1 }}>
                        <div className="card-body-modern p-4">
                            <h5 className="font-weight-bold mb-4 text-dark"><i className="fa fa-envelope-o mr-2" style={{ color: 'var(--cbx-amber)' }}></i> Inviter un Instructeur</h5>
                            <form onSubmit={handleInvite}>
                                <div className="form-group mb-3">
                                    <label className="form-label-modern font-weight-bold small text-uppercase text-muted">Nom Complet</label>
                                    <input
                                        type="text"
                                        className="form-control-modern"
                                        placeholder="Ex: Marie Curie"
                                        value={inviteName}
                                        onChange={(e) => setInviteName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold small text-uppercase text-muted">Adresse E-mail</label>
                                    <input
                                        type="email"
                                        className="form-control-modern"
                                        placeholder="Ex: marie@example.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-modern btn-primary-modern w-100 py-3 shadow-sm font-weight-bold" disabled={inviting}>
                                    {inviting ? <><i className="fa fa-spinner fa-spin mr-2"></i> Envoi...</> : <><i className="fa fa-paper-plane mr-2"></i> Envoyer l'invitation</>}
                                </button>
                                <div className="mt-3 p-3 bg-light rounded text-center">
                                    <small className="d-block text-muted" style={{ fontSize: '11px', lineHeight: 1.4 }}>
                                        <i className="fa fa-info-circle mr-1"></i> Si l'utilisateur n'a pas de compte, nous en créerons un pour lui avec un mot de passe temporaire.
                                    </small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorList;
