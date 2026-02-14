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

    // Lesson Modal State (simplified for MVP)
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [lessonForm, setLessonForm] = useState({ title: '', type: 'video' });

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
            }
        } catch (err) {
            console.error(err);
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

    const openLessonModal = (moduleId) => {
        setCurrentModuleId(moduleId);
        setLessonForm({ title: '', type: 'video' });
        setShowLessonModal(true);
    };

    const addLesson = async () => {
        if (!lessonForm.title) return;
        try {
            const res = await fetch(`/api/academy/modules/${currentModuleId}/lessons`, {
                method: 'POST',
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
            }
        } catch (err) { console.error(err); }
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
                            <button className={`nav-link btn-modern mr-2 ${activeTab === 'infos' ? 'active btn-primary-modern' : 'btn-outline-modern'}`} onClick={() => setActiveTab('infos')}>
                                <i className="fa fa-info-circle mr-2"></i> Informations
                            </button>
                        </li>
                        {courseId !== 'new' && (
                            <li className="nav-item">
                                <button className={`nav-link btn-modern ${activeTab === 'curriculum' ? 'active btn-primary-modern' : 'btn-outline-modern'}`} onClick={() => setActiveTab('curriculum')}>
                                    <i className="fa fa-list-alt mr-2"></i> Programme (Curriculum)
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

                            <div className="accordion" id="curriculumAccordion">
                                {course.modules && course.modules.map((module, index) => (
                                    <div className="card border mb-3 shadow-sm" key={module.id} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        <div className="card-header bg-light d-flex justify-content-between align-items-center p-3">
                                            <h5 className="mb-0 font-weight-bold">
                                                <i className="fa fa-folder-open mr-2 text-primary"></i>
                                                Module {index + 1}: {module.title}
                                            </h5>
                                            <div>
                                                <button className="btn btn-sm btn-outline-danger mr-2" onClick={() => deleteModule(module.id)}><i className="fa fa-trash"></i></button>
                                                <button className="btn btn-sm btn-primary" onClick={() => openLessonModal(module.id)}><i className="fa fa-plus"></i> Leçon</button>
                                            </div>
                                        </div>
                                        <ul className="list-group list-group-flush">
                                            {module.lessons && module.lessons.map((lesson, lIndex) => (
                                                <li key={lesson.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                    <div>
                                                        <i className={`fa ${lesson.type === 'video' ? 'fa-play-circle text-danger' : 'fa-file-text text-info'} mr-3`}></i>
                                                        <span className="font-weight-500">{lIndex + 1}. {lesson.title}</span>
                                                    </div>
                                                    <div>
                                                        <button className="btn btn-sm btn-light mr-2"><i className="fa fa-pencil"></i></button>
                                                        <button className="btn btn-sm btn-light text-danger" onClick={() => deleteLesson(lesson.id)}><i className="fa fa-times"></i></button>
                                                    </div>
                                                </li>
                                            ))}
                                            {(!module.lessons || module.lessons.length === 0) && (
                                                <li className="list-group-item text-muted text-center py-3 sm-text">Aucune leçon dans ce module.</li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Simple Lesson Modal */}
            {showLessonModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content card-modern">
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title font-weight-bold">Ajouter une leçon</h5>
                                <button type="button" className="close" onClick={() => setShowLessonModal(false)}><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label className="form-label-modern">Titre</label>
                                    <input type="text" className="form-control-modern" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} autoFocus />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label-modern">Type</label>
                                    <select className="form-control-modern" value={lessonForm.type} onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}>
                                        <option value="video">Vidéo</option>
                                        <option value="text">Texte / Article</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0">
                                <button type="button" className="btn-modern btn-outline-modern" onClick={() => setShowLessonModal(false)}>Annuler</button>
                                <button type="button" className="btn-modern btn-primary-modern" onClick={addLesson}>Ajouter</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseBuilder;
