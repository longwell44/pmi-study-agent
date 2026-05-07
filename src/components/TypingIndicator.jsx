export default function TypingIndicator() {
  return (
    <div className="msg-enter" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '2px 0' }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 600,
        color: '#6b7280',
        flexShrink: 0,
        marginTop: 2,
      }}>
        P
      </div>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '4px 12px 12px 12px',
        padding: '12px 16px',
        display: 'flex',
        gap: 5,
        alignItems: 'center',
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="typing-dot"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#9ca3af',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
