import { useState } from 'react';

export default function PasswordGate({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_APP_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9fafb',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            background: '#4F17A8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700, letterSpacing: '0.3px' }}>
              PMI
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#200F3B', fontWeight: 600, fontSize: '17px', lineHeight: 1.3 }}>
              Study Assistant
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: 3 }}>
              Research Prototype · Not an official PMI product
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Enter password"
            autoFocus
            style={{
              width: '100%',
              padding: '10px 14px',
              border: `1px solid ${error ? '#dc2626' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '15px',
              color: '#200F3B',
              background: '#ffffff',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
          />
          {error && (
            <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              background: '#4F17A8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
