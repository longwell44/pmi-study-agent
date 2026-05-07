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
      background: '#ffffff',
      textAlign: 'left',
      fontSize: '14px',
      color: 'var(--violet-800)',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      transition: 'all 0.2s',
      cursor: selected ? 'default' : 'pointer',
      lineHeight: 1.5,
    };

    if (!selected) return { ...base };
    if (key === correct) {
      return { ...base, background: 'var(--aqua-50)', borderColor: 'var(--aqua-500)', color: 'var(--aqua-500)' };
    }
    if (key === selected) {
      return { ...base, background: '#fef2f2', borderColor: '#f87171', color: '#b91c1c' };
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
    if (!selected) return { ...base, background: 'var(--violet-50)', color: 'var(--text-secondary)' };
    if (key === correct) return { ...base, background: 'var(--aqua-500)', color: '#fff' };
    if (key === selected) return { ...base, background: '#f87171', color: '#fff' };
    return { ...base, background: 'var(--border)', color: 'var(--text-muted)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {domain && (
        <span style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          padding: '3px 10px',
          borderRadius: 20,
          background: 'var(--violet-50)',
          color: 'var(--violet-500)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.3px',
          border: '1px solid rgba(79,23,168,0.15)',
        }}>
          {domain}
        </span>
      )}

      <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--violet-800)', lineHeight: 1.6 }}>
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
                e.currentTarget.style.borderColor = 'var(--violet-500)';
                e.currentTarget.style.background = 'var(--violet-50)';
              }
            }}
            onMouseLeave={e => {
              if (!selected) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = '#ffffff';
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
          background: selected === correct ? 'var(--aqua-50)' : '#fef2f2',
          border: `1.5px solid ${selected === correct ? 'var(--aqua-500)' : '#fca5a5'}`,
          borderRadius: 'var(--radius-sm)',
          fontSize: '14px',
          color: 'var(--violet-800)',
          lineHeight: 1.6,
        }}>
          <div style={{
            fontWeight: 700,
            marginBottom: 4,
            color: selected === correct ? 'var(--aqua-500)' : '#b91c1c',
          }}>
            {selected === correct ? '✓ Correct!' : `✗ The correct answer is ${correct}.`}
          </div>
          {explanation}
        </div>
      )}
    </div>
  );
}
