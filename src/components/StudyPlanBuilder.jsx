import { useState } from 'react';

// ── Tokens ────────────────────────────────────────────────────────────────────
const V     = '#6B2D8B';
const V700  = '#5a2576';
const V100  = '#f1e8f7';
const AQ    = '#00A9A5';
const AQ100 = '#d8f0ef';
const AQ50  = '#ecf8f7';
const TAN   = '#F5821F';
const INK   = '#1a1230';
const INK2  = '#3a3252';
const MUTED  = '#75708a';
const MUTED2 = '#a8a4b8';
const LINE  = '#ebe9f0';
const LINE2 = '#e0dde8';

const STORAGE_KEY          = 'pmi-study-plan';
const STORAGE_INPUTS_KEY   = 'pmi-study-plan-inputs';
const STORAGE_PROGRESS_KEY = 'pmi-study-plan-progress';
const TIMEFRAMES   = ['6 weeks', '8 weeks', '10 weeks', '12 weeks'];
const DOMAIN_NAMES = { people: 'People', process: 'Process', business: 'Business Environment' };
const DEFAULT_INPUTS = { timeframe: '8 weeks' };

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractJson(text) {
  const stripped = text.replace(/```(?:json)?\s*\n?([\s\S]*?)```/g, '$1').trim();
  try { return JSON.parse(stripped); } catch {}
  const arrMatch = stripped.match(/\[[\s\S]*\]/);
  if (arrMatch) { try { return JSON.parse(arrMatch[0]); } catch {} }
  const objMatch = stripped.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch {} }
  throw new Error('Having trouble generating your plan — try again');
}

// ── Field-name normalizers ────────────────────────────────────────────────────
// Claude occasionally returns camelCase, snake_case, or capitalized variants.
// These mappers canonicalize everything to the field names the render code expects.

// ── Field-name normalizers ────────────────────────────────────────────────────
// Claude occasionally returns camelCase, snake_case, Title Case, or other variants.
// These mappers canonicalize everything to the names the render code expects.

function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

// Case- and separator-insensitive key lookup ("Business Environment" → "businessenvironment")
function ciPick(obj, ...patterns) {
  if (!obj || typeof obj !== 'object') return undefined;
  const norm = s => s.toLowerCase().replace(/[\s_-]/g, '');
  for (const pat of patterns) {
    const key = Object.keys(obj).find(k => norm(k) === norm(pat));
    if (key !== undefined && obj[key] !== undefined) return obj[key];
  }
  return undefined;
}

function normalizeDomains(raw) {
  if (!raw || typeof raw !== 'object') return { people: 0, process: 0, business: 0 };
  const n = v => Number(v) || 0;
  return {
    people:   n(ciPick(raw, 'people', 'People', 'PEOPLE', 'peoplePercent', 'people_percent', 'peopledomain')),
    process:  n(ciPick(raw, 'process', 'Process', 'PROCESS', 'processPercent', 'process_percent', 'processdomain')),
    business: n(ciPick(raw, 'business', 'Business', 'BUSINESS', 'businessPercent', 'business_percent',
                           'businessEnvironment', 'business environment', 'businessdomain')),
  };
}

function normalizeActivity(raw) {
  if (!raw || typeof raw !== 'object') return { type: 'practice', label: '', daily: '', duration: '' };
  return {
    type:     String(pick(raw, 'type', 'activityType', 'category', 'kind', 'mode', 'activityKind') ?? 'practice'),
    label:    String(pick(raw, 'label', 'name', 'title', 'activityName', 'activity', 'description', 'activityTitle') ?? ''),
    daily:    String(pick(raw, 'daily', 'dailyTarget', 'target', 'frequency', 'goal', 'amount', 'quota', 'recommendation', 'dailyGoal') ?? ''),
    duration: String(pick(raw, 'duration', 'time', 'timeEstimate', 'minutes', 'length', 'estimatedTime', 'timeRequired') ?? ''),
  };
}

function normalizeWeek(raw, idx) {
  if (!raw || typeof raw !== 'object') return null;

  const weekNum = Number(
    pick(raw, 'week', 'weekNumber', 'number', 'weekNum', 'weekNo', 'id', 'weekIndex') ?? (idx + 1)
  );

  // Activities — try named keys, then fall back to the first array value in the object
  const activitiesRaw =
    pick(raw, 'activities', 'tasks', 'items', 'studyActivities', 'exercises',
              'studyTasks', 'dailyActivities', 'practiceItems', 'learningActivities',
              'weekActivities', 'activityList') ??
    Object.values(raw).find(v => Array.isArray(v) && v.length > 0 &&
                                  typeof v[0] === 'object' && !Array.isArray(v[0]));
  const activities = Array.isArray(activitiesRaw)
    ? activitiesRaw.map(normalizeActivity).filter(a => a !== null)
    : [];

  // Domains — try named keys, then flat fields, then first sub-object with number values
  let domainsRaw =
    pick(raw, 'domains', 'domain', 'domainWeights', 'domainAllocation', 'domainFocus',
              'domainBreakdown', 'domainPercentages', 'domainCoverage', 'domainDistribution',
              'topicCoverage', 'focusAreas', 'domainSplit', 'coverage');

  if (!domainsRaw) {
    // Flat domain fields at week level: { peopleDomain: 40, processDomain: 50, ... }
    const fp = ciPick(raw, 'peopleDomain',   'peoplePercent',   'people_percent',   'people');
    const fc = ciPick(raw, 'processDomain',  'processPercent',  'process_percent',  'process');
    const fb = ciPick(raw, 'businessDomain', 'businessPercent', 'business_percent', 'business',
                           'businessEnvironment', 'business environment');
    if (fp !== undefined || fc !== undefined || fb !== undefined) {
      domainsRaw = { people: fp ?? 0, process: fc ?? 0, business: fb ?? 0 };
    }
  }

  if (!domainsRaw) {
    // Last resort: first plain sub-object whose values are all numbers
    domainsRaw = Object.values(raw).find(
      v => v && typeof v === 'object' && !Array.isArray(v) &&
           Object.values(v).every(x => typeof x === 'number')
    );
  }

  const title = String(
    pick(raw, 'title', 'weekTitle', 'theme', 'name', 'heading', 'weekName',
              'topic', 'module', 'subject', 'weekTheme', 'studyTopic') ?? `Week ${weekNum}`
  );

  const focus = String(
    pick(raw, 'focus', 'summary', 'overview', 'weekFocus', 'description',
              'objective', 'weekSummary', 'weekObjective', 'focusArea', 'keyFocus') ?? ''
  );

  const hoursPerDay = Number(
    pick(raw, 'hoursPerDay', 'hours_per_day', 'dailyHours', 'hours', 'hoursDaily',
              'dailyStudyHours', 'studyHours', 'recommendedHours', 'targetHours',
              'dailyStudy', 'hoursDaily', 'studyHoursPerDay') ?? 0
  );

  return {
    week: weekNum,
    title,
    dates:       String(pick(raw, 'dates', 'dateRange', 'weekDates', 'period', 'date', 'dateSpan', 'weekPeriod') ?? ''),
    focus,
    description: String(pick(raw, 'description', 'focus', 'summary', 'overview', 'objective', 'weekSummary') ?? focus),
    hoursPerDay,
    activities,
    domains: normalizeDomains(domainsRaw),
  };
}

function normalizePlan(parsed) {
  if (Array.isArray(parsed)) {
    return { planRationale: null, weeks: parsed.map(normalizeWeek).filter(Boolean) };
  }
  if (!parsed || typeof parsed !== 'object') return { planRationale: null, weeks: [] };

  const weeksRaw = pick(parsed,
    'weeks', 'weeklyPlan', 'schedule', 'studyPlan', 'plan',
    'weeklySchedule', 'studySchedule', 'curriculum', 'program', 'studyWeeks'
  ) ?? Object.values(parsed).find(v => Array.isArray(v) && v.length > 0);

  const weeks = Array.isArray(weeksRaw)
    ? weeksRaw.map(normalizeWeek).filter(Boolean)
    : [];

  const rationale = String(
    pick(parsed, 'planRationale', 'rationale', 'summary', 'introduction',
                 'overview', 'explanation', 'personalization', 'planSummary',
                 'reasoning', 'planExplanation') ?? ''
  ) || null;

  return { planRationale: rationale, weeks };
}

function dominantDomain(domains) {
  if (!domains || typeof domains !== 'object') return 'people';
  const entries = Object.entries(domains).filter(([, v]) => typeof v === 'number');
  if (!entries.length) return 'people';
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function loadSaved() {
  try {
    const raw    = JSON.parse(localStorage.getItem(STORAGE_KEY)        || 'null');
    const inputs = JSON.parse(localStorage.getItem(STORAGE_INPUTS_KEY) || 'null');
    if (!raw) return { plan: null, inputs };
    const plan = normalizePlan(raw);
    // If normalization produced no usable weeks, treat as no saved plan
    if (!plan.weeks.length) {
      console.warn('[SPB] cached plan had 0 weeks after normalize — clearing');
      localStorage.removeItem(STORAGE_KEY);
      return { plan: null, inputs };
    }
    return { plan, inputs };
  } catch { return { plan: null, inputs: null }; }
}

function loadProfile() {
  try {
    const onboarding = JSON.parse(localStorage.getItem('pmi-onboarding') || 'null');
    const progress   = JSON.parse(localStorage.getItem('pmi-progress')   || 'null');
    return { onboarding, progress };
  } catch { return { onboarding: null, progress: null }; }
}

function getWeakestDomain(progress) {
  if (!progress) return null;
  let worst = null, worstRate = Infinity;
  for (const d of ['people', 'process', 'business']) {
    const p = progress[d];
    if (!p || !p.attempted) continue;
    const rate = p.correct / p.attempted;
    if (rate < worstRate) { worstRate = rate; worst = d; }
  }
  return worst;
}

function shortFocus(focus) {
  if (!focus) return null;
  const map = [
    ['Agile', 'Agile'], ['Risk', 'Risk'], ['Stakeholder', 'Stakeholder'],
    ['Planning', 'Planning'], ['Business', 'Business'],
  ];
  for (const [k, v] of map) {
    if (focus.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return focus.split(' ')[0];
}

function summaryLabel(inputs, profile) {
  const parts = [inputs.timeframe];
  if (profile.onboarding?.focus) parts.push(`${shortFocus(profile.onboarding.focus)} focus`);
  const weakest = getWeakestDomain(profile.progress);
  if (weakest) parts.push(`${DOMAIN_NAMES[weakest]} priority`);
  return parts.join(' · ');
}

async function callGeneratePlan(inputs, profile) {
  const weekCount = parseInt(inputs.timeframe);
  const { onboarding, progress } = profile;

  const stage = onboarding?.stage || 'Not specified';
  const focus = onboarding?.focus || 'Not specified';

  const domainLine = (key, label) => {
    const p = progress?.[key];
    if (!p || !p.attempted) return `- ${label}: No data yet`;
    return `- ${label}: ${p.correct}/${p.attempted} correct`;
  };

  const systemOverride = `You are a PMP study plan generator. Generate a personalized week-by-week study plan in JSON format.

User profile:
- Journey stage: ${stage}
- Focus area: ${focus}
${domainLine('people', 'People domain')}
${domainLine('process', 'Process domain')}
${domainLine('business', 'Business Environment')}
- Weeks until exam: ${inputs.timeframe}

Use this data to:
1. Weight weak domains more heavily
2. Match the plan depth to their journey stage
3. Incorporate their focus area into week topics
4. Infer appropriate daily hours from timeframe

Return ONLY a JSON object with this structure:
{
  "planRationale": "2-3 sentences explaining why the plan is structured this way, referencing their actual data",
  "weeks": [{
    "week": 1,
    "title": "4-6 word week theme",
    "dates": "Week of Jun 2",
    "focus": "1-2 sentence focus summary",
    "description": "1-2 sentence description of what they will do this week",
    "hoursPerDay": 1.5,
    "activities": [
      { "type": "practice",   "label": "Practice Questions", "daily": "3 questions", "duration": "20 min" },
      { "type": "flashcards", "label": "Flashcards",         "daily": "1 deck",      "duration": "15 min" },
      { "type": "tutor",      "label": "Tutor Mode",         "daily": "1 session",   "duration": "25 min" }
    ],
    "domains": { "people": 60, "process": 30, "business": 10 }
  }]
}

Generate exactly ${weekCount} weeks. Domain percentages must sum to 100. Return ONLY valid JSON, no markdown, no explanation.`;

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemOverride,
      messages: [{ role: 'user', content: 'Generate the study plan now.' }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    console.error('[StudyPlanBuilder] API error:', err);
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const { content } = await res.json();
  try {
    const parsed = extractJson(content);
    console.log('FULL PLAN:', JSON.stringify(parsed, null, 2));
    const result = normalizePlan(parsed);
    console.log('[SPB] week[0] after normalize:', JSON.stringify(result.weeks[0], null, 2));
    if (!result.weeks.length) throw new Error('Unexpected response format — no weeks found');
    return result;
  } catch (e) {
    console.error('[SPB] parse error:', e.message, '\nraw content:\n', content);
    throw new Error('Having trouble generating your plan — try again');
  }
}

// ── Primitives ────────────────────────────────────────────────────────────────
function Pill({ label, selected, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${selected ? V : hov && !disabled ? V : LINE2}`,
        background: selected ? V : '#fff',
        color: selected ? '#fff' : hov && !disabled ? V : INK2,
        padding: '9px 16px', borderRadius: 999,
        fontSize: 13, fontWeight: 500,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.15s ease', userSelect: 'none',
        opacity: disabled && !selected ? 0.55 : 1,
      }}
    >{label}</button>
  );
}

// ── Profile card ──────────────────────────────────────────────────────────────
function ProfileCard({ profile }) {
  const { onboarding, progress } = profile;
  const weakest   = getWeakestDomain(progress);
  const hasPoints = onboarding?.stage || onboarding?.focus || weakest;

  const dataPoints = [];
  if (onboarding?.stage) dataPoints.push({ label: 'Stage', value: onboarding.stage });
  if (onboarding?.focus) dataPoints.push({ label: 'Focus', value: onboarding.focus });
  if (weakest) {
    const p = progress[weakest];
    dataPoints.push({
      label: 'Weakest domain',
      value: `${DOMAIN_NAMES[weakest]} (${p.correct} correct / ${p.attempted} attempted)`,
    });
  }

  return (
    <div style={{
      background: '#f7f6fa', border: `1px solid ${LINE}`,
      borderRadius: 10, padding: '12px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: V, fontWeight: 700 }}>✦</span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: MUTED, letterSpacing: '0.02em' }}>
          Personalizing with your profile
        </span>
      </div>
      {!hasPoints ? (
        <p style={{ margin: 0, fontSize: 12.5, color: MUTED2, lineHeight: 1.5 }}>
          Complete onboarding to personalize your plan
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dataPoints.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, lineHeight: 1.4 }}>
              <span style={{ color: MUTED2, fontWeight: 500, flexShrink: 0, minWidth: 108 }}>{label}:</span>
              <span style={{ color: INK2, fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton card (loading state) ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ border: `1px solid ${LINE}`, background: '#fff', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="skel" style={{ width: 50, height: 26, borderRadius: 999 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skel" style={{ height: 14, width: '50%' }} />
          <div className="skel" style={{ height: 11, width: '70%' }} />
        </div>
        <div className="skel" style={{ width: 80, height: 24, borderRadius: 999 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[0,1,2].map(i => <div key={i} className="skel" style={{ height: 62, borderRadius: 10 }} />)}
      </div>
    </div>
  );
}

// ── Activity item ─────────────────────────────────────────────────────────────
const ACTIVITY_ICONS = {
  practice: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  flashcards: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3.604 7.197l7.138-3.109a.96.96 0 011.27.527l4.924 11.902a1 1 0 01-.514 1.304l-7.137 3.109a.96.96 0 01-1.271-.527L.09 8.501a1 1 0 01.514-1.304z"/>
      <path d="M15 4h1a1 1 0 011 1v3.5M20 6c.264.112.52.214.628.4a1 1 0 01.372.6v8"/>
    </svg>
  ),
  tutor: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 9l-10-4-10 4 10 4 10-4v6"/>
      <path d="M6 10.6v5.4a6 3 0 0012 0v-5.4"/>
    </svg>
  ),
};

function ActivityItem({ activity, weekTitle, domainLabel, onStart, isCompleted }) {
  const [hov, setHov] = useState(false);
  const prompts = {
    practice:   `Give me a practice question on ${weekTitle} in the ${domainLabel} domain`,
    flashcards: `Generate flashcards for ${weekTitle} focusing on ${domainLabel}`,
    tutor:      `Walk me through a tutor scenario on ${weekTitle}`,
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: isCompleted ? AQ50 : '#f6f5f8',
      border: `1px solid ${isCompleted ? AQ100 : LINE}`,
      padding: '10px 12px 10px 10px', borderRadius: 10, minWidth: 0,
      transition: 'background 0.15s, border-color 0.15s',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: isCompleted ? AQ100 : '#e9e7ee',
        color: isCompleted ? AQ : '#5e596f',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        opacity: isCompleted ? 0.75 : 1,
      }}>
        {ACTIVITY_ICONS[activity.type]}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: isCompleted ? MUTED : INK, lineHeight: 1.2, textDecoration: isCompleted ? 'line-through' : 'none' }}>
          {activity.label}
        </div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 2, lineHeight: 1.2 }}>
          {activity.daily}{activity.duration ? ` · ${activity.duration}` : ''}
        </div>
      </div>
      {isCompleted ? (
        <div style={{ width: 24, height: 24, borderRadius: 999, background: AQ, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      ) : (
        <button
          onClick={() => onStart(prompts[activity.type], activity.type)}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            border: `1px solid ${hov ? MUTED : LINE2}`,
            background: hov ? '#f7f6fa' : 'transparent',
            color: hov ? INK : INK2,
            fontSize: 11.5, fontWeight: 600,
            padding: '5px 8px 5px 9px', borderRadius: 6,
            display: 'inline-flex', alignItems: 'center', gap: 3,
            transition: 'all 0.15s ease', fontFamily: 'inherit',
            lineHeight: 1, cursor: 'pointer', flexShrink: 0,
          }}
        >
          Start
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Week card ─────────────────────────────────────────────────────────────────
function WeekCard({ week, locked, onStart, onContinue, completedActivities }) {
  const dom        = dominantDomain(week.domains);
  const domLabel   = DOMAIN_NAMES[dom] ?? 'People';
  const activities = Array.isArray(week.activities) ? week.activities : [];
  const domains    = week.domains ?? { people: 0, process: 0, business: 0 };
  const weekCompletedCount = activities.filter(
    a => completedActivities.has(`${week.week}-${a.type}`)
  ).length;
  return (
    <div style={{
      border: `1px solid ${LINE}`,
      background: locked ? '#fafafd' : '#fff',
      borderRadius: 14, padding: '22px 24px 20px',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {/* Head row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          minWidth: 48, height: 26, padding: '0 12px', borderRadius: 999,
          background: locked ? '#ece9f1' : V,
          color: locked ? INK2 : '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', flexShrink: 0, marginTop: 1,
        }}>
          Wk {week.week}
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED2 }}>
            {week.dates}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: INK, lineHeight: 1.3, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
            {week.title}
            {locked && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUTED2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            )}
          </div>
          <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginTop: 2 }}>
            {week.description || week.focus}
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
          background: locked ? '#ece9f1' : '#efedf3',
          color: locked ? MUTED2 : MUTED,
          flexShrink: 0, marginTop: 1, whiteSpace: 'nowrap',
        }}>
          {locked ? 'Locked' : `${activities.length} activities`}
        </div>
      </div>

      {/* Commit badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontSize: 12.5, color: INK2, fontWeight: 500,
        background: '#f7f6fa', padding: '7px 12px', borderRadius: 8,
        alignSelf: 'flex-start', opacity: locked ? 0.55 : 1,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={AQ} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span><strong style={{ fontWeight: 600, color: INK }}>{week.hoursPerDay}h</strong> per day</span>
      </div>

      {/* Activity grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        opacity: locked ? 0.5 : 1,
        pointerEvents: locked ? 'none' : 'auto',
        userSelect: locked ? 'none' : 'auto',
      }}>
        {activities.map((act, idx) => (
          <ActivityItem
            key={act.type ?? idx}
            activity={act}
            weekTitle={week.title ?? ''}
            domainLabel={domLabel}
            isCompleted={completedActivities.has(`${week.week}-${act.type}`)}
            onStart={(prompt, type) => onStart(prompt, week.week, type)}
          />
        ))}
      </div>

      {/* Domain bar */}
      <div style={{ opacity: locked ? 0.5 : 1 }}>
        <div style={{ display: 'flex', height: 3, overflow: 'hidden', background: '#f1eff5', margin: '0 -24px' }}>
          <span style={{ display: 'block', width: `${domains.people ?? 0}%`,   background: 'rgba(107,45,139,0.55)' }} />
          <span style={{ display: 'block', width: `${domains.process ?? 0}%`,  background: 'rgba(0,169,165,0.55)'  }} />
          <span style={{ display: 'block', width: `${domains.business ?? 0}%`, background: 'rgba(245,130,31,0.55)' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: MUTED, fontWeight: 500, marginTop: 10 }}>
          {[
            { label: 'People',   color: V,   pct: domains.people   ?? 0 },
            { label: 'Process',  color: AQ,  pct: domains.process  ?? 0 },
            { label: 'Business', color: TAN, pct: domains.business ?? 0 },
          ].map(({ label, color, pct }) => (
            <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: 'inline-block' }} />
              {label} {pct}%
            </span>
          ))}
        </div>
      </div>

      {/* Week CTA — active week only */}
      {!locked && (
        <WeekCta
          weekNum={week.week}
          completedCount={weekCompletedCount}
          totalCount={activities.length}
          onClick={() => onContinue(`Let's ${weekCompletedCount > 0 ? 'continue' : 'start'} Week ${week.week} of my study plan: ${week.title}`)}
        />
      )}
    </div>
  );
}

// ── Inline week CTA (lives inside the active WeekCard) ────────────────────────
function WeekCta({ weekNum, completedCount, totalCount, onClick }) {
  const [hov, setHov] = useState(false);
  const allDone = totalCount > 0 && completedCount >= totalCount;

  if (allDone) {
    return (
      <div style={{
        width: '100%', padding: '11px 16px', borderRadius: 10,
        background: AQ50, border: `1px solid ${AQ100}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        fontSize: 13.5, fontWeight: 600, color: AQ, userSelect: 'none',
      }}>
        Week {weekNum} Complete ✓
      </div>
    );
  }

  const label = completedCount > 0 ? `Continue Week ${weekNum}` : `Start Week ${weekNum}`;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '11px 16px', borderRadius: 10,
        background: hov ? V700 : V, color: '#fff', border: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
        fontFamily: 'inherit', transition: 'background 0.15s',
      }}
    >
      {label}
      <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
    </button>
  );
}

// ── Plan form (timeframe only) ────────────────────────────────────────────────
function PlanForm({ inputs, onChange, onSubmit, isGenerating, error, profile, compact = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 18 : 24 }}>
      {error && (
        <div style={{ fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px' }}>
          {error}
        </div>
      )}

      {/* Timeframe */}
      <div>
        <div style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: INK2, marginBottom: 10 }}>
          When is your exam?
          <span style={{ fontSize: 11, color: MUTED2, fontWeight: 500, marginLeft: 8 }}>Weeks until exam</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TIMEFRAMES.map(t => (
            <Pill key={t} label={t} selected={inputs.timeframe === t} disabled={isGenerating}
              onClick={() => onChange({ ...inputs, timeframe: t })} />
          ))}
        </div>
      </div>

      {/* Profile card */}
      {profile && <ProfileCard profile={profile} />}

      {/* CTA */}
      <button
        onClick={onSubmit}
        disabled={isGenerating}
        style={{
          width: '100%', padding: '15px 18px', borderRadius: 12,
          background: isGenerating ? '#9d6fb5' : V, color: '#fff', border: 0,
          fontWeight: 600, fontSize: 15, letterSpacing: '0.01em',
          cursor: isGenerating ? 'default' : 'pointer',
          boxShadow: '0 6px 20px -8px rgba(107,45,139,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'inherit', transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!isGenerating) e.currentTarget.style.background = V700; }}
        onMouseLeave={e => { if (!isGenerating) e.currentTarget.style.background = isGenerating ? '#9d6fb5' : V; }}
      >
        {isGenerating ? (
          <>
            <div className="spb-spin" style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff' }} />
            Generating…
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Generate my study plan
          </>
        )}
      </button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function StudyPlanBuilder({ onNavigate }) {
  const saved   = loadSaved();
  const profile = loadProfile();

  const [view,    setView]    = useState(saved.plan ? 'complete' : 'empty');
  const [plan,    setPlan]    = useState(saved.plan);
  const [inputs,  setInputs]  = useState({ timeframe: saved.inputs?.timeframe || DEFAULT_INPUTS.timeframe });
  const [genProgress, setGenProgress] = useState(0);
  const [error,   setError]   = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [completedActivities, setCompletedActivities] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_PROGRESS_KEY) || '[]'));
    } catch { return new Set(); }
  });

  const weeks          = plan?.weeks ?? [];
  const totalActivities = weeks.reduce((s, w) => s + (Array.isArray(w.activities) ? w.activities.length : 0), 0);
  const completedCount  = completedActivities.size;
  const weekCount       = parseInt(inputs.timeframe);

  const handleGenerate = async () => {
    setView('generating');
    setShowEditForm(false);
    setError(null);
    let pct = 0;
    const iv = setInterval(() => {
      pct = Math.min(pct + Math.random() * 10, 91);
      setGenProgress(Math.round(pct));
    }, 700);
    try {
      const result = await callGeneratePlan(inputs, profile);
      clearInterval(iv);
      setGenProgress(100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      localStorage.setItem(STORAGE_INPUTS_KEY, JSON.stringify(inputs));
      localStorage.removeItem(STORAGE_PROGRESS_KEY);
      setCompletedActivities(new Set());
      console.log('[SPB] setting plan state — weeks:', result.weeks.length, 'week[0]:', result.weeks[0]);
      setTimeout(() => { setPlan(result); setView('complete'); }, 200);
    } catch (err) {
      clearInterval(iv);
      setError(err.message);
      setView('empty');
    }
  };

  const handleRegenerate = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_INPUTS_KEY);
    localStorage.removeItem(STORAGE_PROGRESS_KEY);
    setPlan(null);
    setView('empty');
    setShowEditForm(false);
    setGenProgress(0);
    setError(null);
    setCompletedActivities(new Set());
  };

  const handleActivityStart = (prompt, weekNum, actType) => {
    setCompletedActivities(prev => {
      const next = new Set([...prev, `${weekNum}-${actType}`]);
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify([...next]));
      return next;
    });
    onNavigate(prompt);
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (view === 'empty') {
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f4f7' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 32px 64px' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 600, color: INK, letterSpacing: '-0.02em' }}>
              Build your study plan
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: MUTED, lineHeight: 1.6 }}>
              Tell us your exam date and we'll generate a personalized week-by-week PMP plan.
            </p>
          </div>
          <PlanForm
            inputs={inputs}
            onChange={setInputs}
            onSubmit={handleGenerate}
            isGenerating={false}
            error={error}
            profile={profile}
          />
        </div>
      </div>
    );
  }

  // ── Generating state ─────────────────────────────────────────────────────────
  if (view === 'generating') {
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f4f7' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 32px 64px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <div className="spb-spin" style={{ width: 36, height: 36, borderRadius: 999, border: `3px solid ${V100}`, borderTopColor: V }} />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: INK, letterSpacing: '-0.01em' }}>
              Building your personalized plan…
            </h2>
            <p style={{ margin: '0 0 12px', fontSize: 13.5, color: MUTED }}>
              Personalizing {weekCount} weeks based on your profile.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 160, height: 4, borderRadius: 999, background: V100, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${genProgress}%`, background: V, borderRadius: 999, transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: 12, color: MUTED2, fontFamily: 'monospace' }}>{genProgress}%</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0,1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Complete state ───────────────────────────────────────────────────────────
  // Safety: if weeks is empty or malformed, fall back to the form so the user isn't stranded
  if (!weeks.length) {
    console.error('[StudyPlanBuilder] complete state but weeks is empty — plan:', plan);
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f4f7' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 32px 64px' }}>
          <div style={{ fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
            The generated plan couldn't be displayed. Check the browser console for details.
          </div>
          <PlanForm inputs={inputs} onChange={setInputs} onSubmit={handleGenerate} isGenerating={false} error={null} profile={profile} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f5f4f7' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 32px 64px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Settings summary bar */}
        <div style={{
          background: '#f3f4f6', border: '1px solid #e5e7eb',
          borderRadius: 8, padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>
            {summaryLabel(inputs, profile)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <button
              onClick={() => setShowEditForm(v => !v)}
              style={{ fontSize: 12.5, color: V, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              {showEditForm ? 'Cancel' : 'Edit plan'}
            </button>
            <span style={{ fontSize: 12, color: LINE2 }}>·</span>
            <button
              onClick={handleRegenerate}
              style={{ fontSize: 12.5, color: MUTED, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = INK}
              onMouseLeave={e => e.currentTarget.style.color = MUTED}
            >
              Regenerate
            </button>
          </div>
        </div>

        {/* Inline edit form */}
        {showEditForm && (
          <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, padding: '24px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 20 }}>
              Update your plan settings
            </div>
            <PlanForm
              inputs={inputs}
              onChange={setInputs}
              onSubmit={handleGenerate}
              isGenerating={false}
              error={null}
              profile={profile}
              compact
            />
          </div>
        )}

        {/* Plan rationale */}
        {plan?.planRationale && (
          <div style={{
            background: AQ50, border: `1px solid ${AQ100}`,
            borderRadius: 10, padding: '12px 16px',
            display: 'flex', gap: 10,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={AQ} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ margin: 0, fontSize: 13, color: INK2, lineHeight: 1.6 }}>{plan.planRationale}</p>
          </div>
        )}

        {/* Progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: MUTED, fontWeight: 500, flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={completedCount > 0 ? AQ : MUTED2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Week 1 of {weeks.length}
          <span style={{ color: LINE2 }}>·</span>
          <span style={{ color: completedCount > 0 ? AQ : MUTED }}>
            {completedCount} of {totalActivities} activities completed
          </span>
        </div>

        {/* Week cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {weeks.map((week, i) => (
            <WeekCard
              key={week.week}
              week={week}
              locked={i > 0}
              onStart={handleActivityStart}
              onContinue={(prompt) => onNavigate(prompt)}
              completedActivities={completedActivities}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
