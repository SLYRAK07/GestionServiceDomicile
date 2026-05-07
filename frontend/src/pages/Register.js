import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'client',
        telephone: '',
        adresse: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError('Erreur lors de l\'inscription. Vérifiez vos informations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <p style={styles.preTitle}>REJOIGNEZ-NOUS</p>
                    <h1 className="luxury-font" style={styles.title}>
                        SERVI<span style={{ color: '#C5A059' }}>HOME</span>
                    </h1>
                    <div style={styles.goldLine}></div>
                    <p style={styles.subtitle}>CRÉATION DE COMPTE</p>
                </div>

                {/* Role selector */}
                <div style={styles.roleSelector}>
                    <button
                        type="button"
                        style={{
                            ...styles.roleBtn,
                            ...(formData.role === 'client' ? styles.roleBtnActive : {})
                        }}
                        onClick={() => setFormData({ ...formData, role: 'client' })}
                    >
                        👤 CLIENT
                    </button>
                    <button
                        type="button"
                        style={{
                            ...styles.roleBtn,
                            ...(formData.role === 'prestataire' ? styles.roleBtnActive : {})
                        }}
                        onClick={() => setFormData({ ...formData, role: 'prestataire' })}
                    >
                        🛠️ PRESTATAIRE
                    </button>
                </div>

                {/* Role description */}
                <p style={styles.roleDesc}>
                    {formData.role === 'client'
                        ? '✨ Réservez des services à domicile auprès de nos experts vérifiés'
                        : '💼 Proposez vos services et développez votre clientèle'
                    }
                </p>

                {/* Error */}
                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>NOM D'UTILISATEUR</label>
                            <input
                                type="text"
                                name="username"
                                className="luxury-input"
                                placeholder="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>EMAIL</label>
                            <input
                                type="email"
                                name="email"
                                className="luxury-input"
                                placeholder="email@exemple.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>MOT DE PASSE</label>
                        <input
                            type="password"
                            name="password"
                            className="luxury-input"
                            placeholder="Mot de passe sécurisé"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>TÉLÉPHONE</label>
                            <input
                                type="text"
                                name="telephone"
                                className="luxury-input"
                                placeholder="+212 6 00 00 00 00"
                                value={formData.telephone}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>VILLE</label>
                            <input
                                type="text"
                                name="adresse"
                                className="luxury-input"
                                placeholder="Casablanca"
                                value={formData.adresse}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="gold-button"
                        style={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'CRÉATION...' : `S'INSCRIRE EN TANT QUE ${formData.role.toUpperCase()}`}
                    </button>
                </form>

                {/* Divider */}
                <div style={styles.divider}>
                    <div style={styles.dividerLine}></div>
                    <span style={styles.dividerText}>OU</span>
                    <div style={styles.dividerLine}></div>
                </div>

                {/* Login link */}
                <div style={{ textAlign: 'center' }}>
                    <p style={styles.loginText}>Déjà membre ?</p>
                    <Link to="/login" style={styles.loginLink}>SE CONNECTER</Link>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/" style={styles.backLink}>← Retour à l'accueil</Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.05) 0%, transparent 70%)',
    },
    card: {
        width: '100%',
        maxWidth: '600px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(197,160,89,0.2)',
        padding: '60px 50px',
        backdropFilter: 'blur(10px)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '35px',
    },
    preTitle: {
        color: '#C5A059',
        fontSize: '0.6rem',
        letterSpacing: '6px',
        marginBottom: '15px',
    },
    title: {
        fontSize: '2.5rem',
        letterSpacing: '8px',
        color: '#e8e0d0',
        margin: 0,
    },
    goldLine: {
        width: '60px',
        height: '1px',
        backgroundColor: '#C5A059',
        margin: '20px auto',
    },
    subtitle: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.65rem',
        letterSpacing: '5px',
    },
    roleSelector: {
        display: 'flex',
        gap: '15px',
        marginBottom: '15px',
    },
    roleBtn: {
        flex: 1,
        padding: '15px',
        background: 'transparent',
        border: '1px solid rgba(197,160,89,0.2)',
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.65rem',
        letterSpacing: '3px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    roleBtnActive: {
        border: '1px solid #C5A059',
        color: '#C5A059',
        background: 'rgba(197,160,89,0.05)',
    },
    roleDesc: {
        color: 'rgba(232,224,208,0.35)',
        fontSize: '0.72rem',
        letterSpacing: '0.5px',
        textAlign: 'center',
        marginBottom: '25px',
        lineHeight: '1.6',
    },
    error: {
        border: '1px solid rgba(220,53,69,0.3)',
        backgroundColor: 'rgba(220,53,69,0.05)',
        color: '#dc3545',
        padding: '12px 16px',
        fontSize: '0.8rem',
        letterSpacing: '1px',
        marginBottom: '25px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.6rem',
        letterSpacing: '3px',
    },
    submitBtn: {
        width: '100%',
        padding: '15px',
        marginTop: '10px',
        fontSize: '0.65rem',
        letterSpacing: '2px',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        margin: '30px 0',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: 'rgba(197,160,89,0.2)',
    },
    dividerText: {
        color: 'rgba(232,224,208,0.3)',
        fontSize: '0.6rem',
        letterSpacing: '3px',
    },
    loginText: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        marginBottom: '15px',
    },
    loginLink: {
        color: '#C5A059',
        textDecoration: 'none',
        fontSize: '0.7rem',
        letterSpacing: '4px',
        border: '1px solid #C5A059',
        padding: '12px 40px',
        display: 'inline-block',
    },
    backLink: {
        color: 'rgba(232,224,208,0.3)',
        textDecoration: 'none',
        fontSize: '0.65rem',
        letterSpacing: '2px',
    },
};

export default Register;