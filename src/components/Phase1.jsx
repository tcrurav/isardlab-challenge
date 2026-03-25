import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Check, Eye, Brain, SortAsc } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VisualPuzzle = ({ onComplete }) => {
    const { t } = useLanguage();

    // Generate a 30-cell grid with 3 anomalies hidden
    const [grid] = useState(() => {
        const items = Array(30).fill('normal');
        items[0] = 'ERR';
        items[1] = 'BUG';
        items[2] = '404';

        // Shuffle the array elements
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        // Map to objects with visual hex labels
        return items.map((type, id) => {
            if (type === 'normal') {
                return { id, type, label: '0x' + Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0') };
            }
            return { id, type, label: type };
        });
    });

    const [found, setFound] = useState([]);
    const [shakeId, setShakeId] = useState(null);

    const handleClick = (item) => {
        if (found.includes(item.id)) return;

        if (item.type !== 'normal') {
            const newFound = [...found, item.id];
            setFound(newFound);
            if (newFound.length === 3) {
                setTimeout(onComplete, 500);
            }
        } else {
            // Apply error shake to wrong cell
            setShakeId(item.id);
            setTimeout(() => setShakeId(null), 400);
        }
    };

    return (
        <div className="glass-panel text-center animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '10vh' }}>
            <Eye size={48} style={{ color: 'var(--accent-color)', margin: '0 auto 1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>{t('p1.vis.title')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {t('p1.vis.desc')}
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                marginBottom: '1.5rem'
            }}>
                {grid.map(item => (
                    <div
                        key={item.id}
                        onClick={() => handleClick(item)}
                        className={shakeId === item.id ? 'shake-animation' : ''}
                        style={{
                            background: found.includes(item.id) ? 'var(--success-color)' : 'rgba(255,255,255,0.05)',
                            color: found.includes(item.id) ? '#000' : 'var(--text-secondary)',
                            padding: '12px 5px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            border: '1px solid',
                            borderColor: found.includes(item.id) ? 'var(--success-color)' : 'rgba(255,255,255,0.1)',
                            transition: 'background 0.3s',
                            userSelect: 'none'
                        }}
                    >
                        {item.label}
                    </div>
                ))}
            </div>

            <p style={{ color: 'var(--text-secondary)' }}>{t('p1.vis.found')} {found.length}/3</p>
        </div>
    );
};

const LogicPuzzle = ({ onComplete }) => {
    const { t } = useLanguage();
    const [answer, setAnswer] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim() === '5') {
            onComplete();
        } else {
            alert("Incorrect!");
            setAnswer('');
        }
    };

    return (
        <div className="glass-panel text-center animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '10vh' }}>
            <Brain size={64} style={{ color: 'var(--accent-color)', margin: '0 auto 1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>{t('p1.log.title')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {t('p1.log.desc')}
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <input
                    type="text"
                    className="input-field"
                    style={{ width: '220px', textAlign: 'center', fontSize: '1.5rem' }}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={t('p1.log.placeholder')}
                />
                <button type="submit" className="btn-primary">{t('p1.log.btn')}</button>
            </form>
        </div>
    );
};

const SortPuzzle = ({ onComplete }) => {
    const { t } = useLanguage();

    // Generate 8 unique random uppercase letters
    const [sequence] = useState(() => {
        const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const selected = [];
        while (selected.length < 8) {
            const char = pool[Math.floor(Math.random() * pool.length)];
            if (!selected.includes(char)) selected.push(char);
        }
        return selected.sort(); // This is the goal alphabetical order
    });

    const [items] = useState([...sequence].sort(() => Math.random() - 0.5));
    const [selected, setSelected] = useState([]);
    const [shake, setShake] = useState(false);

    const handleClick = (item) => {
        if (selected.includes(item)) return;

        const newSelected = [...selected, item];
        const currentIndex = newSelected.length - 1;

        if (newSelected[currentIndex] !== sequence[currentIndex]) {
            // Mistake, reset with shake animation
            setShake(true);
            setSelected([]);
            setTimeout(() => setShake(false), 400);
        } else {
            setSelected(newSelected);
            if (newSelected.length === sequence.length) {
                setTimeout(onComplete, 400);
            }
        }
    };

    return (
        <div className={`glass-panel text-center animate-fade-in ${shake ? 'shake-animation' : ''}`} style={{ maxWidth: '600px', margin: '0 auto', marginTop: '10vh' }}>
            <SortAsc size={48} style={{ color: 'var(--accent-color)', margin: '0 auto 1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>{t('p1.srt.title')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {t('p1.srt.desc')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {items.map(item => (
                    <button
                        key={item}
                        className="btn-primary"
                        style={{
                            height: '60px', padding: 0, fontSize: '1.5rem',
                            background: selected.includes(item) ? 'var(--success-color)' : 'transparent',
                            borderColor: selected.includes(item) ? 'var(--success-color)' : 'var(--accent-color)',
                            color: selected.includes(item) ? '#000' : 'var(--text-primary)',
                            opacity: selected.includes(item) ? 0.8 : 1,
                            transition: 'all 0.2s'
                        }}
                        onClick={() => handleClick(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>{t('p1.srt.current')} <strong style={{ color: 'var(--accent-color)' }}>{selected.join(' ')}</strong></p>
        </div>
    );
};

const Phase1 = () => {
    const { sessionData, playerId, completePhase1 } = useGame();
    const { t } = useLanguage();

    if (!sessionData || !playerId) return null;

    const myPlayer = sessionData.players[playerId];
    const roleId = Number(playerId);

    const completedPhases = Object.values(sessionData.players).filter(p => p.taskCompleted).length;
    const allCompleted = completedPhases === 3;

    if (myPlayer.taskCompleted) {
        return (
            <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
                <div className="glass-panel text-center animate-fade-in" style={{ borderColor: 'var(--success-color)' }}>
                    <Check size={64} style={{ color: 'var(--success-color)', margin: '0 auto 1rem' }} />
                    <h2>{t('p1.task_complete')}</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>{t('p1.clue_part')}</p>
                    <div className={allCompleted ? 'animate-blink' : ''} style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        letterSpacing: '5px',
                        color: 'var(--accent-color)',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '2rem',
                        borderRadius: '12px',
                        border: '1px solid var(--accent-color)',
                        marginBottom: '2rem',
                        boxShadow: '0 0 20px var(--accent-glow)'
                    }}>
                        {myPlayer.clue}
                    </div>
                    {!allCompleted && (
                        <p className="animate-pulse" style={{ color: 'var(--accent-color)' }}>
                            {t('p1.waiting', { completed: completedPhases })}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (roleId === 1) return <VisualPuzzle onComplete={completePhase1} />;
    if (roleId === 2) return <LogicPuzzle onComplete={completePhase1} />;
    if (roleId === 3) return <SortPuzzle onComplete={completePhase1} />;

    return null;
};

export default Phase1;
