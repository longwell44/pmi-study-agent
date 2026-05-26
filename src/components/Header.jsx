function TabBtn({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '0 12px',
        alignSelf: 'stretch',
        background: 'none',
        border: 'none',
        borderBottom: isActive ? '2px solid #6B2D8B' : '2px solid transparent',
        marginBottom: '-1px',
        fontSize: '13px',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? '#6B2D8B' : '#6b7280',
        cursor: 'pointer',
        transition: 'color 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#200F3B'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6b7280'; }}
    >
      {icon}
      {label}
    </button>
  );
}


export default function Header({ timer, onHome, activeTab, onTabChange, screen }) {
  const isProgressActive = activeTab === 'progress';
  const isStudyActive    = !isProgressActive && screen === 'chat';
  const isOnHome         = !isProgressActive && !isStudyActive;

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
      {/* Left: logo + nav */}
      <div style={{ display: 'flex', alignItems: 'stretch', alignSelf: 'stretch', gap: 0 }}>
        {/* Logo — not a button, just branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: 15, flexShrink: 0 }}>
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
          <div style={{ color: '#200F3B', fontWeight: 500, fontSize: '15px' }}>
            Study Assistant
          </div>
        </div>

        {/* Divider + nav tabs */}
        {onTabChange && (
          <>
            <div style={{ width: 1, background: '#e5e7eb', margin: '12px 20px', flexShrink: 0 }} />
            <nav style={{ display: 'flex', alignItems: 'stretch', alignSelf: 'stretch' }}>
              <TabBtn
                label="Home"
                isActive={isOnHome}
                onClick={onHome}
              />
              <TabBtn
                label="Study"
                isActive={isStudyActive}
                onClick={() => onTabChange('study')}
              />
              <TabBtn
                label="My Dashboard"
                isActive={isProgressActive}
                onClick={() => onTabChange('progress')}
              />
            </nav>
          </>
        )}
      </div>

      {/* Right: account pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 12px 4px 4px',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        flexShrink: 0,
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#6B2D8B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px' }}>JD</span>
        </div>
        <span style={{ fontSize: '14px', color: '#200F3B', whiteSpace: 'nowrap' }}>John Doe</span>
      </div>
    </header>
  );
}
