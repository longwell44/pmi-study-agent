const labelStyle = {
  fontSize: '10px',
  fontWeight: 600,
  color: '#4F17A8',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  marginBottom: 8,
  padding: '0 16px',
};

const MODES = [
  {
    label: 'Practice question',
    prompt: 'Give me a practice question',
    mode: 'Practice Questions',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
  },
  {
    label: 'Flashcards',
    prompt: 'Generate flashcards for a topic',
    mode: 'Flashcards',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304z" />
        <path d="M15 4h1a1 1 0 0 1 1 1v3.5" />
        <path d="M20 6c.264 .112 .52 .214 .628 .4a1 1 0 0 1 .372 .6v8" />
      </svg>
    ),
  },
  {
    label: 'Tutor mode',
    prompt: 'Help me study for the PMP',
    mode: 'Tutor Mode',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    label: 'PMBOK concept',
    prompt: 'Explain a PMBOK concept',
    mode: 'Concept Review',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
  {
    label: 'Study plan',
    prompt: 'Help me build a study plan',
    mode: 'Study Planning',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Exam structure',
    prompt: 'How is the PMP exam structured?',
    mode: 'Exam Overview',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="2" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
      </svg>
    ),
  },
];

export default function Sidebar({ onStartOver, onModeSelect, currentMode }) {
  return (
    <aside style={{
      width: '200px',
      flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0',
    }}>
      <div style={labelStyle}>Study Modes</div>

      <nav style={{ flex: 1, marginTop: 4 }}>
        {MODES.map(({ label, prompt, mode, icon }) => {
          const isActive = currentMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onModeSelect(prompt)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '7px 16px',
                background: isActive ? '#F3EEFF' : 'none',
                border: 'none',
                borderLeft: isActive ? '2px solid #6B2D8B' : '2px solid transparent',
                borderRadius: 0,
                textAlign: 'left',
                cursor: 'pointer',
                color: isActive ? '#6B2D8B' : '#6b7280',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.color = '#200F3B';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '16px 16px 0', borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={onStartOver}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: '#6b7280',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#200F3B'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 14l-4 -4l4 -4" />
            <path d="M5 10h10.5a5.5 5.5 0 0 1 0 11h-3.5" />
          </svg>
          Start over
        </button>
      </div>
    </aside>
  );
}
