import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Admin() {
    const [stats, setStats] = useState(null);
    const [prestataires, setPrestataires] = useState([]);
    const [clients, setClients] = useState([]);
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [statsRes, prestRes, clientRes, demandesRes] = await Promise.all([
                api.get('/accounts/admin/stats/'),
                api.get('/accounts/admin/users/?role=prestataire'),
                api.get('/accounts/admin/users/?role=client'),
                api.get('/services/?statut=en_attente'),
            ]);
            setStats(statsRes.data);
            setPrestataires(prestRes.data);
            setClients(clientRes.data);
            setDemandes(demandesRes.data);
        } catch (err) {
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBan = async (userId, currentStatus, username) => {
        try {
            const res = await api.patch(`/accounts/admin/users/${userId}/toggle-ban/`);
            setSuccess(`Compte de ${username} ${res.data.is_active ? 'activé' : 'banni'} avec succès`);
            fetchAll();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('Erreur lors de la modification');
            setTimeout(() => setError(''), 4000);
        }
    };

    const handleApprouver = async (serviceId) => {
        try {
            await api.post(`/services/${serviceId}/approuver/`);
            setSuccess('Service approuvé ✅');
            fetchAll();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('Erreur lors de l\'approbation');
            setTimeout(() => setError(''), 4000);
        }
    };

    const handleRefuserService = async (serviceId) => {
        try {
            await api.post(`/services/${serviceId}/refuser/`);
            setSuccess('Service refusé');
            fetchAll();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('Erreur lors du refus');
            setTimeout(() => setError(''), 4000);
        }
    };

    const renderStars = (note) => {
        return [1, 2, 3, 4, 5].map(n => (
            <span key={n} style={{ color: n <= Math.round(note) ? '#C5A059' : 'rgba(197,160,89,0.2)', fontSize: '0.9rem' }}>★</span>
        ));
    };

    const filteredPrestataires = prestataires.filter(p =>
        p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const tabs = [
        { key: 'overview', label: 'VUE GLOBALE' },
        { key: 'demandes', label: `DEMANDES ${demandes.length > 0 ? `(${demandes.length})` : ''}` },
        { key: 'prestataires', label: 'PRESTATAIRES' },
        { key: 'clients', label: 'CLIENTS' },
    ];

    if (loading) return (
        <div style={{ backgroundColor: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#C5A059', letterSpacing: '6px', fontSize: '0.7rem' }}>CHARGEMENT...</p>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#080808', paddingTop: '100px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 40px 80px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>
                        PANNEAU DE CONTRÔLE
                    </p>
                    <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', color: '#e8e0d0', marginBottom: '10px' }}>
                        Administration
                    </h1>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto 25px' }}></div>
<a  href="http://127.0.0.1:8000/admin/"
    target="_blank"
    rel="noreferrer"
    className="gold-button"
    style={{ padding: '10px 25px', fontSize: '0.6rem', letterSpacing: '2px', textDecoration: 'none', display: 'inline-block' }}
>
    ⚙️ DJANGO ADMIN
</a>




                </div>

                {/* Messages */}
                {success && <div style={msgStyle('green')}>{success}</div>}
                {error && <div style={msgStyle('red')}>{error}</div>}

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '50px', borderBottom: '1px solid rgba(197,160,89,0.15)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab.key ? '2px solid #C5A059' : '2px solid transparent',
                                color: activeTab === tab.key ? '#C5A059' : 'rgba(232,224,208,0.3)',
                                padding: '12px 25px',
                                fontSize: '0.6rem',
                                letterSpacing: '3px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                marginBottom: '-1px',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* TAB: VUE GLOBALE */}
                {activeTab === 'overview' && stats && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '50px' }}>
                            {[
                                { value: stats.total_clients, label: 'CLIENTS', color: '#C5A059' },
                                { value: stats.total_prestataires, label: 'PRESTATAIRES', color: '#28a745' },
                                { value: stats.total_reservations, label: 'RÉSERVATIONS', color: '#e8e0d0' },
                                { value: stats.reservations_en_attente, label: 'EN ATTENTE', color: '#ffc107' },
                            ].map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                                    <h2 style={{ color: s.color, fontSize: '2.5rem', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>{s.value}</h2>
                                    <p style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.55rem', letterSpacing: '3px', marginTop: '10px', marginBottom: 0 }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '50px' }}>
                            {[
                                { value: stats.reservations_confirmees, label: 'CONFIRMÉES', color: '#28a745' },
                                { value: stats.reservations_terminees, label: 'TERMINÉES', color: '#6c757d' },
                                { value: stats.reservations_annulees, label: 'ANNULÉES', color: '#dc3545' },
                            ].map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
                                    <h3 style={{ color: s.color, fontSize: '2rem', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>{s.value}</h3>
                                    <p style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.55rem', letterSpacing: '3px', marginTop: '8px', marginBottom: 0 }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card" style={{ padding: '40px' }}>
                            <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '5px', marginBottom: '30px' }}>
                                ⭐ CLASSEMENT PRESTATAIRES PAR NOTE
                            </p>
                            {[...prestataires].sort((a, b) => b.note_moyenne - a.note_moyenne).slice(0, 5).map((p, i) => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px 0', borderBottom: i < 4 ? '1px solid rgba(197,160,89,0.1)' : 'none' }}>
                                    <span style={{ color: '#C5A059', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif', width: '30px' }}>#{i + 1}</span>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(197,160,89,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059', fontSize: '1rem', flexShrink: 0 }}>
                                        {p.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: '#e8e0d0', fontSize: '0.85rem', margin: 0 }}>{p.username}</p>
                                        <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.65rem', margin: '3px 0 0' }}>{p.email}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>{renderStars(p.note_moyenne)}</span>
                                        <span style={{ color: '#C5A059', fontSize: '0.85rem', fontFamily: 'Cormorant Garamond, serif' }}>
                                            {p.note_moyenne > 0 ? p.note_moyenne.toFixed(1) : '—'}/5
                                        </span>
                                    </div>
                                    <span style={{ padding: '3px 12px', fontSize: '0.55rem', letterSpacing: '2px', border: `1px solid ${p.is_active ? 'rgba(40,167,69,0.4)' : 'rgba(220,53,69,0.4)'}`, color: p.is_active ? '#28a745' : '#dc3545' }}>
                                        {p.is_active ? 'ACTIF' : 'BANNI'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* TAB: DEMANDES */}
                {activeTab === 'demandes' && (
                    <>
                        <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '5px', marginBottom: '30px' }}>
                            📋 DEMANDES EN ATTENTE — {demandes.length} demande(s)
                        </p>

                        {demandes.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px' }}>
                                <p style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</p>
                                <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.9rem', letterSpacing: '3px' }}>
                                    AUCUNE DEMANDE EN ATTENTE
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                                {demandes.map(s => (
                                    <div key={s.id} className="glass-card" style={{ padding: '30px', borderLeft: '2px solid #ffc107' }}>
                                        {/* Prestataire */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '1px solid rgba(197,160,89,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059', fontSize: '1rem', flexShrink: 0 }}>
                                                {s.prestataire?.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ color: '#e8e0d0', fontSize: '0.85rem', margin: 0 }}>{s.prestataire?.username}</p>
                                                <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.65rem', margin: '3px 0 0' }}>{s.prestataire?.email}</p>
                                            </div>
                                        </div>

                                        {/* Infos service */}
                                        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div>
                                                <span style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.6rem', letterSpacing: '2px' }}>CATÉGORIE</span>
                                                <p style={{ color: '#C5A059', fontSize: '0.8rem', margin: '4px 0 0' }}>{s.categorie?.icone} {s.categorie?.nom}</p>
                                            </div>
                                            <div>
                                                <span style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.6rem', letterSpacing: '2px' }}>TITRE</span>
                                                <p style={{ color: '#e8e0d0', fontSize: '0.85rem', margin: '4px 0 0' }}>{s.titre}</p>
                                            </div>
                                            <div>
                                                <span style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.6rem', letterSpacing: '2px' }}>DESCRIPTION</span>
                                                <p style={{ color: 'rgba(232,224,208,0.6)', fontSize: '0.8rem', margin: '4px 0 0', lineHeight: '1.6' }}>{s.description}</p>
                                            </div>
                                            <div>
                                                <span style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.6rem', letterSpacing: '2px' }}>PRIX</span>
                                                <p style={{ color: '#C5A059', fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif', margin: '4px 0 0' }}>{s.prix} MAD/h</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="gold-button"
                                                style={{ flex: 1, padding: '12px', fontSize: '0.6rem', borderColor: 'rgba(40,167,69,0.5)', color: '#28a745' }}
                                                onClick={() => handleApprouver(s.id)}
                                            >
                                                ✅ APPROUVER
                                            </button>
                                            <button
                                                className="gold-button"
                                                style={{ flex: 1, padding: '12px', fontSize: '0.6rem', borderColor: 'rgba(220,53,69,0.5)', color: '#dc3545' }}
                                                onClick={() => handleRefuserService(s.id)}
                                            >
                                                ❌ REFUSER
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* TAB: PRESTATAIRES */}
                {activeTab === 'prestataires' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '5px', margin: 0 }}>
                                {filteredPrestataires.length} PRESTATAIRE(S)
                            </p>
                            <input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ background: 'rgba(197,160,89,0.05)', border: '1px solid rgba(197,160,89,0.2)', color: '#e8e0d0', padding: '10px 20px', fontSize: '0.75rem', outline: 'none', width: '250px' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                            {filteredPrestataires.map(p => (
                                <div key={p.id} className="glass-card" style={{ padding: '30px', borderLeft: `2px solid ${p.is_active ? 'rgba(40,167,69,0.4)' : 'rgba(220,53,69,0.4)'}`, opacity: p.is_active ? 1 : 0.7 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid rgba(197,160,89,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059', fontSize: '1.2rem', flexShrink: 0, background: 'rgba(197,160,89,0.05)' }}>
                                                {p.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ color: '#e8e0d0', fontSize: '0.9rem', margin: 0, letterSpacing: '1px' }}>{p.username}</p>
                                                <span style={{ padding: '2px 10px', fontSize: '0.55rem', letterSpacing: '2px', border: `1px solid ${p.is_active ? 'rgba(40,167,69,0.4)' : 'rgba(220,53,69,0.4)'}`, color: p.is_active ? '#28a745' : '#dc3545', marginTop: '5px', display: 'inline-block' }}>
                                                    {p.is_active ? '✓ ACTIF' : '✗ BANNI'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div>{renderStars(p.note_moyenne)}</div>
                                            <p style={{ color: '#C5A059', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', margin: '4px 0 0' }}>
                                                {p.note_moyenne > 0 ? p.note_moyenne.toFixed(1) : '—'}/5
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                        {[{ icon: '✉', value: p.email || '—' }, { icon: '📞', value: p.telephone || '—' }, { icon: '📍', value: p.adresse || '—' }].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                                <span style={{ color: 'rgba(197,160,89,0.5)', fontSize: '0.75rem', flexShrink: 0 }}>{item.icon}</span>
                                                <span style={{ color: 'rgba(232,224,208,0.5)', fontSize: '0.75rem' }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="gold-button"
                                        style={{ width: '100%', padding: '12px', fontSize: '0.6rem', borderColor: p.is_active ? 'rgba(220,53,69,0.4)' : 'rgba(40,167,69,0.4)', color: p.is_active ? '#dc3545' : '#28a745' }}
                                        onClick={() => handleToggleBan(p.id, p.is_active, p.username)}
                                    >
                                        {p.is_active ? '🔒 BANNIR CE COMPTE' : '🔓 RÉACTIVER CE COMPTE'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* TAB: CLIENTS */}
                {activeTab === 'clients' && (
                    <>
                        <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '5px', marginBottom: '30px' }}>
                            {clients.length} CLIENT(S)
                        </p>
                        <div className="glass-card" style={{ padding: '10px 40px' }}>
                            {clients.map((c, i) => (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: i < clients.length - 1 ? '1px solid rgba(197,160,89,0.08)' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(197,160,89,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059', fontSize: '0.9rem', flexShrink: 0 }}>
                                            {c.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ color: '#e8e0d0', fontSize: '0.85rem', margin: 0 }}>{c.username}</p>
                                            <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.65rem', margin: '3px 0 0' }}>
                                                {c.email} {c.telephone ? `· ${c.telephone}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ padding: '3px 12px', fontSize: '0.55rem', letterSpacing: '2px', border: `1px solid ${c.is_active ? 'rgba(40,167,69,0.4)' : 'rgba(220,53,69,0.4)'}`, color: c.is_active ? '#28a745' : '#dc3545' }}>
                                            {c.is_active ? 'ACTIF' : 'BANNI'}
                                        </span>
                                        <button
                                            className="gold-button"
                                            style={{ padding: '8px 18px', fontSize: '0.55rem', borderColor: c.is_active ? 'rgba(220,53,69,0.4)' : 'rgba(40,167,69,0.4)', color: c.is_active ? '#dc3545' : '#28a745' }}
                                            onClick={() => handleToggleBan(c.id, c.is_active, c.username)}
                                        >
                                            {c.is_active ? '🔒 BANNIR' : '🔓 RÉACTIVER'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const msgStyle = (type) => ({
    border: `1px solid rgba(${type === 'green' ? '40,167,69' : '220,53,69'},0.3)`,
    backgroundColor: `rgba(${type === 'green' ? '40,167,69' : '220,53,69'},0.05)`,
    color: type === 'green' ? '#28a745' : '#dc3545',
    padding: '15px', marginBottom: '30px',
    textAlign: 'center', fontSize: '0.8rem', letterSpacing: '1px',
});

export default Admin;