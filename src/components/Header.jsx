const TABS = [
  { id: 'study', label: 'Study' },
  { id: 'progress', label: 'My Progress' },
];

export default function Header({ timer, onHome, activeTab, onTabChange }) {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 24px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Logo */}
      <button
        onClick={onHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '7px',
          background: '#4F17A8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px' }}>
            PMI
          </span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ color: '#200F3B', fontWeight: 500, fontSize: '15px', lineHeight: 1.2 }}>
            Study Assistant
          </div>
          <div style={{ color: '#6b7280', fontSize: '11px', marginTop: 1 }}>
            Research Prototype · Not an official PMI product
          </div>
        </div>
      </button>

      {/* Tabs — only rendered when onTabChange is provided */}
      {onTabChange && (
        <div style={{ display: 'flex', alignSelf: 'stretch', alignItems: 'stretch', gap: 4 }}>
          {TABS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                style={{
                  padding: '0 14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #6B2D8B' : '2px solid transparent',
                  marginBottom: '-1px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#6B2D8B' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#200F3B'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6b7280'; }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Timer */}
      <span style={{
        color: '#6b7280',
        fontSize: '13px',
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'ui-monospace, monospace',
        flexShrink: 0,
      }}>
        {timer}
      </span>
    </header>
  );
}
