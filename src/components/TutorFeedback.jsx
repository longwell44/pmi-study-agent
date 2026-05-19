import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SECTIONS = [
  {
    key: 'got_right',
    icon: '✓',
    label: 'What you got right',
    borderColor: '#16a34a',
    bg: '#f0fdf4',
    labelColor: '#15803d',
  },
  {
    key: 'missed',
    icon: '✗',
    label: 'What you missed',
    borderColor: '#dc2626',
    bg: '#fef2f2',
    labelColor: '#dc2626',
  },
  {
    key: 'pmi_says',
    icon: '💡',
    label: 'What PMI would say',
    borderColor: '#d97706',
    bg: '#fffbeb',
    labelColor: '#b45309',
  },
];

export default function TutorFeedback({ text, data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {text && (
        <div style={{ fontSize: '14px', color: '#200F3B', lineHeight: 1.6, marginBottom: 4 }}>
          {text}
        </div>
      )}

      {SECTIONS.map(({ key, icon, label, borderColor, bg, labelColor }) =>
        data[key] ? (
          <div
            key={key}
            style={{
              background: bg,
              border: '1px solid #e5e7eb',
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: '6px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: '13px', color: labelColor }}>{icon}</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: labelColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {label}
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#200F3B', lineHeight: 1.6 }}>
              {data[key]}
            </div>
          </div>
        ) : null
      )}

      {data.follow_up && (
        <div style={{
          marginTop: 4,
          fontSize: '14px',
          fontWeight: 500,
          color: '#200F3B',
          lineHeight: 1.6,
        }}>
          {data.follow_up}
        </div>
      )}
    </div>
  );
}
