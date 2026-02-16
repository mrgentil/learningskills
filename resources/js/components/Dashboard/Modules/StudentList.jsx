import React, { useState, useEffect } from 'react';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileModal, setProfileModal] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const openProfile = async (student) => {
        setProfileModal({ student, enrollments: null });
        setProfileLoading(true);
        try {
            const res = await fetch(`/api/academy/students/${student.id}`);
            if (res.ok) {
                const data = await res.json();
                setProfileModal({ student: data, enrollments: data.enrollments || [] });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProfileLoading(false);
        }
    };

    const closeProfile = () => setProfileModal(null);

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/academy/students');
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            } else {
                setStudents([]);
            }
        } catch (err) {
            console.error(err);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d) => {
        if (!d) return '-';
        const date = new Date(d);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) return <div className="text-center p-5"><i className="fa fa-spin fa-spinner fa-2x"></i></div>;

    return (
        <div className="fade-in">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="page-title">Mes Étudiants</h2>
                    <p className="page-subtitle mb-0">Liste des personnes inscrites à vos cours.</p>
                </div>
            </div>

            <div className="stat-card p-0" style={{ overflow: 'hidden', borderRadius: 16 }}>
                <div className="table-responsive">
                    <table className="table mb-0 students-table">
                        <thead>
                            <tr>
                                <th style={{ padding: '16px 20px' }}>Étudiant</th>
                                <th>Email</th>
                                <th className="text-center">Cours suivis</th>
                                <th>Date d'inscription</th>
                                <th style={{ width: 120, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5">
                                        <div className="text-muted">
                                            <i className="fa fa-users fa-3x mb-3" style={{ opacity: 0.5 }}></i>
                                            <p className="mb-0">Aucun étudiant inscrit pour le moment.</p>
                                            <p className="small mt-1">Les inscriptions apparaîtront ici lorsqu'un utilisateur s'inscrira à l'un de vos cours.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {students.map((s) => (
                                <tr key={s.id}>
                                    <td style={{ padding: '16px 20px', fontWeight: 700 }}>{s.name || 'Sans nom'}</td>
                                    <td>{s.email}</td>
                                    <td className="text-center">
                                        <span className="badge px-2 py-1" style={{ background: '#eef2ff', color: '#4338ca', fontWeight: 700 }}>
                                            {s.courses_count || 0}
                                        </span>
                                    </td>
                                    <td>{formatDate(s.first_enrolled)}</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-light" title="Voir profil" onClick={() => openProfile(s)}>
                                            <i className="fa fa-user mr-1"></i> Profil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {profileModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={closeProfile}>
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title font-weight-bold">
                                    <i className="fa fa-user mr-2 text-primary"></i>
                                    Profil étudiant
                                </h5>
                                <button type="button" className="close" onClick={closeProfile}><span>&times;</span></button>
                            </div>
                            <div className="modal-body pt-0">
                                {profileLoading ? (
                                    <div className="text-center py-5"><i className="fa fa-spin fa-spinner fa-2x text-muted"></i></div>
                                ) : (
                                    <>
                                        <div className="d-flex align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-3" style={{ width: 56, height: 56 }}>
                                                <i className="fa fa-user fa-2x"></i>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 font-weight-bold">{profileModal.student.name || 'Sans nom'}</h5>
                                                <span className="text-muted">{profileModal.student.email}</span>
                                                {profileModal.student.created_at && (
                                                    <p className="small text-muted mb-0 mt-1">
                                                        Membre depuis {formatDate(profileModal.student.created_at)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <h6 className="font-weight-bold mb-3">Cours suivis ({profileModal.enrollments?.length || 0})</h6>
                                        {profileModal.enrollments?.length === 0 ? (
                                            <p className="text-muted small">Aucun cours pour le moment.</p>
                                        ) : (
                                            <div className="list-group list-group-flush">
                                                {profileModal.enrollments?.map((e, i) => (
                                                    <div key={i} className="list-group-item px-0 d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <div style={{ width: 48, height: 36, borderRadius: 8, backgroundImage: `url(${e.course_thumbnail || 'https://via.placeholder.com/64x48'})`, backgroundSize: 'cover', backgroundPosition: 'center', marginRight: 12 }} />
                                                            <div>
                                                                <span className="font-weight-bold">{e.course_title}</span>
                                                                <p className="small text-muted mb-0 mt-0">
                                                                    Inscrit le {formatDate(e.enrolled_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="progress" style={{ width: 80, height: 8, borderRadius: 4 }}>
                                                                <div className="progress-bar bg-primary" style={{ width: `${e.progress_percent || 0}%` }}></div>
                                                            </div>
                                                            <span className="small font-weight-bold">{e.progress_percent || 0} %</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .students-table thead { background: #f8fafc; }
                .students-table thead th { padding: 14px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 800; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
                .students-table tbody td { padding: 14px 20px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
                .students-table tbody tr:hover { background: #f8fafc; }
            `}</style>
        </div>
    );
};

export default StudentList;
