import { getDotsFilled, getStatusLabel } from '../utils/progress';

const PMI_AQUA = '#00A9A5';
const DOMAIN_KEYS = ['People', 'Process', 'Business Environment'];

function dotColor(filled) {
  if (filled === 0) return '#9ca3af';
  if (filled <= 2) return '#F5821F';
  if (filled <= 4) return PMI_AQUA;
  return '#6B2D8B';
}

export default function PracticeProgressBar({ progress }) {
  const { questionsAttempted, correctCount, domains } = progress;
  const avgScore = questionsAttempted > 0
    ? Math.round((correctCount / questionsAttempted) * 100)
    : null;

  return (
    <div style={{
      background: '#fafafa',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 0,
    }}>

      {/* Domain columns */}
      <div style={{ display: 'flex', flex: 1 }}>
        {DOMAIN_KEYS.map((key, i) => {
          const data = domains[key] ?? { attempted: 0, correct: 0 };
          const filled = getDotsFilled(data);
          const status = getStatusLabel(filled);
          const isLast = i === DOMAIN_KEYS.length - 1;

          return (
            <div
              key={key}
              style={{
                flex: 1,
                paddingRight: isLast ? 0 : 20,
                marginRight: isLast ? 0 : 20,
                borderRight: isLast ? 'none' : '1px solid #e5e7eb',
              }}
            >
              <div style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 5,
              }}>
                {key}
              </div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: j < filled ? PMI_AQUA : 'transparent',
                      border: `1.5px solid ${j < filled ? PMI_AQUA : '#d1d5db'}`,
                      transition: 'background 0.2s, border-color 0.2s',
                    }}
                  />
                ))}
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 500,
                color: dotColor(filled),
              }}>
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rolling score */}
      <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 24, borderLeft: '1px solid #e5e7eb' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: 3,
        }}>
          Score
        </div>
        <div style={{
          fontSize: '20px',
          fontWeight: 700,
          color: avgScore !== null ? '#200F3B' : '#d1d5db',
          lineHeight: 1,
        }}>
          {avgScore !== null ? `${avgScore}%` : '—'}
        </div>
        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: 3 }}>
          {questionsAttempted > 0 ? `${questionsAttempted} attempted` : 'No questions yet'}
        </div>
      </div>

    </div>
  );
}
