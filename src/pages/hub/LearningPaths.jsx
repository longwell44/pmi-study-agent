import { paths, content } from '../../lib/mockData.js';
import { usePersona } from '../../lib/PersonaContext.jsx';

const SECTION_LABEL = {
  fontSize: '10px',
  fontWeight: 600,
  color: '#4F17A8',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  marginBottom: 10,
};

const TYPE_BADGE = {
  course:      { bg: '#EFEDF3', color: '#4F17A8' },
  webinar:     { bg: '#EEFAFA', color: '#05BFE0' },
  'bite-size': { bg: '#FEF7F3', color: '#FF610F' },
};

// Per-step copy keyed by path id. Each step has:
//   oneLineSummary — shown in the "Up next" card of the preceding step
//   description    — full paragraph in the current step card
//   contentIds     — content items to surface (empty = no content section)
//   action         — CTA button label
const STEP_DETAILS = {
  'cert-prep': [
    {
      oneLineSummary: 'Verify your 36 months of PM experience and 35 hours of PM education.',
      description: 'Confirm that you meet PMI\'s eligibility requirements before investing time in the application. You need 36 months of project management experience (non-overlapping) and 35 hours of PM education. Gather project names, dates, and a brief description of your responsibilities — you\'ll need these in the next step.',
      contentIds: [],
      action: 'Review eligibility checklist',
    },
    {
      oneLineSummary: 'Submit your PMI application with project experience and education records.',
      description: 'Complete your PMI application with summaries of your project leadership experience and your 35-hour education credential. PMI audits a percentage of applications, so keep your documentation specific and honest. Most applicants hear back within 5–10 business days.',
      contentIds: [],
      action: 'Start my application',
    },
    {
      oneLineSummary: 'Build a study schedule targeting your weakest ECO performance domains.',
      description: 'With your exam date set, build a study schedule that targets your weakest performance domains across People, Process, and Business Environment. Most candidates underestimate how much pacing matters — consistent daily sessions outperform weekend cramming. Reserve the final two weeks exclusively for full-length, timed practice exams.',
      contentIds: [4, 3, 7],
      action: 'Build my study plan',
    },
    {
      oneLineSummary: 'Work through timed practice exams and track your accuracy by domain.',
      description: 'Simulate real exam conditions: full-length tests, strict timing, no interruptions. Track your score by domain after every attempt and spend extra review time on any area below 70%. The goal isn\'t to memorize answers — it\'s to understand why each correct choice is correct and why the others aren\'t.',
      contentIds: [3, 7, 4],
      action: 'Start a practice exam',
    },
    {
      oneLineSummary: 'Final logistics, mindset, and strategy for the day of your exam.',
      description: 'Confirm your test center location or online proctoring setup, ID requirements, and break policy well in advance. The night before: light review only, a solid meal, and early sleep. On exam day, trust your preparation — you\'ve done the work.',
      contentIds: [],
      action: 'Review exam day tips',
    },
  ],

  'cert-maintenance': [
    {
      oneLineSummary: 'Map out how you\'ll earn 60 PDUs across Education and Giving Back.',
      description: 'Review how many PDUs remain in your cycle and build a plan to earn them across the three Talent Triangle dimensions: Ways of Working, Power Skills, and Business Acumen. A pace of roughly 20 PDUs per year keeps you on track without a last-minute scramble. Log as you go — the habit matters.',
      contentIds: [],
      action: 'Set my PDU goal',
    },
    {
      oneLineSummary: 'Earn PDUs through courses, webinars, and self-directed learning.',
      description: 'Education PDUs come from structured learning — courses, webinars, conferences, and self-directed reading. You can also count time spent as a student in a formal class. Aim to spread your PDUs across all three Talent Triangle dimensions rather than concentrating them in one area.',
      contentIds: [1, 2, 8],
      action: 'Find a course',
    },
    {
      oneLineSummary: 'Earn PDUs by mentoring, speaking at events, or creating content.',
      description: 'Giving Back PDUs come from contributing your expertise to the profession — mentoring a colleague, presenting at an event, writing articles, or volunteering for PMI chapters or committees. Up to 25 PDUs per cycle can come from this category. It\'s where many professionals find the most lasting value: teaching what you know deepens your own understanding and builds your network.',
      contentIds: [2, 8, 6],
      action: 'Log a PDU',
    },
    {
      oneLineSummary: 'Document your PDUs and submit your renewal application in myPMI.',
      description: 'Log into your myPMI account and confirm your PDU totals are accurate and fully documented across all categories. Once you submit your renewal, PMI will review and confirm. Your PMP credential will then be active for another three-year cycle.',
      contentIds: [],
      action: 'Start renewal submission',
    },
  ],

  'professional-edge': [
    {
      oneLineSummary: 'Identify the trends most relevant to where your career is headed.',
      description: 'Survey the forces reshaping project management — AI-assisted delivery, sustainability requirements, hybrid team dynamics, and shifting stakeholder expectations. The goal isn\'t to cover everything; it\'s to identify two or three areas that feel genuinely relevant to where your career is headed and commit to going deeper.',
      contentIds: [1, 9, 8],
      action: 'Explore trending topics',
    },
    {
      oneLineSummary: 'Attend a PMI event to hear how practitioners are applying new ideas.',
      description: 'Join a live or on-demand PMI webinar to hear how practitioners outside your current context are solving familiar problems. External perspective is the point — the goal isn\'t a PDU, it\'s exposure to approaches and language you wouldn\'t encounter in your own organization.',
      contentIds: [2, 5, 8],
      action: 'Browse upcoming webinars',
    },
    {
      oneLineSummary: 'Go deep on one skill area that extends your current expertise.',
      description: 'Pick one skill area and invest in it seriously. Whether it\'s AI tools for project delivery, negotiation across stakeholder groups, or agile scaling in complex environments — choose something that builds on what you already know and positions you for where the profession is going. A focused 3–5 hour investment now can change how you approach your next project.',
      contentIds: [1, 10, 9],
      action: 'Explore AI content',
    },
    {
      oneLineSummary: 'Share what you\'ve learned by mentoring or connecting with your chapter.',
      description: 'The most durable professional growth comes from teaching what you know. Connect with your local PMI chapter, mentor someone earlier in their career, contribute to a discussion forum, or write up something you\'ve learned this year. Giving back is also how the profession moves forward — and it rounds out your PDU portfolio at the same time.',
      contentIds: [2, 6, 8],
      action: 'Find a chapter near me',
    },
  ],
};

export default function LearningPaths() {
  const { activePersona } = usePersona();
  const activePath     = paths.find(p => p.id === activePersona.activePath);
  const { steps }      = activePath;
  const completedCount = activePath.progress[activePersona.id];
  const allDone        = completedCount >= steps.length;
  const currentIdx     = allDone ? steps.length - 1 : completedCount;
  const stepDetail     = STEP_DETAILS[activePath.id][currentIdx];
  const nextStep       = !allDone ? steps[currentIdx + 1] : null;
  const nextDetail     = !allDone ? STEP_DETAILS[activePath.id][currentIdx + 1] : null;

  const stepContent = stepDetail.contentIds
    .map(id => content.find(c => c.id === id))
    .filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>

      {/* ── Section 1: Path header ─────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px 24px',
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#200F3B', marginBottom: 2 }}>
            {activePath.label}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>{activePath.description}</div>
        </div>

        {/* Progress line */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          {steps.map((step, i) => {
            const done    = i < completedCount;
            const current = i === completedCount && !allDone;
            const isLast  = i === steps.length - 1;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'none' : 1 }}>
                <div
                  title={step}
                  style={{
                    width:        current ? 14 : 10,
                    height:       current ? 14 : 10,
                    borderRadius: '50%',
                    background:   done ? '#4F17A8' : 'transparent',
                    border:       `2px solid ${done || current ? '#4F17A8' : '#e5e7eb'}`,
                    flexShrink:   0,
                    transition:   'all 0.2s',
                  }}
                />
                {!isLast && (
                  <div style={{
                    flex:       1,
                    height:     2,
                    minWidth:   12,
                    background: i < completedCount - 1 ? '#4F17A8' : '#e5e7eb',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {allDone
            ? `All ${steps.length} steps complete`
            : `Step ${currentIdx + 1} of ${steps.length}`}
        </div>
      </div>

      {/* ── Section 2: Current step ───────────────────────────── */}
      <div style={{
        background:    '#ffffff',
        borderTop:     '1px solid #e5e7eb',
        borderRight:   '1px solid #e5e7eb',
        borderBottom:  '1px solid #e5e7eb',
        borderLeft:    '2px solid #4F17A8',
        borderRadius:  '8px',
        padding:       '24px 28px',
        display:       'flex',
        flexDirection: 'column',
        gap:           20,
      }}>
        <div>
          <div style={SECTION_LABEL}>
            {allDone ? 'Completed' : 'Current Step'}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#200F3B', marginBottom: 10 }}>
            {steps[currentIdx]}
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.75, maxWidth: 600 }}>
            {stepDetail.description}
          </p>
        </div>

        {stepContent.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#9ca3af', marginBottom: 10 }}>
              Relevant for this step
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {stepContent.map(item => {
                const badge = TYPE_BADGE[item.type] ?? TYPE_BADGE.course;
                return (
                  <div key={item.id} style={{
                    background:    '#f9fafb',
                    border:        '1px solid #e5e7eb',
                    borderRadius:  '6px',
                    padding:       '10px 14px',
                    flex:          '1 1 190px',
                    maxWidth:      250,
                    display:       'flex',
                    flexDirection: 'column',
                    gap:           5,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize:        '10px',
                        fontWeight:      600,
                        padding:         '1px 7px',
                        borderRadius:    '20px',
                        background:      badge.bg,
                        color:           badge.color,
                        textTransform:   'capitalize',
                      }}>
                        {item.type}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{item.duration}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#200F3B', lineHeight: 1.35 }}>
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!allDone && (
          <button style={{
            alignSelf:    'flex-start',
            padding:      '9px 20px',
            background:   '#4F17A8',
            color:        '#ffffff',
            border:       'none',
            borderRadius: '6px',
            fontSize:     '13px',
            fontWeight:   500,
            cursor:       'pointer',
          }}>
            {stepDetail.action}
          </button>
        )}
      </div>

      {/* ── Section 3: Up next ───────────────────────────────── */}
      {nextStep && nextDetail && (
        <div style={{
          background:   '#ffffff',
          border:       '1px solid #e5e7eb',
          borderRadius: '8px',
          padding:      '16px 24px',
        }}>
          <div style={SECTION_LABEL}>Up Next</div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#200F3B', marginBottom: 3 }}>
            {nextStep}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            {nextDetail.oneLineSummary}
          </div>
        </div>
      )}

    </div>
  );
}
