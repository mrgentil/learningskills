import React, { useState, useEffect } from 'react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/academy/courses'); // Using the route we created
            if (res.ok) {
                const data = await res.json();
                setCourses(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        // Navigate to builder with 'new' ID
        window.location.href = '/dashboard/courses/new/builder'; // Using reload to ensure fresh state or use navigate from router
        // Better: use useNavigate if inside router context, but here simpler:
        // Since we are in Router context in Dashboard.jsx, we should use Link or navigate hook.
        // But let's stick to standard internal navigation if I can import it.
    };

    if (loading) return <div className="text-center p-5"><i className="fa fa-spin fa-spinner fa-2x"></i></div>;

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="page-title">Mes Cours 📚</h2>
                    <p className="page-subtitle">Gérez vos contenus pédagogiques et suivez leur succès.</p>
                </div>
                <a href="/dashboard/courses/new/builder" className="btn-modern btn-primary-modern">
                    <i className="fa fa-plus mr-2"></i> Créer un Cours
                </a>
            </div>

            <div className="row">
                {courses.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <div className="text-muted mb-3"><i className="fa fa-book fa-3x"></i></div>
                        <h4>Vous n'avez pas encore créé de cours.</h4>
                        <p>Lancez-vous et partagez vos connaissances !</p>
                    </div>
                )}
                {courses.map((c) => (
                    <div className="col-lg-4 col-md-6 mb-4" key={c.id}>
                        <div className="card-modern h-100 overflow-hidden border-0">
                            <div style={{ height: '160px', backgroundImage: `url(${c.thumbnail || 'https://via.placeholder.com/400x250'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <div className="card-body-modern p-4">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="font-weight-bold mb-0 text-truncate" title={c.title}>{c.title}</h5>
                                    <span className="badge badge-light text-primary font-weight-bold">{c.price > 0 ? c.price + '$' : 'Gratuit'}</span>
                                </div>
                                <div className="d-flex align-items-center gap-3 mb-4 text-muted small">
                                    <span><i className="fa fa-users mr-1"></i> {c.students_count || 0} Étudiants</span>
                                    <span className="mx-2">•</span>
                                    <span className={c.is_published ? 'text-success font-weight-bold' : 'text-warning font-weight-bold'}>
                                        {c.is_published ? 'Publié' : 'Brouillon'}
                                    </span>
                                </div>
                                <div className="d-flex gap-2">
                                    <a href={`/dashboard/courses/${c.id}/builder`} className="btn btn-light btn-sm flex-grow-1 font-weight-bold">
                                        <i className="fa fa-pencil mr-1"></i> Éditer
                                    </a>
                                    <button className="btn btn-sm btn-outline-primary" title="Statistiques (bientôt)">
                                        <i className="fa fa-bar-chart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
