const PMI_VIOLET     = '#4F17A8';
const PMI_VIOLET_SEC = '#6B2D8B';

const TIMING_LABELS = {
  '30days':      'Exam in 30 days',
  '1-3mo':       '1–3 months to exam',
  '3-6mo':       '3–6 months to exam',
  'unscheduled': 'Exam not yet scheduled',
};

function getWeekRange() {
  const today = new Date();
  const dow = today.getDay();
  const mon = new Date(today);
  mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(mon)} – ${fmt(sun)}`;
}

export default function ThisWeekCard({ tasks, onStart, userProfile, onViewPlan }) {
  const footerText = [
    userProfile?.weakDomains?.length > 0 && `Focus: ${userProfile.weakDomains.join(' & ')}`,
    TIMING_LABELS[userProfile?.examTiming],
  ].filter(Boolean).join(' · ');

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderLeft: '3px solid #4F17A8',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        padding: '13px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f3f4f6',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: PMI_VIOLET,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            This week
          </span>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>{getWeekRange()}</span>
        </div>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>0 / 3 done</span>
      </div>

      {/* Task rows */}
      {tasks.map((task, i, arr) => (
        <div key={i} style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none',
        }}>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: PMI_VIOLET_SEC, background: '#EDE9FF',
            padding: '2px 8px', borderRadius: '10px',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {task.domain}
          </span>
          <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: '#374151', minWidth: 0 }}>
            {task.title}
          </span>
          <span style={{
            fontSize: '11px', color: '#9ca3af', background: '#f3f4f6',
            padding: '2px 8px', borderRadius: '10px',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {task.time}
          </span>
          <button
            onClick={() => onStart(task.prompt)}
            style={{
              background: 'none', border: `1px solid ${PMI_VIOLET}`,
              borderRadius: '5px', padding: '4px 10px',
              color: PMI_VIOLET, fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#EDE9FF'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            Start →
          </button>
        </div>
      ))}

      {/* Footer (shown when footer content exists) */}
      {(footerText || onViewPlan) && (
        <div style={{
          padding: '11px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f3f4f6',
          gap: 12,
        }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', minWidth: 0 }}>
            {footerText}
          </span>
          {onViewPlan && (
            <button
              onClick={onViewPlan}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: PMI_VIOLET, fontSize: '12px', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              View full plan →
            </button>
          )}
        </div>
      )}

    </div>
  );
}
