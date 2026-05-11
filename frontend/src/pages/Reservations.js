import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Reservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAvisModal, setShowAvisModal] = useState(false);
    const [reservationAvis, setReservationAvis] = useState(null);
    const [avisData, setAvisData] = useState({ note: 5, commentaire: '' });
    const [filtreActif, setFiltreActif] = useState('tous');

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const res = await api.get('/reservations/');
            setReservations(res.data);
        } catch (err) {
            setError('Erreur lors du chargement des réservations');
        } finally {
            setLoading(false);
        }
    };

    const handleAnnuler = async (id) => {
        try {
            await api.post(`/reservations/${id}/annuler/`);
            setSuccess('Réservation annulée !');
            fetchReservations();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Erreur lors de l\'annulation');
        }
    };

    const checkPeutNoter = async (reservation) => {
        try {
            const res = await api.get(`/reservations/${reservation.id}/peut_noter/`);
            if (res.data.peut_noter) {
                setReservationAvis(reservation);
                setShowAvisModal(true);
            } else {
                setError(res.data.message);
                setTimeout(() => setError(''), 4000);
            }
        } catch (err) {
            setError('Erreur lors de la vérification.');
        }
    };

    const handleSoumettreAvis = async (e) => {
        e.preventDefault();
        try {
            await api.post('/avis/', {
                reservation: reservationAvis.id,
                note: parseInt(avisData.note),
                commentaire: avisData.commentaire,
            });
            setShowAvisModal(false);
            setSuccess('Avis soumis ! Note du prestataire mise à jour ✅');
            fetchReservations();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError(err.response?.data?.non_field_errors?.[0] || 'Erreur lors de la soumission.');
            setTimeout(() => setError(''), 4000);
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
            case 'terminee': return { color: '#6c757d', border: '1px solid #6c757d' };
            case 'expiree': return { color: '#ff6b35', border: '1px solid #ff6b35' };
            case 'refusee': return { color: '#ff6b35', border: '1px solid #ff6b35' };
            default: return { color: '#C5A059', border: '1px solid #C5A059' };
        }
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case 'en_attente': return '⏳ En attente';
            case 'confirmee': return '✅ Confirmée';
            case 'annulee': return '❌ Annulée';
            case 'expiree': return '⏰ Expirée';
            case 'refusee': return '🚫 Refusée';
            case 'terminee': return '🏁 Terminée';
            default: return statut;
        }
    };

    const filtres = [
        { key: 'tous', label: 'TOUTES' },
        { key: 'en_attente', label: '⏳ EN ATTENTE' },
        { key: 'confirmee', label: '✅ CONFIRMÉES' },
        { key: 'terminee', label: '🏁 TERMINÉES' },
        { key: 'refusee', label: '🚫 REFUSÉES' },
        { key: 'annulee', label: '❌ ANNULÉES' },
        { key: 'expiree', label: '⏰ EXPIRÉES' },
    ];

    const ordreStatut = ['en_attente', 'confirmee', 'terminee', 'expiree', 'annulee', 'refusee'];

    const reservationsFiltrees = filtreActif === 'tous'
    ? [...reservations].sort((a, b) => ordreStatut.indexOf(a.statut) - ordreStatut.indexOf(b.statut))
    : reservations.filter(r => r.statut === filtreActif);

    const getBorderColor = (statut) => {
        switch (statut) {
            case 'en_attente': return '#ffc107';
            case 'confirmee': return '#28a745';
            case 'terminee': return '#C5A059';
            case 'annulee': return '#dc3545';
            case 'refusee': return '#ff6b35';
            case 'expiree': return '#ff6b35';
            default: return '#C5A059';
        }
    };

    return (
        <div style={{ backgroundColor: '#080808', paddingTop: '100px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 80px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>
                        MON ESPACE
                    </p>
                    <h1 className="luxury-font" style={{ fontSize: '3.5rem', color: '#e8e0d0', marginBottom: '10px' }}>
                        Mes Réservations
                    </h1>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto' }}></div>
                </div>

                {/* Filtres */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '50px' }}>
                    {filtres.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFiltreActif(f.key)}
                            style={{
                                background: 'transparent',
                                border: filtreActif === f.key ? '1px solid #C5A059' : '1px solid rgba(197,160,89,0.2)',
                                color: filtreActif === f.key ? '#C5A059' : 'rgba(232,224,208,0.4)',
                                padding: '8px 20px',
                                fontSize: '0.6rem',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {f.label}
                            {f.key !== 'tous' && (
                                <span style={{ marginLeft: '6px', opacity: 0.6 }}>
                                    ({reservations.filter(r => r.statut === f.key).length})
                                </span>
                            )}
                            {f.key === 'tous' && (
                                <span style={{ marginLeft: '6px', opacity: 0.6 }}>
                                    ({reservations.length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                {error && (
                    <div style={{ border: '1px solid rgba(220,53,69,0.3)', backgroundColor: 'rgba(220,53,69,0.05)', color: '#dc3545', padding: '15px', marginBottom: '30px', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '1px' }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ border: '1px solid rgba(40,167,69,0.3)', backgroundColor: 'rgba(40,167,69,0.05)', color: '#28a745', padding: '15px', marginBottom: '30px', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '1px' }}>
                        {success}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#C5A059', letterSpacing: '4px' }}>
                        CHARGEMENT...
                    </div>
                ) : reservationsFiltrees.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px' }}>
                        <p style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</p>
                        <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.9rem', letterSpacing: '3px', marginBottom: '30px' }}>
                            AUCUNE RÉSERVATION {filtreActif !== 'tous' ? `"${getStatutLabel(filtreActif).toUpperCase()}"` : ''}
                        </p>
                        {filtreActif === 'tous' && (
                            <button className="gold-button" style={{ padding: '15px 40px' }}
                                onClick={() => navigate('/services')}>
                                TROUVER UN PRESTATAIRE
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {reservationsFiltrees.map(r => (
                            <div key={r.id} className="glass-card" style={{
                                ...styles.card,
                                borderLeft: `2px solid ${getBorderColor(r.statut)}`,
                                opacity: ['annulee', 'expiree', 'refusee'].includes(r.statut) ? 0.7 : 1,
                            }}>
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

                                {r.statut === 'en_attente' && (
                                    <button
                                        className="gold-button"
                                        style={{ width: '100%', marginTop: '20px', fontSize: '0.65rem', borderColor: 'rgba(220,53,69,0.5)', color: '#dc3545' }}
                                        onClick={() => handleAnnuler(r.id)}
                                    >
                                        ❌ ANNULER
                                    </button>
                                )}
                                {(r.statut === 'confirmee' || r.statut === 'terminee') && (
                                    <button
                                        className="gold-button"
                                        style={{ width: '100%', marginTop: '20px', fontSize: '0.65rem' }}
                                        onClick={() => checkPeutNoter(r)}
                                    >
                                        ★ LAISSER UN AVIS
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Avis */}
            {showAvisModal && (
                <div style={styles.overlay} onClick={() => setShowAvisModal(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '4px', marginBottom: '10px' }}>
                                ÉVALUATION
                            </p>
                            <h3 className="luxury-font" style={{ fontSize: '1.8rem', color: '#e8e0d0' }}>
                                Laisser un avis
                            </h3>
                            <div style={{ width: '40px', height: '1px', background: '#C5A059', margin: '15px auto' }}></div>
                            <p style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.8rem' }}>
                                Réservation #{reservationAvis?.id}
                            </p>
                        </div>

                        <form onSubmit={handleSoumettreAvis} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div>
                                <label style={styles.label}>VOTRE NOTE</label>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button
                                            key={n}
                                            type="button"
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                fontSize: '2rem',
                                                cursor: 'pointer',
                                                color: n <= avisData.note ? '#C5A059' : 'rgba(197,160,89,0.2)',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onClick={() => setAvisData({ ...avisData, note: n })}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <p style={{ color: '#C5A059', fontSize: '0.7rem', letterSpacing: '2px', marginTop: '8px' }}>
                                    {avisData.note}/5
                                </p>
                            </div>

                            <div>
                                <label style={styles.label}>COMMENTAIRE</label>
                                <textarea
                                    className="luxury-input"
                                    rows="4"
                                    placeholder="Décrivez votre expérience..."
                                    value={avisData.commentaire}
                                    onChange={e => setAvisData({ ...avisData, commentaire: e.target.value })}
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button type="submit" className="gold-button" style={{ flex: 1, padding: '15px', fontSize: '0.65rem' }}>
                                    SOUMETTRE
                                </button>
                                <button type="button" className="gold-button"
                                    style={{ flex: 1, padding: '15px', fontSize: '0.65rem', borderColor: 'rgba(232,224,208,0.2)', color: 'rgba(232,224,208,0.4)' }}
                                    onClick={() => setShowAvisModal(false)}>
                                    ANNULER
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
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
    adresse: {
        color: 'rgba(232,224,208,0.6)',
        fontSize: '0.85rem',
        marginBottom: '10px',
        letterSpacing: '0.5px',
    },
    date: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.78rem',
        letterSpacing: '0.5px',
    },
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
    },
    modal: {
        background: '#0d0d0d',
        border: '1px solid rgba(197,160,89,0.3)',
        padding: '50px',
        width: '100%',
        maxWidth: '480px',
    },
    label: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.6rem',
        letterSpacing: '3px',
        display: 'block',
        marginBottom: '8px',
    },
};

export default Reservations;