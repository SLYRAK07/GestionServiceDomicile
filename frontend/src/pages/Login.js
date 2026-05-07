import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const data = await login(username, password);

        // Redirection basée sur le rôle stocké dans ton modèle User
        if (data.user.role === 'admin') {
            navigate('/app-admin');
        } else if (data.user.role === 'prestataire') {
            navigate('/prestataire');
        } else {
            const from = location.state?.from || '/dashboard';
            navigate(from);
        }
    } catch (err) {
        // VERROU SÉCURITÉ : Capture des erreurs 401 (Bannissement) ou 403 (Middleware)
        if (err.response && err.response.data) {
            // Affiche le message "Ce compte a été suspendu" du Serializer
            // ou "Compte bloqué temporairement" du Middleware
            setError(err.response.data.detail || err.response.data.error || 'Identifiants incorrects.');
        } else {
            setError('Le serveur Django ne répond pas (Vérifie le port 8000).');
        }
    } finally {
        setLoading(false);
    }
};

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <p style={styles.preTitle}>ESPACE MEMBRE</p>
                    <h1 className="luxury-font" style={styles.title}>
                        SERVI<span style={{ color: '#C5A059' }}>HOME</span>
                    </h1>
                    <div style={styles.goldLine}></div>
                    <p style={styles.subtitle}>CONNEXION</p>
                </div>

                {/* Error */}
                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>NOM D'UTILISATEUR</label>
                        <input
                            type="text"
                            className="luxury-input"
                            placeholder="Votre username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>MOT DE PASSE</label>
                        <input
                            type="password"
                            className="luxury-input"
                            placeholder="Votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="gold-button"
                        style={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'CONNEXION...' : 'SE CONNECTER'}
                    </button>
                </form>

                {/* Divider */}
                <div style={styles.divider}>
                    <div style={styles.dividerLine}></div>
                    <span style={styles.dividerText}>OU</span>
                    <div style={styles.dividerLine}></div>
                </div>

                {/* Register link */}
                <div style={styles.registerSection}>
                    <p style={styles.registerText}>Pas encore de compte ?</p>
                    <Link to="/register" style={styles.registerLink}>
                        S'INSCRIRE
                    </Link>
                </div>

                {/* Back home */}
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
        maxWidth: '480px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(197,160,89,0.2)',
        padding: '60px 50px',
        backdropFilter: 'blur(10px)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
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
        fontSize: '0.7rem',
        letterSpacing: '3px',
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
    registerSection: {
        textAlign: 'center',
    },
    registerText: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        marginBottom: '15px',
    },
    registerLink: {
        color: '#C5A059',
        textDecoration: 'none',
        fontSize: '0.7rem',
        letterSpacing: '4px',
        border: '1px solid #C5A059',
        padding: '12px 40px',
        display: 'inline-block',
        transition: 'all 0.3s ease',
    },
    backLink: {
        color: 'rgba(232,224,208,0.3)',
        textDecoration: 'none',
        fontSize: '0.65rem',
        letterSpacing: '2px',
    },
};

export default Login;