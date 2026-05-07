const CARDS = [
  {
    accent: { bg: '#EFEDF3', stroke: '#4F17A8' },
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
    accent: { bg: '#EEFAFA', stroke: '#05BFE0' },
    icon: (stroke) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    label: 'Generate flashcards for a topic',
    description: 'Create study cards for any PMBOK concept or domain',
  },
  {
    accent: { bg: '#FEF7F3', stroke: '#FF610F' },
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
    accent: { bg: '#EFEDF3', stroke: '#4F17A8' },
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
    accent: { bg: '#EEFAFA', stroke: '#05BFE0' },
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

export default function StarterCards({ onSelect }) {
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        width: '100%',
        maxWidth: 820,
      }}>
        {CARDS.map((card) => (
          <button
            key={card.label}
            className="starter-card"
            onClick={() => onSelect(card.label)}
            style={{
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
              }}>
                {card.label}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
                {card.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
