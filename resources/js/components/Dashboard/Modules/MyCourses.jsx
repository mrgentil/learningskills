import React, { useState, useEffect } from 'react';

const MyCourses = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/user/my-courses')
            .then(res => res.json())
            .then(data => {
                setMyCourses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching courses:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-5 text-center">Chargement de vos cours...</div>;
    }

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="page-title">Mes Études 🎓</h2>
                    <p className="page-subtitle">Continuez là où vous vous êtes arrêté.</p>
                </div>
                <a href="/" className="btn btn-light" style={{ borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>
                    <i className="fa fa-search"></i> Explorer plus
                </a>
            </div>

            <div className="row">
                {myCourses.length > 0 ? (
                    myCourses.map((c) => (
                        <div className="col-lg-6 mb-4" key={c.id}>
                            <div className="stat-card d-flex p-0" style={{ overflow: 'hidden' }}>
                                <div style={{ width: '40%' }}>
                                    <img src={c.img} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ width: '60%', padding: '25px' }}>
                                    <small style={{ color: '#a0aec0', fontWeight: 700, textTransform: 'uppercase' }}>{c.instructor}</small>
                                    <h4 style={{ fontWeight: 800, margin: '5px 0 15px', fontSize: '18px' }}>{c.title}</h4>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span style={{ fontSize: '13px', color: '#718096' }}>Progression</span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#2575fc' }}>{c.progress}%</span>
                                    </div>
                                    <div className="progress mb-4" style={{ height: '8px', borderRadius: '4px', background: '#f1f5f9' }}>
                                        <div className="progress-bar" style={{ width: `${c.progress}%`, background: 'linear-gradient(to right, #6a11cb, #2575fc)', borderRadius: '4px' }}></div>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = `/academy/${c.academy_slug}/learn/${c.course_slug}`}
                                        className="btn-modern btn-primary-modern w-100"
                                    >
                                        Reprendre le cours
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-md-12 text-center py-5">
                        <i className="fa fa-graduation-cap fa-4x mb-3" style={{ color: '#cbd5e1' }}></i>
                        <h4 style={{ color: '#64748b' }}>Vous n'êtes inscrit à aucun cours pour le moment.</h4>
                        <a href="/" className="btn-enroll mt-4" style={{ display: 'inline-block', textDecoration: 'none' }}>Parcourir le catalogue</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
