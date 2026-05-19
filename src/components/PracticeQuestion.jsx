import { useState } from 'react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function PracticeQuestion({ data, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const { question, options, correct, explanation, domain } = data;

  const handleSelect = (key) => {
    if (selected) return;
    setSelected(key);
    onAnswer?.(domain, key === correct);
  };

  const getOptionStyle = (key) => {
    const base = {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      background: '#ffffff',
      textAlign: 'left',
      fontSize: '14px',
      color: '#200F3B',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      transition: 'all 0.15s',
      cursor: selected ? 'default' : 'pointer',
      lineHeight: 1.5,
    };

    if (!selected) return { ...base };
    if (key === correct) {
      return { ...base, background: '#f0fdf4', borderColor: '#16a34a', color: '#15803d' };
    }
    if (key === selected) {
      return { ...base, background: '#fef2f2', borderColor: '#dc2626', color: '#dc2626' };
    }
    return { ...base, opacity: 0.4 };
  };

  const getLabelStyle = (key) => {
    const base = {
      minWidth: 22,
      height: 22,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 600,
      flexShrink: 0,
      marginTop: 1,
    };
    if (!selected) return { ...base, background: '#f3f4f6', color: '#6b7280' };
    if (key === correct) return { ...base, background: '#16a34a', color: '#fff' };
    if (key === selected) return { ...base, background: '#dc2626', color: '#fff' };
    return { ...base, background: '#e5e7eb', color: '#9ca3af' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {domain && (
        <span style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          padding: '2px 8px',
          borderRadius: '20px',
          background: '#f3f4f6',
          color: '#6b7280',
          fontSize: '11px',
          fontWeight: 500,
          border: '1px solid #e5e7eb',
        }}>
          {domain}
        </span>
      )}

      <p style={{ fontSize: '14px', fontWeight: 600, color: '#200F3B', lineHeight: 1.6 }}>
        {question}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {OPTION_LABELS.filter((k) => options?.[k]).map((key) => (
          <button
            key={key}
            style={getOptionStyle(key)}
            onClick={() => handleSelect(key)}
            onMouseEnter={e => {
              if (!selected) e.currentTarget.style.background = '#f9fafb';
            }}
            onMouseLeave={e => {
              if (!selected) e.currentTarget.style.background = '#ffffff';
            }}
          >
            <span style={getLabelStyle(key)}>{key}</span>
            <span>{options[key]}</span>
          </button>
        ))}
      </div>

      {selected && explanation && (
        <div style={{
          marginTop: 2,
          padding: '12px 14px',
          background: selected === correct ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${selected === correct ? '#16a34a' : '#dc2626'}`,
          borderRadius: '6px',
          fontSize: '13px',
          color: '#200F3B',
          lineHeight: 1.6,
        }}>
          <div style={{
            fontWeight: 600,
            marginBottom: 4,
            color: selected === correct ? '#16a34a' : '#dc2626',
          }}>
            {selected === correct ? '✓ Correct' : `✗ Correct answer: ${correct}`}
          </div>
          {explanation}
        </div>
      )}
    </div>
  );
}
