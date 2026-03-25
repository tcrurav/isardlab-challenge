import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Laptop, Globe } from 'lucide-react';
import Ranking from './Ranking';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
    const { joinSession, createSession, loading } = useGame();
    const { t, lang, toggleLanguage } = useLanguage();
    const [teamNameInput, setTeamNameInput] = useState('');
    const [sessionInput, setSessionInput] = useState('');
    const [roleInput, setRoleInput] = useState(null);
    const [error, setError] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!sessionInput.trim() || !roleInput) {
            setError(t('landing.err_no_session'));
            return;
        }

        try {
            await joinSession(sessionInput, roleInput);
        } catch (err) {
            setError(`${t('landing.err_failed')} ${err.message}`);
        }
    };

    const handleCreate = async () => {
        if (!teamNameInput.trim()) {
            setError(t('landing.err_no_team'));
            return;
        }
        const randomSession = Math.random().toString(36).substring(2, 8).toUpperCase();
        await createSession(randomSession, teamNameInput.trim());
        setSessionInput(randomSession);
        setError(`${t('landing.err_created')} ${randomSession}`);
    };

    return (
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1.5rem', padding: '2rem 1rem' }}>

            {/* Language Toggle Relative Header */}
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={toggleLanguage}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                    }}
                    title="Cambiar idioma / Change language"
                >
                    <Globe size={16} /> {lang === 'es' ? 'EN' : 'ES'}
                </button>
            </div>

            <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', width: '100%' }}>
                <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>
                    {t('app.title')}
                </h1>

                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('landing.subtitle')}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder={t('landing.team_placeholder')}
                            value={teamNameInput}
                            onChange={(e) => setTeamNameInput(e.target.value)}
                        />
                        <button className="btn-primary" onClick={handleCreate} disabled={loading} style={{ minWidth: '140px' }}>
                            {t('landing.create_btn')}
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder={t('landing.session_placeholder')}
                            value={sessionInput}
                            onChange={(e) => setSessionInput(e.target.value)}
                        />
                    </div>
                </div>

                <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>{t('landing.select_role')}</h3>
                <div className="role-grid" style={{ marginBottom: '2rem' }}>
                    {[1, 2, 3].map((role) => (
                        <div
                            key={role}
                            className={`role-card ${roleInput === String(role) ? 'selected' : ''}`}
                            onClick={() => setRoleInput(String(role))}
                        >
                            <Laptop size={32} style={{ margin: '0 auto 10px', color: 'var(--accent-color)' }} />
                            <h4>{t(`landing.laptop_${role}`)}</h4>
                        </div>
                    ))}
                </div>

                {error && <p style={{ color: 'var(--accent-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
                    onClick={handleJoin}
                    disabled={loading || !sessionInput || !roleInput}
                >
                    {loading ? t('landing.entering') : t('landing.enter_btn')}
                </button>
            </div>

            <Ranking />
        </div>
    );
};

export default Landing;
