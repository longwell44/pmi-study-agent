import { useState } from 'react';

export default function StudyPlanQuestion({ data, onSelect }) {
  const [answered, setAnswered] = useState(false);

  const handleClick = (option) => {
    if (answered) return;
    setAnswered(true);
    onSelect(option);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#200F3B', lineHeight: 1.6, margin: 0 }}>
        {data.question}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleClick(opt)}
            disabled={answered}
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              textAlign: 'left',
              fontSize: '14px',
              color: answered ? '#9ca3af' : '#200F3B',
              cursor: answered ? 'default' : 'pointer',
              lineHeight: 1.5,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!answered) e.currentTarget.style.background = '#f9fafb'; }}
            onMouseLeave={e => { if (!answered) e.currentTarget.style.background = '#ffffff'; }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
