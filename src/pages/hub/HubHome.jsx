import { paths, content } from '../../lib/mockData.js';
import { usePersona } from '../../lib/PersonaContext.jsx';

const SECTION_LABEL = {
  fontSize: '10px',
  fontWeight: 600,
  color: '#4F17A8',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  marginBottom: 12,
};

const TYPE_BADGE = {
  course:      { bg: '#EFEDF3', color: '#4F17A8' },
  webinar:     { bg: '#EEFAFA', color: '#05BFE0' },
  'bite-size': { bg: '#FEF7F3', color: '#FF610F' },
};

function getSubtitle(persona) {
  if (persona.id === 'jordan') {
    return `${persona.renewalMonths} months to renewal · ${persona.pdus.earned} of ${persona.pdus.needed} PDUs earned`;
  }
  const map = {
    alex: "You're on track for your PMP — keep the momentum going",
    sam:  "Welcome back — here's what's new in project management",
  };
  return map[persona.id] ?? '';
}

function getRecommended(persona) {
  if (persona.id === 'alex')   return content.filter(c => c.topic === 'Agile' || c.topic === 'Risk').slice(0, 3);
  if (persona.id === 'jordan') return content.filter(c => c.type === 'webinar' || c.topic === 'AI').slice(0, 3);
  if (persona.id === 'sam')    return content.filter(c => c.topic === 'AI' || c.topic === 'Leadership').slice(0, 3);
  return content.slice(0, 3);
}

function Checkmark() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HubHome() {
  const { activePersona } = usePersona();
  const activePath     = paths.find(p => p.id === activePersona.activePath);
  const completedCount = activePath.progress[activePersona.id];
  const recommended    = getRecommended(activePersona);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 860 }}>

      {/* 1 — Welcome strip */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#200F3B', marginBottom: 6 }}>
          Good morning, {activePersona.name.split(' ')[0]}
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          {getSubtitle(activePersona)}
        </p>
      </div>

      {/* 2 — Active path progress */}
      <div>
        <div style={SECTION_LABEL}>Active Path</div>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px 24px',
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#200F3B', marginBottom: 3 }}>
              {activePath.label}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {activePath.description}
            </div>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {activePath.steps.map((step, i) => {
              const done    = i < completedCount;
              const current = i === completedCount;
              const isLast  = i === activePath.steps.length - 1;
              return (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flex: isLast ? 'none' : 1,
                    minWidth: 0,
                  }}
                >
                  {/* Circle + label */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: done ? '#4F17A8' : '#ffffff',
                      border: `2px solid ${done || current ? '#4F17A8' : '#e5e7eb'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {done
                        ? <Checkmark />
                        : <span style={{ fontSize: '11px', fontWeight: 600, color: current ? '#4F17A8' : '#9ca3af' }}>{i + 1}</span>
                      }
                    </div>
                    <span style={{
                      fontSize: '10px',
                      textAlign: 'center',
                      lineHeight: 1.3,
                      maxWidth: 72,
                      color: done ? '#4F17A8' : current ? '#200F3B' : '#9ca3af',
                      fontWeight: done || current ? 500 : 400,
                    }}>
                      {step}
                    </span>
                  </div>

                  {/* Connector */}
                  {!isLast && (
                    <div style={{
                      flex: 1,
                      height: 2,
                      minWidth: 8,
                      background: i < completedCount - 1 ? '#4F17A8' : '#e5e7eb',
                      marginTop: 13,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3 — Recommended content */}
      <div>
        <div style={SECTION_LABEL}>Recommended for You</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}>
          {recommended.map((item) => {
            const badge = TYPE_BADGE[item.type] ?? TYPE_BADGE.course;
            return (
              <div key={item.id} style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    background: badge.bg,
                    color: badge.color,
                    textTransform: 'capitalize',
                  }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {item.format} · {item.duration}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#200F3B', lineHeight: 1.3 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
