import React, { useState, useEffect } from "react";
import {
    Building2, User, Mail, Calendar,
    ExternalLink, CheckCircle2, Clock,
    Archive, MoreVertical, Eye
} from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const OnboardingList = () => {
    const [requests, setRequests] = useState < any[] > ([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState < any > (null);

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

    const updateStatus = async (id: number, status: string) => {
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "new": return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Nouveau</span>;
            case "contacted": return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Contacté</span>;
            case "deployed": return <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Déployé</span>;
            case "archived": return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">Archivé</span>;
            default: return null;
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement des demandes...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-display">Demandes d'Onboarding</h1>
                    <p className="text-sm text-muted-foreground">Gérez les nouveaux clients et le déploiement des académies.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Organisation / Académie</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Plan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Statut</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.map((req) => (
                                    <tr
                                        key={req.id}
                                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedRequest?.id === req.id ? 'bg-slate-50 border-l-4 border-l-primary' : ''}`}
                                        onClick={() => setSelectedRequest(req)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{req.organization_name}</div>
                                            <div className="text-xs text-slate-500">{req.academy_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${req.selected_plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                                                    req.selected_plan === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {req.selected_plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {format(new Date(req.created_at), "d MMM yyyy", { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-primary"><Eye className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {requests.length === 0 && (
                            <div className="p-12 text-center text-slate-400 italic">Aucune demande pour le moment.</div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    {selectedRequest ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
                            <div className="p-6 bg-slate-900 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => updateStatus(selectedRequest.id, 'contacted')} title="Marquer comme contacté" className="p-2 hover:bg-white/10 rounded-lg"><Clock className="w-4 h-4" /></button>
                                        <button onClick={() => updateStatus(selectedRequest.id, 'deployed')} title="Marquer comme déployé" className="p-2 hover:bg-white/10 rounded-lg text-emerald-400"><CheckCircle2 className="w-4 h-4" /></button>
                                        <button onClick={() => updateStatus(selectedRequest.id, 'archived')} title="Archiver" className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><Archive className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold">{selectedRequest.organization_name}</h2>
                                <p className="text-white/60 text-sm">{selectedRequest.academy_name}</p>
                            </div>

                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Contact</h3>
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span>{selectedRequest.contact_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <a href={`mailto:${selectedRequest.email}`} className="text-primary hover:underline">{selectedRequest.email}</a>
                                    </div>
                                    {selectedRequest.phone && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-slate-400 text-xs font-bold">Tél:</span>
                                            <span>{selectedRequest.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Configuration</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Domaine</div>
                                            <div className="text-sm font-bold">{selectedRequest.custom_domain ? selectedRequest.domain_name : 'Sous-domaine standard'}</div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Certificats</div>
                                            <div className="text-sm font-bold">{selectedRequest.wants_certificates ? 'Oui' : 'Non'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Types de formation</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.training_types?.map((t: string) => (
                                            <span key={t} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px]">{t}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contenus prévus</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.content_types?.map((t: string) => (
                                            <span key={t} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[11px]">{t}</span>
                                        ))}
                                    </div>
                                </div>

                                {selectedRequest.comments && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Commentaires</h3>
                                        <div className="p-4 bg-amber-50 rounded-xl text-sm border border-amber-100 italic">
                                            "{selectedRequest.comments}"
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <Button
                                        className="w-full bg-primary text-white h-12 rounded-xl"
                                        onClick={() => {
                                            // Future: Open AcademyModal pre-filled with this data
                                            alert("Fonctionnalité 'Déployer l'académie' bientôt disponible !");
                                        }}
                                    >
                                        🚀 Déployer maintenant
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[400px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <Building2 className="w-12 h-12 mb-4 opacity-20" />
                            <p>Sélectionnez une demande dans la liste pour voir les détails ici.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingList;
