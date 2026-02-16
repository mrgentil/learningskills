import React, { useState, useEffect, useMemo } from 'react';

const PAGE_SIZES = [5, 10, 25, 50];

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quota, setQuota] = useState(null);
    const [canCreateCourse, setCanCreateCourse] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchCourses();
        fetchQuota();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/academy/courses');
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

    const fetchQuota = async () => {
        try {
            const res = await fetch('/api/academy/quota');
            if (res.ok) {
                const data = await res.json();
                setQuota(data.quota || null);
                setCanCreateCourse(data.can_create_course !== false);
            }
        } catch (_) {}
    };

    const toggleSort = (field) => {
        if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(field); setSortDir('desc'); }
    };

    const sortedAndFiltered = useMemo(() => {
        let list = courses.filter(c =>
            !search || c.title?.toLowerCase().includes(search.toLowerCase())
        );
        const mult = sortDir === 'asc' ? 1 : -1;
        list.sort((a, b) => {
            let va = a[sortBy], vb = b[sortBy];
            if (sortBy === 'title') return mult * (String(va || '').localeCompare(String(vb || '')));
            if (sortBy === 'price') return mult * (parseFloat(va || 0) - parseFloat(vb || 0));
            if (sortBy === 'students_count') return mult * ((a.students_count || 0) - (b.students_count || 0));
            if (sortBy === 'modules_count') return mult * ((a.modules_count || 0) - (b.modules_count || 0));
            if (sortBy === 'lessons_count') return mult * ((a.lessons_count || 0) - (b.lessons_count || 0));
            if (sortBy === 'status') return mult * ((a.status === 'published' ? 1 : 0) - (b.status === 'published' ? 1 : 0));
            if (sortBy === 'created_at') return mult * (new Date(va || 0) - new Date(vb || 0));
            return 0;
        });
        return list;
    }, [courses, search, sortBy, sortDir]);

    const totalItems = sortedAndFiltered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * pageSize;
    const paginatedList = useMemo(() =>
        sortedAndFiltered.slice(start, start + pageSize),
        [sortedAndFiltered, start, pageSize]
    );

    useEffect(() => {
        setPage(1);
    }, [search, sortBy, sortDir]);

    const SortIcon = ({ field }) => {
        if (sortBy !== field) return <i className="fa fa-sort text-muted ml-1" style={{ opacity: 0.5 }} />;
        return <i className={`fa fa-sort-${sortDir === 'asc' ? 'up' : 'down'} text-primary ml-1`} />;
    };

    if (loading) return <div className="text-center p-5"><i className="fa fa-spin fa-spinner fa-2x"></i></div>;

    return (
        <div className="fade-in">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="page-title">Mes Cours</h2>
                    <p className="page-subtitle mb-0">
                        {quota && quota.plan_name && (
                            <>
                                Plan <strong>{quota.plan_name}</strong>
                                {quota.courses_limit != null && (
                                    <span className="text-muted ml-1">
                                        · {quota.courses_used} / {quota.courses_limit} cours
                                    </span>
                                )}
                                <span className="text-muted ml-1">— Gérez vos contenus et suivez leur succès.</span>
                            </>
                        )}
                        {(!quota || !quota.plan_name) && 'Gérez vos contenus pédagogiques et suivez leur succès.'}
                    </p>
                </div>
                {canCreateCourse ? (
                    <a href="/dashboard/courses/new/builder" className="btn-modern btn-primary-modern">
                        <i className="fa fa-plus mr-2"></i> Créer un cours
                    </a>
                ) : (
                    <span className="btn-modern btn-outline-modern disabled" title="Limite de cours atteinte pour votre plan">
                        <i className="fa fa-lock mr-2"></i> Limite atteinte
                    </span>
                )}
            </div>

            <div className="stat-card mb-4 p-3">
                <div className="input-group" style={{ maxWidth: 360 }}>
                    <div className="input-group-prepend">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="fa fa-search text-muted"></i>
                        </span>
                    </div>
                    <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Rechercher par titre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ borderColor: '#e2e8f0' }}
                    />
                </div>
            </div>

            <div className="stat-card p-0" style={{ overflow: 'hidden', borderRadius: 16 }}>
                <div className="table-responsive">
                    <table className="table mb-0 courses-table">
                        <thead>
                            <tr>
                                <th style={{ width: 60, padding: '16px 20px' }}></th>
                                <th style={{ minWidth: 220 }} className="clickable" onClick={() => toggleSort('title')}>
                                    Titre <SortIcon field="title" />
                                </th>
                                <th className="text-center clickable" onClick={() => toggleSort('price')}>
                                    Prix <SortIcon field="price" />
                                </th>
                                <th className="text-center">
                                    <span className="d-none d-md-inline">Contenu</span>
                                    <span className="d-md-none">M / L</span>
                                </th>
                                <th className="text-center clickable" onClick={() => toggleSort('students_count')}>
                                    Étudiants <SortIcon field="students_count" />
                                </th>
                                <th className="text-center clickable" onClick={() => toggleSort('status')}>
                                    Statut <SortIcon field="status" />
                                </th>
                                <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFiltered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <div className="text-muted">
                                            <i className="fa fa-book fa-3x mb-3" style={{ opacity: 0.5 }}></i>
                                            <p className="mb-0">
                                                {search ? 'Aucun cours ne correspond à votre recherche.' : "Vous n'avez pas encore créé de cours."}
                                            </p>
                                            {!search && <a href="/dashboard/courses/new/builder" className="btn btn-link mt-2">Créer votre premier cours</a>}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {paginatedList.map((c) => (
                                <tr key={c.id}>
                                    <td className="align-middle" style={{ padding: '12px 20px' }}>
                                        <div
                                            style={{
                                                width: 48,
                                                height: 36,
                                                borderRadius: 8,
                                                backgroundImage: `url(${c.thumbnail || 'https://via.placeholder.com/64x48?text=📚'})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                    </td>
                                    <td className="align-middle">
                                        <a href={`/dashboard/courses/${c.id}/builder`} className="font-weight-bold text-dark text-decoration-none">
                                            {c.title}
                                        </a>
                                    </td>
                                    <td className="align-middle text-center">
                                        <span className="badge px-3 py-2" style={{ background: c.price > 0 ? '#eef2ff' : '#ecfdf5', color: c.price > 0 ? '#4338ca' : '#059669', fontWeight: 700 }}>
                                            {c.price > 0 ? `${parseFloat(c.price).toFixed(2)} $` : 'Gratuit'}
                                        </span>
                                    </td>
                                    <td className="align-middle text-center text-muted small">
                                        <span title="Modules / Leçons">{c.modules_count || 0} / {c.lessons_count || 0}</span>
                                    </td>
                                    <td className="align-middle text-center">
                                        <span className="font-weight-bold">{c.students_count || 0}</span>
                                    </td>
                                    <td className="align-middle text-center">
                                        <span
                                            className="badge px-2 py-1"
                                            style={{
                                                background: c.status === 'published' ? 'rgba(72,187,120,0.15)' : 'rgba(245,158,11,0.2)',
                                                color: c.status === 'published' ? '#276749' : '#92400e',
                                                fontWeight: 700,
                                                fontSize: 12
                                            }}
                                        >
                                            {c.status === 'published' ? 'Publié' : 'Brouillon'}
                                        </span>
                                    </td>
                                    <td className="align-middle text-end">
                                        <a href={`/dashboard/courses/${c.id}/builder`} className="btn btn-sm btn-light mr-1" title="Éditer">
                                            <i className="fa fa-pencil"></i>
                                        </a>
                                        <button className="btn btn-sm btn-light" title="Statistiques (bientôt)">
                                            <i className="fa fa-bar-chart text-muted"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalItems > 0 && (
                    <div className="courses-pagination d-flex flex-wrap align-items-center justify-content-between px-4 py-3" style={{ borderTop: '1px solid #f1f5f9', background: '#fafbfc' }}>
                        <div className="d-flex align-items-center gap-3 mb-2 mb-md-0">
                            <span className="text-muted small">
                                Affichage {start + 1}-{Math.min(start + pageSize, totalItems)} sur {totalItems}
                            </span>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: 70 }}
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                            >
                                {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <span className="text-muted small">par page</span>
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                                        <i className="fa fa-chevron-left"></i>
                                    </button>
                                </li>
                                {(() => {
                                    const pages = [];
                                    const add = (p) => { if (p >= 1 && p <= totalPages && !pages.includes(p)) pages.push(p); };
                                    add(1);
                                    if (currentPage > 3) pages.push('…');
                                    for (let i = currentPage - 1; i <= currentPage + 1; i++) add(i);
                                    if (currentPage < totalPages - 2) pages.push('…');
                                    if (totalPages > 1) add(totalPages);
                                    return pages.map((p, i) =>
                                        p === '…' ? (
                                            <li key={`ellip-${i}`} className="page-item disabled"><span className="page-link">…</span></li>
                                        ) : (
                                            <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                                            </li>
                                        )
                                    );
                                })()}
                                <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                                        <i className="fa fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            <style>{`
                .courses-table thead { background: #f8fafc; }
                .courses-table thead th { padding: 14px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 800; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
                .courses-table tbody td { padding: 14px 20px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
                .courses-table tbody tr:hover { background: #f8fafc; }
                .courses-table .clickable { cursor: pointer; user-select: none; }
                .courses-table .clickable:hover { color: #ff007a; }
                .courses-pagination .pagination .page-link { border-radius: 8px; margin: 0 2px; border: 1px solid #e2e8f0; color: #475569; }
                .courses-pagination .pagination .page-item.active .page-link { background: #ff007a; border-color: #ff007a; color: #fff; }
            `}</style>
        </div>
    );
};

export default CourseList;
