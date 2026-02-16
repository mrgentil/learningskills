import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PageEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [settings, setSettings] = useState({
        title: '',
        content: '',
        is_published: false,
        show_in_nav: false,
        meta_description: ''
    });

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        try {
            const response = await fetch(`/api/academy/pages/${id}`, {
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setSettings({
                    title: data.title,
                    content: data.content || '',
                    is_published: data.is_published,
                    show_in_nav: data.show_in_nav,
                    meta_description: data.meta_description || ''
                });
            }
        } catch (err) {
            console.error('Error fetching page:', err);
            setError('Impossible de charger la page.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleQuillChange = (content) => {
        setSettings({
            ...settings,
            content: content
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `/api/academy/pages/${id}` : '/api/academy/pages';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                navigate('/dashboard/pages');
            } else {
                const data = await response.json();
                setError(data.message || 'Une erreur est survenue.');
            }
        } catch (err) {
            console.error('Error saving page:', err);
            setError('Erreur de connexion.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center p-5"><i className="fa fa-spinner fa-spin fa-3x text-primary"></i></div>;

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="page-title">{isEdit ? 'Modifier la Page' : 'Créer une nouvelle Page'} 📝</h2>
                    <p className="page-subtitle">Rédigez le contenu de votre page personnalisée.</p>
                </div>
                <button onClick={() => navigate('/dashboard/pages')} className="btn-modern btn-outline-modern">
                    Retour à la liste
                </button>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card-modern shadow-soft border-0">
                        <div className="card-body-modern p-4">
                            {error && <div className="alert alert-danger mb-4">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold">Titre de la Page</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control-modern form-control-lg"
                                        value={settings.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: Conditions Générales de Vente"
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold">Contenu de la Page</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={settings.content}
                                        onChange={handleQuillChange}
                                        className="bg-white"
                                        style={{ height: '400px', marginBottom: '50px' }}
                                        placeholder="Écrivez votre contenu ici..."
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, 4, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                [{ 'color': [] }, { 'background': [] }],
                                                ['link', 'image', 'clean']
                                            ],
                                        }}
                                    />
                                </div>

                                <div className="d-flex justify-content-end align-items-center mt-5">
                                    <div className="custom-control custom-switch mr-4">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="navSwitch"
                                            name="show_in_nav"
                                            checked={settings.show_in_nav}
                                            onChange={handleChange}
                                        />
                                        <label className="custom-control-label" htmlFor="navSwitch">Afficher dans le menu</label>
                                    </div>
                                    <div className="custom-control custom-switch mr-4">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="publishSwitch"
                                            name="is_published"
                                            checked={settings.is_published}
                                            onChange={handleChange}
                                        />
                                        <label className="custom-control-label" htmlFor="publishSwitch">Publier la page</label>
                                    </div>
                                    <button type="submit" className="btn-modern btn-primary-modern px-5" disabled={saving}>
                                        {saving ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-save mr-2"></i>}
                                        {isEdit ? 'Mettre à jour' : 'Enregistrer la page'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card-modern shadow-soft border-0 mb-4">
                        <div className="card-body-modern p-4">
                            <h5 className="font-weight-bold mb-3">Paramètres SEO</h5>
                            <div className="form-group">
                                <label className="form-label-modern">Méta Description (Optionnel)</label>
                                <textarea
                                    name="meta_description"
                                    className="form-control-modern"
                                    rows="4"
                                    value={settings.meta_description}
                                    onChange={handleChange}
                                    placeholder="Brève description pour les moteurs de recherche..."
                                ></textarea>
                                <small className="text-muted">Max 160 caractères recommandés.</small>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-info border-0 shadow-sm">
                        <h6><i className="fa fa-lightbulb-o mr-2"></i> Astuce CMS</h6>
                        <p className="small mb-0">
                            Une fois enregistrée, vous pourrez lier cette page dans votre menu ou votre pied de page. L'URL sera automatiquement générée à partir du titre.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageEditor;
