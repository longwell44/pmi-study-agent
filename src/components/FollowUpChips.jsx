export default function FollowUpChips({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {suggestions.map((s) => (
        <button
          key={s}
          className="chip"
          onClick={() => onSelect(s)}
          style={{
            padding: '5px 12px',
            borderRadius: '20px',
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            fontSize: '12px',
            color: '#6b7280',
            transition: 'background 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
