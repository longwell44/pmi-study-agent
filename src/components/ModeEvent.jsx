const PMI_AQUA = '#00A9A5';
const BORDER = '#e5e7eb';
const TEXT_SECONDARY = '#6b7280';
const TEXT_TERTIARY = '#9ca3af';

const MODE_META = {
  'Practice Questions': {
    label: 'Practice Question',
    description: "I'll give you a realistic PMP-style scenario question with four options.",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  'Flashcards': {
    label: 'Flashcards',
    description: 'Generate study cards for any PMBOK concept or domain.',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304z" />
        <path d="M15 4h1a1 1 0 0 1 1 1v3.5" />
        <path d="M20 6c.264 .112 .52 .214 .628 .4a1 1 0 0 1 .372 .6v8" />
      </svg>
    ),
  },
  'Tutor Mode': {
    label: 'Tutor Mode',
    description: 'Walk me through a real scenario and get expert structured feedback.',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"/>
        <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"/>
      </svg>
    ),
  },
  'Concept Review': {
    label: 'PMBOK Concept',
    description: 'Deep dives into frameworks, principles, and performance domains.',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
  'Study Planning': {
    label: 'Study Plan',
    description: 'Get a personalized roadmap to PMP exam readiness.',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  'Exam Overview': {
    label: 'Exam Structure',
    description: 'Learn the ECO domains, question types, and format.',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
};

export default function ModeEvent({ mode }) {
  const meta = MODE_META[mode];
  if (!meta) return null;

  return (
    <div style={{ margin: '12px 0 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>

      {/* Pill + lines row */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
        <div style={{ flex: 1, height: '0.5px', background: BORDER }} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          borderRadius: '20px',
          border: `0.5px solid ${BORDER}`,
          background: '#ffffff',
          flexShrink: 0,
        }}>
          <span style={{ color: PMI_AQUA, display: 'flex', alignItems: 'center' }}>
            {meta.icon}
          </span>
          <span style={{ fontSize: '12px', color: TEXT_SECONDARY, whiteSpace: 'nowrap' }}>
            {meta.label}
          </span>
        </div>
        <div style={{ flex: 1, height: '0.5px', background: BORDER }} />
      </div>

      {/* Description */}
      <p style={{ fontSize: '12px', color: TEXT_TERTIARY, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
        {meta.description}
      </p>

    </div>
  );
}
