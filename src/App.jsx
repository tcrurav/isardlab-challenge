import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Landing from './components/Landing';
import Phase1 from './components/Phase1';
import Phase2 from './components/Phase2';
import AdminPanel from './components/AdminPanel';
import Modal from './components/Modal';
import { Menu, RotateCcw, LogOut } from 'lucide-react';
import './index.css';

const HamburgerMenu = () => {
  const { resetGame, leaveSession } = useGame();
  const { t, lang, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);

  const requestRestart = () => {
    setModalConfig({
      title: t('app.restart'),
      message: t('app.restart_confirm'),
      onConfirm: resetGame,
      isDanger: true,
      confirmText: t('app.restart')
    });
    setIsOpen(false);
  };

  const requestLeave = () => {
    setModalConfig({
      title: t('app.leave'),
      message: t('app.leave_confirm'),
      onConfirm: leaveSession,
      isDanger: false,
      confirmText: t('app.leave')
    });
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}
          onClick={toggleLanguage}
          title="Toggle Language"
        >
          {lang === 'en' ? 'ES' : 'EN'}
        </button>
        <button
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
          onClick={() => setIsOpen(!isOpen)}
          title={t('app.menu')}
        >
          <Menu size={28} />
        </button>
      </div>

      {isOpen && (
        <div className="glass-panel" style={{ position: 'absolute', top: '40px', right: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '220px', zIndex: 100 }}>
          <button
            style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '0.8rem', textAlign: 'left', width: '100%', borderRadius: '8px' }}
            onClick={requestRestart}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 51, 102, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <RotateCcw size={18} /> {t('app.restart')}
          </button>
          <button
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '0.8rem', textAlign: 'left', width: '100%', borderRadius: '8px' }}
            onClick={requestLeave}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} /> {t('app.leave')}
          </button>
        </div>
      )}

      <Modal
        isOpen={!!modalConfig}
        onClose={() => setModalConfig(null)}
        {...modalConfig}
      />
    </div>
  );
};

const Timer = ({ startTime, endTime }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (endTime) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!startTime) return <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--accent-color)' }}>⏱ 00:00</span>;

  const elapsed = endTime ? endTime - startTime : Math.max(0, now - startTime);
  const totalSeconds = Math.floor(elapsed / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');

  return <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--accent-color)' }}>⏱ {m}:{s}</span>;
};

const GameRouter = () => {
  const { sessionId, sessionData, loading } = useGame();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh' }}>
        <h2 className="animate-pulse text-gradient">{t('app.loading')}</h2>
      </div>
    );
  }

  if (!sessionId || !sessionData) {
    return <Landing />;
  }

  const allPhase1Completed = sessionData?.players
    ? Object.values(sessionData.players).every(p => p?.taskCompleted)
    : false;

  const [showPhase2, setShowPhase2] = useState(allPhase1Completed);

  useEffect(() => {
    let t;
    if (allPhase1Completed && !showPhase2) {
      t = setTimeout(() => setShowPhase2(true), 3000);
    } else if (!allPhase1Completed && showPhase2) {
      setShowPhase2(false);
    }
    return () => clearTimeout(t);
  }, [allPhase1Completed, showPhase2]);

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h3 className="text-gradient" style={{ margin: 0 }}>{t('app.title')}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-secondary)', alignItems: 'center', justifyContent: 'center' }}>
          <Timer startTime={sessionData.startTime} endTime={sessionData.endTime} />
          <span>{t('app.link')} <strong>{sessionId}</strong></span>
          <span>{t('app.phase')} <strong>{showPhase2 ? '2' : '1'}</strong></span>
          <HamburgerMenu />
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {!showPhase2 ? <Phase1 /> : <Phase2 />}
      </main>

      <AdminPanel />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <GameProvider>
        <GameRouter />
      </GameProvider>
    </LanguageProvider>
  );
};

export default App;
