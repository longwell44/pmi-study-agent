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

  const navBtnStyle = {
    padding: '5px 14px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    fontSize: '13px',
    color: '#6b7280',
    transition: 'background 0.15s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          display: 'inline-flex',
          padding: '2px 8px',
          borderRadius: '20px',
          background: '#f3f4f6',
          color: '#6b7280',
          fontSize: '11px',
          fontWeight: 500,
          border: '1px solid #e5e7eb',
        }}>
          Flashcards · {cards.length} card{cards.length !== 1 ? 's' : ''}
        </span>
        {cards.length > 1 && (
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            {index + 1} / {cards.length}
          </span>
        )}
      </div>

      <div
        className="flashcard-scene"
        style={{ width: '100%', height: 190, cursor: 'pointer' }}
        onClick={() => setFlipped((f) => !f)}
        title="Click to flip"
      >
        <div className={`flashcard-card${flipped ? ' flipped' : ''}`} style={{ width: '100%', height: '100%' }}>
          <div className="flashcard-face">
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#9ca3af',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              FRONT
            </div>
            <p style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#200F3B',
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              {card.front}
            </p>
            <div style={{ marginTop: 14, fontSize: '11px', color: '#9ca3af' }}>
              Click to reveal
            </div>
          </div>

          <div className="flashcard-face back">
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#9ca3af',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              BACK
            </div>
            <p style={{
              fontSize: '14px',
              color: '#200F3B',
              textAlign: 'center',
              lineHeight: 1.6,
            }}>
              {card.back}
            </p>
          </div>
        </div>
      </div>

      {cards.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={navBtnStyle}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            ← Prev
          </button>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFlipped(false); setIndex(i); }}
                style={{
                  width: i === index ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === index ? '#6b7280' : '#d1d5db',
                  transition: 'all 0.2s',
                  border: 'none',
                }}
              />
            ))}
          </div>
          <button
            onClick={() => navigate(1)}
            style={navBtnStyle}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
