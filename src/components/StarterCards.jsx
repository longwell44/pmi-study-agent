const CARDS = [
  {
    accent: { bg: '#FEE2E2', stroke: '#DC2626' },
    prompt: 'Start tutor mode',
    icon: (stroke) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    label: 'Tutor mode',
    description: 'Answer open-ended questions and get intelligent feedback',
  },
  {
    accent: { bg: '#EDE9FF', stroke: '#5B21B6' },
    icon: (stroke) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
    label: 'Give me a practice question',
    description: 'Test your knowledge with a realistic PMP-style question',
  },
  {
    accent: { bg: '#E0F5F1', stroke: '#0D9488' },
    icon: (stroke) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304z" />
        <path d="M15 4h1a1 1 0 0 1 1 1v3.5" />
        <path d="M20 6c.264 .112 .52 .214 .628 .4a1 1 0 0 1 .372 .6v8" />
      </svg>
    ),
    label: 'Generate flashcards for a topic',
    description: 'Create study cards for any PMBOK concept or domain',
  },
  {
    accent: { bg: '#FEF3E2', stroke: '#D97706' },
    icon: (stroke) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    label: 'Explain a PMBOK concept',
    description: 'Deep dives into frameworks, principles, and performance domains',
  },
  {
    accent: { bg: '#FDE8F0', stroke: '#DB2777' },
    icon: (stroke) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    label: 'Help me build a study plan',
    description: 'Get a personalized roadmap to PMP exam readiness',
  },
  {
    accent: { bg: '#E8F1FD', stroke: '#2563EB' },
    icon: (stroke) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="2" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
      </svg>
    ),
    label: 'How is the PMP exam structured?',
    description: 'Learn the ECO domains, question types, and format',
  },
];

export default function StarterCards({ onSelect, recommended = [], stage, struggle, onEdit }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: '28px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 600,
          color: '#200F3B',
          letterSpacing: '-0.3px',
          marginBottom: 8,
        }}>
          Ready to ace the PMP?
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>
          Choose where to start, or type your own question below.
        </p>
      </div>

      {stage && (
        <div style={{
          background: '#F5F3FF',
          border: '1px solid #d1d5db',
          borderLeft: '3px solid #7C3AED',
          borderRadius: '8px',
          padding: '8px 16px',
          maxWidth: 820,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
          </svg>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Recommendations based on: <span style={{ fontWeight: 500 }}>Stage:</span> {stage}
            {struggle && <> · <span style={{ fontWeight: 500 }}>Focus:</span> {struggle}</>}
            {' · '}
            <button
              onClick={onEdit}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                fontSize: '13px',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Edit
            </button>
          </span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        width: '100%',
        maxWidth: 820,
      }}>
        {CARDS.map((card) => {
          const isRecommended = recommended.includes(card.label);
          const badgeLabel = card.badge ?? (isRecommended ? 'Recommended' : null);
          return (
            <button
              key={card.label}
              className="starter-card"
              onClick={() => onSelect(card.prompt ?? card.label)}
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '18px 16px',
                textAlign: 'left',
                transition: 'background 0.15s',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {badgeLabel && (
                <span style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: badgeLabel === 'New' ? '#FEE2E2' : '#EDE9FF',
                  color: badgeLabel === 'New' ? '#DC2626' : '#5B21B6',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}>
                  {badgeLabel === 'Recommended' && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
                    </svg>
                  )}
                  {badgeLabel}
                </span>
              )}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: card.accent.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {card.icon(card.accent.stroke)}
              </div>
              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#200F3B',
                  marginBottom: 3,
                  lineHeight: 1.3,
                  paddingRight: badgeLabel ? 80 : 0,
                }}>
                  {card.label}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
                  {card.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
