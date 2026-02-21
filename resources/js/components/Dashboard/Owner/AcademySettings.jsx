import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AcademySettings = () => {
    const { user, refreshUser } = useUser();
    const [settings, setSettings] = useState({
        name: '',
        slug: '',
        description: '',
        about: '',
        footer_about: '',
        support_email: '',
        support_phone: '',
        facebook_url: '',
        instagram_url: '',
        linkedin_url: '',
        twitter_url: '',
        youtube_url: '',
        experience_years: '',
        experience_label: '',
        hero_slide2_title: '',
        hero_slide2_subtitle: '',
        hero_slide3_title: '',
        hero_slide3_subtitle: '',
        feature1_title: '',
        feature1_desc: '',
        feature2_title: '',
        feature2_desc: '',
        feature3_title: '',
        feature3_desc: '',
        stat_satisfaction_percent: ''
    });
    const [logo, setLogo] = useState(null);
    const [favicon, setFavicon] = useState(null);
    const [banner, setBanner] = useState(null);
    const [aboutImage, setAboutImage] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewFavicon, setPreviewFavicon] = useState(null);
    const [previewBanner, setPreviewBanner] = useState(null);
    const [previewAboutImage, setPreviewAboutImage] = useState(null);

    const [activeTab, setActiveTab] = useState('general');
    const [license, setLicense] = useState(null);
    const [quota, setQuota] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/academy/settings', {
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setError(null);
                setSettings({
                    name: data.name || '',
                    slug: data.slug || '',
                    description: data.description || '',
                    about: data.about || '',
                    footer_about: data.footer_about || '',
                    support_email: data.support_email || '',
                    support_phone: data.support_phone || '',
                    facebook_url: data.facebook_url || '',
                    instagram_url: data.instagram_url || '',
                    linkedin_url: data.linkedin_url || '',
                    twitter_url: data.twitter_url || '',
                    youtube_url: data.youtube_url || '',
                    experience_years: data.experience_years || '10+',
                    experience_label: data.experience_label || "Années d'expérience",
                    hero_slide2_title: data.hero_slide2_title || '',
                    hero_slide2_subtitle: data.hero_slide2_subtitle || '',
                    hero_slide3_title: data.hero_slide3_title || '',
                    hero_slide3_subtitle: data.hero_slide3_subtitle || '',
                    feature1_title: data.feature1_title || '',
                    feature1_desc: data.feature1_desc || '',
                    feature2_title: data.feature2_title || '',
                    feature2_desc: data.feature2_desc || '',
                    feature3_title: data.feature3_title || '',
                    feature3_desc: data.feature3_desc || '',
                    stat_satisfaction_percent: data.stat_satisfaction_percent || '99'
                });
                setLicense(data.license);
                setQuota(data.quota);
                if (data.logo_url) setPreviewLogo(data.logo_url);
                if (data.favicon_url) setPreviewFavicon(data.favicon_url);
                if (data.banner_url) setPreviewBanner(data.banner_url);
                if (data.about_image) setPreviewAboutImage(data.about_image);
            } else if (response.status === 404) {
                setError('Aucune académie associée à votre compte. Créez une académie via le checkout pour accéder aux paramètres.');
            }
        } catch (err) {
            console.error(err);
            setError('Impossible de charger les paramètres.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    const handleQuillChange = (content) => {
        setSettings({
            ...settings,
            about: content
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (e.target.name === 'logo') {
                setLogo(file);
                setPreviewLogo(URL.createObjectURL(file));
            } else if (e.target.name === 'favicon') {
                setFavicon(file);
                setPreviewFavicon(URL.createObjectURL(file));
            } else if (e.target.name === 'banner') {
                setBanner(file);
                setPreviewBanner(URL.createObjectURL(file));
            } else if (e.target.name === 'about_image') {
                setAboutImage(file);
                setPreviewAboutImage(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        setError(null);

        const formData = new FormData();
        formData.append('name', settings.name);
        formData.append('description', settings.description || '');
        formData.append('about', settings.about || '');
        formData.append('footer_about', settings.footer_about || '');
        formData.append('support_email', settings.support_email || '');
        formData.append('support_phone', settings.support_phone || '');
        formData.append('facebook_url', settings.facebook_url || '');
        formData.append('instagram_url', settings.instagram_url || '');
        formData.append('linkedin_url', settings.linkedin_url || '');
        formData.append('twitter_url', settings.twitter_url || '');
        formData.append('youtube_url', settings.youtube_url || '');
        formData.append('experience_years', settings.experience_years || '');
        formData.append('experience_label', settings.experience_label || '');
        formData.append('hero_slide2_title', settings.hero_slide2_title || '');
        formData.append('hero_slide2_subtitle', settings.hero_slide2_subtitle || '');
        formData.append('hero_slide3_title', settings.hero_slide3_title || '');
        formData.append('hero_slide3_subtitle', settings.hero_slide3_subtitle || '');
        formData.append('feature1_title', settings.feature1_title || '');
        formData.append('feature1_desc', settings.feature1_desc || '');
        formData.append('feature2_title', settings.feature2_title || '');
        formData.append('feature2_desc', settings.feature2_desc || '');
        formData.append('feature3_title', settings.feature3_title || '');
        formData.append('feature3_desc', settings.feature3_desc || '');
        formData.append('stat_satisfaction_percent', settings.stat_satisfaction_percent || '');
        formData.append('_method', 'PUT');

        if (logo) formData.append('logo', logo);
        if (favicon) formData.append('favicon', favicon);
        if (banner) formData.append('banner', banner);
        if (aboutImage) formData.append('about_image', aboutImage);

        try {
            const response = await fetch('/api/academy/settings', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès !' });
                if (data.academy && data.academy.logo_url) setPreviewLogo(data.academy.logo_url);
                if (data.academy && data.academy.favicon_url) setPreviewFavicon(data.academy.favicon_url);
                if (data.academy && data.academy.banner_url) setPreviewBanner(data.academy.banner_url);
                if (data.academy && data.academy.about_image) setPreviewAboutImage(data.academy.about_image);
            } else {
                setError(data.message || 'Une erreur est survenue.');
            }
        } catch (err) {
            setError('Erreur de connexion.');
        } finally {
            setSaving(false);
        }
    };

    const renderQuotaBar = (used, limit, label) => {
        const percent = limit ? Math.min(100, (used / limit) * 100) : 0;
        const isUnlimited = !limit;
        const color = percent > 90 ? 'bg-danger' : percent > 70 ? 'bg-warning' : 'bg-success';

        return (
            <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                    <span className="font-weight-bold text-dark">{label}</span>
                    <span className="text-muted">
                        {used} / {isUnlimited ? '∞' : limit}
                    </span>
                </div>
                <div className="progress" style={{ height: '8px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}>
                    <div
                        className={`progress-bar ${color}`}
                        role="progressbar"
                        style={{ width: `${isUnlimited ? (used > 0 ? 10 : 0) : percent}%`, borderRadius: '4px' }}
                    ></div>
                </div>
                {isUnlimited && <small className="text-muted mt-1 d-block text-right">Illimité</small>}
            </div>
        );
    };

    if (loading) return (
        <div className="text-center p-5">
            <i className="fa fa-circle-o-notch fa-spin fa-3x" style={{ color: 'var(--cbx-navy)' }}></i>
            <p className="mt-3 text-muted">Chargement de vos paramètres...</p>
        </div>
    );

    if (error && !settings.slug) {
        return (
            <div className="fade-in">
                <div className="alert alert-warning d-flex align-items-center" style={{ borderRadius: 12, border: '1px solid var(--cbx-amber)', background: 'var(--cbx-amber-soft)' }}>
                    <i className="fa fa-exclamation-triangle fa-2x mr-3" style={{ color: 'var(--cbx-amber)' }}></i>
                    <div>
                        <strong>Académie non trouvée</strong>
                        <p className="mb-0 mt-1">{error}</p>
                        <a href="/#cbx-pricing" className="btn btn-sm btn-outline-dark mt-3" style={{ borderColor: 'var(--cbx-amber)', color: 'var(--cbx-navy)' }}>Créer une académie</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 dashboard-header">
                <div>
                    <h2 className="page-title">Paramètres de l'Académie ⚙️</h2>
                    <p className="page-subtitle">Gérez l'apparence, les informations et votre licence.</p>
                </div>
                <a href={`/academy/${settings.slug}`} target="_blank" rel="noreferrer" className="btn-modern btn-outline-modern">
                    <i className="fa fa-external-link mr-2"></i> Voir ma page publique
                </a>
            </div>

            {/* Navigation par Onglets */}
            <div className="d-flex mb-4" style={{ gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveTab('general')}
                    className={`btn btn-sm ${activeTab === 'general' ? 'btn-primary shadow-sm' : 'btn-light'}`}
                    style={activeTab === 'general' ? { background: 'var(--cbx-navy)', border: 'none' } : {}}
                >
                    <i className="fa fa-info-circle mr-2"></i> Général
                </button>
                <button
                    onClick={() => setActiveTab('appearance')}
                    className={`btn btn-sm ${activeTab === 'appearance' ? 'btn-primary shadow-sm' : 'btn-light'}`}
                    style={activeTab === 'appearance' ? { background: 'var(--cbx-navy)', border: 'none' } : {}}
                >
                    <i className="fa fa-paint-brush mr-2"></i> Design & Landing
                </button>
                <button
                    onClick={() => setActiveTab('license')}
                    className={`btn btn-sm ${activeTab === 'license' ? 'btn-primary shadow-sm' : 'btn-light'}`}
                    style={activeTab === 'license' ? { background: 'var(--cbx-navy)', border: 'none' } : {}}
                >
                    <i className="fa fa-id-card mr-2"></i> Licence & Capacité
                </button>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card-modern shadow-soft border-0 mb-4">
                        <div className="card-body-modern p-4">
                            {message && (
                                <div className={`alert alert-${message.type} d-flex align-items-center mb-4`} role="alert">
                                    <i className={`fa ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                                    <div>{message.text}</div>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                    <i className="fa fa-exclamation-triangle mr-2"></i>
                                    <div>{error}</div>
                                </div>
                            )}

                            {activeTab === 'general' && (
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <h5 className="mb-4 text-dark font-weight-bold">Informations de base</h5>

                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-modern font-weight-bold">Logo</label>
                                                <div className="d-flex align-items-center">
                                                    <div className="mr-3 p-1 border rounded bg-light" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                        {previewLogo ? (
                                                            <img src={previewLogo} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                                        ) : (
                                                            <i className="fa fa-image fa-2x text-muted"></i>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <input type="file" name="logo" onChange={handleFileChange} className="form-control-modern" accept="image/*" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-modern font-weight-bold">Favicon</label>
                                                <div className="d-flex align-items-center">
                                                    <div className="mr-3 p-1 border rounded bg-light" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                        {previewFavicon ? (
                                                            <img src={previewFavicon} alt="Favicon Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                                        ) : (
                                                            <i className="fa fa-star text-muted"></i>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <input type="file" name="favicon" onChange={handleFileChange} className="form-control-modern" accept="image/*" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="form-label-modern font-weight-bold">Nom de l'Académie</label>
                                        <input type="text" name="name" className="form-control-modern form-control-lg" value={settings.name} onChange={handleChange} required />
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="form-label-modern font-weight-bold">Description Courte</label>
                                        <textarea name="description" className="form-control-modern" rows="2" value={settings.description} onChange={handleChange} placeholder="Une phrase accrocheuse..."></textarea>
                                    </div>

                                    <h5 className="mt-5 mb-4 text-dark font-weight-bold">Contact & Support</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="small font-weight-bold">Email de Support</label>
                                                <input type="email" name="support_email" className="form-control-modern" value={settings.support_email} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="small font-weight-bold">Téléphone</label>
                                                <input type="text" name="support_phone" className="form-control-modern" value={settings.support_phone} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <h5 className="mt-5 mb-4 text-dark font-weight-bold">Réseaux Sociaux</h5>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold">Facebook URL</label>
                                        <input type="url" name="facebook_url" className="form-control-modern" value={settings.facebook_url} onChange={handleChange} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold">Instagram URL</label>
                                        <input type="url" name="instagram_url" className="form-control-modern" value={settings.instagram_url} onChange={handleChange} />
                                    </div>

                                    <div className="mt-5 d-flex justify-content-end">
                                        <button type="submit" className="btn-modern btn-primary-modern px-5 py-2 shadow-sm" disabled={saving}>
                                            {saving ? <><i className="fa fa-spinner fa-spin mr-2"></i> Enregistrement...</> : <><i className="fa fa-save mr-2"></i> Enregistrer les modifications</>}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'appearance' && (
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <h5 className="mb-4 text-dark font-weight-bold">Design de la Landing Page</h5>

                                    <div className="form-group mb-4">
                                        <label className="form-label-modern font-weight-bold">Bannière (Hero Section)</label>
                                        <div className="d-block mb-2 border rounded bg-light" style={{ height: '100px', backgroundImage: `url(${previewBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                            {!previewBanner && <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted"><i className="fa fa-image"></i></div>}
                                        </div>
                                        <input type="file" name="banner" onChange={handleFileChange} className="form-control-modern" accept="image/*" />
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="form-label-modern font-weight-bold">Contenu "À Propos"</label>
                                        <div className="bg-white">
                                            <ReactQuill theme="snow" value={settings.about} onChange={handleQuillChange} />
                                        </div>
                                    </div>

                                    <h5 className="mt-5 mb-4 text-dark font-weight-bold">Slider Hero & Caractéristiques</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="small font-weight-bold">Titre Slide 2</label>
                                                <input type="text" name="hero_slide2_title" className="form-control-modern" value={settings.hero_slide2_title} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="small font-weight-bold">Titre Slide 3</label>
                                                <input type="text" name="hero_slide3_title" className="form-control-modern" value={settings.hero_slide3_title} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 d-flex justify-content-end">
                                        <button type="submit" className="btn-modern btn-primary-modern px-5 py-2 shadow-sm" disabled={saving}>
                                            <i className="fa fa-save mr-2"></i> Enregistrer le Design
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'license' && (
                                <div className="p-2">
                                    <div className="d-flex align-items-center mb-5 p-4 rounded-xl shadow-sm" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white', borderRadius: '15px' }}>
                                        <div className="mr-4 p-3 bg-white bg-opacity-10 rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                            <i className="fa fa-rocket fa-3x" style={{ color: 'var(--cbx-amber)' }}></i>
                                        </div>
                                        <div>
                                            <span className="badge badge-warning mb-2" style={{ background: 'var(--cbx-amber)', color: '#0f172a' }}>
                                                {quota ? quota.plan_name : 'Forfait inconnu'}
                                            </span>
                                            <h3 className="mb-0 font-weight-bold">Abonnement Actif</h3>
                                            <p className="mb-0 opacity-75 mt-1">
                                                {license ? `Expire le : ${new Date(license.expires_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Pas de licence active'}
                                            </p>
                                        </div>
                                    </div>

                                    <h5 className="mb-4 text-dark font-weight-bold"><i className="fa fa-chart-pie mr-2 text-primary"></i> Utilisation des Ressources</h5>

                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <div className="p-4 border rounded bg-light h-100 shadow-sm">
                                                {quota && renderQuotaBar(quota.courses_used, quota.courses_limit, "Cours Créés")}
                                                <p className="small text-muted mb-0">
                                                    Le nombre de cours que vous avez créés dans votre académie.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <div className="p-4 border rounded bg-light h-100 shadow-sm">
                                                {quota && renderQuotaBar(quota.students_used, quota.students_limit, "Étudiants Inscrits")}
                                                <p className="small text-muted mb-0">
                                                    Le nombre d'utilisateurs inscrits à vos cours.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 alert alert-info border-0 p-4 shadow-sm" style={{ borderRadius: '12px', background: '#f0f9ff' }}>
                                        <div className="d-flex">
                                            <i className="fa fa-question-circle fa-2x mr-4 text-info"></i>
                                            <div>
                                                <h6 className="font-weight-bold text-info">Besoin de plus de capacité ?</h6>
                                                <p className="mb-0 text-muted small">
                                                    Si vous approchez de vos limites, contactez-nous pour passer au forfait supérieur (Enterprise) ou pour personnaliser votre licence actuelle.
                                                </p>
                                                <a href="mailto:support@skills.nl" className="btn btn-sm btn-info mt-3 text-white px-4">Contacter le support</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card-modern text-white mb-4 border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--cbx-navy) 0%, var(--cbx-navy-light) 100%)', borderRadius: '15px' }}>
                        <div className="card-body-modern p-4">
                            <h5 className="font-weight-bold mb-3"><i className="fa fa-rocket mr-2" style={{ color: 'var(--cbx-amber)' }}></i> Conseil Pro</h5>
                            <p className="mb-0" style={{ fontSize: '15px', opacity: 0.95, lineHeight: 1.6 }}>
                                Une description claire et engageante augmente vos chances de conversion de 40%. N'hésitez pas à mettre en avant votre expertise unique !
                            </p>
                        </div>
                    </div>

                    <div className="card-modern border-0 shadow-soft" style={{ borderRadius: '15px' }}>
                        <div className="card-body-modern p-4">
                            <h6 className="font-weight-bold mb-3 text-dark">Aperçu rapide</h6>
                            <div className="p-3 bg-light rounded border">
                                {previewBanner && (
                                    <div className="mb-2 rounded" style={{ height: '60px', backgroundImage: `url(${previewBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                )}
                                <div className="d-flex align-items-center mb-2">
                                    {previewLogo && <img src={previewLogo} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} alt="logo" />}
                                    <h6 className="mb-0 text-primary">{settings.name || 'Nom Académie'}</h6>
                                </div>
                                <p className="mb-0 small text-dark">{settings.description || 'Description courte...'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademySettings;
