import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function PrestataireDashboard() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
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

    const handleConfirmer = async (id) => {
        try {
            await api.post(`/reservations/${id}/confirmer/`);
            setSuccess('Réservation confirmée ! Email envoyé au client ✅');
            fetchReservations();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('Erreur lors de la confirmation');
        }
    };

    const handleRefuser = async (id) => {
        try {
            await api.post(`/reservations/${id}/refuser/`);
            setSuccess('Réservation refusée. Email envoyé au client.');
            fetchReservations();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('Erreur lors du refus');
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
            default: return { color: '#C5A059', border: '1px solid #C5A059' };
        }
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case 'en_attente': return '⏳ En attente';
            case 'confirmee': return '✅ Confirmée';
            case 'annulee': return '❌ Annulée/Refusée';
            default: return statut;
        }
    };

    const enAttente = reservations.filter(r => r.statut === 'en_attente');
    const confirmees = reservations.filter(r => r.statut === 'confirmee');
    const historique = reservations.filter(r => r.statut === 'annulee');

    return (
        <div style={{ backgroundColor: '#080808', paddingTop: '100px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 80px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>
                        ESPACE PRESTATAIRE
                    </p>
                    <h1 className="luxury-font" style={{ fontSize: '3.5rem', color: '#e8e0d0', marginBottom: '10px' }}>
                        Mes Demandes
                    </h1>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto' }}></div>
                    <p style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.8rem', letterSpacing: '2px' }}>
                        Bienvenue, {user?.username?.toUpperCase()}
                    </p>
                </div>

                {/* Stats */}
                <div style={styles.stats}>
                    {[
                        { value: enAttente.length, label: 'EN ATTENTE', color: '#ffc107' },
                        { value: confirmees.length, label: 'CONFIRMÉES', color: '#28a745' },
                        { value: historique.length, label: 'REFUSÉES', color: '#dc3545' },
                        { value: reservations.length, label: 'TOTAL', color: '#C5A059' },
                    ].map((s, i) => (
                        <div key={i} className="glass-card" style={styles.statCard}>
                            <h2 style={{ color: s.color, fontSize: '2.5rem', fontFamily: 'Cormorant Garamond, serif' }}>
                                {s.value}
                            </h2>
                            <p style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.6rem', letterSpacing: '3px', marginTop: '8px' }}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Messages */}
                {error && (
                    <div style={styles.errorMsg}>{error}</div>
                )}
                {success && (
                    <div style={styles.successMsg}>{success}</div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#C5A059', letterSpacing: '4px' }}>
                        CHARGEMENT...
                    </div>
                ) : reservations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px' }}>
                        <p style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</p>
                        <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.9rem', letterSpacing: '3px' }}>
                            AUCUNE DEMANDE POUR LE MOMENT
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Demandes en attente */}
                        {enAttente.length > 0 && (
                            <div style={{ marginBottom: '60px' }}>
                                <p style={{ color: '#ffc107', fontSize: '0.6rem', letterSpacing: '5px', marginBottom: '25px' }}>
                                    ⏳ DEMANDES EN ATTENTE — {enAttente.length} demande(s)
                                </p>
                                <div style={styles.grid}>
                                    {enAttente.map(r => (
                                        <div key={r.id} className="glass-card" style={{ ...styles.card, borderLeft: '2px solid #ffc107' }}>
                                            <div style={styles.cardTop}>
                                                <span style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.65rem', letterSpacing: '2px' }}>
                                                    DEMANDE #{r.id}
                                                </span>
                                                <span style={{ ...getStatutStyle(r.statut), padding: '4px 12px', fontSize: '0.6rem', letterSpacing: '2px' }}>
                                                    {getStatutLabel(r.statut)}
                                                </span>
                                            </div>

                                            <div style={styles.clientInfo}>
                                                <div style={styles.clientAvatar}>
                                                    {r.client_username ? r.client_username.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div>
                                                    <p style={{ color: '#e8e0d0', fontSize: '0.85rem', letterSpacing: '1px' }}>
                                                        {r.client_username || 'Client'}
                                                    </p>
                                                    <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.65rem' }}>CLIENT</p>
                                                </div>
                                            </div>

                                            <p style={styles.adresse}>📍 {r.adresse}</p>
                                            <p style={styles.date}>📅 {formatDate(r.date_service)}</p>

                                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                                <button
                                                    className="gold-button"
                                                    style={{ flex: 1, padding: '12px', fontSize: '0.6rem' }}
                                                    onClick={() => handleConfirmer(r.id)}
                                                >
                                                    ✅ CONFIRMER
                                                </button>
                                                <button
                                                    className="gold-button"
                                                    style={{ flex: 1, padding: '12px', fontSize: '0.6rem', borderColor: 'rgba(220,53,69,0.5)', color: '#dc3545' }}
                                                    onClick={() => handleRefuser(r.id)}
                                                >
                                                    ❌ REFUSER
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Confirmées */}
                        {confirmees.length > 0 && (
                            <div style={{ marginBottom: '60px' }}>
                                <p style={{ color: '#28a745', fontSize: '0.6rem', letterSpacing: '5px', marginBottom: '25px' }}>
                                    ✅ RÉSERVATIONS CONFIRMÉES — {confirmees.length}
                                </p>
                                <div style={styles.grid}>
                                    {confirmees.map(r => (
                                        <div key={r.id} className="glass-card" style={{ ...styles.card, borderLeft: '2px solid #28a745' }}>
                                            <div style={styles.cardTop}>
                                                <span style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.65rem', letterSpacing: '2px' }}>
                                                    RÉSERVATION #{r.id}
                                                </span>
                                                <span style={{ ...getStatutStyle(r.statut), padding: '4px 12px', fontSize: '0.6rem', letterSpacing: '2px' }}>
                                                    {getStatutLabel(r.statut)}
                                                </span>
                                            </div>
                                            <p style={styles.adresse}>📍 {r.adresse}</p>
                                            <p style={styles.date}>📅 {formatDate(r.date_service)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Historique refusées */}
                        {historique.length > 0 && (
                            <div>
                                <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.6rem', letterSpacing: '5px', marginBottom: '25px' }}>
                                    🏁 HISTORIQUE — {historique.length}
                                </p>
                                <div style={styles.grid}>
                                    {historique.map(r => (
                                        <div key={r.id} className="glass-card" style={{ ...styles.card, opacity: 0.5 }}>
                                            <div style={styles.cardTop}>
                                                <span style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.65rem', letterSpacing: '2px' }}>
                                                    RÉSERVATION #{r.id}
                                                </span>
                                                <span style={{ ...getStatutStyle(r.statut), padding: '4px 12px', fontSize: '0.6rem', letterSpacing: '2px' }}>
                                                    {getStatutLabel(r.statut)}
                                                </span>
                                            </div>
                                            <p style={styles.adresse}>📍 {r.adresse}</p>
                                            <p style={styles.date}>📅 {formatDate(r.date_service)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '50px',
    },
    statCard: {
        padding: '30px',
        textAlign: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '25px',
    },
    card: {
        padding: '30px',
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    clientInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '15px',
        padding: '12px',
        background: 'rgba(197,160,89,0.03)',
        border: '1px solid rgba(197,160,89,0.1)',
    },
    clientAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid rgba(197,160,89,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#C5A059',
        fontSize: '1rem',
        flexShrink: 0,
    },
    adresse: {
        color: 'rgba(232,224,208,0.6)',
        fontSize: '0.85rem',
        marginBottom: '10px',
    },
    date: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.78rem',
    },
    errorMsg: {
        border: '1px solid rgba(220,53,69,0.3)',
        backgroundColor: 'rgba(220,53,69,0.05)',
        color: '#dc3545',
        padding: '15px',
        marginBottom: '30px',
        textAlign: 'center',
        fontSize: '0.8rem',
        letterSpacing: '1px',
    },
    successMsg: {
        border: '1px solid rgba(40,167,69,0.3)',
        backgroundColor: 'rgba(40,167,69,0.05)',
        color: '#28a745',
        padding: '15px',
        marginBottom: '30px',
        textAlign: 'center',
        fontSize: '0.8rem',
        letterSpacing: '1px',
    },
};

export default PrestataireDashboard;