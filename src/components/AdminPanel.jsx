import React, { useState } from 'react';
import { Shield, RotateCcw, LogOut, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import Modal from './Modal';

const AdminPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState(null);
    const { resetGame, leaveSession, sessionId } = useGame();
    const { t } = useLanguage();

    if (!sessionId) return null;

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {!isOpen ? (
                <button
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', opacity: 0.5 }}
                    onClick={() => setIsOpen(true)}
                >
                    <Shield size={24} />
                </button>
            ) : (
                <div className="glass-panel animate-fade-in" style={{ width: '300px', padding: '1.5rem', border: '1px solid var(--danger-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ color: 'var(--danger-color)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Shield size={18} /> {t('admin.title')}
                        </h4>
                        <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {t('admin.session')} <strong>{sessionId}</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            className="btn-primary"
                            style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
                            onClick={() => {
                                setModalConfig({
                                    title: t('admin.reset'),
                                    message: t('admin.confirm_reset'),
                                    onConfirm: resetGame,
                                    isDanger: true,
                                    confirmText: t('admin.reset')
                                });
                            }}
                        >
                            <RotateCcw size={16} /> {t('admin.reset')}
                        </button>

                        <button
                            className="btn-primary"
                            style={{ background: 'transparent' }}
                            onClick={() => {
                                leaveSession();
                                setIsOpen(false);
                            }}
                        >
                            <LogOut size={16} /> {t('admin.leave')}
                        </button>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem', cursor: 'pointer' }} onClick={() => setIsOpen(false)}>
                        {t('admin.close')}
                    </p>
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

export default AdminPanel;
