import ThisWeekCard from './ThisWeekCard.jsx';

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


function addWeeks(n) {
  const d = new Date();
  d.setDate(d.getDate() + n * 7);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const DOMAIN_TASKS = {
  'People': [
    { domain: '📖 Reading',            title: 'Read PMBOK 7 Ch. 4–5 — People domain fundamentals',               time: '~30 min', prompt: 'Explain a PMBOK concept' },
    { domain: '✏️ Practice Questions', title: '20 exam-style Qs — leadership, conflict & team dynamics',         time: '~20 min', prompt: 'Give me a practice question on People' },
    { domain: '💬 Tutor Session',      title: 'Work through a real stakeholder scenario step by step',           time: '~45 min', prompt: 'Help me study for the PMP' },
  ],
  'Process': [
    { domain: '📖 Reading',            title: 'Read PMBOK 7 Ch. 6–8 — Process domain & project execution',      time: '~30 min', prompt: 'Explain a PMBOK concept' },
    { domain: '✏️ Practice Questions', title: '20 exam-style Qs — scheduling, cost & quality management',       time: '~20 min', prompt: 'Give me a practice question on Process' },
    { domain: '💬 Tutor Session',      title: 'Work through a real project execution scenario step by step',     time: '~45 min', prompt: 'Help me study for the PMP' },
  ],
  'Business Environment': [
    { domain: '📖 Reading',            title: 'Read PMBOK 7 Ch. 2–3 — Business Environment & org context',      time: '~30 min', prompt: 'Explain a PMBOK concept' },
    { domain: '✏️ Practice Questions', title: '20 exam-style Qs — compliance, value delivery & change',         time: '~20 min', prompt: 'Give me a practice question on Business Environment' },
    { domain: '💬 Tutor Session',      title: 'Work through a real organisational change scenario step by step', time: '~45 min', prompt: 'Help me study for the PMP' },
  ],
};

function buildTasks(userProfile) {
  const domain = userProfile?.weakDomains?.[0] ?? 'People';
  return DOMAIN_TASKS[domain] ?? DOMAIN_TASKS['People'];
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
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: isCurrent ? PMI_VIOLET : 'transparent',
            border: isCurrent ? 'none' : '1.5px solid #d1d5db',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700,
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
          background: isCurrent ? '#EDE9FF' : '#f3f4f6',
          color: isCurrent ? PMI_VIOLET : '#9ca3af',
        }}>
          {isCurrent ? 'Current phase' : isLocked ? 'Locked' : 'Up next'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14, paddingLeft: 44 }}>
        {phase.bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{
              width: 4, height: 4, borderRadius: '50%', background: '#d1d5db',
              flexShrink: 0, marginTop: 7,
            }} />
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

const MARKDOWN_RE = /#{1,6}\s|\*\*|---|^#/m;

function safeSummary(text) {
  if (!text) return null;
  if (text.length >= 300) return null;
  if (MARKDOWN_RE.test(text)) return null;
  return text;
}

export default function StudyPlanContent({ userProfile, onStart, onRegenerate = () => {}, planSummary }) {
  const summary    = safeSummary(planSummary);
  const totalWeeks = getWeekCount(userProfile?.examTiming);
  const pct        = Math.round((1 / totalWeeks) * 100);
  const weak       = userProfile?.weakDomains ?? [];
  const focusLabel = weak.length > 0 ? `${weak[0]} first` : 'all domains';
  const tasks      = buildTasks(userProfile);
  const phases     = buildPhases(userProfile, totalWeeks);
  const weekGroups = buildWeekGroups(totalWeeks);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f9fafb' }}>
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
              {totalWeeks}-week plan · Generated today
            </p>
          </div>
        </div>

        {/* ── PLAN SUMMARY (StudyPlan only) ── */}
        {summary && (
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
        <ThisWeekCard tasks={tasks} onStart={onStart} userProfile={userProfile} />

        {/* ── THE PLAN ── */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
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
