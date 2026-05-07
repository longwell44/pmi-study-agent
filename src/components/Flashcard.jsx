import { useState } from 'react';

export default function Flashcard({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const card = cards[index];

  const navigate = (dir) => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + dir + cards.length) % cards.length), 200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          display: 'inline-flex',
          padding: '3px 10px',
          borderRadius: 20,
          background: 'var(--aqua-light)',
          color: 'var(--aqua-dark)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.3px',
          border: '1px solid rgba(5,191,224,0.2)',
        }}>
          Flashcards · {cards.length} card{cards.length !== 1 ? 's' : ''}
        </span>
        {cards.length > 1 && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {index + 1} / {cards.length}
          </span>
        )}
      </div>

      <div
        className="flashcard-scene"
        style={{ width: '100%', height: 200, cursor: 'pointer' }}
        onClick={() => setFlipped((f) => !f)}
        title="Click to flip"
      >
        <div className={`flashcard-card${flipped ? ' flipped' : ''}`} style={{ width: '100%', height: '100%' }}>
          <div className="flashcard-face" style={{ background: 'var(--aqua-light)' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--aqua-dark)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
              FRONT
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', textAlign: 'center', lineHeight: 1.5 }}>
              {card.front}
            </p>
            <div style={{ marginTop: 16, fontSize: '11px', color: 'var(--text-muted)' }}>
              Click to reveal answer
            </div>
          </div>

          <div className="flashcard-face back" style={{ background: 'var(--violet-light)' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--violet)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
              BACK
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text)', textAlign: 'center', lineHeight: 1.6 }}>
              {card.back}
            </p>
          </div>
        </div>
      </div>

      {cards.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--aqua)'; e.currentTarget.style.color = 'var(--aqua-dark)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            ← Prev
          </button>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFlipped(false); setIndex(i); }}
                style={{
                  width: i === index ? 18 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: i === index ? 'var(--aqua)' : 'var(--border)',
                  transition: 'all 0.2s',
                  border: 'none',
                }}
              />
            ))}
          </div>
          <button
            onClick={() => navigate(1)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--aqua)'; e.currentTarget.style.color = 'var(--aqua-dark)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
