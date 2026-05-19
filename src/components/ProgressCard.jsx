import { loadProgress, getDotsFilled, getStatusLabel } from '../utils/progress';

const PMI_AQUA = '#00A9A5';

function getStatus(filled) {
  const label = getStatusLabel(filled);
  if (filled === 0) return { label, color: '#9ca3af' };
  if (filled <= 2) return { label, color: '#F59E0B' };
  if (filled <= 4) return { label, color: PMI_AQUA };
  return { label, color: '#6B2D8B' };
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '11px',
      fontWeight: 600,
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

export default function ProgressCard() {
  const progress = loadProgress();
  const { questionsAttempted, correctCount, domains } = progress;
  const avgScore = questionsAttempted > 0
    ? Math.round((correctCount / questionsAttempted) * 100)
    : null;

  const domainRows = Object.entries(domains).map(([label, data]) => ({
    label,
    filled: getDotsFilled(data),
  }));

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px 24px',
      maxWidth: 820,
      width: '100%',
    }}>

      {/* Section 1 — Performance Stats */}
      <SectionLabel>Performance</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#200F3B', lineHeight: 1 }}>
            {avgScore !== null ? `${avgScore}%` : '—'}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: 5, lineHeight: 1.4 }}>
            Avg. Score on Practice Questions
          </div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#200F3B', lineHeight: 1 }}>
            {questionsAttempted}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: 5, lineHeight: 1.4 }}>
            Questions Attempted
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: '#e5e7eb', marginBottom: 20 }} />

      {/* Section 2 — Strengths & Weaknesses */}
      <SectionLabel>Strengths &amp; Weaknesses</SectionLabel>
      <div>
        {domainRows.map((domain, i) => {
          const status = getStatus(domain.filled);
          const isLast = i === domainRows.length - 1;
          return (
            <div
              key={domain.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: isLast ? 0 : 12,
                marginBottom: isLast ? 0 : 12,
                borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#200F3B', flex: '0 0 160px' }}>
                {domain.label}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: status.color, flex: 1, textAlign: 'center' }}>
                {status.label}
              </div>
              <div style={{ display: 'flex', gap: 5, flex: '0 0 auto' }}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: j < domain.filled ? PMI_AQUA : 'transparent',
                      border: `1.5px solid ${j < domain.filled ? PMI_AQUA : '#d1d5db'}`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
