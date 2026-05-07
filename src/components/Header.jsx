export default function Header({ timer, onHome }) {
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
          <span style={{
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.3px',
          }}>
            PMI
          </span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{
            color: '#200F3B',
            fontWeight: 500,
            fontSize: '15px',
            lineHeight: 1.2,
          }}>
            Study Assistant
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '11px',
            marginTop: 1,
          }}>
            Research Prototype · Not an official PMI product
          </div>
        </div>
      </button>

      <span style={{
        color: '#6b7280',
        fontSize: '13px',
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'ui-monospace, monospace',
      }}>
        {timer}
      </span>
    </header>
  );
}
