const PMI_VIOLET = '#4F17A8';
const PMI_VIOLET_SEC = '#6B2D8B';

// ── helpers (kept in sync with PlanReveal.jsx) ─────────────────────────────

function getWeekCount(examTiming) {
  return { '30days': 4, '1-3mo': 9, '3-6mo': 18, 'unscheduled': 9 }[examTiming] ?? 9;
}

function splitIntoThree(total) {
  if (total <= 3) return [1, 1, 1];
  const base = Math.floor(total / 3);
  const rem = total % 3;
  return [base + (rem > 0 ? 1 : 0), base + (rem > 1 ? 1 : 0), base];
}

function getWeekRange() {
  const today = new Date();
  const dow = today.getDay();
  const mon = new Date(today);
  mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(mon)} – ${fmt(fri)}`;
}

function addWeeks(n) {
  const d = new Date();
  d.setDate(d.getDate() + n * 7);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildTasks(userProfile) {
  const weak = userProfile?.weakDomains ?? [];
  const domain = weak[0] ?? 'People';
  return [
    { domain: 'PMBOK 7', title: `${domain} domain overview`,    time: '30 min', prompt: 'Explain a PMBOK concept' },
    { domain,            title: `Practice: ${domain} questions`, time: '20 min', prompt: `Give me a practice question on ${domain}` },
    { domain: 'Tutor',   title: 'Scenario-based reasoning',     time: '45 min', prompt: 'Help me study for the PMP' },
  ];
}

function buildPhases(userProfile, totalWeeks) {
  const weak = userProfile?.weakDomains ?? [];
  const d1 = weak[0] ?? 'People';
  const d2 = weak[1] ?? 'Process';
  const [w1, w2] = splitIntoThree(totalWeeks);

  return [
    {
      number: 1, status: 'current',
      title: `${d1} domain foundations`,
      bullets: [`Core PMBOK 7 principles for ${d1}`, '10 practice questions per session', `Flashcard review: ${d1} concepts`],
      schedule: '1 hr/day · Mon–Fri',
      startLabel: null,
    },
    {
      number: 2, status: 'upcoming',
      title: `${d2} + mixed practice`,
      bullets: [`Deep dive into ${d2} frameworks`, 'Mixed domain practice questions', 'Tutor mode scenario practice'],
      schedule: '1 hr/day · Mon–Fri',
      startLabel: `Starts ${addWeeks(w1)}`,
    },
    {
      number: 3, status: 'locked',
      title: 'Full exam simulation & targeted review',
      bullets: ['180-question mock exams', 'Targeted review of weak areas', 'Exam strategy and timing practice'],
      schedule: '1.5 hrs/day · Mon–Sat',
      startLabel: `Starts ${addWeeks(w1 + w2)}`,
    },
  ];
}

function buildWeekGroups(totalWeeks) {
  const [w1c, w2c, w3c] = splitIntoThree(totalWeeks);
  let n = 1;
  return [
    { label: 'Phase 1', weeks: Array.from({ length: w1c }, () => n++) },
    { label: 'Phase 2', weeks: Array.from({ length: w2c }, () => n++) },
    { label: 'Phase 3', weeks: Array.from({ length: w3c }, () => n++) },
  ];
}

// ── sub-components (identical to PlanReveal.jsx) ───────────────────────────

function TaskCard({ task, onStart }) {
  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#c4b5fd'; e.currentTarget.style.background = '#faf8ff'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#ffffff'; }}
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'border-color 0.15s, background 0.15s',
        cursor: 'default',
      }}>
      <span style={{
        alignSelf: 'flex-start',
        fontSize: '10px', fontWeight: 600,
        color: '#5B21B6', background: '#ddd6fe',
        padding: '2px 8px', borderRadius: '10px', letterSpacing: '0.3px',
      }}>
        {task.domain}
      </span>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#200F3B', lineHeight: 1.4 }}>
        {task.title}
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{task.time}</div>
      <div style={{ marginTop: 2 }}>
        <button
          onClick={() => onStart(task.prompt)}
          style={{
            background: 'none', border: 'none', padding: 0,
            color: PMI_VIOLET, fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >
          Start →
        </button>
      </div>
    </div>
  );
}

function PhaseCard({ phase }) {
  const isCurrent = phase.status === 'current';
  const isLocked  = phase.status === 'locked';
  const textColor = isCurrent ? '#374151' : '#9ca3af';

  return (
    <div style={{
      background: isCurrent ? '#F8F6FF' : '#ffffff',
      border: `1px solid ${isCurrent ? '#c4b5fd' : '#e5e7eb'}`,
      borderRadius: '8px',
      padding: '18px 20px',
      opacity: isLocked ? 0.5 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: isCurrent ? 38 : 32, height: isCurrent ? 38 : 32, borderRadius: '50%', flexShrink: 0,
            background: isCurrent ? PMI_VIOLET : 'transparent',
            border: isCurrent ? 'none' : '1.5px solid #d1d5db',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isCurrent ? '15px' : '13px', fontWeight: 700,
            color: isCurrent ? '#ffffff' : '#b0b7c3',
          }}>
            {phase.number}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: isCurrent ? '#200F3B' : '#9ca3af', lineHeight: 1.3 }}>
            {phase.title}
          </div>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 600, flexShrink: 0,
          padding: '3px 10px', borderRadius: '10px',
          background: isCurrent ? PMI_VIOLET : '#f3f4f6',
          color: isCurrent ? '#ffffff' : '#9ca3af',
        }}>
          {isCurrent ? 'Current phase' : isLocked ? 'Locked' : 'Up next'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14, paddingLeft: 44 }}>
        {phase.bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M2.5 7L5.5 10L11.5 4" stroke={isCurrent ? PMI_VIOLET : '#d1d5db'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '13px', color: textColor, lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 44 }}>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{phase.schedule}</span>
        {!isCurrent && (
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>{phase.startLabel}</span>
        )}
      </div>
    </div>
  );
}

// ── shared page layout ─────────────────────────────────────────────────────

export default function StudyPlanContent({ userProfile, onStart, onRegenerate = () => {}, planSummary }) {
  const totalWeeks = getWeekCount(userProfile?.examTiming);
  const pct        = Math.round((1 / totalWeeks) * 100);
  const weak       = userProfile?.weakDomains ?? [];
  const focusLabel = weak.length > 0 ? `${weak[0]} first` : 'all domains';
  const tasks      = buildTasks(userProfile);
  const phases     = buildPhases(userProfile, totalWeeks);
  const weekGroups = buildWeekGroups(totalWeeks);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%)' }}>
      <div style={{
        maxWidth: 820,
        margin: '0 auto',
        padding: '32px 24px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#200F3B', letterSpacing: '-0.3px', marginBottom: 5 }}>
              Your Study Plan
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              {totalWeeks}-week plan · Generated today · {focusLabel}
            </p>
          </div>
          <button
            onClick={onRegenerate}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#9ca3af', fontSize: '13px',
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, marginTop: 6,
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#6b7280'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            Regenerate
          </button>
        </div>

        {/* ── PLAN SUMMARY (StudyPlan only) ── */}
        {planSummary && (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px 20px',
          }}>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#6b7280',
              fontStyle: 'italic',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {planSummary}
            </p>
          </div>
        )}

        {/* ── THIS WEEK ── */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                This week
              </span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{getWeekRange()}</span>
            </div>
            <span style={{ fontSize: '12px', color: '#9ca3af', flexShrink: 0 }}>
              0 / 3 done · ~1h 35m left
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {tasks.map((task, i) => (
              <TaskCard key={i} task={task} onStart={onStart} />
            ))}
          </div>
        </div>

        {/* ── THE PLAN ── */}
        <div style={{ background: '#F8F6FF', border: '1px solid #c4b5fd', borderRadius: '8px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
            The Plan
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '13px', color: '#374151' }}>
                Week 1 of {totalWeeks}{' '}
                <span style={{ color: '#9ca3af' }}>· Phase 1: Foundations</span>
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: PMI_VIOLET_SEC }}>{pct}% complete</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: PMI_VIOLET, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {weekGroups.map((group, gi) => (
                <div key={gi} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {group.weeks.map((w) => (
                      <div key={w} title={`W${w}`} style={{
                        flex: 1, height: 16, borderRadius: 3,
                        background: w === 1 ? PMI_VIOLET : '#e5e7eb',
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', fontWeight: 500 }}>
                    {group.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {phases.map((phase, i) => (
              <PhaseCard key={i} phase={phase} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
