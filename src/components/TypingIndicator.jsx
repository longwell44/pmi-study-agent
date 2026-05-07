export default function TypingIndicator() {
  return (
    <div className="msg-enter" style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '4px 0' }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--violet)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
      }}>
        P
      </div>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '0 var(--radius) var(--radius) var(--radius)',
        padding: '14px 18px',
        display: 'flex',
        gap: 5,
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="typing-dot"
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--text-muted)',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
