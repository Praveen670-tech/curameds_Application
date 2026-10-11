import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Notification({ type = 'info', message, onClose }) {
  if (!message) return null;

  let bg = 'var(--color-primary-light)';
  let color = 'var(--color-primary-dark)';
  let Icon = Info;

  if (type === 'success') {
    bg = 'var(--color-success-light)';
    color = '#065F46';
    Icon = CheckCircle2;
  } else if (type === 'error') {
    bg = 'var(--color-danger-light)';
    color = '#991B1B';
    Icon = AlertCircle;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: bg,
      color: color,
      padding: '0.85rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      marginBottom: '1.25rem',
      fontSize: '0.92rem',
      fontWeight: 500,
      border: `1px solid ${color}33`,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Icon size={18} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
