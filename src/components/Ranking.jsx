import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Ranking = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const { t } = useLanguage();

    useEffect(() => {
        const q = query(collection(db, 'rankings'), orderBy('timeTaken', 'asc'), limit(10));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaderboard(results);
        });
        return () => unsubscribe();
    }, []);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (leaderboard.length === 0) {
        return (
            <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', background: 'rgba(26,26,26,0.9)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent-color)' }}>
                    <Trophy size={28} /> {t('rank.title')}
                </h2>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    {t('rank.empty')}<br />
                    <strong>{t('rank.be_first')}</strong>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', background: 'rgba(26,26,26,0.9)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent-color)' }}>
                <Trophy size={28} /> {t('rank.title')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {leaderboard.map((team, index) => (
                    <div key={team.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: index === 0 ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        border: index === 0 ? '1px solid var(--accent-color)' : '1px solid transparent'
                    }}>
                        <span style={{ fontWeight: index === 0 ? 'bold' : 'normal', fontSize: '1.1rem' }}>
                            {index === 0 && '🥇 '}
                            {index === 1 && '🥈 '}
                            {index === 2 && '🥉 '}
                            {index > 2 && `${index + 1}. `}
                            {team.teamName}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: index === 0 ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                            {formatTime(team.timeTaken)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ranking;
