import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    const [compte, setCompte] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCompte(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div style={styles.page}>
            <div style={styles.content}>
                <p style={styles.code}>404</p>
                <div style={styles.goldLine}></div>
                <h1 className="luxury-font" style={styles.titre}>
                    Page Introuvable
                </h1>
                <p style={styles.message}>
                    La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <p style={styles.compteur}>
                    Redirection dans <span style={{ color: '#C5A059' }}>{compte}</span> secondes...
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                    <button
                        className="gold-button"
                        style={{ padding: '15px 40px' }}
                        onClick={() => navigate('/')}
                    >
                        ACCUEIL
                    </button>
                    <button
                        className="gold-button"
                        style={{ padding: '15px 40px' }}
                        onClick={() => navigate(-1)}
                    >
                        RETOUR
                    </button>
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
        textAlign: 'center',
        background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.05) 0%, transparent 70%)',
    },
    content: {
        padding: '40px',
    },
    code: {
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '10rem',
        color: 'rgba(197,160,89,0.15)',
        lineHeight: '1',
        margin: 0,
        letterSpacing: '20px',
    },
    goldLine: {
        width: '60px',
        height: '1px',
        backgroundColor: '#C5A059',
        margin: '20px auto',
    },
    titre: {
        fontSize: '3rem',
        color: '#e8e0d0',
        marginBottom: '20px',
        letterSpacing: '4px',
    },
    message: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.9rem',
        letterSpacing: '1px',
        lineHeight: '1.8',
        maxWidth: '400px',
        margin: '0 auto 20px',
    },
    compteur: {
        color: 'rgba(232,224,208,0.3)',
        fontSize: '0.75rem',
        letterSpacing: '3px',
    },
};

export default NotFound;