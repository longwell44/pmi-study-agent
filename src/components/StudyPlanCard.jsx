const DOMAIN_COLORS = {
  'People': { bg: '#EDE9FF', bar: '#7C3AED', text: '#5B21B6' },
  'Process': { bg: '#CCFBF1', bar: '#0D9488', text: '#0F766E' },
  'Business Environment': { bg: '#FEF3C7', bar: '#D97706', text: '#92400E' },
};

const PRIORITY_BADGE = {
  true: { bg: '#FEE2E2', color: '#DC2626', label: 'Priority week' },
  false: { bg: '#F3F4F6', color: '#6B7280', label: null },
};

function HeaderPill({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      background: '#F3F0FF',
      borderRadius: 8,
      padding: '8px 14px',
    }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#200F3B' }}>{value}</span>
    </div>
  );
}

function DomainBar({ domainWeighting }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        ECO Domain Weighting
      </div>
      <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 12 }}>
        {domainWeighting.map(({ domain, percent }) => {
          const colors = DOMAIN_COLORS[domain] ?? { bar: '#9CA3AF' };
          return (
            <div
              key={domain}
              style={{ width: `${percent}%`, background: colors.bar }}
              title={`${domain}: ${percent}%`}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
        {domainWeighting.map(({ domain, percent }) => {
          const colors = DOMAIN_COLORS[domain] ?? { bg: '#F3F4F6', text: '#374151' };
          return (
            <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: colors.bar }} />
              <span style={{ fontSize: 12, color: colors.text, fontWeight: 500 }}>{domain} {percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekCard({ week }) {
  const badge = PRIORITY_BADGE[String(week.priority)] ?? PRIORITY_BADGE.false;
  return (
    <div style={{
      border: '1px solid #E5E7EB',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#7C3AED',
            background: '#EDE9FF',
            borderRadius: 4,
            padding: '2px 7px',
          }}>
            Week {week.week}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#200F3B' }}>{week.title}</span>
        </div>
        {week.priority && (
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: badge.color,
            background: badge.bg,
            borderRadius: 4,
            padding: '2px 7px',
          }}>
            {badge.label}
          </span>
        )}
      </div>
      <div style={{ padding: '10px 14px' }}>
        <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {week.tasks.map((task, i) => (
            <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{task}</li>
          ))}
        </ul>
        {week.goal && (
          <div style={{
            marginTop: 10,
            padding: '7px 10px',
            background: '#F3F0FF',
            borderRadius: 6,
            fontSize: 12,
            color: '#5B21B6',
            fontStyle: 'italic',
          }}>
            Goal: {week.goal}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudyPlanCard({ data }) {
  const {
    timeline, background, availability, focus,
    domainWeighting = [],
    weeks = [],
    keyConceptsToMaster = [],
    examDayTips = [],
    weeklyBreakdown = [],
  } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#200F3B', marginBottom: 10 }}>
          Your Study Plan
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {timeline && <HeaderPill label="Timeline" value={timeline} />}
          {background && <HeaderPill label="Background" value={background} />}
          {availability && <HeaderPill label="Weekly hours" value={availability} />}
          {focus && <HeaderPill label="Focus area" value={focus} />}
        </div>
      </div>

      {domainWeighting.length > 0 && <DomainBar domainWeighting={domainWeighting} />}

      {weeks.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            Week-by-Week Plan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {weeks.map((week) => <WeekCard key={week.week} week={week} />)}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {keyConceptsToMaster.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Key Concepts
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {keyConceptsToMaster.map((concept, i) => (
                <span key={i} style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#5B21B6',
                  background: '#EDE9FF',
                  borderRadius: 20,
                  padding: '4px 10px',
                }}>
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {weeklyBreakdown.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Weekly Schedule
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <tbody>
                {weeklyBreakdown.map(({ activity, hours }, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '5px 0', color: '#374151' }}>{activity}</td>
                    <td style={{ padding: '5px 0', color: '#7C3AED', fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {hours}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {examDayTips.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Exam Day Tips
            </div>
            <ol style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {examDayTips.map((tip, i) => (
                <li key={i} style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{tip}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
