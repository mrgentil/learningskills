import React, { useState } from 'react';

const StudentList = () => {
    const [students] = useState([
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', courses: 2, joined: '2026-02-01' },
        { id: 2, name: 'Bob Wilson', email: 'bob@example.com', courses: 1, joined: '2026-02-05' },
    ]);

    return (
        <div className="fade-in">
            <h2 className="page-title">Mes Étudiants 🎓</h2>
            <div className="stat-card p-0" style={{ overflow: 'hidden' }}>
                <table className="table mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '20px' }}>Étudiant</th>
                            <th>Email</th>
                            <th>Cours Suivis</th>
                            <th>Date d'inscription</th>
                            <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s.id}>
                                <td style={{ padding: '20px', fontWeight: 700 }}>{s.name}</td>
                                <td>{s.email}</td>
                                <td>{s.courses}</td>
                                <td>{s.joined}</td>
                                <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                    <button className="btn btn-sm btn-light">Voir Profil</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;
