import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Profile() {
    const { user, setUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({});

    // Fetch les vraies données depuis le backend au chargement
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/accounts/profile/');
                setProfileData(res.data);
                setForm({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    telephone: res.data.telephone || '',
                    adresse: res.data.adresse || '',
                });
            } catch (err) {
                setError('Erreur lors du chargement du profil');
            }
        };
        fetchProfile();
    }, []);

    const getRoleBadge = () => {
        switch (profileData?.role) {
            case 'client': return { label: 'CLIENT', color: '#C5A059' };
            case 'prestataire': return { label: 'PRESTATAIRE', color: '#28a745' };
            case 'admin': return { label: 'ADMINISTRATEUR', color: '#dc3545' };
            default: return { label: 'INCONNU', color: '#888' };
        }
    };

    const badge = getRoleBadge();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await api.patch('/accounts/profile/', form);
            setProfileData(res.data);
            // Mettre à jour le context si setUser existe
            if (setUser) setUser({ ...user, ...res.data });
            setSuccess('Profil mis à jour avec succès ✅');
            setEditing(false);
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('Erreur lors de la mise à jour');
            setTimeout(() => setError(''), 4000);
        }
    };

    if (!profileData) return (
        <div style={{ backgroundColor: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#C5A059', letterSpacing: '4px', fontSize: '0.7rem' }}>CHARGEMENT...</p>
        </div>
    );

    const fields = [
        { label: "NOM D'UTILISATEUR", key: 'username', editable: true },
        { label: 'EMAIL', key: 'email', editable: true },
        { label: 'TÉLÉPHONE', key: 'telephone', editable: true },
        { label: 'ADRESSE', key: 'adresse', editable: true },
        { label: 'RÔLE', value: badge.label, color: badge.color, editable: false },
        { label: 'STATUT', value: profileData?.is_active ? '✅ Actif' : '❌ Inactif', editable: false },
        ...(profileData?.role === 'prestataire' ? [{
            label: 'NOTE MOYENNE',
            value: profileData?.note_moyenne ? `⭐ ${profileData.note_moyenne}/5` : 'Pas encore noté',
            editable: false
        }] : []),
    ];

    return (
        <div style={{ backgroundColor: '#080808', paddingTop: '100px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 40px 80px' }}>

                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ color: '#C5A059', fontSize: '0.6rem', letterSpacing: '6px', marginBottom: '15px' }}>MON COMPTE</p>
                    <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: '#e8e0d0' }}>Mon Profil</h1>
                    <div style={{ width: '60px', height: '1px', background: '#C5A059', margin: '20px auto' }}></div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        border: '2px solid #C5A059', margin: '0 auto 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', color: '#C5A059', background: 'rgba(197,160,89,0.05)',
                    }}>
                        {profileData?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ border: `1px solid ${badge.color}`, color: badge.color, padding: '4px 16px', fontSize: '0.6rem', letterSpacing: '3px' }}>
                        {badge.label}
                    </span>
                </div>

                {success && <div style={{ border: '1px solid rgba(40,167,69,0.3)', backgroundColor: 'rgba(40,167,69,0.05)', color: '#28a745', padding: '15px', marginBottom: '30px', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '1px' }}>{success}</div>}
                {error && <div style={{ border: '1px solid rgba(220,53,69,0.3)', backgroundColor: 'rgba(220,53,69,0.05)', color: '#dc3545', padding: '15px', marginBottom: '30px', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '1px' }}>{error}</div>}

                <div className="glass-card" style={{ padding: '40px' }}>
                    {fields.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid rgba(197,160,89,0.1)' }}>
                            <span style={{ color: 'rgba(232,224,208,0.4)', fontSize: '0.6rem', letterSpacing: '2px' }}>{item.label}</span>
                            {editing && item.editable ? (
                                <input
                                    name={item.key}
                                    value={form[item.key]}
                                    onChange={handleChange}
                                    style={{ background: 'rgba(197,160,89,0.05)', border: '1px solid rgba(197,160,89,0.3)', color: '#e8e0d0', padding: '8px 12px', fontSize: '0.85rem', outline: 'none', width: '250px' }}
                                />
                            ) : (
                                <span style={{ color: item.color || '#e8e0d0', fontSize: '0.85rem' }}>
                                    {item.value || form[item.key] || '—'}
                                </span>
                            )}
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end' }}>
                        {editing ? (
                            <>
                                <button onClick={() => setEditing(false)} style={{ background: 'transparent', border: '1px solid rgba(232,224,208,0.2)', color: 'rgba(232,224,208,0.5)', padding: '12px 25px', fontSize: '0.6rem', letterSpacing: '2px', cursor: 'pointer' }}>
                                    ANNULER
                                </button>
                                <button onClick={handleSave} className="gold-button" style={{ padding: '12px 25px', fontSize: '0.6rem' }}>
                                    SAUVEGARDER
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setEditing(true)} className="gold-button" style={{ padding: '12px 25px', fontSize: '0.6rem' }}>
                                ✏️ MODIFIER
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;