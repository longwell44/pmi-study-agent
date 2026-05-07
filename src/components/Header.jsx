export default function Header({ timer }) {
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
      <div>
        <div style={{
          color: '#200F3B',
          fontWeight: 500,
          fontSize: '15px',
          lineHeight: 1.2,
        }}>
          PMI Study Assistant
        </div>
        <div style={{
          color: '#6b7280',
          fontSize: '11px',
          marginTop: 2,
        }}>
          Research Prototype · Not an official PMI product
        </div>
      </div>

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
