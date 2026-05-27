const SECTIONS = [
  {
    label: 'Practice & Learn',
    cards: [
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
        accent: { bg: '#FEE2E2', stroke: '#DC2626' },
        prompt: 'Help me study for the PMP',
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
    ],
  },
  {
    label: 'Plan & Understand',
    cards: [
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
    ],
  },
];

import ThisWeekCard from './ThisWeekCard.jsx';

const DOMAIN_TASKS = {
  'People': [
    { domain: '📖 Reading',            title: 'Read PMBOK 7 Ch. 4–5 — People domain fundamentals',               time: '~30 min', prompt: 'Explain a PMBOK concept' },
    { domain: '✏️ Practice Questions', title: '20 exam-style Qs — leadership, conflict & team dynamics',         time: '~20 min', prompt: 'Give me a practice question on People' },
    { domain: '💬 Tutor Session',      title: 'Work through a real stakeholder scenario step by step',           time: '~45 min', prompt: 'Help me study for the PMP' },
  ],
  'Process': [
    { domain: '📖 Reading',            title: 'Read PMBOK 7 Ch. 6–8 — Process domain & project execution',      time: '~30 min', prompt: 'Explain a PMBOK concept' },
    { domain: '✏️ Practice Questions', title: '20 exam-style Qs — scheduling, cost & quality management',       time: '~20 min', prompt: 'Give me a practice question on Process' },
    { domain: '💬 Tutor Session',      title: 'Work through a real project execution scenario step by step',     time: '~45 min', prompt: 'Help me study for the PMP' },
  ],
  'Business Environment': [
    { domain: '📖 Reading',            title: 'Read PMBOK 7 Ch. 2–3 — Business Environment & org context',      time: '~30 min', prompt: 'Explain a PMBOK concept' },
    { domain: '✏️ Practice Questions', title: '20 exam-style Qs — compliance, value delivery & change',         time: '~20 min', prompt: 'Give me a practice question on Business Environment' },
    { domain: '💬 Tutor Session',      title: 'Work through a real organisational change scenario step by step', time: '~45 min', prompt: 'Help me study for the PMP' },
  ],
};

function buildWeekTasks(profile) {
  const domain = profile.weakDomains?.[0] ?? 'People';
  return DOMAIN_TASKS[domain] ?? DOMAIN_TASKS['People'];
}

export default function StarterCards({ onSelect, recommended = [], userProfile, onEdit, onViewDashboard }) {
  const hasProfile = userProfile && !userProfile.skipped;

  return (
    <div style={{
      minHeight: '100%',
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
          Welcome, John — Ready to ace the PMP?
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>
          Choose where to start, or type your own question below.
        </p>
      </div>

      {!hasProfile && (
        <div style={{
          background: '#fafafa',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
          maxWidth: 820,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Complete your setup to get a personalised study plan
          </span>
          <button
            onClick={onEdit}
            style={{
              background: 'none',
              border: 'none',
              color: '#4F17A8',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Complete your setup →
          </button>
        </div>
      )}

      {hasProfile && (
        <div style={{ maxWidth: 820, width: '100%' }}>
          <ThisWeekCard
            tasks={buildWeekTasks(userProfile)}
            onStart={onSelect}
            userProfile={userProfile}
            onViewPlan={onViewDashboard}
          />
        </div>
      )}

      {SECTIONS.map((section) => (
        <div key={section.label} style={{ width: '100%', maxWidth: 820 }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6B2D8B',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: 10,
          }}>
            {section.label}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
          }}>
            {section.cards.map((card) => {
              return (
                <button
                  key={card.label}
                  className="starter-card"
                  onClick={() => onSelect(card.prompt ?? card.label)}
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
                      paddingRight: 0,
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
      ))}

    </div>
  );
}
