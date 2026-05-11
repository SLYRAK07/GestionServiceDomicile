import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CompleteProfile() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        categorie_id: '',
        titre: '',
        description: '',
        prix: '',
    });

    useEffect(() => {
        api.get('/categories/').then(res => setCategories(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/services/', formData);
            setSuccess('Votre demande a été soumise ! En attente de validation par l\'administrateur.');
            setTimeout(() => navigate('/prestataire'), 3000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la soumission.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#080808', paddingTop: '100px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 40px 80px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>
                        ESPACE PRESTATAIRE
                    </p>
                    <h1 className="luxury-font" style={{ fontSize: '3rem', color: '#e8e0d0', marginBottom: '10px' }}>
                        Proposer un Service
                    </h1>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto' }}></div>
                    <p style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                        Votre offre sera examinée par notre équipe avant d'être publiée.
                    </p>
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

                {/* Formulaire */}
                <div className="glass-card" style={{ padding: '40px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                        {/* Catégorie */}
                        <div>
                            <label style={styles.label}>CATÉGORIE</label>
                            <select
                                className="luxury-input"
                                value={formData.categorie_id}
                                onChange={e => setFormData({ ...formData, categorie_id: e.target.value })}
                                required
                                style={{ width: '100%', background: '#0d0d0d', color: '#e8e0d0' }}
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.icone} {c.nom}</option>
                                ))}
                            </select>
                        </div>

                        {/* Titre */}
                        <div>
                            <label style={styles.label}>TITRE DU SERVICE</label>
                            <input
                                className="luxury-input"
                                type="text"
                                placeholder="Ex: Plomberie professionnelle"
                                value={formData.titre}
                                onChange={e => setFormData({ ...formData, titre: e.target.value })}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label style={styles.label}>DESCRIPTION</label>
                            <textarea
                                className="luxury-input"
                                rows="5"
                                placeholder="Décrivez votre service en détail..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {/* Prix */}
                        <div>
                            <label style={styles.label}>PRIX (MAD/HEURE)</label>
                            <input
                                className="luxury-input"
                                type="number"
                                placeholder="Ex: 150"
                                min="1"
                                value={formData.prix}
                                onChange={e => setFormData({ ...formData, prix: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="gold-button"
                            style={{ padding: '18px', fontSize: '0.7rem', letterSpacing: '3px', marginTop: '10px' }}
                            disabled={loading}
                        >
                            {loading ? 'ENVOI EN COURS...' : 'SOUMETTRE MA DEMANDE'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    label: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.6rem',
        letterSpacing: '3px',
        display: 'block',
        marginBottom: '8px',
    },
};

export default CompleteProfile;