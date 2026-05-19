import { useState, useEffect } from 'react';

function saveResult(front, result) {
  try {
    const existing = JSON.parse(localStorage.getItem('pmi-flashcard-results') || '[]');
    localStorage.setItem('pmi-flashcard-results', JSON.stringify([...existing, { front, result }]));
  } catch {}
}

const ASSESS = [
  {
    label: '✗  No',
    value: 'no',
    highlight: { background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' },
    hover:     { color: '#dc2626', borderColor: '#fca5a5' },
  },
  {
    label: '≈  Kinda',
    value: 'kinda',
    highlight: { background: '#fffbeb', color: '#d97706', borderColor: '#fcd34d' },
    hover:     { color: '#d97706', borderColor: '#fcd34d' },
  },
  {
    label: '✓  Yes',
    value: 'yes',
    highlight: { background: '#f0fdf4', color: '#16a34a', borderColor: '#86efac' },
    hover:     { color: '#16a34a', borderColor: '#86efac' },
  },
];

const FEEDBACK_MSG = {
  no:    "Got it — we'll revisit this one",
  kinda: "Got it — we'll come back to this",
  yes:   'Nice work — moving on!',
};

const badgeStyle = {
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '20px',
  background: '#f3f4f6',
  color: '#6b7280',
  fontSize: '11px',
  fontWeight: 500,
  border: '1px solid #e5e7eb',
};

const chipStyle = {
  padding: '5px 12px',
  borderRadius: '20px',
  borderTop: '1px solid #e5e7eb',
  borderRight: '1px solid #e5e7eb',
  borderBottom: '1px solid #e5e7eb',
  borderLeft: '2px solid #05BFE0',
  background: '#ffffff',
  fontSize: '12px',
  color: '#6b7280',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

// Shared footer container style — same height on both faces keeps card stable
const footerStyle = {
  flexShrink: 0,
  height: 68,
  borderTop: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 16px',
};

export default function Flashcard({ cards, onChipSelect, onProgress }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState(() => new Array(cards.length).fill(null));
  const [done, setDone] = useState(false);
  // feedback: null | { result: string, phase: 'highlight'|'message'|'fading' }
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    onProgress?.(done ? cards.length : index + 1, cards.length);
  }, [index, done, cards.length]);

  if (!cards || cards.length === 0) return null;

  const card = cards[index];
  const isAssessed = results[index] !== null;

  const navigate = (dir) => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + dir + cards.length) % cards.length), 200);
  };

  const handleAssess = (result) => {
    const next = [...results];
    next[index] = { front: card.front, result };
    setResults(next);
    saveResult(card.front, result);

    const allDone = next.every((r) => r !== null);

    setFeedback({ result, phase: 'highlight' });
    setTimeout(() => setFeedback({ result, phase: 'message' }), 400);
    setTimeout(() => setFeedback({ result, phase: 'fading' }), 1200);
    setTimeout(() => {
      setFeedback(null);
      if (allDone) {
        setDone(true);
      } else {
        setFlipped(false);
        setTimeout(() => setIndex((i) => (i + 1) % cards.length), 200);
      }
    }, 1400);
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

  // ── Summary screen ──────────────────────────────────────────────
  if (done) {
    const yes   = results.filter((r) => r?.result === 'yes').length;
    const kinda = results.filter((r) => r?.result === 'kinda').length;
    const no    = results.filter((r) => r?.result === 'no').length;
    const missed = results
      .filter((r) => r?.result === 'no' || r?.result === 'kinda')
      .map((r) => r.front);

    const breakdown = [
      { icon: '✓', label: 'Yes',   count: yes,   color: '#16a34a' },
      { icon: '≈', label: 'Kinda', count: kinda, color: '#d97706' },
      { icon: '✗', label: 'No',    count: no,    color: '#dc2626' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={badgeStyle}>
          Flashcards · {cards.length} card{cards.length !== 1 ? 's' : ''}
        </span>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderTop: '3px solid #00A9A5',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(32, 15, 59, 0.10)',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#200F3B', marginBottom: 6 }}>
            Deck complete!
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#200F3B', lineHeight: 1.2, marginBottom: 20 }}>
            You got {yes}/{cards.length} right
          </div>

          <div style={{ borderTop: '1px solid #f3f4f6' }}>
            {breakdown.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < breakdown.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: item.color, minWidth: 14 }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#200F3B' }}>
                  {item.count} card{item.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {missed.length > 0 && (
            <button
              style={chipStyle}
              onClick={() => onChipSelect?.(`Generate flashcards for the PMP concepts I'm still learning. Focus on these specific topics: ${missed.join('; ')}`)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
            >
              Retry the ones I missed
            </button>
          )}
          <button
            style={chipStyle}
            onClick={() => onChipSelect?.('Generate flashcards for a topic')}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            Try a new topic
          </button>
        </div>
      </div>
    );
  }

  // ── Back footer content ─────────────────────────────────────────
  const inMessagePhase = feedback?.phase === 'message' || feedback?.phase === 'fading';

  const backFooterContent = feedback ? (
    feedback.phase === 'highlight' ? (
      // Highlighted buttons — clicked one lit up, others dimmed
      <div style={{ display: 'flex', gap: 6, width: '100%' }}>
        {ASSESS.map((btn) => {
          const isClicked = feedback.result === btn.value;
          return (
            <button
              key={btn.value}
              disabled
              style={{
                flex: 1,
                padding: '5px 0',
                border: `1px solid ${isClicked ? btn.highlight.borderColor : '#e5e7eb'}`,
                borderRadius: '6px',
                background: isClicked ? btn.highlight.background : '#ffffff',
                fontSize: '12px',
                color: isClicked ? btn.highlight.color : '#d1d5db',
                opacity: isClicked ? 1 : 0.4,
                cursor: 'default',
                transition: 'background 0.15s',
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    ) : (
      // Message with fade-out
      <div style={{
        fontSize: '13px',
        color: '#6b7280',
        textAlign: 'center',
        opacity: feedback.phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.2s',
      }}>
        {FEEDBACK_MSG[feedback.result]}
      </div>
    )
  ) : !isAssessed ? (
    // Active assessment buttons
    <>
      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: 5 }}>
        Did you get it right?
      </div>
      <div style={{ display: 'flex', gap: 6, width: '100%' }}>
        {ASSESS.map((btn) => (
          <button
            key={btn.value}
            onClick={(e) => { e.stopPropagation(); handleAssess(btn.value); }}
            style={{
              flex: 1,
              padding: '5px 0',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: '#ffffff',
              fontSize: '12px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = btn.hover.color;
              e.currentTarget.style.borderColor = btn.hover.borderColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </>
  ) : (
    // Already assessed (user navigated back)
    <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
      ✓ Assessed
    </div>
  );

  // ── Card screen ─────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ ...badgeStyle, alignSelf: 'auto' }}>
          Flashcards · {cards.length} card{cards.length !== 1 ? 's' : ''}
        </span>
        {cards.length > 1 && (
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            {index + 1} / {cards.length}
          </span>
        )}
      </div>

      {/* Fixed-height scene — never resizes */}
      <div
        className="flashcard-scene"
        style={{ width: '100%', height: 240, cursor: 'pointer' }}
        onClick={() => setFlipped((f) => !f)}
        title="Click to flip"
      >
        <div className={`flashcard-card${flipped ? ' flipped' : ''}`} style={{ width: '100%', height: '100%' }}>

          {/* ── Front face ── */}
          <div className="flashcard-face">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 24px 0', overflow: 'hidden' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#05BFE0', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
                FRONT
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#200F3B', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                {card.front}
              </p>
            </div>
            <div style={{ ...footerStyle, alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                Flip to assess yourself
              </div>
            </div>
          </div>

          {/* ── Back face ── */}
          <div className="flashcard-face back">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 24px 0', overflow: 'hidden' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#FF610F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
                BACK
              </div>
              <p style={{ fontSize: '14px', color: '#200F3B', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
                {card.back}
              </p>
            </div>
            {/* onClick stops propagation so footer interactions don't flip the card */}
            <div style={footerStyle} onClick={(e) => e.stopPropagation()}>
              {backFooterContent}
            </div>
          </div>

        </div>
      </div>

      {cards.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={navBtnStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
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
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
