import { useState } from 'react';
import { loadProgress, loadHistory, getDotsFilled, getStatusLabel } from '../utils/progress.js';
import StudyPlanBuilder from './StudyPlanBuilder.jsx';

const PMI_VIOLET = '#6B2D8B';
const PMI_AQUA = '#00A9A5';
const DOMAINS = ['People', 'Process', 'Business Environment'];

const LEVEL_TO_PCT = {
  'Not Started': 0,
  'Beginner': 20,
  'Developing': 45,
  'Intermediate': 75,
};

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
};

const sectionHeadStyle = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.7px',
  marginBottom: 16,
};

function loadFlashcardResults() {
  try { return JSON.parse(localStorage.getItem('pmi-flashcard-results') || '[]'); } catch { return []; }
}

async function fetchInsights(progressData, flashcardData) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{
        role: 'user',
        content: `Based on this PMP study performance data, give 3-4 short personalized insights and one specific next step recommendation. Be direct and actionable. Format as plain paragraphs — no headers, no JSON, no markdown symbols. Data: ${JSON.stringify({ progress: progressData, flashcards: flashcardData })}`,
      }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const { content } = await res.json();
  return content;
}

// ── Section 1: Readiness Snapshot ──────────────────────────────────────────
function ReadinessSnapshot({ progress }) {
  const { questionsAttempted, correctCount, domains } = progress;
  const score = questionsAttempted > 0
    ? Math.round((correctCount / questionsAttempted) * 100)
    : null;

  return (
    <div style={cardStyle}>
      <div style={sectionHeadStyle}>Your Performance</div>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>

        {/* Left: score */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            fontSize: '64px',
            fontWeight: 700,
            color: PMI_VIOLET,
            lineHeight: 1,
            marginBottom: 4,
          }}>
            {score !== null ? `${score}%` : '—'}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: 10 }}>
            Practice score
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {questionsAttempted} question{questionsAttempted !== 1 ? 's' : ''} attempted · {correctCount} correct overall
          </div>
        </div>

        {/* Right: domain bars */}
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          {DOMAINS.map((key) => {
            const data = domains[key] ?? { attempted: 0, correct: 0 };
            const filled = getDotsFilled(data);
            const status = getStatusLabel(filled);
            const pct = LEVEL_TO_PCT[status] ?? 0;
            const isStarted = status !== 'Not Started';
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontSize: '13px', color: '#374151' }}>{key}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isStarted ? PMI_AQUA : '#9ca3af',
                  }}>
                    {status}
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: PMI_AQUA,
                    borderRadius: 3,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// ── Section 3: What to Focus On Next ───────────────────────────────────────
const URGENCY_ORDER = { red: 0, amber: 1, teal: 2 };
const BORDER_COLOR = { red: '#dc2626', amber: '#d97706', teal: PMI_AQUA };

function buildInsights(progress, flashResults, history, onNavigate) {
  const { domains } = progress;
  const missed = flashResults.filter(r => r.result === 'no' || r.result === 'kinda');
  const insights = [];

  const proc = domains.Process ?? { attempted: 0, correct: 0 };
  if (proc.attempted < 5 || proc.correct === 0) {
    insights.push({
      urgency: 'red',
      title: 'Process domain is your biggest gap',
      body: `Process makes up 50% of the PMP exam and your data shows ${proc.attempted} attempt${proc.attempted !== 1 ? 's' : ''} with ${proc.correct} correct. Focus here first.`,
      btnLabel: 'Practice Process questions →',
      onAction: () => onNavigate('Give me a practice question on the Process domain'),
    });
  }

  if (missed.length >= 5) {
    insights.push({
      urgency: 'amber',
      title: `${missed.length} flashcards need another pass`,
      body: `You marked ${missed.length} cards as Almost or Need work. Reviewing these is your highest ROI activity right now.`,
      btnLabel: 'Review weak flashcards →',
      onAction: () => onNavigate(`Generate flashcards for these concepts I struggled with: ${missed.map(r => r.front).join('; ')}`),
    });
  }

  if (history.tutorSessions === 0) {
    insights.push({
      urgency: 'teal',
      title: "You haven't tried Tutor Mode yet",
      body: "Tutor Mode builds the reasoning skills the PMP exam actually tests — not just memorization.",
      btnLabel: 'Start Tutor Mode →',
      onAction: () => onNavigate('Help me study for the PMP'),
    });
  }

  const be = domains['Business Environment'] ?? { attempted: 0, correct: 0 };
  if (be.attempted < 3) {
    insights.push({
      urgency: 'amber',
      title: 'Business Environment needs attention',
      body: `You've barely touched this domain. It's 8% of the exam but candidates often underestimate it.`,
      btnLabel: 'Practice Business Environment →',
      onAction: () => onNavigate('Give me a practice question on Business Environment'),
    });
  }

  return insights
    .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])
    .slice(0, 3);
}

function FocusNext({ progress, flashResults, history, onNavigate }) {
  const insights = buildInsights(progress, flashResults, history, onNavigate);

  return (
    <div style={cardStyle}>
      <div style={sectionHeadStyle}>What to Focus On Next</div>
      {insights.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          Complete some study activities to unlock personalized coaching.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {insights.map((ins, i) => (
            <div key={i} style={{
              borderLeft: `3px solid ${BORDER_COLOR[ins.urgency]}`,
              borderRadius: '4px',
              background: '#fafafa',
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#200F3B', marginBottom: 4 }}>
                {ins.title}
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px', lineHeight: 1.6 }}>
                {ins.body}
              </p>
              <button
                onClick={ins.onAction}
                style={{
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: `1px solid ${PMI_VIOLET}`,
                  background: 'none',
                  color: PMI_VIOLET,
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F3EEFF'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {ins.btnLabel}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section 4: Study Activity ───────────────────────────────────────────────
function activityParagraph(progress, history) {
  const modesUsed = [
    progress.questionsAttempted > 0,
    history.flashcardDecks > 0,
    history.tutorSessions > 0,
  ].filter(Boolean).length;

  if (history.tutorSessions === 0) {
    return "You've focused on practice questions and flashcards. Tutor Mode is particularly effective for building PMP reasoning skills.";
  }
  if (modesUsed >= 3) {
    return "Great variety in your study approach — using multiple modes improves retention.";
  }
  return "You've only used one study mode so far. Try mixing in flashcards or tutor mode for better retention.";
}

function StudyActivity({ progress, history }) {
  const [aiState, setAiState] = useState('idle');
  const [aiText, setAiText] = useState('');

  const generateInsights = async () => {
    setAiState('loading');
    try {
      const flashcardData = loadFlashcardResults();
      const text = await fetchInsights(progress, flashcardData);
      setAiText(text);
      setAiState('done');
    } catch {
      setAiState('error');
    }
  };

  const metrics = [
    { label: 'Practice questions', count: progress.questionsAttempted },
    { label: 'Flashcard decks', count: history.flashcardDecks },
    { label: 'Tutor sessions', count: history.tutorSessions },
  ];

  return (
    <div style={cardStyle}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={sectionHeadStyle}>Your Study Activity</div>
        {aiState === 'idle' || aiState === 'error' ? (
          <button
            onClick={generateInsights}
            style={{
              padding: '5px 12px',
              borderRadius: '5px',
              border: `1px solid ${PMI_VIOLET}`,
              background: 'none',
              color: PMI_VIOLET,
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.15s',
              flexShrink: 0,
              marginTop: -2,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F3EEFF'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            Generate AI insights
          </button>
        ) : aiState === 'done' ? (
          <button
            onClick={generateInsights}
            style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#200F3B'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            ↻ Refresh
          </button>
        ) : null}
      </div>

      {/* Metric boxes */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {metrics.map(({ label, count }) => (
          <div key={label} style={{
            flex: 1,
            minWidth: 120,
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#200F3B', lineHeight: 1, marginBottom: 4 }}>
              {count}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Derived paragraph */}
      <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
        {activityParagraph(progress, history)}
      </p>

      {/* AI insights output */}
      {aiState === 'loading' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: '13px' }}>
          <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
          <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
          <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
          <span>Generating your insights…</span>
        </div>
      )}
      {aiState === 'done' && (
        <div style={{
          background: '#faf8ff',
          borderLeft: `3px solid ${PMI_VIOLET}`,
          borderRadius: '4px',
          padding: '14px 16px',
          fontSize: '14px',
          color: '#200F3B',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {aiText}
        </div>
      )}
      {aiState === 'error' && (
        <div style={{ fontSize: '13px', color: '#dc2626' }}>
          Failed to generate insights.{' '}
          <button onClick={() => setAiState('idle')} style={{ fontSize: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function MyDashboard({ onNavigate, userProfile, onOpenOnboarding, autoplan }) {
  const [view, setView] = useState('dashboard');
  const progress    = loadProgress();
  const history     = loadHistory();
  const flashResults = loadFlashcardResults();

  if (view === 'planbuilder') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          padding: '10px 24px', borderBottom: '1px solid #e5e7eb',
          background: '#fff', flexShrink: 0,
        }}>
          <button
            onClick={() => setView('dashboard')}
            style={{ fontSize: '13px', color: PMI_VIOLET, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            ← Back to My Learning History
          </button>
        </div>
        <StudyPlanBuilder onNavigate={(prompt) => { setView('dashboard'); onNavigate(prompt); }} />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{
        maxWidth: 820,
        margin: '0 auto',
        padding: '32px 24px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <ReadinessSnapshot progress={progress} />
        <FocusNext progress={progress} flashResults={flashResults} history={history} onNavigate={onNavigate} />
        <StudyActivity progress={progress} history={history} />
      </div>
    </div>
  );
}
