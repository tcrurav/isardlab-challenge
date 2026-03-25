import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Lock, Unlock } from 'lucide-react';
import Ranking from './Ranking';
import { useLanguage } from '../context/LanguageContext';

const Phase2 = () => {
    const { sessionData, playerId, submitFinalCode } = useGame();
    const { t } = useLanguage();
    const [code, setCode] = useState('');

    if (!sessionData) return null;

    const myStatus = sessionData?.finalInputs?.[playerId];
    const allCorrect = sessionData?.finalInputs
        ? Object.values(sessionData.finalInputs).every(status => status === true)
        : false;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.trim().toUpperCase() === 'ISARDLAB') {
            submitFinalCode(true);
        } else {
            alert(t('p2.err_code'));
            setCode('');
        }
    };

    if (allCorrect) {
        return (
            <div className="glass-panel text-center animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', marginTop: '10vh', borderColor: 'var(--success-color)', boxShadow: '0 0 40px var(--success-glow)' }}>
                <Unlock size={80} style={{ color: 'var(--success-color)', margin: '0 auto 1.5rem' }} />
                <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--success-color), #fff)' }}>
                    {t('p2.unlocked')}
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    {t('p2.congrats')}
                </p>
                {sessionData.endTime && sessionData.startTime && (
                    <div className="animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid var(--success-color)', borderRadius: '12px', display: 'inline-block' }}>
                        <h3 style={{ margin: 0, color: 'var(--success-color)' }}>
                            {t('p2.time')} {Math.floor((sessionData.endTime - sessionData.startTime) / 60000)}m {Math.floor(((sessionData.endTime - sessionData.startTime) % 60000) / 1000)}s
                        </h3>
                    </div>
                )}
                <div style={{ marginTop: '2rem' }}>
                    <Ranking />
                </div>
            </div>
        );
    }

    if (myStatus) {
        return (
            <div className="glass-panel text-center animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '10vh' }}>
                <h2 style={{ color: 'var(--success-color)' }}>{t('p2.auth')}</h2>
                <p style={{ marginTop: '1rem' }}>{t('p2.awaiting')}</p>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                    {[1, 2, 3].map(id => (
                        <div key={id} style={{ opacity: sessionData?.finalInputs?.[id] ? 1 : 0.3, transition: '0.3s' }}>
                            <Lock size={40} style={{ color: sessionData?.finalInputs?.[id] ? 'var(--success-color)' : 'var(--text-secondary)' }} />
                            <p>{t('p2.term', { id })}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel text-center animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '10vh' }}>
            <Lock size={64} style={{ color: 'var(--accent-color)', margin: '0 auto 1rem' }} />
            <h1 style={{ marginBottom: '1rem' }}>{t('p2.form_title')}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {t('p2.form_desc')}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                <input
                    type="text"
                    className="input-field"
                    style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '8px', textTransform: 'uppercase' }}
                    placeholder={t('p2.form_placeholder')}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    maxLength={8}
                />
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>{t('p2.form_btn')}</button>
            </form>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                {[1, 2, 3].map(id => (
                    <div key={id} style={{ opacity: sessionData?.finalInputs?.[id] ? 1 : 0.3, transition: '0.3s' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: sessionData?.finalInputs?.[id] ? 'var(--success-color)' : 'var(--danger-color)', margin: '0 auto 5px' }}></div>
                        <p style={{ fontSize: '0.8rem' }}>T{id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Phase2;
