import React, { useState, useEffect, useMemo } from "react";
import {
    Building2, User, Mail, Calendar,
    ExternalLink, CheckCircle2, Clock,
    Archive, MoreVertical, Eye, Search,
    Filter, X, Shield, Sparkles, Crown,
    TrendingUp, Users, CreditCard, Rocket,
    ChevronRight, ArrowUpRight, BarChart3,
    ArrowLeft, Check
} from "lucide-react";
import axios from "axios";

// Native helper for date formatting in French
const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    } catch (e) {
        return dateString;
    }
};

const TIER_ICONS = {
    starter: Shield,
    pro: Sparkles,
    enterprise: Crown,
};

const TIER_THEMES = {
    starter: "emerald",
    pro: "blue",
    enterprise: "purple",
};

const OnboardingList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const resp = await axios.get("/api/admin/onboarding-requests");
            setRequests(resp.data.data || []);
        } catch (err) {
            console.error("Failed to fetch onboarding requests", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/admin/onboarding-requests/${id}/status`, { status });
            fetchRequests();
            if (selectedRequest?.id === id) {
                setSelectedRequest({ ...selectedRequest, status });
            }
        } catch (err) {
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const openDetails = (req) => {
        setSelectedRequest(req);
        setIsSheetOpen(true);
    };

    const stats = useMemo(() => ({
        total: requests.length,
        new: requests.filter(r => r.status === 'new').length,
        deployed: requests.filter(r => r.status === 'deployed').length,
    }), [requests]);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch =
                req.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.contact_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || req.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchTerm, statusFilter]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="container mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">Onboarding <span className="text-cbx-amber">Hub</span></h1>
                    <p className="text-slate-500 text-sm font-medium">Gérez le déploiement et le suivi des nouvelles académies.</p>
                </div>

                <div className="flex gap-2">
                    <div className="bg-white border px-4 py-2 rounded-2xl shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-700 uppercase">{stats.new} NOUVEAUX</span>
                    </div>
                    <div className="bg-white border px-4 py-2 rounded-2xl shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-slate-700 uppercase">{stats.deployed} DÉPLOYÉS</span>
                    </div>
                </div>
            </div>

            {/* Global Stats bar - Simple & Clean */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Leads</span>
                        <h4 className="text-2xl font-black text-slate-900 leading-tight">{stats.total}</h4>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-cbx-amber/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cbx-amber/10 group-hover:text-cbx-amber transition-colors">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">À Contacter</span>
                        <h4 className="text-2xl font-black text-slate-900 leading-tight">{stats.new}</h4>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opérationnels</span>
                        <h4 className="text-2xl font-black text-slate-900 leading-tight">{stats.deployed}</h4>
                    </div>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une organisation..."
                        className="w-full h-14 pl-11 pr-4 rounded-[1.25rem] bg-white border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="h-14 px-5 rounded-[1.25rem] bg-white border border-slate-200 text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">TOUS STATUTS</option>
                        <option value="new">NOUVEAUX</option>
                        <option value="deployed">DÉPLOYÉS</option>
                        <option value="archived">ARCHIVÉS</option>
                    </select>
                </div>
            </div>

            {/* Main Table - Robust & Clean */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Organisation / Projet</th>
                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Licence</th>
                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Statut</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredRequests.map((req) => {
                            const Icon = TIER_ICONS[req.selected_plan] || Shield;
                            const theme = TIER_THEMES[req.selected_plan] || "emerald";

                            return (
                                <tr key={req.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => openDetails(req)}>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl bg-${theme}-50 border border-${theme}-100 flex items-center justify-center text-${theme}-600 shrink-0 group-hover:scale-105 transition-transform`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">{req.organization_name}</h3>
                                                <p className="text-xs text-slate-500 font-bold uppercase mt-2 opacity-60 flex items-center gap-2">
                                                    <User className="w-3 h-3" /> {req.contact_name} • {formatDate(req.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest`}>
                                            {req.selected_plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.status === 'new' ? (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black border border-blue-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> NOUVEAU
                                            </span>
                                        ) : req.status === 'deployed' ? (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black border border-emerald-200">
                                                <Check className="w-3 h-3" /> DÉPLOYÉ
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black border border-slate-200 uppercase">
                                                {req.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-10 py-4 text-right">
                                        <button className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredRequests.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-8 h-8 text-slate-200" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900">Aucun projet trouvé</h4>
                        <p className="text-slate-400 font-medium max-w-xs mt-2">Essayez d'ajuster vos critères de recherche ou vos filtres.</p>
                    </div>
                )}
            </div>

            {/* SLIDE OVER SHEET - Premium Interaction Pattern */}
            <div className={`fixed inset-0 z-50 transition-all duration-500 ${isSheetOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSheetOpen(false)}></div>

                {/* Panel */}
                <div className={`absolute top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSheetOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {selectedRequest && (
                        <div className="flex flex-col h-full bg-[#fcfdfe]">
                            {/* Sheet Header */}
                            <div className="p-8 bg-slate-900 text-white relative flex justify-between items-center">
                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-cbx-amber/10 rounded-full blur-[60px] translate-x-10 translate-y-10"></div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase">{selectedRequest.organization_name}</h2>
                                    <p className="text-cbx-amber text-xs font-black uppercase tracking-[0.3em] mt-1">{selectedRequest.academy_name}</p>
                                </div>
                                <button onClick={() => setIsSheetOpen(false)} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Sheet Content */}
                            <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                {/* Configuration Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Plan Choisi</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                {TIER_ICONS[selectedRequest.selected_plan] && React.createElement(TIER_ICONS[selectedRequest.selected_plan], { className: "w-4 h-4" })}
                                            </div>
                                            <span className="text-lg font-black uppercase leading-none">{selectedRequest.selected_plan}</span>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Infrastructure</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold uppercase truncate">{selectedRequest.custom_domain ? 'Custom Domain' : 'On-Premise'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Contact Group */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsable & Contact</h4>
                                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                                        <div className="p-6 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Nom Complet</p>
                                                <p className="font-bold text-slate-900">{selectedRequest.contact_name}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                                <Mail className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Email</p>
                                                <a href={`mailto:${selectedRequest.email}`} className="font-bold text-primary hover:underline">{selectedRequest.email}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Preferences & Tags */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration Plateforme</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.training_types?.map(t => (
                                            <span key={t} className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">{t}</span>
                                        ))}
                                        {selectedRequest.content_types?.map(t => (
                                            <span key={t} className="px-4 py-2 bg-cbd-amber/10 border border-cbx-amber/20 text-cbx-amber rounded-2xl text-[10px] font-black uppercase tracking-widest">{t}</span>
                                        ))}
                                    </div>
                                </div>

                                {selectedRequest.comments && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commentaires Client</h4>
                                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 italic text-sm text-slate-700 leading-relaxed font-medium">
                                            "{selectedRequest.comments}"
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sheet Footer Action Area */}
                            <div className="p-8 bg-white border-t border-slate-100 space-y-4">
                                <div className="flex gap-2">
                                    <button onClick={() => updateStatus(selectedRequest.id, 'deployed')} className="flex-grow h-16 rounded-[1.25rem] bg-slate-900 text-white font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-emerald-600 transition-colors shadow-xl shadow-slate-900/20 active:scale-95">
                                        <Rocket className="w-5 h-5" /> DÉPLOYER MAINTENANT
                                    </button>
                                    <button onClick={() => updateStatus(selectedRequest.id, 'archived')} className="w-16 h-16 rounded-[1.25rem] bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <Archive className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-[9px] text-center font-black text-slate-400 uppercase tracking-widest">Marquer comme opérationnel générera l'accès au tenant.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingList;
