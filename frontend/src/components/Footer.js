import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    {/* Logo */}
                    <div style={styles.col}>
                        <h3 className="luxury-font" style={styles.logo}>
                            SERVI<span style={{ color: '#C5A059' }}>HOME</span>
                        </h3>
                        <div className="gold-divider" style={{ margin: '20px 0' }}></div>
                        <p style={styles.desc}>
                            La première conciergerie digitale dédiée aux résidences de prestige au Maroc.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div style={styles.col}>
                        <h6 style={styles.colTitle}>NAVIGATION</h6>
                        <div style={styles.linkList}>
                            <Link to="/" style={styles.link}>Accueil</Link>
                            <Link to="/services" style={styles.link}>Services</Link>
                            <Link to="/login" style={styles.link}>Connexion</Link>
                            <Link to="/register" style={styles.link}>S'inscrire</Link>
                        </div>
                    </div>

                    {/* Services */}
                    <div style={styles.col}>
                        <h6 style={styles.colTitle}>NOS SERVICES</h6>
                        <div style={styles.linkList}>
                            <span style={styles.link}>🔧 Plomberie</span>
                            <span style={styles.link}>🧹 Ménage</span>
                            <span style={styles.link}>🌿 Jardinage</span>
                            <span style={styles.link}>💻 Informatique</span>
                            <span style={styles.link}>🎨 Peinture</span>
                        </div>
                    </div>

                    {/* Contact */}
                    <div style={styles.col}>
                        <h6 style={styles.colTitle}>CONTACT</h6>
                        <div style={styles.linkList}>
                            <span style={styles.link}>📧 contact@servihome.ma</span>
                            <span style={styles.link}>📞 +212 6 00 00 00 00</span>
                            <span style={styles.link}>📍 Casablanca, Maroc</span>
                        </div>
                        <div style={styles.socials}>
                            <span style={styles.social}>f</span>
                            <span style={styles.social}>in</span>
                            <span style={styles.social}>tw</span>
                        </div>
                    </div>
                </div>

                <div style={styles.bottom}>
                    <div style={styles.goldLine}></div>
                    <p style={styles.copyright}>
                        © 2026 ServiHome. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: '#050505',
        borderTop: '1px solid rgba(197,160,89,0.2)',
        padding: '80px 0 40px',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 60px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '60px',
        marginBottom: '60px',
    },
    col: {
        display: 'flex',
        flexDirection: 'column',
    },
    logo: {
        fontSize: '1.8rem',
        letterSpacing: '4px',
        color: '#e8e0d0',
    },
    desc: {
        color: 'rgba(232,224,208,0.4)',
        fontSize: '0.8rem',
        lineHeight: '2',
        letterSpacing: '0.5px',
    },
    colTitle: {
        color: '#C5A059',
        fontSize: '0.65rem',
        letterSpacing: '3px',
        marginBottom: '25px',
        fontFamily: 'Montserrat, sans-serif',
    },
    linkList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    link: {
        color: 'rgba(232,224,208,0.4)',
        textDecoration: 'none',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        transition: 'color 0.3s ease',
        cursor: 'pointer',
    },
    socials: {
        display: 'flex',
        gap: '15px',
        marginTop: '25px',
    },
    social: {
        width: '35px',
        height: '35px',
        border: '1px solid rgba(197,160,89,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#C5A059',
        fontSize: '0.7rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    bottom: {
        textAlign: 'center',
    },
    goldLine: {
        width: '100%',
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.4), transparent)',
        marginBottom: '30px',
    },
    copyright: {
        color: 'rgba(232,224,208,0.25)',
        fontSize: '0.65rem',
        letterSpacing: '2px',
    },
};

export default Footer;