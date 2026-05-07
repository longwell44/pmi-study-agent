const CARDS = [
  {
    icon: '📝',
    label: 'Give me a practice question',
    description: 'Test your knowledge with a realistic PMP-style question',
    color: 'var(--tangerine)',
    bg: 'var(--tangerine-light)',
    border: 'rgba(255,97,15,0.2)',
  },
  {
    icon: '🗂️',
    label: 'Generate flashcards for a topic',
    description: 'Create study cards for any PMBOK concept or domain',
    color: 'var(--aqua-dark)',
    bg: 'var(--aqua-light)',
    border: 'rgba(5,191,224,0.2)',
  },
  {
    icon: '📖',
    label: 'Explain a PMBOK concept',
    description: 'Deep dives into frameworks, principles, and performance domains',
    color: 'var(--violet)',
    bg: 'var(--violet-light)',
    border: 'rgba(79,23,168,0.15)',
  },
  {
    icon: '🗓️',
    label: 'Help me build a study plan',
    description: 'Get a personalized roadmap to PMP exam readiness',
    color: 'var(--violet)',
    bg: 'var(--violet-light)',
    border: 'rgba(79,23,168,0.15)',
  },
  {
    icon: '🎯',
    label: 'How is the PMP exam structured?',
    description: 'Learn the ECO domains, question types, and format',
    color: 'var(--aqua-dark)',
    bg: 'var(--aqua-light)',
    border: 'rgba(5,191,224,0.2)',
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
      gap: '32px',
      background: 'var(--bg)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--violet)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 800,
          color: '#fff',
          margin: '0 auto 20px',
          boxShadow: '0 4px 16px rgba(79,23,168,0.3)',
        }}>
          P
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 10 }}>
          Ready to ace the PMP?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
          Your AI study partner is here. Choose where to start, or type your own question below.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px',
        width: '100%',
        maxWidth: 820,
      }}>
        {CARDS.map((card) => (
          <button
            key={card.label}
            className="starter-card"
            onClick={() => onSelect(card.label)}
            style={{
              background: 'var(--surface)',
              border: `1.5px solid ${card.border}`,
              borderRadius: 'var(--radius)',
              padding: '20px 18px',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>
                {card.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {card.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
