import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText, isDanger }) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-panel animate-fade-in" style={{
                maxWidth: '400px',
                width: '90%',
                padding: '2rem',
                textAlign: 'center',
                border: isDanger ? '1px solid var(--danger-color)' : '1px solid rgba(255,255,255,0.2)',
                boxShadow: isDanger ? '0 0 30px rgba(255,51,102,0.3)' : '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <h3 style={{ marginBottom: '1rem', color: isDanger ? 'var(--danger-color)' : 'var(--text-primary)', fontSize: '1.5rem' }}>
                    {title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyItems: 'stretch' }}>
                    <button
                        style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={onClose}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        {t('app.cancel')}
                    </button>
                    <button
                        style={{ flex: 1, padding: '0.8rem', background: isDanger ? 'var(--danger-color)' : 'var(--accent-color)', border: 'none', color: isDanger ? '#fff' : '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText || t('app.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
