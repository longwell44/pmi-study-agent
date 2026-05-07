export default function Header({ timer }) {
  return (
    <header style={{
      background: 'var(--violet)',
      borderBottom: '3px solid var(--tangerine)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.5px',
          flexShrink: 0,
        }}>
          P
        </div>
        <div>
          <div style={{
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '17px',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}>
            PMI Study Assistant
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '11px',
            letterSpacing: '0.3px',
            fontWeight: 500,
          }}>
            Research Prototype · Not an official PMI product
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--aqua)',
          boxShadow: '0 0 6px var(--aqua)',
        }} />
        <span style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '13px',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 500,
          fontFamily: 'ui-monospace, monospace',
        }}>
          {timer}
        </span>
      </div>
    </header>
  );
}
