import React, { useState, useEffect, useMemo } from "react";
import {
    Building2, User, Mail, Calendar,
    ExternalLink, CheckCircle2, Clock,
    Archive, MoreVertical, Eye, Search,
    Filter, X, Shield, Sparkles, Crown,
    TrendingUp, Users, CreditCard, Rocket,
    ChevronRight, ArrowUpRight, BarChart3
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

const TIER_COLORS = {
    starter: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", accent: "bg-emerald-500" },
    pro: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", accent: "bg-blue-500" },
    enterprise: { text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", accent: "bg-purple-500" },
};

const OnboardingList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");

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

    const stats = useMemo(() => {
        return {
            total: requests.length,
            new: requests.filter(r => r.status === 'new').length,
            deployed: requests.filter(r => r.status === 'deployed').length,
            conversion: requests.length > 0 ? Math.round((requests.filter(r => r.status === 'deployed').length / requests.length) * 100) : 0
        };
    }, [requests]);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch =
                req.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || req.status === statusFilter;
            const matchesPlan = planFilter === "all" || req.selected_plan === planFilter;
            return matchesSearch && matchesStatus && matchesPlan;
        });
    }, [requests, searchTerm, statusFilter, planFilter]);

    const getStatusBadge = (status) => {
        switch (status) {
            case "new": return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100 flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Nouveau</span>;
            case "contacted": return <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100 w-fit">En attente</span>;
            case "deployed": return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 w-fit">Déployé</span>;
            case "archived": return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-200 w-fit">Archivé</span>;
            default: return null;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            </div>
            <p className="mt-6 text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Initialisation du Pipeline...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* TOP HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Onboarding <span className="text-primary">&</span> Pipeline</h1>
                    <p className="text-slate-500 font-medium">Gestion des nouveaux clients et déploiement stratégique.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    <Clock className="w-3.5 h-3.5" />
                    MIS À JOUR IL Y A 1 MIN
                </div>
            </div>

            {/* KEY STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Leads", value: stats.total, icon: Users, color: "blue", trend: "+12%" },
                    { label: "À Traiter", value: stats.new, icon: Clock, color: "amber", trend: "-2" },
                    { label: "Déployés", value: stats.deployed, icon: CheckCircle2, color: "emerald", trend: "+5%" },
                    { label: "Conversion", value: `${stats.conversion}%`, icon: BarChart3, color: "purple", trend: "Stable" },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.color}-50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500`}></div>
                        <div className="flex justify-between items-start relative mb-4">
                            <div className={`p-3 rounded-2xl bg-${s.color}-50 text-${s.color}-600`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-50 text-slate-400">{s.trend}</span>
                        </div>
                        <div className="relative">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{s.label}</h4>
                            <div className="text-4xl font-black text-slate-900 mt-1">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT SIDE: LIST & FILTERS */}
                <div className="lg:col-span-2 space-y-6">

                    {/* FILTERS COMPACT */}
                    <div className="bg-slate-900 p-4 rounded-3xl shadow-lg flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Recherche par organisation ou contact..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/5 border-none text-white text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-12 bg-white/5 border-none rounded-2xl text-white text-xs font-bold px-4 focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer">
                                <option className="text-slate-900" value="all">Filtre Statut</option>
                                <option className="text-slate-900" value="new">Nouveaux</option>
                                <option className="text-slate-900" value="contacted">En attente</option>
                                <option className="text-slate-900" value="deployed">Déployés</option>
                            </select>
                            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="h-12 bg-white/5 border-none rounded-2xl text-white text-xs font-bold px-4 focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer">
                                <option className="text-slate-900" value="all">Filtre Plan</option>
                                <option className="text-slate-900" value="starter">Starter</option>
                                <option className="text-slate-900" value="pro">Pro</option>
                                <option className="text-slate-900" value="enterprise">Enterprise</option>
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/30">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Organisation / Contact</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Forfait</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Statut</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((req) => {
                                    const PlanIcon = TIER_ICONS[req.selected_plan] || Shield;
                                    const tierStyle = TIER_COLORS[req.selected_plan] || TIER_COLORS.starter;
                                    const isSelected = selectedRequest?.id === req.id;

                                    return (
                                        <tr key={req.id} onClick={() => setSelectedRequest(req)} className={`group hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-none ${isSelected ? 'bg-primary/5' : ''}`}>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl ${tierStyle.bg} flex items-center justify-center border ${tierStyle.border} shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                                                        <PlanIcon className={`w-6 h-6 ${tierStyle.text}`} />
                                                    </div>
                                                    <div>
                                                        <div className={`font-black tracking-tight leading-none text-[15px] ${isSelected ? 'text-primary' : 'text-slate-900'}`}>{req.organization_name}</div>
                                                        <div className="text-slate-400 text-xs font-bold mt-1.5 flex items-center gap-2 uppercase tracking-tighter">
                                                            {req.contact_name} • {formatDate(req.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${tierStyle.border} ${tierStyle.bg} ${tierStyle.text}`}>
                                                    {req.selected_plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className={`w-10 h-10 rounded-xl inline-flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30 rotate-90' : 'bg-slate-50 text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-md'}`}>
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredRequests.length === 0 && (
                            <div className="p-24 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <Search className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Aucun résultat</h3>
                                <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Ajustez vos filtres ou effectuez une nouvelle recherche pour trouver vos prospects.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: DETAIL DRAWER-STYLE PANEL */}
                <div className="lg:col-span-1">
                    {selectedRequest ? (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden sticky top-8 animate-in slide-in-from-right-10 duration-500">
                            {/* Detail Header */}
                            <div className="p-8 bg-slate-900 text-white relative">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -translate-y-12 translate-x-12"></div>
                                <div className="flex justify-between items-start relative mb-8">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl ring-4 ring-white/5">
                                        <Building2 className="w-8 h-8 text-cbx-amber" />
                                    </div>
                                    <div className="flex gap-2">
                                        {[
                                            { action: 'contacted', icon: Clock, color: 'text-amber-400', tip: 'En attente' },
                                            { action: 'deployed', icon: CheckCircle2, color: 'text-emerald-400', tip: 'Déployer' },
                                            { action: 'archived', icon: Archive, color: 'text-slate-400', tip: 'Archiver' }
                                        ].map((btn, bidx) => (
                                            <button key={bidx} onClick={() => updateStatus(selectedRequest.id, btn.action)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 group relative">
                                                <btn.icon className={`w-4 h-4 ${btn.color}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter leading-none">{selectedRequest.organization_name}</h2>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className={`w-2 h-2 rounded-full ${TIER_COLORS[selectedRequest.selected_plan].accent} animate-pulse`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{selectedRequest.academy_name}</span>
                                </div>
                            </div>

                            {/* Detail Body */}
                            <div className="p-8 space-y-8 max-h-[calc(100vh-400px)] overflow-y-auto detail-scroll">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informations Directes</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: User, val: selectedRequest.contact_name, label: "Contact Principal" },
                                            { icon: Mail, val: selectedRequest.email, label: "Email Professionnel", link: `mailto:${selectedRequest.email}` },
                                            { icon: ExternalLink, val: selectedRequest.custom_domain ? selectedRequest.domain_name : "Sous-domaine par défaut", label: "Infrastructure Web" }
                                        ].map((info, iidx) => (
                                            <div key={iidx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                                                    <info.icon className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{info.label}</p>
                                                    <p className="font-bold text-slate-900 truncate">
                                                        {info.link ? <a href={info.link} className="hover:text-primary transition-colors">{info.val}</a> : info.val}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900 p-5 rounded-3xl text-white">
                                        <div className="text-[9px] font-black text-white/40 uppercase tracking-wider mb-2 text-center">Plan Client</div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Shield className="w-5 h-5 text-cbx-amber" />
                                            <span className="text-xl font-black uppercase tracking-tighter">{selectedRequest.selected_plan}</span>
                                        </div>
                                    </div>
                                    <div className="bg-primary p-5 rounded-3xl text-white">
                                        <div className="text-[9px] font-black text-white/40 uppercase tracking-wider mb-2 text-center">Certificats</div>
                                        <div className="flex items-center justify-center gap-2">
                                            {selectedRequest.wants_certificates ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5 opacity-50" />}
                                            <span className="text-xl font-black">{selectedRequest.wants_certificates ? 'OUI' : 'NON'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags Section */}
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Focus Plateforme</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.training_types?.map(t => <span key={t} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold border border-slate-100">{t}</span>)}
                                        {selectedRequest.content_types?.map(t => <span key={t} className="px-3 py-1.5 bg-primary/5 text-primary rounded-xl text-[10px] font-bold border border-primary/10">{t}</span>)}
                                    </div>
                                </div>

                                {/* Deployment Footer */}
                                <div className="pt-8 border-t border-slate-100 flex flex-col items-center">
                                    <button
                                        className="w-full h-16 rounded-[1.5rem] bg-slate-900 text-white font-black text-sm relative group overflow-hidden shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all"
                                        onClick={() => alert('Déploiement en cours...')}
                                    >
                                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-3 tracking-widest">
                                            DÉPLOYER L'ACADÉMIE <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </span>
                                    </button>
                                    <p className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Générera l'infrastructure & les accès</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 h-[600px] rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center opacity-70">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 mb-8 animate-pulse text-slate-200">
                                <Building2 className="w-10 h-10" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900">Prospect Non Sélectionné</h4>
                            <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">Cliquez sur une organisation dans la liste pour visualiser la configuration complète et lancer son académie.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingList;
