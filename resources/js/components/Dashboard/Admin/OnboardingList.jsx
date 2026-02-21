import React, { useState, useEffect, useMemo } from "react";
import {
    Building2, User, Mail, Calendar,
    ExternalLink, CheckCircle2, Clock,
    Archive, MoreVertical, Eye, Search,
    Filter, X, Shield, Sparkles, Crown,
    TrendingUp, Users, CreditCard, Rocket,
    ChevronRight, ArrowUpRight
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
    starter: { text: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200" },
    pro: { text: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200" },
    enterprise: { text: "text-purple-700", bg: "bg-purple-100", border: "border-purple-200" },
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

    // Stats calculations
    const stats = useMemo(() => {
        return {
            total: requests.length,
            new: requests.filter(r => r.status === 'new').length,
            contacted: requests.filter(r => r.status === 'contacted').length,
            deployed: requests.filter(r => r.status === 'deployed').length,
            proPlus: requests.filter(r => r.selected_plan === 'pro' || r.selected_plan === 'enterprise').length,
        };
    }, [requests]);

    // Filtering logic
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
            case "new": return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div> Nouveau</span>;
            case "contacted": return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Contacté</span>;
            case "deployed": return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Déployé</span>;
            case "archived": return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">Archivé</span>;
            default: return null;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Rocket className="w-12 h-12 text-primary/20 animate-bounce" />
            <p className="text-muted-foreground animate-pulse font-medium">Récupération des prospects...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            {/* HEADER & STATS */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900">Pipeline Onboarding</h1>
                    <p className="text-slate-500 mt-1 font-medium">Suivez et convertissez vos prospects en académies actives.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[140px]">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900">{stats.total}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total</div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[140px]">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900">{stats.new}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">À Traiter</div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[140px]">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900">{stats.deployed}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Actives</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTERS BAR */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une organisation, contact ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors">
                            <X className="w-3 h-3 text-slate-500" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 pl-9 pr-8 rounded-xl bg-slate-50 border-transparent text-sm font-semibold appearance-none cursor-pointer hover:bg-slate-100 transition-colors outline-none w-full"
                        >
                            <option value="all">Tous les Statuts</option>
                            <option value="new">Nouveaux</option>
                            <option value="contacted">Contactés</option>
                            <option value="deployed">Déployés</option>
                            <option value="archived">Archivés</option>
                        </select>
                    </div>

                    <div className="relative flex-grow md:flex-grow-0">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <select
                            value={planFilter}
                            onChange={(e) => setPlanFilter(e.target.value)}
                            className="h-11 pl-9 pr-8 rounded-xl bg-slate-50 border-transparent text-sm font-semibold appearance-none cursor-pointer hover:bg-slate-100 transition-colors outline-none w-full"
                        >
                            <option value="all">Tous les Plans</option>
                            <option value="starter">Starter</option>
                            <option value="pro">Pro</option>
                            <option value="enterprise">Enterprise</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-0 lg:gap-8 items-start">
                {/* LIST SECTION */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organisation & Nom</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Plan</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reçu le</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredRequests.map((req) => {
                                    const PlanIcon = TIER_ICONS[req.selected_plan] || Shield;
                                    const tierColor = TIER_COLORS[req.selected_plan] || TIER_COLORS.starter;
                                    const isSelected = selectedRequest?.id === req.id;

                                    return (
                                        <tr
                                            key={req.id}
                                            className={`hover:bg-slate-50/50 cursor-pointer group transition-all duration-200 ${isSelected ? 'bg-primary/5' : ''}`}
                                            onClick={() => setSelectedRequest(req)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg ${tierColor.bg} ${tierColor.text} flex items-center justify-center shrink-0`}>
                                                        <PlanIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold text-sm transition-colors ${isSelected ? 'text-primary' : 'text-slate-900 group-hover:text-primary'}`}>{req.organization_name}</div>
                                                        <div className="text-[11px] text-slate-500 font-medium">{req.contact_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${tierColor.bg} ${tierColor.text} border ${tierColor.border}`}>
                                                    {req.selected_plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex shrink-0">{getStatusBadge(req.status)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-[11px] text-slate-400 font-bold whitespace-nowrap uppercase tracking-tighter">
                                                {formatDate(req.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className={`p-1.5 rounded-lg transition-all ${isSelected ? 'bg-primary text-white scale-110' : 'text-slate-300 group-hover:bg-slate-100 group-hover:text-primary'}`}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredRequests.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Aucun prospect trouvé</h3>
                                <p className="text-slate-400 text-sm max-w-[240px] mt-1">Essayez de modifier vos filtres ou termes de recherche pour trouver ce que vous cherchez.</p>
                                <button
                                    onClick={() => { setSearchTerm(""); setStatusFilter("all"); setPlanFilter("all"); }}
                                    className="mt-6 text-sm font-bold text-primary hover:underline"
                                >
                                    Réinitialiser tout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* DETAIL PANEL SECTION */}
                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    {selectedRequest ? (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden sticky top-24 transition-all duration-300 animate-in fade-in slide-in-from-right-4">
                            {/* Panel Header */}
                            <div className="p-6 bg-slate-900 text-white relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
                                <div className="flex justify-between items-start mb-6 relative">
                                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 ring-4 ring-white/5">
                                        <Building2 className="w-6 h-6 text-cbx-amber" />
                                    </div>
                                    <div className="flex gap-1.5 p-1.5 bg-white/5 rounded-2xl backdrop-blur-md border border-white/5">
                                        <button onClick={() => updateStatus(selectedRequest.id, 'contacted')} title="Marquer comme contacté" className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Clock className="w-4 h-4 text-amber-400" /></button>
                                        <button onClick={() => updateStatus(selectedRequest.id, 'deployed')} title="Marquer comme déployé" className="p-2 hover:bg-white/10 rounded-xl transition-colors"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></button>
                                        <button onClick={() => updateStatus(selectedRequest.id, 'archived')} title="Archiver" className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Archive className="w-4 h-4 text-slate-400" /></button>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black tracking-tight leading-tight">{selectedRequest.organization_name}</h2>
                                <div className="flex items-center gap-2 mt-2 opacity-60">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    <p className="text-xs font-bold uppercase tracking-widest">{selectedRequest.academy_name}</p>
                                </div>
                            </div>

                            {/* Panel Content */}
                            <div className="p-6 space-y-8 max-h-[calc(100vh-320px)] overflow-y-auto detail-scroll custom-scrollbar">
                                {/* Contact Card */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prospect</h3>
                                        {getStatusBadge(selectedRequest.status)}
                                    </div>
                                    <div className="bg-slate-50 p-5 rounded-2xl space-y-3 border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200">
                                                <User className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{selectedRequest.contact_name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <a href={`mailto:${selectedRequest.email}`} className="text-sm font-bold text-primary hover:underline truncate">{selectedRequest.email}</a>
                                        </div>
                                        {selectedRequest.phone && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200">
                                                    <span className="text-[8px] font-black text-slate-400">TEL</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">{selectedRequest.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Configuration Grid */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Infrastructure</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div className="text-[9px] text-slate-400 uppercase font-black tracking-wider mb-1">Domaine</div>
                                            <div className="text-xs font-bold text-slate-900 leading-tight">
                                                {selectedRequest.custom_domain ? (
                                                    <span className="flex flex-col">
                                                        <span>Personnalisé</span>
                                                        <span className="text-[10px] text-primary truncate mt-0.5">{selectedRequest.domain_name}</span>
                                                    </span>
                                                ) : 'Par défaut (.learningskills.ca)'}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div className="text-[9px] text-slate-400 uppercase font-black tracking-wider mb-1">Certificats</div>
                                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                {selectedRequest.wants_certificates ? (
                                                    <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Requis</>
                                                ) : 'Non requis'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags Sections */}
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Objectifs Pédagogiques</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRequest.training_types?.map((t) => (
                                                <span key={t} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-bold border border-blue-100/50">{t}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Formats de Contenu</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRequest.content_types?.map((t) => (
                                                <span key={t} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-bold border border-emerald-100/50">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Comments */}
                                {selectedRequest.comments && (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Commentaires Client</h3>
                                        <div className="p-5 bg-cbx-amber/5 rounded-2xl text-xs font-semibold text-slate-700 border border-cbx-amber/10 italic leading-relaxed relative">
                                            <div className="absolute top-0 right-4 -translate-y-1/2 bg-cbx-amber text-navy px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Note</div>
                                            "{selectedRequest.comments}"
                                        </div>
                                    </div>
                                )}

                                {/* Footer Action */}
                                <div className="pt-4 border-t border-slate-100">
                                    <button
                                        className="w-full bg-primary text-white h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 group"
                                        onClick={() => {
                                            const tierName = selectedRequest.selected_plan.charAt(0).toUpperCase() + selectedRequest.selected_plan.slice(1);
                                            alert(`Génération automatique de l'académie "${selectedRequest.academy_name}" (Plan ${tierName}) en cours...`);
                                        }}
                                    >
                                        <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        DÉPLOYER L'ACADÉMIE
                                    </button>
                                    <p className="text-[10px] text-center mt-3 text-slate-400 font-bold uppercase tracking-wider">Créera l'instance, le tenant et les accès admin.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[500px] rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-12 text-center bg-slate-50/50">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm mb-6 animate-pulse">
                                <TrendingUp className="w-10 h-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Sélectionnez un Prospect</h3>
                            <p className="text-sm font-medium leading-relaxed max-w-[240px]">Cliquez sur une demande dans la liste pour voir les détails de configuration et lancer le déploiement.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingList;
