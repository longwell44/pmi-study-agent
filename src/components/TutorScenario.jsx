export default function TutorScenario({ text, meta }) {
  // Split text into paragraphs; detect the closing question (last para ending with ?)
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const questionIdx = (() => {
    for (let i = paragraphs.length - 1; i >= 0; i--) {
      if (paragraphs[i].endsWith('?')) return i;
    }
    return -1;
  })();

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderLeft: '4px solid #6B2D8B',
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Domain + difficulty badges */}
      {(meta?.domain || meta?.difficulty) && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {meta.domain && (
            <span style={{
              padding: '2px 8px',
              borderRadius: '20px',
              background: '#00A9A5',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 500,
            }}>
              {meta.domain}
            </span>
          )}
          {meta.difficulty && (
            <span style={{
              padding: '2px 8px',
              borderRadius: '20px',
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: '11px',
              fontWeight: 500,
              border: '1px solid #e5e7eb',
            }}>
              {meta.difficulty}
            </span>
          )}
        </div>
      )}

      {/* SCENARIO label */}
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
      }}>
        Scenario
      </div>

      {/* Scenario text — last paragraph ending with ? gets question styling */}
      <div>
        {paragraphs.map((p, i) => {
          const isQuestion = i === questionIdx;
          return (
            <p
              key={i}
              style={{
                margin: i < paragraphs.length - 1 ? '0 0 10px 0' : '0',
                fontSize: isQuestion ? '15px' : '14px',
                fontWeight: isQuestion ? 600 : 400,
                color: isQuestion ? '#6B2D8B' : '#374151',
                lineHeight: 1.7,
              }}
            >
              {p}
            </p>
          );
        })}
      </div>
    </div>
  );
}
