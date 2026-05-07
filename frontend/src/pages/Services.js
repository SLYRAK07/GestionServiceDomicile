import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Services() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorieFilter, setCategorieFilter] = useState('');
    const [trierParNote, setTrierParNote] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [serviceChoisi, setServiceChoisi] = useState(null);
    const [formData, setFormData] = useState({ date_service: '', adresse: '' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchServices();
    }, []);

    useEffect(() => {
        fetchServices();
    }, [categorieFilter, trierParNote]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchServices = async () => {
        setLoading(true);
        try {
            let url = trierParNote ? '/services/par_note/' : '/services/';
            if (categorieFilter) url += `?categorie=${categorieFilter}`;
            const res = await api.get(url);
            setServices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReserver = (service) => {
        if (!user) {
            navigate('/login', { state: { from: '/services' } });
            return;
        }
        setServiceChoisi(service);
        setShowModal(true);
    };

    const handleConfirmerReservation = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reservations/', {
                date_service: formData.date_service,
                adresse: formData.adresse,
                prestataire: serviceChoisi.prestataire.id,
            });
            setSuccess('Réservation créée avec succès !');
            setShowModal(false);
            setTimeout(() => navigate('/reservations'), 1500);
        } catch (err) {
            setError('Erreur lors de la réservation.');
        }
    };

    const renderEtoiles = (note) => {
        const n = Math.round(note);
        return '★'.repeat(n) + '☆'.repeat(5 - n);
    };

    return (
        <div style={{ backgroundColor: '#080808', paddingTop: '100px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>
                        NOS EXPERTS
                    </p>
                    <h1 className="luxury-font" style={{ fontSize: '3.5rem', color: '#e8e0d0', marginBottom: '10px' }}>
                        Prestataires disponibles
                    </h1>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto' }}></div>
                </div>

                {/* Filtres */}
                <div style={styles.filtres}>
                    <div style={styles.filtreItem}>
                        <label style={styles.filtreLabel}>CATÉGORIE</label>
                        <select
                            className="luxury-select"
                            value={categorieFilter}
                            onChange={(e) => setCategorieFilter(e.target.value)}
                        >
                            <option value="">Toutes les catégories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.icone} {c.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.filtreItem}>
                        <label style={styles.filtreLabel}>TRI</label>
                        <button
                            className="gold-button"
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '0.65rem',
                                background: trierParNote ? '#C5A059' : 'transparent',
                                color: trierParNote ? '#080808' : '#C5A059',
                            }}
                            onClick={() => setTrierParNote(!trierParNote)}
                        >
                            {trierParNote ? '★ Trié par note' : '☆ Trier par note'}
                        </button>
                    </div>
                </div>

                {/* Liste services */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#C5A059', letterSpacing: '4px' }}>
                        CHARGEMENT...
                    </div>
                ) : services.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px' }}>
                        <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '1rem', letterSpacing: '3px' }}>
                            AUCUN PRESTATAIRE DISPONIBLE
                        </p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {services.map((s, i) => (
                            <div key={s.id} className="glass-card" style={styles.card}>
                                {i === 0 && trierParNote && (
                                    <div style={styles.topBadge}>TOP RATED</div>
                                )}
                                <div style={styles.cardHeader}>
                                    <div style={styles.avatar}>
                                        {s.prestataire.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h5 style={styles.prestataireNom}>
                                            {s.prestataire.username.toUpperCase()}
                                        </h5>
                                        <p style={styles.categorieNom}>
                                            {s.categorie.icone} {s.categorie.nom}
                                        </p>
                                    </div>
                                </div>

                                <h4 className="luxury-font" style={styles.serviceTitre}>{s.titre}</h4>
                                <p style={styles.serviceDesc}>{s.description}</p>

                                <div style={styles.cardInfos}>
                                    <span style={styles.etoiles}>
                                        {renderEtoiles(s.note_moyenne)}
                                        <span style={{ color: '#C5A059', marginLeft: '8px' }}>
                                            {s.note_moyenne}/5
                                        </span>
                                    </span>
                                    <span style={styles.prix}>{s.prix} DH/h</span>
                                </div>

                                <button
                                    className="gold-button"
                                    style={{ width: '100%', marginTop: '20px', fontSize: '0.65rem' }}
                                    onClick={() => handleReserver(s)}
                                >
                                    RÉSERVER
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal réservation */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '4px', marginBottom: '10px' }}>
                                NOUVELLE RÉSERVATION
                            </p>
                            <h3 className="luxury-font" style={{ fontSize: '1.8rem', color: '#e8e0d0' }}>
                                {serviceChoisi?.titre}
                            </h3>
                            <div style={{ width: '40px', height: '1px', background: '#C5A059', margin: '15px auto' }}></div>
                            <p style={{ color: 'rgba(232,224,208,0.5)', fontSize: '0.8rem' }}>
                                {serviceChoisi?.prestataire.username} — {serviceChoisi?.prix} DH/h
                            </p>
                        </div>

                        {success && (
                            <div style={{ border: '1px solid rgba(40,167,69,0.3)', backgroundColor: 'rgba(40,167,69,0.05)', color: '#28a745', padding: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '0.8rem' }}>
                                {success}
                            </div>
                        )}
                        {error && (
                            <div style={{ border: '1px solid rgba(220,53,69,0.3)', backgroundColor: 'rgba(220,53,69,0.05)', color: '#dc3545', padding: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '0.8rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleConfirmerReservation} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={styles.modalLabel}>DATE ET HEURE DU SERVICE</label>
                                <input
                                    type="datetime-local"
                                    className="luxury-input"
                                    value={formData.date_service}
                                    onChange={(e) => setFormData({ ...formData, date_service: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={styles.modalLabel}>ADRESSE DU SERVICE</label>
                                <input
                                    type="text"
                                    className="luxury-input"
                                    placeholder="Ex: 123 Rue Hassan II, Casablanca"
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="submit" className="gold-button" style={{ flex: 1, padding: '15px', fontSize: '0.65rem' }}>
                                    CONFIRMER
                                </button>
                                <button
                                    type="button"
                                    className="gold-button"
                                    style={{ flex: 1, padding: '15px', fontSize: '0.65rem', borderColor: 'rgba(232,224,208,0.3)', color: 'rgba(232,224,208,0.5)' }}
                                    onClick={() => setShowModal(false)}
                                >
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
    filtres: {
        display: 'flex',
        gap: '30px',
        marginBottom: '60px',
        alignItems: 'flex-end',
    },
    filtreItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '250px',
    },
    filtreLabel: {
        color: '#C5A059',
        fontSize: '0.6rem',
        letterSpacing: '3px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '30px',
        marginBottom: '80px',
    },
    card: {
        padding: '35px',
        position: 'relative',
    },
    topBadge: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        border: '1px solid #C5A059',
        color: '#C5A059',
        padding: '4px 12px',
        fontSize: '0.55rem',
        letterSpacing: '2px',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px',
    },
    avatar: {
        width: '55px',
        height: '55px',
        borderRadius: '50%',
        border: '1px solid rgba(197,160,89,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: '#C5A059',
        flexShrink: 0,
    },
    prestataireNom: {
        fontSize: '0.9rem',
        letterSpacing: '2px',
        color: '#e8e0d0',
        marginBottom: '4px',
        fontFamily: 'Montserrat, sans-serif',
    },
    categorieNom: {
        fontSize: '0.65rem',
        opacity: 0.4,
        letterSpacing: '2px',
    },
    serviceTitre: {
        fontSize: '1.2rem',
        color: '#e8e0d0',
        marginBottom: '10px',
        letterSpacing: '1px',
    },
    serviceDesc: {
        fontSize: '0.78rem',
        opacity: 0.4,
        lineHeight: '1.7',
        marginBottom: '20px',
    },
    cardInfos: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(197,160,89,0.1)',
        paddingTop: '15px',
    },
    etoiles: {
        color: '#C5A059',
        fontSize: '0.9rem',
    },
    prix: {
        color: '#C5A059',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '1.1rem',
        letterSpacing: '1px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        maxWidth: '500px',
        backdropFilter: 'blur(10px)',
    },
    modalLabel: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.6rem',
        letterSpacing: '3px',
        display: 'block',
        marginBottom: '8px',
    },
};

export default Services;