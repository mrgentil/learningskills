import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PageList = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await fetch('/api/academy/pages', {
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setPages(data);
            }
        } catch (err) {
            console.error('Error fetching pages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette page ?')) return;

        try {
            const response = await fetch(`/api/academy/pages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Page supprimée avec succès.' });
                setPages(pages.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error('Error deleting page:', err);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <i className="fa fa-spinner fa-spin fa-3x text-primary"></i>
                <p className="mt-2">Chargement des pages...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="page-title">Gestion des Pages CMS 📄</h2>
                    <p className="page-subtitle">Créez des pages personnalisées (Conditions, À propos, Contact, etc.)</p>
                </div>
                <Link to="/dashboard/pages/create" className="btn-modern btn-primary-modern">
                    <i className="fa fa-plus-circle mr-2"></i> Créer une Page
                </Link>
            </div>

            {message && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4 alternate`}>
                    {message.text}
                </div>
            )}

            <div className="card-modern shadow-soft border-0">
                <div className="card-body-modern p-0">
                    <div className="table-responsive">
                        <table className="table-modern w-100">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>URL (Slug)</th>
                                    <th>Statut</th>
                                    <th>Créée le</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            Aucune page créée pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    pages.map(page => (
                                        <tr key={page.id}>
                                            <td className="font-weight-bold">{page.title}</td>
                                            <td><code>/p/{page.slug}</code></td>
                                            <td>
                                                <span className={`badge badge-pill ${page.is_published ? 'badge-success-modern' : 'badge-warning-modern'}`}>
                                                    {page.is_published ? 'Publiée' : 'Brouillon'}
                                                </span>
                                            </td>
                                            <td>{new Date(page.created_at).toLocaleDateString()}</td>
                                            <td className="text-right action-btns">
                                                <Link to={`/dashboard/pages/${page.id}/edit`} className="btn-action edit" title="Modifier">
                                                    <i className="fa fa-pencil"></i>
                                                </Link>
                                                <button onClick={() => handleDelete(page.id)} className="btn-action delete" title="Supprimer">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageList;
