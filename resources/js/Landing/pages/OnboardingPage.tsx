import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    User, Building2, Palette, GraduationCap,
    Users, CreditCard, Rocket, CheckCircle2,
    ChevronRight, ChevronLeft, Loader2,
    Camera, Globe, Clock, MessageSquare
} from "lucide-react";
import axios from "axios";

const STEPS = [
    { id: 1, title: "Général", icon: User },
    { id: 2, title: "Image", icon: Palette },
    { id: 3, title: "Programme", icon: GraduationCap },
    { id: 4, title: "Utilisateurs", icon: Users },
    { id: 5, title: "Paiements", icon: CreditCard },
    { id: 6, title: "Lancement", icon: Rocket },
];

const OnboardingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        organization_name: "",
        contact_name: "",
        email: "",
        phone: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Toronto",

        academy_name: "",
        logo_base64: "", // For preview and upload
        brand_colors: { primary: "#001F3F", secondary: "#FFB000" },
        custom_domain: false,
        domain_name: "",

        training_types: [] as string[],
        content_types: [] as string[],
        wants_certificates: false,

        estimated_learners: "",
        registration_mode: "auto",

        will_sell_courses: false,
        has_stripe: false,

        enabled_features: [] as string[],

        content_readiness: "prep",
        target_launch_date: "",
        comments: "",

        selected_plan: searchParams.get("plan") || "pro",
        payment_method: "bank_transfer",
    });

    const [errors, setErrors] = useState<any>({});

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        const checked = (e.target as any).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleArrayChange = (name: string, value: string) => {
        setFormData((prev: any) => {
            const current = prev[name] || [];
            const updated = current.includes(value)
                ? current.filter((v: string) => v !== value)
                : [...current, value];
            return { ...prev, [name]: updated };
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo_base64: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});
        try {
            await axios.post("/api/onboarding", formData);
            setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
                alert("Veuillez corriger les erreurs dans le formulaire.");
            } else {
                alert("Une erreur est survenue lors de la soumission.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-gradient-subtle">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-card p-10 rounded-3xl shadow-elevated border border-border text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Demande Reçue !</h2>
                    <p className="text-muted-foreground mb-8">
                        Merci <strong>{formData.contact_name}</strong>. Votre demande pour <strong>{formData.academy_name}</strong> a été transmise à notre équipe. Nous vous contacterons par courriel d'ici 24 heures.
                    </p>
                    <Button onClick={() => navigate("/")} className="w-full h-12 rounded-xl">
                        Retour à l'accueil
                    </Button>
                </motion.div>
            </div>
        );
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Nom de l'organisation</label>
                                <input
                                    type="text" name="organization_name" value={formData.organization_name} onChange={handleChange}
                                    placeholder="Ex: École Technique Supérieure"
                                    className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Nom complet du contact</label>
                                <input
                                    type="text" name="contact_name" value={formData.contact_name} onChange={handleChange}
                                    placeholder="Ex: Jean Tremblay"
                                    className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Courriel professionnel</label>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder="jean@exemple.ca"
                                    className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Téléphone</label>
                                <input
                                    type="text" name="phone" value={formData.phone} onChange={handleChange}
                                    placeholder="+1 (514) 000-0000"
                                    className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Nom de votre académie</label>
                            <input
                                type="text" name="academy_name" value={formData.academy_name} onChange={handleChange}
                                placeholder="Le nom visible par les apprenants"
                                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                            />
                        </div>

                        <div className="p-6 rounded-2xl border border-dashed border-border flex flex-col items-center">
                            <div className="w-24 h-24 mb-4 relative group cursor-pointer" onClick={() => document.getElementById('logo-upload')?.click()}>
                                {formData.logo_base64 ? (
                                    <img src={formData.logo_base64} className="w-full h-full object-contain rounded-lg" alt="Logo preview" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                                        <Camera className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <span className="text-[10px] text-white font-bold bg-black/50 px-2 py-1 rounded">Changer</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Cliquez pour téléverser votre logo (PNG/JPG)</p>
                            <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                        </div>

                        <div className="flex items-center gap-4 py-4">
                            <input type="checkbox" id="custom_domain" name="custom_domain" checked={formData.custom_domain} onChange={handleChange} className="w-5 h-5 rounded border-border" />
                            <label htmlFor="custom_domain" className="text-sm font-medium cursor-pointer">
                                Je souhaite utiliser mon propre nom de domaine
                            </label>
                        </div>

                        {formData.custom_domain && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2">
                                <label className="text-sm font-semibold">Nom de domaine souhaité</label>
                                <div className="flex gap-2">
                                    <span className="flex items-center px-3 bg-slate-100 border border-border rounded-l-xl text-xs font-mono">https://</span>
                                    <input
                                        type="text" name="domain_name" value={formData.domain_name} onChange={handleChange}
                                        placeholder="cours.votreorganisation.com"
                                        className="w-full h-12 px-4 rounded-r-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-semibold block">Quels types de formations offrirez-vous ?</label>
                            <div className="grid grid-cols-2 gap-3">
                                {["Formation interne", "Cours publics", "Certification", "Coaching"].map(type => (
                                    <button
                                        key={type} type="button" onClick={() => handleArrayChange('training_types', type)}
                                        className={`p-3 rounded-xl border text-sm text-left transition-all ${formData.training_types.includes(type) ? 'bg-primary/5 border-primary text-primary font-bold' : 'border-border bg-background hover:bg-slate-50'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-semibold block">Types de contenus prévus</label>
                            <div className="grid grid-cols-2 gap-3">
                                {["Vidéos", "PDF / Documents", "Webinaires Live", "Quiz / Évaluations"].map(type => (
                                    <button
                                        key={type} type="button" onClick={() => handleArrayChange('content_types', type)}
                                        className={`p-3 rounded-xl border text-sm text-left transition-all ${formData.content_types.includes(type) ? 'bg-primary/5 border-primary text-primary font-bold' : 'border-border bg-background hover:bg-slate-50'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-2">
                            <input type="checkbox" id="wants_certificates" name="wants_certificates" checked={formData.wants_certificates} onChange={handleChange} className="w-5 h-5 rounded border-border" />
                            <label htmlFor="wants_certificates" className="text-sm font-medium cursor-pointer">
                                Souhaitez-vous délivrer des certificats de réussite ?
                            </label>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Nombre approximatif d'apprenants au lancement</label>
                            <select name="estimated_learners" value={formData.estimated_learners} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="">Sélectionner...</option>
                                <option value="1-50">1 - 50</option>
                                <option value="51-200">51 - 200</option>
                                <option value="201-1000">201 - 1,000</option>
                                <option value="1000+">1,000 +</option>
                            </select>
                        </div>

                        <div className="space-y-4 pt-2">
                            <label className="text-sm font-semibold block">Mode d'inscription souhaité</label>
                            <div className="space-y-3">
                                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.registration_mode === 'auto' ? 'bg-primary/5 border-primary' : 'border-border bg-background'}`}>
                                    <input type="radio" name="registration_mode" value="auto" checked={formData.registration_mode === 'auto'} onChange={handleChange} className="mt-1" />
                                    <div>
                                        <span className="font-bold block">Auto-inscription</span>
                                        <span className="text-xs text-muted-foreground">Les étudiants créent leur propre compte sur votre site.</span>
                                    </div>
                                </label>
                                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.registration_mode === 'invitation' ? 'bg-primary/5 border-primary' : 'border-border bg-background'}`}>
                                    <input type="radio" name="registration_mode" value="invitation" checked={formData.registration_mode === 'invitation'} onChange={handleChange} className="mt-1" />
                                    <div>
                                        <span className="font-bold block">Invitation par admin</span>
                                        <span className="text-xs text-muted-foreground">Vous contrôlez qui a accès en envoyant des invitations par courriel.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-sm font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Vente de cours</label>
                                <div className="flex items-center gap-4">
                                    <input type="checkbox" id="will_sell_courses" name="will_sell_courses" checked={formData.will_sell_courses} onChange={handleChange} className="w-5 h-5" />
                                    <label htmlFor="will_sell_courses" className="text-sm cursor-pointer">Allez-vous vendre vos formations ?</label>
                                </div>
                                {formData.will_sell_courses && (
                                    <div className="flex items-center gap-4 pl-9">
                                        <input type="checkbox" id="has_stripe" name="has_stripe" checked={formData.has_stripe} onChange={handleChange} className="w-5 h-5" />
                                        <label htmlFor="has_stripe" className="text-sm cursor-pointer">Avez-vous déjà un compte Stripe ?</label>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 border-l pl-8 border-border">
                                <label className="text-sm font-semibold flex items-center gap-2"><Loader2 className="w-4 h-4 text-amber-500" /> Forfait choisi</label>
                                <div className="space-y-2">
                                    <div className={`p-3 rounded-lg border text-sm flex justify-between items-center ${formData.selected_plan === 'starter' ? 'border-emerald-500 bg-emerald-50 font-bold' : 'border-border bg-slate-50 opacity-60'}`}>
                                        <span>Starter</span>
                                        <span>1 999 $</span>
                                    </div>
                                    <div className={`p-3 rounded-lg border text-sm flex justify-between items-center ${formData.selected_plan === 'pro' ? 'border-blue-500 bg-blue-50 font-bold' : 'border-border bg-slate-50 opacity-60'}`}>
                                        <span>Pro ⭐</span>
                                        <span>2 999 $</span>
                                    </div>
                                    <div className={`p-3 rounded-lg border text-sm flex justify-between items-center ${formData.selected_plan === 'enterprise' ? 'border-purple-500 bg-purple-50 font-bold' : 'border-border bg-slate-50 opacity-60'}`}>
                                        <span>Enterprise</span>
                                        <span>4 599 $</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-4 border-b pb-6 border-border">
                            <label className="text-sm font-semibold block flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> État des lieux</label>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setFormData({ ...formData, content_readiness: 'ready' })} className={`flex-1 p-3 rounded-xl border text-sm transition-all ${formData.content_readiness === 'ready' ? 'bg-primary/5 border-primary font-bold' : 'border-border hover:bg-slate-50'}`}>Tous mes contenus sont prêts</button>
                                <button type="button" onClick={() => setFormData({ ...formData, content_readiness: 'prep' })} className={`flex-1 p-3 rounded-xl border text-sm transition-all ${formData.content_readiness === 'prep' ? 'bg-primary/5 border-primary font-bold' : 'border-border hover:bg-slate-50'}`}>En préparation</button>
                            </div>
                            <div className="space-y-2 pt-2">
                                <label className="text-xs text-muted-foreground">Date cible de lancement</label>
                                <input type="date" name="target_launch_date" value={formData.target_launch_date} onChange={handleChange} className="w-full h-11 px-4 rounded-xl border border-border bg-background" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Questions ou besoins particuliers</label>
                            <textarea
                                name="comments" value={formData.comments} onChange={handleChange} rows={4}
                                placeholder="Détaillez vos besoins spécifiques..."
                                className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-4 py-2 p-4 bg-primary/10 rounded-xl">
                            <input type="checkbox" id="auth" required className="w-5 h-5 rounded" />
                            <label htmlFor="auth" className="text-xs text-primary leading-tight">J'autorise <strong>learningskills.ca</strong> à utiliser ces informations pour la configuration et la mise en service de ma plateforme.</label>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-gradient-subtle">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-accent text-accent-foreground mb-4">ONBOARDING CLIENT</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Configurez Votre Empire</h1>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Commençons par les détails qui feront de votre académie une plateforme unique et performante.</p>
                    </motion.div>
                </div>

                {/* PROGRESS STEPS BAR */}
                <div className="flex justify-between items-center mb-12 relative px-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 -z-10" />
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 -z-10 transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;
                        return (
                            <div key={step.id} className="relative flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-primary text-white scale-110' : isActive ? 'bg-white border-2 border-primary text-primary scale-125 z-10 shadow-lg' : 'bg-white border border-border text-muted-foreground'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap hidden sm:block ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{step.title}</span>
                            </div>
                        )
                    })}
                </div>

                {/* FORM CARD */}
                <div className="bg-card rounded-3xl shadow-elevated border border-border overflow-hidden">
                    <div className="p-8 md:p-12 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>
                    </div>

                    <div className="px-8 pb-10 flex border-t border-border pt-8 bg-slate-50/50 justify-between items-center mt-auto">
                        <Button
                            variant="ghost" onClick={prevStep} disabled={currentStep === 1 || loading}
                            className="h-12 rounded-xl border border-border px-6 hover:bg-slate-100 font-bold"
                        >
                            <ChevronLeft className="mr-2 w-4 h-4" /> Précédent
                        </Button>

                        {currentStep < STEPS.length ? (
                            <Button
                                onClick={nextStep} className="h-12 rounded-xl px-10 font-bold shadow-lg"
                            >
                                Continuer <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit} disabled={loading}
                                className="h-12 rounded-xl px-10 font-bold bg-gradient-accent text-accent-foreground shadow-lg hover:opacity-90"
                            >
                                {loading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Envoi...</> : <>🚀 Lancer ma demande</>}
                            </Button>
                        )}
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-muted-foreground">Besoin d'aide ? Contactez-nous à <span className="font-bold">support@learningskills.ca</span></p>
            </div>
        </div>
    );
};

export default OnboardingPage;
