import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recommandations, setRecommandations] = useState([]);

    useEffect(() => {
        api.get('/services/recommandations/')
            .then(res => setRecommandations(res.data))
            .catch(() => {});
    }, []);

    const renderStars = (note) => {
        return [1, 2, 3, 4, 5].map(n => (
            <span key={n} style={{ color: n <= Math.round(note) ? '#C5A059' : 'rgba(197,160,89,0.2)' }}>★</span>
        ));
    };

    const getMedaille = (index) => {
        switch (index) {
            case 0: return { emoji: '🥇', label: '1ER', color: '#FFD700' };
            case 1: return { emoji: '🥈', label: '2ÈME', color: '#C0C0C0' };
            case 2: return { emoji: '🥉', label: '3ÈME', color: '#CD7F32' };
            default: return { emoji: '⭐', label: `${index + 1}ÈME`, color: '#C5A059' };
        }
    };

    return (
        <div style={{ backgroundColor: '#080808' }}>

            {/* HERO */}
            <section style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.05) 0%, transparent 70%)',
                paddingTop: '80px',
            }}>
                <div>
                    <p style={{ color: '#C5A059', fontSize: '0.65rem', letterSpacing: '6px', marginBottom: '20px' }}>
                        BIENVENUE CHEZ
                    </p>
                    <h1 className="luxury-font" style={{ fontSize: '7rem', letterSpacing: '15px', color: '#e8e0d0', margin: 0 }}>
                        SERVI<span style={{ color: '#C5A059' }}>HOME</span>
                    </h1>
                    <div style={{ width: '100px', height: '1px', backgroundColor: '#C5A059', margin: '25px auto' }}></div>
                    <p style={{ color: '#C5A059', letterSpacing: '8px', fontSize: '0.7rem', marginBottom: '25px' }}>
                        L'EXCELLENCE À VOTRE SERVICE
                    </p>
                    <p style={{ maxWidth: '600px', margin: '0 auto 20px', opacity: 0.5, lineHeight: '2.2', fontSize: '0.95rem' }}>
                        La première conciergerie digitale dédiée aux résidences de prestige au Maroc.
                        Connectez-vous avec les meilleurs artisans pour un quotidien simplifié.
                    </p>
                    <div style={{ marginTop: '45px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="gold-button" style={{ padding: '15px 45px', fontSize: '0.7rem' }}
                            onClick={() => navigate('/services')}>
                            EXPLORER NOS SERVICES
                        </button>
                        {!user && (
                            <button className="gold-button" style={{ padding: '15px 45px', fontSize: '0.7rem' }}
                                onClick={() => navigate('/register')}>
                                DEVENIR MEMBRE
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '80px',
                padding: '60px 0',
                backgroundColor: '#050505',
                borderTop: '1px solid rgba(197,160,89,0.1)',
                borderBottom: '1px solid rgba(197,160,89,0.1)',
                flexWrap: 'wrap',
            }}>
                {[
                    { value: '500+', label: 'PRESTATAIRES' },
                    { value: '10K+', label: 'MISSIONS' },
                    { value: '4.8★', label: 'NOTE MOYENNE' },
                    { value: '24/7', label: 'DISPONIBILITÉ' },
                ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <h3 className="luxury-font" style={{ fontSize: '3rem', color: '#C5A059', letterSpacing: '3px' }}>{s.value}</h3>
                        <p style={{ fontSize: '0.6rem', letterSpacing: '4px', opacity: 0.4, marginTop: '8px' }}>{s.label}</p>
                    </div>
                ))}
            </section>

            {/* CATEGORIES */}
            <section style={{ padding: '120px 10%', textAlign: 'center' }}>
                <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>NOS DOMAINES</p>
                <h2 className="luxury-font" style={{ fontSize: '3rem', color: '#e8e0d0', marginBottom: '10px' }}>Catégories de Services</h2>
                <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto 60px' }}></div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '25px',
                    maxWidth: '900px',
                    margin: '0 auto',
                }}>
                    {[
                        { icon: '🔧', nom: 'Plomberie', desc: 'Réparations & installations' },
                        { icon: '🧹', nom: 'Ménage', desc: 'Nettoyage & entretien' },
                        { icon: '🌿', nom: 'Jardinage', desc: 'Espaces verts' },
                        { icon: '💻', nom: 'Informatique', desc: 'Support technique' },
                        { icon: '🎨', nom: 'Peinture', desc: 'Décoration intérieure' },
                        { icon: '🚚', nom: 'Déménagement', desc: 'Transport & logistique' },
                    ].map((cat, i) => (
                        <div key={i} className="glass-card" style={{ padding: '40px 30px', cursor: 'pointer', textAlign: 'center' }}
                            onClick={() => navigate('/services')}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{cat.icon}</div>
                            <h5 className="luxury-font" style={{ fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '8px', color: '#e8e0d0' }}>{cat.nom}</h5>
                            <p style={{ fontSize: '0.7rem', opacity: 0.4, letterSpacing: '1px' }}>{cat.desc}</p>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '80px' }}>
                    <button className="gold-button" style={{ padding: '15px 50px' }}
                        onClick={() => navigate('/services')}>
                        VOIR TOUS LES PRESTATAIRES
                    </button>
                </div>
            </section>

            {/* RECOMMANDATIONS IA */}
            {recommandations.length > 0 && (
                <section style={{ padding: '120px 10%', backgroundColor: '#050505', textAlign: 'center' }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>
                        INTELLIGENCE ARTIFICIELLE
                    </p>
                    <h2 className="luxury-font" style={{ fontSize: '3rem', color: '#e8e0d0', marginBottom: '10px' }}>
                        Nos Experts Recommandés
                    </h2>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto 15px' }}></div>
                    <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '60px' }}>
                        Sélectionnés par notre algorithme IA selon la note, la fiabilité, le prix et l'analyse des avis
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.min(recommandations.length, 3)}, 1fr)`,
                        gap: '25px',
                        maxWidth: '1100px',
                        margin: '0 auto',
                    }}>
                        {recommandations.slice(0, 3).map((s, i) => {
                            const medaille = getMedaille(i);
                            return (
                                <div key={s.id} className="glass-card" style={{
                                    padding: '40px 30px',
                                    textAlign: 'center',
                                    borderTop: `2px solid ${medaille.color}`,
                                    position: 'relative',
                                }}>
                                    {/* Médaille */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: '#080808',
                                        border: `1px solid ${medaille.color}`,
                                        padding: '5px 15px',
                                        fontSize: '0.55rem',
                                        letterSpacing: '3px',
                                        color: medaille.color,
                                    }}>
                                        {medaille.emoji} {medaille.label}
                                    </div>

                                    {/* Avatar */}
                                    <div style={{
                                        width: '70px', height: '70px',
                                        borderRadius: '50%',
                                        border: `2px solid ${medaille.color}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: medaille.color,
                                        fontSize: '1.8rem',
                                        margin: '20px auto 15px',
                                        background: 'rgba(197,160,89,0.05)',
                                        fontFamily: 'Cormorant Garamond, serif',
                                    }}>
                                        {s.prestataire?.username?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Nom */}
                                    <p style={{ color: '#e8e0d0', fontSize: '1rem', letterSpacing: '2px', marginBottom: '5px' }}>
                                        {s.prestataire?.username}
                                    </p>

                                    {/* Catégorie */}
                                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '3px', marginBottom: '15px' }}>
                                        {s.categorie?.icone} {s.categorie?.nom}
                                    </p>

                                    {/* Titre service */}
                                    <p style={{ color: 'rgba(232,224,208,0.6)', fontSize: '0.8rem', marginBottom: '15px', fontStyle: 'italic' }}>
                                        {s.titre}
                                    </p>

                                    {/* Stars */}
                                    <div style={{ marginBottom: '8px', fontSize: '1.1rem' }}>
                                        {renderStars(s.note_moyenne)}
                                    </div>
                                    <p style={{ color: '#C5A059', fontSize: '0.85rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '15px' }}>
                                        {s.note_moyenne > 0 ? s.note_moyenne.toFixed(1) : '—'}/5
                                    </p>

                                    {/* Prix */}
                                    <p style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.75rem', marginBottom: '15px' }}>
                                        {s.prix} MAD/h
                                    </p>

                                    {/* Score IA */}
                                    <div style={{
                                        background: 'rgba(197,160,89,0.05)',
                                        border: '1px solid rgba(197,160,89,0.15)',
                                        padding: '8px',
                                        marginBottom: '20px',
                                    }}>
                                        <p style={{ color: 'rgba(232,224,208,0.3)', fontSize: '0.55rem', letterSpacing: '2px', marginBottom: '4px' }}>
                                            SCORE IA
                                        </p>
                                        <p style={{ color: medaille.color, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>
                                            {(s.score_ia * 100).toFixed(1)}%
                                        </p>
                                    </div>

                                    <button
                                        className="gold-button"
                                        style={{ width: '100%', padding: '12px', fontSize: '0.6rem' }}
                                        onClick={() => navigate('/services')}
                                    >
                                        RÉSERVER
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* COMMENT CA MARCHE */}
            <section style={{ padding: '120px 10%', backgroundColor: recommandations.length > 0 ? '#080808' : '#050505', textAlign: 'center' }}>
                <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>PROCESSUS</p>
                <h2 className="luxury-font" style={{ fontSize: '3rem', color: '#e8e0d0', marginBottom: '10px' }}>Comment ça marche</h2>
                <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto 60px' }}></div>
                <div style={{ display: 'flex', gap: '35px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                        { num: '01', title: 'Rechercher', desc: 'Parcourez nos prestataires vérifiés et triez par note ou catégorie' },
                        { num: '02', title: 'Réserver', desc: 'Choisissez la date, l\'heure et l\'adresse de votre service' },
                        { num: '03', title: 'Profiter', desc: 'Votre expert intervient à domicile et vous laissez un avis' },
                    ].map((step, i) => (
                        <div key={i} className="glass-card" style={{ padding: '50px 40px', minWidth: '260px', maxWidth: '300px', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', color: 'rgba(197,160,89,0.15)', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', lineHeight: '1', marginBottom: '20px' }}>
                                {step.num}
                            </div>
                            <h4 className="luxury-font" style={{ fontSize: '1.5rem', letterSpacing: '2px', marginBottom: '15px', color: '#e8e0d0' }}>{step.title}</h4>
                            <p style={{ fontSize: '0.8rem', opacity: 0.4, lineHeight: '1.8' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* AVIS */}
            <section style={{ padding: '120px 10%', textAlign: 'center' }}>
                <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>TÉMOIGNAGES</p>
                <h2 className="luxury-font" style={{ fontSize: '3rem', color: '#e8e0d0', marginBottom: '10px' }}>Ce que disent nos clients</h2>
                <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto 60px' }}></div>
                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                        { nom: 'Sara M.', comment: 'Service impeccable, prestataire très professionnel.', note: 5 },
                        { nom: 'Karim B.', comment: 'Ponctuel et efficace. Je recommande vivement.', note: 5 },
                        { nom: 'Nadia H.', comment: 'Excellent rapport qualité-prix, je re-commanderai.', note: 4 },
                    ].map((a, i) => (
                        <div key={i} className="glass-card" style={{ padding: '40px', minWidth: '280px', maxWidth: '320px', textAlign: 'left' }}>
                            <div style={{ color: '#C5A059', fontSize: '1rem', letterSpacing: '3px', marginBottom: '20px' }}>
                                {'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}
                            </div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.9', fontStyle: 'italic', marginBottom: '20px' }}>
                                "{a.comment}"
                            </p>
                            <p style={{ fontSize: '0.65rem', color: '#C5A059', letterSpacing: '3px' }}>— {a.nom}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA FINAL */}
            {!user && (
                <section style={{
                    padding: '150px 20px',
                    textAlign: 'center',
                    background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.05) 0%, transparent 70%)',
                }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>REJOIGNEZ-NOUS</p>
                    <h2 className="luxury-font" style={{ fontSize: '3.5rem', color: '#e8e0d0', maxWidth: '700px', margin: '0 auto', lineHeight: '1.3' }}>
                        Prêt à vivre l'expérience ServiHome ?
                    </h2>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '30px auto' }}></div>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
                        <button className="gold-button" style={{ padding: '18px 50px' }}
                            onClick={() => navigate('/register')}>
                            DEVENIR MEMBRE
                        </button>
                        <button className="gold-button" style={{ padding: '18px 50px' }}
                            onClick={() => navigate('/register')}>
                            DEVENIR PRESTATAIRE
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Home;