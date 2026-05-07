import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/app-admin';
        if (user?.role === 'prestataire') return '/prestataire';
        return '/dashboard';
    };

    return (
        <nav style={{
            ...styles.nav,
            background: scrolled ? 'rgba(8,8,8,0.98)' : 'transparent',
            borderBottom: scrolled ? '1px solid rgba(197,160,89,0.2)' : 'none',
        }}>
            <Link to="/" style={styles.logo}>
                SERVI<span style={{ color: '#C5A059' }}>HOME</span>
            </Link>

            {/* Desktop menu */}
            <div style={styles.links}>
                <Link to="/" style={styles.link}>Accueil</Link>
                <Link to="/services" style={styles.link}>Services</Link>
                {user ? (
                    <>
                        <Link to={getDashboardLink()} style={styles.link}>
                            Dashboard
                        </Link>
                        {user.role === 'client' && (
                            <Link to="/reservations" style={styles.link}>
                                Réservations
                            </Link>
                        )}
                        <Link to="/profile" style={styles.username}>👤 Profile</Link>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            DÉCONNEXION
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Connexion</Link>
                        <Link to="/register" style={styles.goldBtn}>
                            S'INSCRIRE
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile burger */}
            <button
                style={styles.burger}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile menu */}
            {menuOpen && (
                <div style={styles.mobileMenu}>
                    <Link to="/" style={styles.mobileLink}>Accueil</Link>
                    <Link to="/services" style={styles.mobileLink}>Services</Link>
                    {user ? (
                        <>
                            <Link to={getDashboardLink()} style={styles.mobileLink}>Dashboard</Link>
                            {user.role === 'client' && (
                                <Link to="/reservations" style={styles.mobileLink}>Réservations</Link>
                            )}
                            <button onClick={handleLogout} style={styles.mobileLinkBtn}>
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.mobileLink}>Connexion</Link>
                            <Link to="/register" style={styles.mobileLink}>S'inscrire</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

const styles = {
    nav: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 60px',
        transition: 'all 0.4s ease',
    },
    logo: {
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#e8e0d0',
        textDecoration: 'none',
        letterSpacing: '4px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '35px',
    },
    link: {
        color: 'rgba(232,224,208,0.7)',
        textDecoration: 'none',
        fontSize: '0.7rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        transition: 'color 0.3s ease',
    },

    username: {
    color: '#C5A059',
    fontSize: '0.7rem',
    letterSpacing: '2px',
    textDecoration: 'none',
    cursor: 'pointer',
    },
    goldBtn: {
        color: '#C5A059',
        textDecoration: 'none',
        fontSize: '0.7rem',
        letterSpacing: '2px',
        border: '1px solid #C5A059',
        padding: '8px 20px',
        transition: 'all 0.3s ease',
    },
    logoutBtn: {
        background: 'transparent',
        border: '1px solid rgba(232,224,208,0.3)',
        color: 'rgba(232,224,208,0.7)',
        padding: '8px 20px',
        fontSize: '0.65rem',
        letterSpacing: '2px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    burger: {
        display: 'none',
        background: 'transparent',
        border: 'none',
        color: '#C5A059',
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
    mobileMenu: {
        display: 'none',
    },
    mobileLink: {
        color: '#e8e0d0',
        textDecoration: 'none',
        fontSize: '0.8rem',
        letterSpacing: '2px',
        padding: '10px 0',
        display: 'block',
    },
    mobileLinkBtn: {
        background: 'transparent',
        border: 'none',
        color: '#e8e0d0',
        fontSize: '0.8rem',
        letterSpacing: '2px',
        cursor: 'pointer',
        padding: '10px 0',
    },
};

export default Navbar;