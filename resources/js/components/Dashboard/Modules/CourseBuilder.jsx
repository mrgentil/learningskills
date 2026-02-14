import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CourseBuilder = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('infos');
    const [course, setCourse] = useState({
        title: '',
        price: '',
        description: '',
        short_description: '',
        thumbnail: null,
        is_published: false,
        modules: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState(null);

    // Module/Lesson State
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [editingModule, setEditingModule] = useState(null); // module id being edited

    // Lesson Modal/Editor State
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [isEditingLesson, setIsEditingLesson] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [lessonForm, setLessonForm] = useState({ title: '', type: 'video', video_url: '', content: '' });

    useEffect(() => {
        if (courseId !== 'new') {
            fetchCourse();
        } else {
            setLoading(false);
        }
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/academy/courses/${courseId}`);
            if (res.ok) {
                const data = await res.json();
                setCourse(data);
                if (data.thumbnail) setPreviewThumbnail(data.thumbnail);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleQuillChange = (content) => {
        setCourse({ ...course, description: content });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourse({ ...course, thumbnail: file });
            setPreviewThumbnail(URL.createObjectURL(file));
        }
    };

    const saveCourse = async (e) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData();
        formData.append('title', course.title);
        formData.append('price', course.price);
        formData.append('description', course.description || '');
        formData.append('short_description', course.short_description || '');
        formData.append('is_published', course.is_published ? '1' : '0');
        if (course.thumbnail instanceof File) {
            formData.append('thumbnail', course.thumbnail);
        }

        // Handle Create or Update
        const url = courseId === 'new' ? '/api/academy/courses' : `/api/academy/courses/${courseId}`;
        const method = courseId === 'new' ? 'POST' : 'POST'; // Use POST for both, but for update add _method=PUT

        if (courseId !== 'new') {
            formData.append('_method', 'PUT');
        }

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                if (courseId === 'new') {
                    navigate(`/dashboard/courses/${data.course.id}/builder`);
                } else {
                    setCourse({ ...course, ...data.course }); // Update state with saved data
                    alert('Cours sauvegardé !');
                }
            } else {
                alert(data.message || 'Erreur lors de la sauvegarde');
            }
        } catch (err) {
            console.error(err);
            alert('Erreur réseau');
        } finally {
            setSaving(false);
        }
    };

    // --- Module Management ---

    const addModule = async () => {
        if (!newModuleTitle.trim()) return;
        try {
            const res = await fetch(`/api/academy/courses/${courseId}/modules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ title: newModuleTitle })
            });
            if (res.ok) {
                setNewModuleTitle('');
                fetchCourse(); // Refresh curriculum
            } else {
                const errData = await res.json();
                alert("Erreur lors de la création du module: " + (errData.message || res.statusText));
            }
        } catch (err) {
            console.error(err);
            alert("Une erreur réseau est survenue.");
        }
    };

    const deleteModule = async (moduleId) => {
        if (!confirm('Supprimer ce module et ses leçons ?')) return;
        try {
            await fetch(`/api/academy/modules/${moduleId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            fetchCourse();
        } catch (err) { console.error(err); }
    };

    // --- Lesson Management ---

    const openLessonModal = (moduleId, lesson = null) => {
        setCurrentModuleId(moduleId);
        if (lesson) {
            setIsEditingLesson(true);
            setCurrentLessonId(lesson.id);
            setLessonForm({
                title: lesson.title,
                type: lesson.type,
                video_url: lesson.video_url || '',
                content: lesson.content || ''
            });
        } else {
            setIsEditingLesson(false);
            setLessonForm({ title: '', type: 'video', video_url: '', content: '' });
        }
        setShowLessonModal(true);
    };

    const handleLessonSave = async () => {
        if (!lessonForm.title) return;

        const url = isEditingLesson
            ? `/api/academy/lessons/${currentLessonId}`
            : `/api/academy/modules/${currentModuleId}/lessons`;

        const method = isEditingLesson ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(lessonForm)
            });
            if (res.ok) {
                setShowLessonModal(false);
                fetchCourse();
            } else {
                const errData = await res.json();
                alert("Erreur lors de la sauvegarde de la leçon: " + (errData.message || res.statusText));
            }
        } catch (err) {
            console.error(err);
            alert("Une erreur réseau est survenue.");
        }
    };

    const deleteLesson = async (lessonId) => {
        if (!confirm('Supprimer cette leçon ?')) return;
        try {
            await fetch(`/api/academy/lessons/${lessonId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            fetchCourse();
        } catch (err) { console.error(err); }
    }


    if (loading) return <div className="text-center p-5"><i className="fa fa-spin fa-spinner fa-2x"></i></div>;

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 dashboard-header">
                <div>
                    <h2 className="page-title">{courseId === 'new' ? 'Créer un nouveau cours' : `Édition : ${course.title}`}</h2>
                    <p className="page-subtitle">Configurez le contenu et les paramètres de votre cours.</p>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={() => navigate('/dashboard/my-courses')} className="btn-modern btn-outline-modern">
                        <i className="fa fa-arrow-left mr-2"></i> Retour
                    </button>
                    <button onClick={saveCourse} className="btn-modern btn-primary-modern" disabled={saving}>
                        {saving ? <i className="fa fa-spin fa-spinner mr-2"></i> : <i className="fa fa-save mr-2"></i>}
                        {courseId === 'new' ? 'Créer le cours' : 'Sauvegarder'}
                    </button>
                </div>
            </div>

            <div className="card-modern shadow-soft border-0">
                <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                    <ul className="nav nav-pills custom-pills" id="courseTabs" role="tablist">
                        <li className="nav-item">
                            <button className={`nav-link btn-modern-lg mr-3 ${activeTab === 'infos' ? 'active-premium' : 'inactive-premium'}`} onClick={() => setActiveTab('infos')}>
                                <i className="fa fa-info-circle fa-lg mr-2"></i>
                                <span>Configuration Générale</span>
                            </button>
                        </li>
                        {courseId !== 'new' && (
                            <li className="nav-item">
                                <button className={`nav-link btn-modern-lg ${activeTab === 'curriculum' ? 'active-premium' : 'inactive-premium'}`} onClick={() => setActiveTab('curriculum')}>
                                    <i className="fa fa-layer-group fa-lg mr-2"></i>
                                    <span>Programme du Cours</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="card-body-modern p-4">
                    {activeTab === 'infos' && (
                        <div className="row">
                            <div className="col-md-8">
                                <div className="form-group mb-4">
                                    <label className="form-label-modern">Titre du cours</label>
                                    <input type="text" name="title" className="form-control-modern form-control-lg" value={course.title} onChange={handleChange} placeholder="Ex: Maîtriser React de A à Z" required />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label-modern">Description courte</label>
                                    <textarea name="short_description" className="form-control-modern" rows="2" value={course.short_description} onChange={handleChange} placeholder="Résumé accrocheur pour la carte du cours..."></textarea>
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label-modern">Description détaillée</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={course.description}
                                        onChange={handleQuillChange}
                                        className="bg-white"
                                        style={{ height: '300px', marginBottom: '50px' }}
                                        placeholder="Tout ce que les étudiants vont apprendre..."
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
                            </div>
                            <div className="col-md-4">
                                <div className="form-group mb-4">
                                    <label className="form-label-modern">Prix ($)</label>
                                    <input type="number" name="price" className="form-control-modern" value={course.price} onChange={handleChange} placeholder="0.00" />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label-modern">Image de couverture</label>
                                    <div className="mb-2 p-1 border rounded bg-light" style={{ height: '150px', backgroundImage: `url(${previewThumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                        {!previewThumbnail && <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted"><i className="fa fa-image fa-2x"></i></div>}
                                    </div>
                                    <input type="file" onChange={handleFileChange} className="form-control-modern" accept="image/*" />
                                </div>
                                <div className="form-check form-switch custom-switch p-0 mt-4 d-flex align-items-center">
                                    <input className="form-check-input ms-0 me-3" type="checkbox" id="publishedSwitch" checked={course.is_published} onChange={(e) => setCourse({ ...course, is_published: e.target.checked })} style={{ width: '40px', height: '20px' }} />
                                    <label className="form-check-label font-weight-bold" htmlFor="publishedSwitch">Publier ce cours</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'curriculum' && (
                        <div>
                            <div className="mb-4 d-flex">
                                <input
                                    type="text"
                                    className="form-control-modern mr-2"
                                    placeholder="Nouveau module (ex: Introduction)"
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addModule()}
                                />
                                <button className="btn-modern btn-primary-modern" onClick={addModule} disabled={!newModuleTitle}>
                                    <i className="fa fa-plus mr-2"></i> Ajouter Module
                                </button>
                            </div>

                            {(!course.modules || course.modules.length === 0) && (
                                <div className="text-center py-5 border rounded bg-white shadow-sm mb-4" style={{ borderStyle: 'dashed !important', borderWidth: '2px !important' }}>
                                    <div className="text-muted mb-3"><i className="fa fa-layer-group fa-3x"></i></div>
                                    <h4 className="font-weight-bold">Votre programme est vide</h4>
                                    <p className="text-muted">Écrivez un titre ci-dessus (ex: "Introduction") et cliquez sur <b>Ajouter Module</b> pour commencer à créer vos leçons.</p>
                                    <div className="mt-3">
                                        <i className="fa fa-long-arrow-up fa-2x text-primary anim-bounce-y"></i>
                                    </div>
                                </div>
                            )}

                            <div className="accordion" id="curriculumAccordion">
                                {course.modules && course.modules.map((module, index) => (
                                    <div className="card-module-builder mb-4" key={module.id}>
                                        <div className="card-module-header d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="module-number mr-3">{index + 1}</div>
                                                <h5 className="mb-0 font-weight-bold">{module.title}</h5>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteModule(module.id)} title="Supprimer le module">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                                <button className="btn btn-sm btn-primary-modern px-3" onClick={() => openLessonModal(module.id)}>
                                                    <i className="fa fa-plus mr-1"></i> Leçon
                                                </button>
                                            </div>
                                        </div>
                                        <div className="list-group list-group-flush">
                                            {module.lessons && module.lessons.map((lesson, lIndex) => (
                                                <div key={lesson.id} className="list-group-item d-flex justify-content-between align-items-center lesson-row-builder">
                                                    <div className="d-flex align-items-center">
                                                        <div className="lesson-icon-indicator mr-3">
                                                            <i className={`fa ${lesson.type === 'video' ? 'fa-play-circle text-danger' : 'fa-align-left text-info'}`}></i>
                                                        </div>
                                                        <div>
                                                            <span className="font-weight-bold d-block">{lesson.title}</span>
                                                            <span className="small text-muted text-uppercase">{lesson.type}</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-light border" onClick={() => openLessonModal(module.id, lesson)} title="Modifier le contenu">
                                                            <i className="fa fa-pencil mr-1"></i> Modifier
                                                        </button>
                                                        <button className="btn btn-sm btn-light text-danger border" onClick={() => deleteLesson(lesson.id)} title="Supprimer la leçon">
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!module.lessons || module.lessons.length === 0) && (
                                                <div className="p-4 text-center text-muted">
                                                    <p className="mb-0 small italic">Aucune leçon dans ce module. Cliquez sur "+ Leçon" pour commencer.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Simple Lesson Modal */}
            {showLessonModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="modal-header bg-dark text-white p-4 border-0">
                                <h5 className="modal-title font-weight-bold">
                                    {isEditingLesson ? 'Modifier la leçon' : 'Nouvelle leçon'}
                                </h5>
                                <button type="button" className="close text-white" onClick={() => setShowLessonModal(false)}><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div className="modal-body p-4 bg-light">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="form-group mb-4">
                                            <label className="form-label-modern">Titre de la leçon</label>
                                            <input
                                                type="text"
                                                className="form-control-modern border-2"
                                                value={lessonForm.title}
                                                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                                placeholder="Ex: Les bases de l'algorithme"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="form-group mb-4">
                                            <label className="form-label-modern">Type de contenu</label>
                                            <div className="d-flex gap-3">
                                                {['video', 'text', 'quiz'].map(t => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        className={`btn flex-grow-1 p-3 border-2 d-flex flex-column align-items-center gap-2 ${lessonForm.type === t ? 'btn-primary-modern border-primary' : 'btn-outline-modern bg-white'}`}
                                                        onClick={() => setLessonForm({ ...lessonForm, type: t })}
                                                    >
                                                        <i className={`fa ${t === 'video' ? 'fa-play-circle' : t === 'text' ? 'fa-file-text' : 'fa-question-circle'} fa-lg`}></i>
                                                        <span className="text-capitalize font-weight-bold">{t}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="alert alert-info border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                                            <h6 className="font-weight-bold mb-2"><i className="fa fa-lightbulb-o mr-2"></i>Conseil</h6>
                                            <p className="small mb-0">Un bon titre doit être court et prometteur. Les leçons vidéos sont les plus appréciées !</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {lessonForm.type === 'video' && (
                                    <div className="form-group mb-4">
                                        <label className="form-label-modern">URL de la Vidéo (YouTube, Vimeo, ou MP4)</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-white border-2 border-right-0"><i className="fa fa-video-camera text-danger"></i></span>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control-modern border-2"
                                                value={lessonForm.video_url}
                                                onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                        </div>
                                        <small className="text-muted mt-2 d-block">Collez simplement l'URL de votre vidéo.</small>
                                    </div>
                                )}

                                {lessonForm.type === 'text' && (
                                    <div className="form-group mb-4">
                                        <label className="form-label-modern">Contenu de la leçon (Article)</label>
                                        <ReactQuill
                                            theme="snow"
                                            value={lessonForm.content}
                                            onChange={(val) => setLessonForm({ ...lessonForm, content: val })}
                                            className="bg-white border-2"
                                            style={{ height: '250px', marginBottom: '50px' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer bg-white p-4 border-0">
                                <button type="button" className="btn-modern btn-outline-modern px-5" onClick={() => setShowLessonModal(false)}>Annuler</button>
                                <button type="button" className="btn-modern btn-primary-modern px-5" onClick={handleLessonSave}>
                                    <i className="fa fa-check mr-2"></i> Sauvegarder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseBuilder;
