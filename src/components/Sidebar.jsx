const labelStyle = {
  fontSize: '10px',
  fontWeight: 600,
  color: '#4F17A8',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  marginBottom: 8,
};

export default function Sidebar({ timer, onStartOver }) {
  return (
    <aside style={{
      width: '200px',
      flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
    }}>
      <div style={{ padding: '0 16px', marginBottom: 24 }}>
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

      <div style={{ padding: '0 16px', marginBottom: 24 }}>
        <div style={labelStyle}>Session Time</div>
        <div style={{
          fontFamily: 'ui-monospace, monospace',
          fontSize: '20px',
          color: '#6b7280',
          letterSpacing: '1px',
        }}>
          {timer}
        </div>
      </div>
    </aside>
  );
}
