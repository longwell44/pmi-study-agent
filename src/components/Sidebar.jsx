export default function Sidebar({ mode, timer, onStartOver }) {
  return (
    <aside style={{
      width: '220px',
      flexShrink: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 16px',
      gap: '20px',
    }}>
      <div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
          Current Mode
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'var(--violet-light)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(79,23,168,0.15)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--violet)', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--violet)' }}>{mode}</span>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
          Session Time
        </div>
        <div style={{
          padding: '8px 12px',
          background: 'var(--aqua-light)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(5,191,224,0.2)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--aqua-dark)',
          letterSpacing: '1px',
        }}>
          {timer}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={onStartOver}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 'var(--radius-sm)',
            border: '1.5px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--tangerine)';
            e.currentTarget.style.color = 'var(--tangerine)';
            e.currentTarget.style.background = 'var(--tangerine-light)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
          </svg>
          Start Over
        </button>
      </div>
    </aside>
  );
}
