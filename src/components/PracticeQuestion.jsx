import { useState } from 'react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function PracticeQuestion({ data }) {
  const [selected, setSelected] = useState(null);
  const { question, options, correct, explanation, domain } = data;

  const handleSelect = (key) => {
    if (selected) return;
    setSelected(key);
  };

  const getOptionStyle = (key) => {
    const base = {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 'var(--radius-sm)',
      border: '1.5px solid var(--border)',
      background: 'var(--surface)',
      textAlign: 'left',
      fontSize: '14px',
      color: 'var(--text)',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      transition: 'all 0.2s',
      cursor: selected ? 'default' : 'pointer',
      lineHeight: 1.5,
    };

    if (!selected) {
      return { ...base };
    }
    if (key === correct) {
      return { ...base, background: '#E8F5E9', borderColor: '#4CAF50', color: '#1B5E20' };
    }
    if (key === selected) {
      return { ...base, background: '#FFEBEE', borderColor: '#F44336', color: '#B71C1C' };
    }
    return { ...base, opacity: 0.45 };
  };

  const getLabelStyle = (key) => {
    const base = {
      minWidth: 24,
      height: 24,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 700,
      flexShrink: 0,
      marginTop: 1,
    };
    if (!selected) return { ...base, background: 'var(--bg)', color: 'var(--text-secondary)' };
    if (key === correct) return { ...base, background: '#4CAF50', color: '#fff' };
    if (key === selected) return { ...base, background: '#F44336', color: '#fff' };
    return { ...base, background: 'var(--bg)', color: 'var(--text-muted)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {domain && (
        <span style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          padding: '3px 10px',
          borderRadius: 20,
          background: 'var(--violet-light)',
          color: 'var(--violet)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.3px',
          border: '1px solid rgba(79,23,168,0.15)',
        }}>
          {domain}
        </span>
      )}

      <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.6 }}>
        {question}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPTION_LABELS.filter((k) => options?.[k]).map((key) => (
          <button
            key={key}
            style={getOptionStyle(key)}
            onClick={() => handleSelect(key)}
            onMouseEnter={e => {
              if (!selected) {
                e.currentTarget.style.borderColor = 'var(--aqua)';
                e.currentTarget.style.background = 'var(--aqua-light)';
              }
            }}
            onMouseLeave={e => {
              if (!selected) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--surface)';
              }
            }}
          >
            <span style={getLabelStyle(key)}>{key}</span>
            <span>{options[key]}</span>
          </button>
        ))}
      </div>

      {selected && explanation && (
        <div style={{
          marginTop: 4,
          padding: '14px 16px',
          background: selected === correct ? '#E8F5E9' : '#FFF8E1',
          border: `1.5px solid ${selected === correct ? '#A5D6A7' : '#FFE082'}`,
          borderRadius: 'var(--radius-sm)',
          fontSize: '14px',
          color: 'var(--text)',
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: selected === correct ? '#2E7D32' : '#E65100' }}>
            {selected === correct ? '✓ Correct!' : `✗ The correct answer is ${correct}.`}
          </div>
          {explanation}
        </div>
      )}
    </div>
  );
}
