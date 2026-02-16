import React from 'react';

const Topbar = ({ user }) => {
    const handleLogout = (e) => {
        e.preventDefault();
        const form = document.getElementById('logout-form');
        if (form) {
            form.submit();
        } else {
            console.error('Logout form not found');
        }
    };

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    return (
        <header className="topbar">
            <div className="topbar-left d-flex align-items-center gap-4">
                <div className="search-box d-none d-md-flex align-items-center px-3 py-2" style={{ background: '#f1f5f9', borderRadius: '12px', width: '300px' }}>
                    <i className="fa fa-search" style={{ color: '#94a3b8' }}></i>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', fontSize: '14px', width: '100%' }}
                    />
                </div>
            </div>

            <div className="topbar-right">
                <div className="d-flex align-items-center gap-3">
                    <a href="/" className="btn btn-link p-0" title="Voir le site public" style={{ color: '#64748b' }}>
                        <i className="fa fa-globe fa-lg"></i>
                    </a>
                    <button className="btn btn-link p-0 position-relative" style={{ color: '#64748b' }}>
                        <i className="fa fa-bell-o fa-lg"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '8px', padding: '3px 5px' }}>
                            3
                        </span>
                    </button>

                    <div className="user-profile">
                        <div className="d-flex flex-column align-items-end d-none d-sm-flex">
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{user?.name || 'Utilisateur'}</span>
                            <span className="badge-role">{user?.role || 'Rôle'}</span>
                        </div>
                        <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn-logout"
                        title="Se déconnecter"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s' }}
                    >
                        <i className="fa fa-power-off fa-lg"></i>
                    </button>
                </div>

                <form id="logout-form" action="/logout" method="POST" style={{ display: 'none' }}>
                    <input type="hidden" name="_token" value={csrfToken || ''} />
                </form>
            </div>
        </header>
    );
};

export default Topbar;
