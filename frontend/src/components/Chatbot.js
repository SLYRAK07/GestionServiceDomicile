import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Bonjour ! Je suis l\'assistant ServiHome 🏠\nJe peux vous aider à trouver un prestataire, consulter les notes ou réserver un service.\nQue puis-je faire pour vous ?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Charge les services disponibles pour le contexte du chatbot
        api.get('/services/').then(res => setServices(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const buildSystemPrompt = () => {
        const servicesContext = services.map(s =>
            `- ${s.titre} | Prestataire: ${s.prestataire?.username} | Note: ${s.note_moyenne}/5 | Prix: ${s.prix} MAD/h | Catégorie: ${s.categorie?.nom}`
        ).join('\n');

        return `Tu es l'assistant virtuel de ServiHome, une plateforme de services à domicile au Maroc.
Tu aides les clients à trouver des prestataires, consulter les notes et réserver des services.
Réponds toujours en français, de façon concise et professionnelle.
Utilise des emojis pour rendre la conversation agréable.

Voici les services disponibles sur la plateforme :
${servicesContext || 'Aucun service disponible pour le moment.'}

Règles :
- Si le client cherche un service, propose les prestataires correspondants avec leur note et prix
- Si le client veut réserver, dis-lui de cliquer sur "RÉSERVER" dans la page Services
- Ne jamais inventer des prestataires qui ne sont pas dans la liste
- Si tu ne sais pas, dis-le honnêtement`;
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            console.log('Clé utilisée:', process.env.REACT_APP_GROQ_KEY);
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`,
                },
               body: JSON.stringify({
                 model: 'llama-3.1-8b-instant',
                 messages: [
                    { role: 'system', content: buildSystemPrompt() },
                        ...newMessages,
                                ],
                 max_tokens: 500,
                 temperature: 0.7,
            }),
        });

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu répondre.';
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Une erreur est survenue. Veuillez réessayer.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Bulle flottante */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C5A059, #8B6914)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(197,160,89,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
                {open ? '✕' : '💬'}
            </button>

            {/* Fenêtre chat */}
            {open && (
                <div style={{
                    position: 'fixed',
                    bottom: '105px',
                    right: '30px',
                    width: '370px',
                    height: '500px',
                    background: '#0d0d0d',
                    border: '1px solid rgba(197,160,89,0.3)',
                    borderRadius: '2px',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '15px 20px',
                        borderBottom: '1px solid rgba(197,160,89,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <div style={{
                            width: '35px', height: '35px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #C5A059, #8B6914)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem',
                        }}>
                            🏠
                        </div>
                        <div>
                            <p style={{ color: '#e8e0d0', fontSize: '0.85rem', margin: 0, letterSpacing: '1px' }}>
                                Assistant ServiHome
                            </p>
                            <p style={{ color: '#28a745', fontSize: '0.6rem', margin: 0, letterSpacing: '1px' }}>
                                ● En ligne
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            }}>
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '10px 14px',
                                    background: msg.role === 'user'
                                        ? 'linear-gradient(135deg, #C5A059, #8B6914)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: msg.role === 'user'
                                        ? 'none'
                                        : '1px solid rgba(197,160,89,0.15)',
                                    color: '#e8e0d0',
                                    fontSize: '0.78rem',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    padding: '10px 14px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(197,160,89,0.15)',
                                    color: 'rgba(232,224,208,0.4)',
                                    fontSize: '0.78rem',
                                }}>
                                    ✦ En train de répondre...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '12px 15px',
                        borderTop: '1px solid rgba(197,160,89,0.15)',
                        display: 'flex',
                        gap: '10px',
                    }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Écrivez votre message..."
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(197,160,89,0.2)',
                                color: '#e8e0d0',
                                padding: '10px 12px',
                                fontSize: '0.78rem',
                                outline: 'none',
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            style={{
                                background: 'linear-gradient(135deg, #C5A059, #8B6914)',
                                border: 'none',
                                color: '#080808',
                                padding: '10px 15px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                opacity: loading || !input.trim() ? 0.5 : 1,
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbot;