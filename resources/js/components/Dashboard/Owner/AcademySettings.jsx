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
                if (data.logo_url) setPreviewLogo(data.logo_url);
                if (data.favicon_url) setPreviewFavicon(data.favicon_url);
                if (data.banner_url) setPreviewBanner(data.banner_url);
                if (data.about_image) setPreviewAboutImage(data.about_image);
            }
        } catch (err) {
            console.error(err);
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

    if (loading) return (
        <div className="text-center p-5">
            <i className="fa fa-circle-o-notch fa-spin fa-3x text-primary"></i>
            <p className="mt-3 text-muted">Chargement de vos paramètres...</p>
        </div>
    );

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 dashboard-header">
                <div>
                    <h2 className="page-title">Paramètres de l'Académie ⚙️</h2>
                    <p className="page-subtitle">Personnalisez l'apparence et les informations de votre académie.</p>
                </div>
                <a href={`/academy/${settings.slug}`} target="_blank" rel="noreferrer" className="btn-modern btn-outline-modern">
                    <i className="fa fa-external-link mr-2"></i> Voir ma page publique
                </a>
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

                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label-modern font-weight-bold">Logo de l'Académie</label>
                                            <div className="d-flex align-items-center">
                                                <div className="mr-3 p-1 border rounded bg-light" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                    {previewLogo ? (
                                                        <img src={previewLogo} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                                    ) : (
                                                        <i className="fa fa-image fa-2x text-muted"></i>
                                                    )}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <input
                                                        type="file"
                                                        name="logo"
                                                        onChange={handleFileChange}
                                                        className="form-control-modern"
                                                        accept="image/*"
                                                    />
                                                    <small className="text-muted d-block">JPG, PNG. Max 2MB.</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label-modern font-weight-bold">Favicon (Icône Onglet)</label>
                                            <div className="d-flex align-items-center">
                                                <div className="mr-3 p-1 border rounded bg-light" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                    {previewFavicon ? (
                                                        <img src={previewFavicon} alt="Favicon Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                                    ) : (
                                                        <i className="fa fa-star text-muted"></i>
                                                    )}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <input
                                                        type="file"
                                                        name="favicon"
                                                        onChange={handleFileChange}
                                                        className="form-control-modern"
                                                        accept="image/*"
                                                    />
                                                    <small className="text-muted d-block">Carré 32x32px recommandé. PNG/ICO.</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-label-modern font-weight-bold">Bannière (Couverture)</label>
                                            <div className="d-block mb-2 border rounded bg-light" style={{ height: '80px', backgroundImage: `url(${previewBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                                {!previewBanner && <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted"><i className="fa fa-image"></i></div>}
                                            </div>
                                            <input
                                                type="file"
                                                name="banner"
                                                onChange={handleFileChange}
                                                className="form-control-modern"
                                                accept="image/*"
                                            />
                                            <small className="text-muted">1200x400px recommandé. Max 4MB.</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold">Nom de l'Académie</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control-modern form-control-lg"
                                        value={settings.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: Académie du Code"
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold">Slogan / Description Courte</label>
                                    <textarea
                                        name="description"
                                        className="form-control-modern"
                                        rows="2"
                                        value={settings.description}
                                        onChange={handleChange}
                                        placeholder="Une phrase accrocheuse pour décrire votre académie..."
                                    ></textarea>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold">À Propos (Page /about)</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={settings.about}
                                        onChange={handleQuillChange}
                                        className="bg-white"
                                        placeholder="Racontez votre histoire, votre mission..."
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'clean']
                                            ],
                                        }}
                                    />
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label-modern font-weight-bold">Badge Expérience (Chiffre)</label>
                                            <input
                                                type="text"
                                                name="experience_years"
                                                className="form-control-modern"
                                                value={settings.experience_years}
                                                onChange={handleChange}
                                                placeholder="Ex: 10+"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="form-group">
                                            <label className="form-label-modern font-weight-bold">Label Expérience</label>
                                            <input
                                                type="text"
                                                name="experience_label"
                                                className="form-control-modern"
                                                value={settings.experience_label}
                                                onChange={handleChange}
                                                placeholder="Ex: Années d'expérience"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold">Image "À Propos" (Illustration)</label>
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="mr-3 p-1 border rounded bg-light" style={{ width: '120px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {previewAboutImage ? (
                                                <img src={previewAboutImage} alt="About Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <i className="fa fa-image fa-2x text-muted"></i>
                                            )}
                                        </div>
                                        <div className="flex-grow-1">
                                            <input
                                                type="file"
                                                name="about_image"
                                                onChange={handleFileChange}
                                                className="form-control-modern"
                                                accept="image/*"
                                            />
                                            <small className="text-muted">Image qui illustre votre section "À propos". Max 4MB.</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold">Texte de Pied de Page (Mission)</label>
                                    <textarea
                                        name="footer_about"
                                        className="form-control-modern"
                                        rows="3"
                                        value={settings.footer_about}
                                        onChange={handleChange}
                                        placeholder="Ex: Notre mission est de rendre l'éducation accessible à tous..."
                                    ></textarea>
                                </div>

                                <hr className="my-5" />
                                <h4 className="mb-4 text-warning"><i className="fa fa-magic mr-2"></i> Personnalisation Bannière (Slider Hero)</h4>

                                <div className="card bg-light border-0 mb-4 shadow-sm">
                                    <div className="card-body p-4">
                                        <h6 className="font-weight-bold mb-3 d-flex align-items-center">
                                            <span className="badge badge-warning mr-2">2</span> Slide 2: Formations / Catalogue
                                        </h6>
                                        <div className="form-group mb-3">
                                            <label className="small font-weight-bold">Titre Slide 2</label>
                                            <input type="text" name="hero_slide2_title" className="form-control-modern" value={settings.hero_slide2_title} onChange={handleChange} placeholder="Ex: Boostez Votre Carrière" />
                                        </div>
                                        <div className="form-group">
                                            <label className="small font-weight-bold">Sous-titre Slide 2</label>
                                            <textarea name="hero_slide2_subtitle" className="form-control-modern" rows="2" value={settings.hero_slide2_subtitle} onChange={handleChange} placeholder="Accédez à plus de formations spécialisées..."></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-light border-0 mb-4 shadow-sm">
                                    <div className="card-body p-4">
                                        <h6 className="font-weight-bold mb-3 d-flex align-items-center">
                                            <span className="badge badge-warning mr-2">3</span> Slide 3: Certification / Confiance
                                        </h6>
                                        <div className="form-group mb-3">
                                            <label className="small font-weight-bold">Titre Slide 3</label>
                                            <input type="text" name="hero_slide3_title" className="form-control-modern" value={settings.hero_slide3_title} onChange={handleChange} placeholder="Ex: Validé & Certifié" />
                                        </div>
                                        <div className="form-group">
                                            <label className="small font-weight-bold">Sous-titre Slide 3</label>
                                            <textarea name="hero_slide3_subtitle" className="form-control-modern" rows="2" value={settings.hero_slide3_subtitle} onChange={handleChange} placeholder="Tous nos diplômes sont reconnus..."></textarea>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-5" />
                                <h4 className="mb-4 text-info"><i className="fa fa-th-list mr-2"></i> Section Caractéristiques (3 Badges)</h4>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="card border-0 bg-light p-3 h-100">
                                            <div className="form-group mb-3">
                                                <label className="small font-weight-bold">Badge 1: Titre</label>
                                                <input type="text" name="feature1_title" className="form-control-modern" value={settings.feature1_title} onChange={handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="small font-weight-bold">Badge 1: Description</label>
                                                <textarea name="feature1_desc" className="form-control-modern" rows="3" value={settings.feature1_desc} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card border-0 bg-light p-3 h-100">
                                            <div className="form-group mb-3">
                                                <label className="small font-weight-bold">Badge 2: Titre</label>
                                                <input type="text" name="feature2_title" className="form-control-modern" value={settings.feature2_title} onChange={handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="small font-weight-bold">Badge 2: Description</label>
                                                <textarea name="feature2_desc" className="form-control-modern" rows="3" value={settings.feature2_desc} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card border-0 bg-light p-3 h-100">
                                            <div className="form-group mb-3">
                                                <label className="small font-weight-bold">Badge 3: Titre</label>
                                                <input type="text" name="feature3_title" className="form-control-modern" value={settings.feature3_title} onChange={handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="small font-weight-bold">Badge 3: Description</label>
                                                <textarea name="feature3_desc" className="form-control-modern" rows="3" value={settings.feature3_desc} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-5" />
                                <h4 className="mb-4 text-success"><i className="fa fa-chart-bar mr-2"></i> Statistiques & Chiffres</h4>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label-modern font-weight-bold">Taux de Satisfaction %</label>
                                            <input type="number" name="stat_satisfaction_percent" className="form-control-modern" value={settings.stat_satisfaction_percent} onChange={handleChange} max="100" />
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-5" />
                                <h4 className="mb-4"><i className="fa fa-envelope-open-text mr-2 text-primary"></i> Contact & Support</h4>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label-modern font-weight-bold">Email de Support</label>
                                            <input
                                                type="email"
                                                name="support_email"
                                                className="form-control-modern"
                                                value={settings.support_email}
                                                onChange={handleChange}
                                                placeholder="Ex: support@votreacademie.nl"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label-modern font-weight-bold">Téléphone de Support</label>
                                            <input
                                                type="text"
                                                name="support_phone"
                                                className="form-control-modern"
                                                value={settings.support_phone}
                                                onChange={handleChange}
                                                placeholder="Ex: +1 234 567 890"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-5" />
                                <h4 className="mb-4"><i className="fa fa-share-alt mr-2 text-primary"></i> Réseaux Sociaux</h4>

                                <div className="form-group mb-3">
                                    <label className="form-label-modern font-weight-bold">Facebook URL</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0"><i className="fab fa-facebook text-primary"></i></span>
                                        <input
                                            type="url"
                                            name="facebook_url"
                                            className="form-control form-control-lg border-start-0 ps-0"
                                            value={settings.facebook_url}
                                            onChange={handleChange}
                                            placeholder="https://facebook.com/votre-page"
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label-modern font-weight-bold">Instagram URL</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0"><i className="fab fa-instagram text-danger"></i></span>
                                        <input
                                            type="url"
                                            name="instagram_url"
                                            className="form-control form-control-lg border-start-0 ps-0"
                                            value={settings.instagram_url}
                                            onChange={handleChange}
                                            placeholder="https://instagram.com/votre-compte"
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label-modern font-weight-bold">LinkedIn URL</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0"><i className="fab fa-linkedin text-info"></i></span>
                                        <input
                                            type="url"
                                            name="linkedin_url"
                                            className="form-control form-control-lg border-start-0 ps-0"
                                            value={settings.linkedin_url}
                                            onChange={handleChange}
                                            placeholder="https://linkedin.com/company/votre-entreprise"
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label-modern font-weight-bold">Twitter / X URL</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0"><i className="fab fa-twitter text-dark"></i></span>
                                        <input
                                            type="url"
                                            name="twitter_url"
                                            className="form-control form-control-lg border-start-0 ps-0"
                                            value={settings.twitter_url}
                                            onChange={handleChange}
                                            placeholder="https://twitter.com/votre-compte"
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label-modern font-weight-bold">YouTube URL</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0"><i className="fab fa-youtube text-danger"></i></span>
                                        <input
                                            type="url"
                                            name="youtube_url"
                                            className="form-control form-control-lg border-start-0 ps-0"
                                            value={settings.youtube_url}
                                            onChange={handleChange}
                                            placeholder="https://youtube.com/@votre-chaine"
                                        />
                                    </div>
                                </div>

                                <hr className="my-4 border-light" />

                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn-modern btn-primary-modern px-5 py-3 shadow-sm" disabled={saving}>
                                        {saving ? <><i className="fa fa-spinner fa-spin mr-2"></i> Enregistrement...</> : <><i className="fa fa-save mr-2"></i> Enregistrer les modifications</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card-modern bg-gradient-primary text-white mb-4 border-0 shadow-lg">
                        <div className="card-body-modern p-4">
                            <h5 className="font-weight-bold mb-3"><i className="fa fa-rocket mr-2"></i> Conseil Pro</h5>
                            <p className="mb-0" style={{ fontSize: '15px', opacity: 0.95, lineHeight: 1.6 }}>
                                Une description claire et engageante augmente vos chances de conversion. N'hésitez pas à mettre en avant votre expertise !
                            </p>
                        </div>
                    </div>

                    <div className="card-modern border-0 shadow-soft">
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
