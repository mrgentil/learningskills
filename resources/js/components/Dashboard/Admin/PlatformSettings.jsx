import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Settings,
    Palette,
    CreditCard,
    Cpu,
    Save,
    RefreshCw,
    ShieldCheck,
    CheckCircle2,
    ChevronRight,
    LayoutDashboard
} from 'lucide-react';

const PlatformSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/settings');
            setSettings(res.data);
        } catch (err) {
            toast.error("Erreur lors du chargement des paramètres.");
        } finally {
            setLoading(false);
        }
    };

    const handleSetupDefaults = async () => {
        setLoading(true);
        try {
            await axios.post('/api/admin/settings/setup');
            toast.success("Plateforme initialisée avec succès !");
            fetchSettings();
        } catch (err) {
            toast.error("Échec de l'initialisation.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (group, key, value) => {
        setSettings(prev => ({
            ...prev,
            [group]: prev[group].map(s => s.key === key ? { ...s, value } : s)
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {};
            Object.values(settings).flat().forEach(s => {
                payload[s.key] = { value: s.value, type: s.type, group: s.group };
            });

            await axios.post('/api/admin/settings', { settings: payload });
            toast.success("Configuration mise à jour ! ✨");
        } catch (err) {
            toast.error("Erreur lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '400px', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <RefreshCw size={40} className="animate-spin" style={{ color: 'var(--cbx-amber)' }} />
                <p style={{ fontWeight: 800, color: '#94a3b8', letterSpacing: '2px', fontSize: '12px' }}>SYNCHRONISATION DU SYSTÈME...</p>
            </div>
        );
    }

    if (Object.keys(settings).length === 0) {
        return (
            <div style={{ background: 'white', borderRadius: '35px', padding: '80px 40px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }}>
                <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                    <Cpu size={40} style={{ color: '#cbd5e1' }} />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 950, color: '#0f172a', marginBottom: '15px' }}>Configuration Requise</h2>
                <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '500px', margin: '0 auto 40px', fontWeight: 500, lineHeight: 1.6 }}>
                    La plateforme n'est pas encore initialisée. Générez les paramètres globaux par défaut pour commencer à personnaliser votre SaaS.
                </p>
                <button onClick={handleSetupDefaults} className="btn-modern btn-primary-modern" style={{ height: '60px', padding: '0 40px', borderRadius: '18px', fontSize: '15px' }}>
                    🚀 Initialiser la Plateforme
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'Général', icon: Settings, desc: 'Identité et accès' },
        { id: 'branding', label: 'Apparence', icon: Palette, desc: 'Couleurs et thèmes' },
        { id: 'payments', label: 'Paiements', icon: CreditCard, desc: 'Stripe et taxes' },
        { id: 'tech', label: 'Système', icon: Cpu, desc: 'Maintenance et API' },
    ];

    const currentSettings = settings[activeTab] || [];

    return (
        <div className="platform-config-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
                        Config <span style={{ color: '#f59e0b' }}>Plateforme</span> ⚙️
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '15px', marginTop: '5px', fontWeight: 500 }}>
                        Maîtrise totale sur les paramètres globaux du SaaS.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-modern btn-primary-modern"
                    style={{ height: '54px', padding: '0 30px', borderRadius: '15px', fontSize: '14px' }}
                >
                    {saving ? <RefreshCw size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '30px' }}>
                {/* Lateral Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '18px 25px',
                                borderRadius: '20px',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: activeTab === tab.id ? 'var(--cbx-navy)' : 'white',
                                color: activeTab === tab.id ? 'white' : '#64748b',
                                boxShadow: activeTab === tab.id ? '0 10px 20px -5px rgba(15, 23, 42, 0.2)' : 'none',
                                transform: activeTab === tab.id ? 'translateX(5px)' : 'none'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <tab.icon size={20} style={{ color: activeTab === tab.id ? '#f59e0b' : '#94a3b8' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '14px' }}>{tab.label}</div>
                                <div style={{ fontSize: '11px', opacity: 0.6, fontWeight: 700 }}>{tab.desc}</div>
                            </div>
                            {activeTab === tab.id && <ChevronRight size={16} style={{ color: '#f59e0b' }} />}
                        </button>
                    ))}

                    <div style={{ marginTop: '30px', padding: '25px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '25px', border: '1px dashed rgba(245, 158, 11, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <ShieldCheck size={18} style={{ color: '#d97706' }} />
                            <span style={{ fontSize: '11px', fontWeight: 900, color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px' }}>Zone Critique</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#b45309', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
                            Ces modifications affectent instantanément toutes les instances. Gérez avec précaution.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ background: 'white', borderRadius: '35px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                    <div style={{ padding: '30px 40px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '10px', background: 'var(--cbx-navy)', borderRadius: '12px' }}>
                            {activeTab === 'general' && <Settings size={20} style={{ color: '#f59e0b' }} />}
                            {activeTab === 'branding' && <Palette size={20} style={{ color: '#f59e0b' }} />}
                            {activeTab === 'payments' && <CreditCard size={20} style={{ color: '#f59e0b' }} />}
                            {activeTab === 'tech' && <Cpu size={20} style={{ color: '#f59e0b' }} />}
                        </div>
                        <h3 style={{ margin: 0, fontWeight: 900, fontSize: '20px', color: '#0f172a' }}>{tabs.find(t => t.id === activeTab)?.label}</h3>
                    </div>

                    <div style={{ padding: '40px' }}>
                        {currentSettings.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                                {currentSettings.map((setting) => (
                                    <div key={setting.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                                {setting.key.replace(/_/g, ' ')}
                                            </label>
                                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>Type: {setting.type.toUpperCase()}</span>
                                        </div>

                                        {setting.type === 'boolean' ? (
                                            <div
                                                onClick={() => handleChange(activeTab, setting.key, setting.value === '1' || setting.value === true ? false : true)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '15px',
                                                    padding: '15px 25px',
                                                    background: '#f8fafc',
                                                    borderRadius: '15px',
                                                    cursor: 'pointer',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                            >
                                                <div style={{
                                                    width: '50px',
                                                    height: '26px',
                                                    background: (setting.value === '1' || setting.value === true) ? '#10b981' : '#cbd5e1',
                                                    borderRadius: '20px',
                                                    position: 'relative',
                                                    transition: 'all 0.3s'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '3px',
                                                        left: (setting.value === '1' || setting.value === true) ? '27px' : '3px',
                                                        width: '20px',
                                                        height: '20px',
                                                        background: 'white',
                                                        borderRadius: '50%',
                                                        transition: 'all 0.3s'
                                                    }} />
                                                </div>
                                                <span style={{ fontWeight: 800, fontSize: '14px', color: (setting.value === '1' || setting.value === true) ? '#059669' : '#64748b' }}>
                                                    {(setting.value === '1' || setting.value === true) ? 'Activé' : 'Désactivé'}
                                                </span>
                                            </div>
                                        ) : (
                                            <input
                                                type={setting.type === 'integer' ? 'number' : 'text'}
                                                className="form-control"
                                                style={{
                                                    borderRadius: '15px',
                                                    padding: '15px 20px',
                                                    fontWeight: 700,
                                                    fontSize: '15px',
                                                    background: '#f8fafc',
                                                    border: '1px solid #e2e8f0',
                                                    width: '100%'
                                                }}
                                                value={setting.value || ''}
                                                onChange={(e) => handleChange(activeTab, setting.key, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <RefreshCw size={30} style={{ color: '#e2e8f0', marginBottom: '15px' }} />
                                <p style={{ fontWeight: 700, color: '#94a3b8' }}>Aucun paramètre configuré pour cette section.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
