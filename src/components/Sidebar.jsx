const SECTIONS = [
  {
    label: 'Practice & Learn',
    items: [
      {
        label: 'Practice Question',
        prompt: 'Give me a practice question',
        mode: 'Practice Questions',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
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
        label: 'Tutor Mode',
        prompt: 'Help me study for the PMP',
        mode: 'Tutor Mode',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"/>
            <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Plan & Understand',
    items: [
      {
        label: 'PMBOK Concept',
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
        label: 'Study Plan',
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
        label: 'Exam Structure',
        prompt: 'How is the PMP exam structured?',
        mode: 'Exam Overview',
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        ),
      },
    ],
  },
];

const PMI_AQUA = '#00A9A5';

const sectionLabelStyle = {
  fontSize: '10px',
  fontWeight: 600,
  color: '#9ca3af',
  letterSpacing: '0.7px',
  textTransform: 'uppercase',
  padding: '0 16px',
  marginBottom: 2,
};

function NavItem({ label, prompt, mode, icon, isActive, onModeSelect }) {
  return (
    <button
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
      <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.65 }}>{icon}</span>
      {label}
    </button>
  );
}

function TutorContext({ tutorMeta }) {
  if (!tutorMeta) return null;
  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={sectionLabelStyle}>Current Scenario</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {tutorMeta.domain && (
          <span style={{
            padding: '2px 8px',
            borderRadius: '20px',
            background: '#00A9A5',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 500,
          }}>
            {tutorMeta.domain}
          </span>
        )}
        {tutorMeta.difficulty && (
          <span style={{
            padding: '2px 8px',
            borderRadius: '20px',
            background: '#f3f4f6',
            color: '#6b7280',
            fontSize: '11px',
            fontWeight: 500,
            border: '1px solid #e5e7eb',
          }}>
            {tutorMeta.difficulty}
          </span>
        )}
      </div>
    </div>
  );
}

function FlashcardContext({ flashcardProgress }) {
  if (!flashcardProgress) return null;
  const { current, total } = flashcardProgress;
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={sectionLabelStyle}>This Deck</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>{current} / {total} cards</span>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#200F3B' }}>{pct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: '#f3f4f6', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: PMI_AQUA, borderRadius: 2, transition: 'width 0.2s' }} />
      </div>
    </div>
  );
}

export default function Sidebar({ onModeSelect, currentMode, tutorMeta, flashcardProgress }) {
  const showContext = (currentMode === 'Tutor Mode' && tutorMeta) || (currentMode === 'Flashcards' && flashcardProgress);

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

      <nav style={{ flex: 1 }}>
        {SECTIONS.map((section, si) => (
          <div key={section.label} style={{ marginBottom: si < SECTIONS.length - 1 ? 16 : 0 }}>
            <div style={{ ...sectionLabelStyle, marginBottom: 4 }}>{section.label}</div>
            {section.items.map(({ label, prompt, mode, icon }) => (
              <NavItem
                key={mode}
                label={label}
                prompt={prompt}
                mode={mode}
                icon={icon}
                isActive={currentMode === mode}
                onModeSelect={onModeSelect}
              />
            ))}
          </div>
        ))}
      </nav>

      {showContext && (
        <div style={{ borderTop: '1px solid #f3f4f6' }}>
          {currentMode === 'Tutor Mode' && (
            <TutorContext tutorMeta={tutorMeta} />
          )}
          {currentMode === 'Flashcards' && (
            <FlashcardContext flashcardProgress={flashcardProgress} />
          )}
        </div>
      )}

    </aside>
  );
}
