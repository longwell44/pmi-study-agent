export default function FollowUpChips({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
      {suggestions.map((s) => (
        <button
          key={s}
          className="chip"
          onClick={() => onSelect(s)}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
