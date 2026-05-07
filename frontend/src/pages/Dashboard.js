import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const res = await api.get('/reservations/');
            setReservations(res.data);
        } catch (err) {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatutStyle = (statut) => {
        switch (statut) {
            case 'en_attente': return { color: '#ffc107', border: '1px solid #ffc107' };
            case 'confirmee': return { color: '#28a745', border: '1px solid #28a745' };
            case 'annulee': return { color: '#dc3545', border: '1px solid #dc3545' };
            case 'expiree': return { color: '#ff6b35', border: '1px solid #ff6b35' };
            case 'terminee': return { color: '#6c757d', border: '1px solid #6c757d' };
            default: return { color: '#C5A059', border: '1px solid #C5A059' };
        }
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case 'en_attente': return '⏳ En attente';
            case 'confirmee': return '✅ Confirmée';
            case 'annulee': return '❌ Annulée';
            case 'expiree': return '⏰ Expirée';
            case 'terminee': return '🏁 Terminée';
            default: return statut;
        }
    };

    const enAttente = reservations.filter(r => r.statut === 'en_attente');
    const confirmees = reservations.filter(r => r.statut === 'confirmee');
    const terminees = reservations.filter(r => r.statut === 'terminee');
    const annulees = reservations.filter(r => ['annulee', 'expiree'].includes(r.statut));

    // 3 dernières réservations toutes catégories confondues
    const dernieres = [...reservations]
        .sort((a, b) => new Date(b.date_reservation) - new Date(a.date_reservation))
        .slice(0, 3);

    return (
        <div style={{ backgroundColor: '#080808', paddingTop: '100px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 80px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>
                        MON ESPACE
                    </p>
                    <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', color: '#e8e0d0', marginBottom: '10px' }}>
                        Bonjour, {user?.username?.toUpperCase()}
                    </h1>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto' }}></div>
                    <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.7rem', letterSpacing: '2px' }}>
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                    </p>
                </div>

                {error && (
                    <div style={{ border: '1px solid rgba(220,53,69,0.3)', backgroundColor: 'rgba(220,53,69,0.05)', color: '#dc3545', padding: '15px', marginBottom: '30px', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '1px' }}>
                        {error}
                    </div>
                )}

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '50px' }}>
                    {[
                        { value: enAttente.length, label: 'EN ATTENTE', color: '#ffc107' },
                        { value: confirmees.length, label: 'CONFIRMÉES', color: '#28a745' },
                        { value: terminees.length, label: 'TERMINÉES', color: '#6c757d' },
                        { value: reservations.length, label: 'TOTAL', color: '#C5A059' },
                    ].map((s, i) => (
                        <div key={i} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                            <h2 style={{ color: s.color, fontSize: '2.5rem', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>
                                {s.value}
                            </h2>
                            <p style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.55rem', letterSpacing: '3px', marginTop: '10px', marginBottom: 0 }}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '50px' }}>

                    {/* Profil résumé */}
                    <div className="glass-card" style={{ padding: '35px' }}>
                        <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '5px', marginBottom: '25px' }}>
                            👤 MON PROFIL
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%',
                                border: '2px solid rgba(197,160,89,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#C5A059', fontSize: '1.5rem',
                                background: 'rgba(197,160,89,0.05)', flexShrink: 0,
                            }}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={{ color: '#e8e0d0', fontSize: '1rem', margin: 0, letterSpacing: '1px' }}>{user?.username}</p>
                                <span style={{ border: '1px solid rgba(197,160,89,0.4)', color: '#C5A059', padding: '2px 10px', fontSize: '0.55rem', letterSpacing: '2px', marginTop: '5px', display: 'inline-block' }}>
                                    CLIENT
                                </span>
                            </div>
                        </div>
                        {[
                            { label: 'EMAIL', value: user?.email || '—' },
                            { label: 'TÉLÉPHONE', value: user?.telephone || '—' },
                            { label: 'STATUT', value: '✅ Actif' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(197,160,89,0.08)' }}>
                                <span style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.6rem', letterSpacing: '2px' }}>{item.label}</span>
                                <span style={{ color: '#e8e0d0', fontSize: '0.8rem' }}>{item.value}</span>
                            </div>
                        ))}
                        <button
                            className="gold-button"
                            style={{ width: '100%', marginTop: '20px', padding: '12px', fontSize: '0.6rem' }}
                            onClick={() => navigate('/profile')}
                        >
                            ✏️ MODIFIER MON PROFIL
                        </button>
                    </div>

                    {/* Accès rapides */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '5px', margin: '0 0 5px' }}>
                            🚀 ACCÈS RAPIDES
                        </p>

                        {[
                            {
                                icon: '🔍',
                                title: 'Trouver un prestataire',
                                desc: 'Parcourez nos experts disponibles',
                                path: '/services',
                                color: '#C5A059',
                            },
                            {
                                icon: '📋',
                                title: 'Mes réservations',
                                desc: `${reservations.length} réservation(s) au total`,
                                path: '/reservations',
                                color: '#28a745',
                            },
                            {
                                icon: '⏳',
                                title: 'En attente',
                                desc: `${enAttente.length} demande(s) en cours`,
                                path: '/reservations',
                                color: '#ffc107',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="glass-card"
                                style={{ padding: '20px 25px', cursor: 'pointer', borderLeft: `2px solid ${item.color}`, transition: 'all 0.3s ease' }}
                                onClick={() => navigate(item.path)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                    <div>
                                        <p style={{ color: '#e8e0d0', fontSize: '0.8rem', margin: 0, letterSpacing: '1px' }}>{item.title}</p>
                                        <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.65rem', margin: '4px 0 0' }}>{item.desc}</p>
                                    </div>
                                    <span style={{ marginLeft: 'auto', color: item.color, fontSize: '1rem' }}>→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dernières réservations */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#C5A059', letterSpacing: '4px', fontSize: '0.7rem' }}>
                        CHARGEMENT...
                    </div>
                ) : dernieres.length > 0 ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '5px', margin: 0 }}>
                                🕐 DERNIÈRES RÉSERVATIONS
                            </p>
                            <button
                                onClick={() => navigate('/reservations')}
                                style={{ background: 'transparent', border: 'none', color: 'rgba(197,160,89,0.6)', fontSize: '0.6rem', letterSpacing: '2px', cursor: 'pointer' }}
                            >
                                VOIR TOUT →
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {dernieres.map(r => (
                                <div key={r.id} className="glass-card" style={{ padding: '25px', borderLeft: `2px solid ${getStatutStyle(r.statut).color}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <span style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.6rem', letterSpacing: '2px' }}>
                                            #{r.id}
                                        </span>
                                        <span style={{ ...getStatutStyle(r.statut), padding: '3px 10px', fontSize: '0.55rem', letterSpacing: '1px' }}>
                                            {getStatutLabel(r.statut)}
                                        </span>
                                    </div>
                                    <p style={{ color: 'rgba(232,224,208,0.6)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                        📍 {r.adresse}
                                    </p>
                                    <p style={{ color: 'rgba(232,224,208,0.35)', fontSize: '0.7rem', margin: 0 }}>
                                        📅 {formatDate(r.date_service)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px' }} className="glass-card">
                        <p style={{ fontSize: '3rem', marginBottom: '20px' }}>📭</p>
                        <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.8rem', letterSpacing: '3px', marginBottom: '30px' }}>
                            AUCUNE RÉSERVATION POUR LE MOMENT
                        </p>
                        <button className="gold-button" style={{ padding: '15px 40px', fontSize: '0.65rem' }} onClick={() => navigate('/services')}>
                            TROUVER UN PRESTATAIRE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;