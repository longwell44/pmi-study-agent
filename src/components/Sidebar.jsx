const labelStyle = {
  fontSize: '10px',
  fontWeight: 600,
  color: '#4F17A8',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  marginBottom: 8,
};

export default function Sidebar({ mode, timer, onStartOver }) {
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
        <div style={labelStyle}>Current Mode</div>
        <div style={{
          padding: '6px 10px',
          background: '#4F17A8',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#ffffff',
          fontWeight: 500,
          lineHeight: 1.4,
        }}>
          {mode}
        </div>
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

      <div style={{ marginTop: 'auto', padding: '0 16px' }}>
        <button
          onClick={onStartOver}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: '#6b7280',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#200F3B'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
        >
          Start over
        </button>
      </div>
    </aside>
  );
}
