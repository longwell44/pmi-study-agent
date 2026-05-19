import { useState } from 'react';
import { loadProgress, getDotsFilled, getStatusLabel } from '../utils/progress.js';

const PMI_VIOLET = '#6B2D8B';
const PMI_AQUA = '#00A9A5';
const DOMAINS = ['People', 'Process', 'Business Environment'];

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
};

const sectionLabelStyle = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  marginBottom: 14,
};

async function fetchInsights(progressData, flashcardData) {
  const dataStr = JSON.stringify({ progress: progressData, flashcards: flashcardData });
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{
        role: 'user',
        content: `Based on this PMP study performance data, give 3-4 short personalized insights and one specific next step recommendation. Be direct and actionable. Format as plain paragraphs — no headers, no JSON, no markdown symbols. Data: ${dataStr}`,
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

function loadFlashcardResults() {
  try {
    return JSON.parse(localStorage.getItem('pmi-flashcard-results') || '[]');
  } catch {
    return [];
  }
}

// ── Section 1: Performance Overview ────────────────────────────────────────
function PerformanceOverview({ progress }) {
  const { questionsAttempted, correctCount } = progress;
  const hasData = questionsAttempted > 0;
  const score = hasData ? Math.round((correctCount / questionsAttempted) * 100) : 0;

  return (
    <div style={cardStyle}>
      <div style={sectionLabelStyle}>Performance Overview</div>
      {!hasData ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
          Start answering practice questions to see your performance here.
        </p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#200F3B', lineHeight: 1 }}>
              {score}%
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: 4 }}>Readiness score</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{
                height: '100%',
                width: `${score}%`,
                background: score >= 70 ? PMI_AQUA : score >= 50 ? '#F5821F' : '#6B2D8B',
                borderRadius: 4,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {correctCount} correct out of {questionsAttempted} attempted
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section 2: ECO Domain Breakdown ────────────────────────────────────────
function DomainBreakdown({ progress }) {
  const { domains } = progress;

  return (
    <div>
      <div style={sectionLabelStyle}>ECO Domain Breakdown</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
      }}>
        {DOMAINS.map((key) => {
          const data = domains[key] ?? { attempted: 0, correct: 0 };
          const filled = getDotsFilled(data);
          const status = getStatusLabel(filled);
          return (
            <div key={key} style={{ ...cardStyle, padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#200F3B', marginBottom: 10 }}>
                {key}
              </div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: i < filled ? PMI_AQUA : 'transparent',
                    border: `1.5px solid ${i < filled ? PMI_AQUA : '#d1d5db'}`,
                  }} />
                ))}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: PMI_AQUA, marginBottom: 4 }}>
                {status}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                {data.correct} correct / {data.attempted} attempted
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section 3: Flashcard Performance ───────────────────────────────────────
function FlashcardPerformance({ onReviewMissed }) {
  const results = loadFlashcardResults();
  const yes   = results.filter(r => r.result === 'yes').length;
  const kinda = results.filter(r => r.result === 'kinda').length;
  const no    = results.filter(r => r.result === 'no').length;
  const total = results.length;
  const missed = results
    .filter(r => r.result === 'no' || r.result === 'kinda')
    .map(r => r.front);

  const rows = [
    { icon: '✓', label: 'Got it',    count: yes,   color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
    { icon: '≈', label: 'Almost',    count: kinda, color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
    { icon: '✗', label: 'Need work', count: no,    color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  ];

  return (
    <div style={cardStyle}>
      <div style={sectionLabelStyle}>Flashcard Performance</div>
      {total === 0 ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
          Complete a flashcard deck to see your results here.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {rows.map(({ icon, label, count, color, bg, border }) => (
              <div key={label} style={{
                flex: 1,
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '6px',
                padding: '10px 12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color, lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: '11px', color, marginTop: 3 }}>{icon} {label}</div>
              </div>
            ))}
          </div>
          {missed.length > 0 && (
            <button
              onClick={() => onReviewMissed(missed)}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: `1px solid ${PMI_VIOLET}`,
                background: 'none',
                color: PMI_VIOLET,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F3EEFF'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Review cards I missed
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ── Section 4: AI Insights ──────────────────────────────────────────────────
function AIInsights({ progress, hasData }) {
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [insights, setInsights] = useState('');

  const generate = async () => {
    setState('loading');
    try {
      const flashcardData = loadFlashcardResults();
      const text = await fetchInsights(progress, flashcardData);
      setInsights(text);
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={sectionLabelStyle}>Your Study Insights</div>
        {state === 'done' && (
          <button
            onClick={generate}
            style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#200F3B'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            ↻ Refresh
          </button>
        )}
      </div>

      {state === 'idle' && (
        <>
          {!hasData ? (
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 14px', lineHeight: 1.6 }}>
              Complete some study activities first to unlock your personalized insights.
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 14px', lineHeight: 1.6 }}>
              Get a personalized analysis of your study progress and what to focus on next.
            </p>
          )}
          <button
            disabled={!hasData}
            onClick={generate}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: hasData ? PMI_VIOLET : '#e5e7eb',
              color: hasData ? '#ffffff' : '#9ca3af',
              fontSize: '13px',
              fontWeight: 500,
              cursor: hasData ? 'pointer' : 'default',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { if (hasData) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { if (hasData) e.currentTarget.style.opacity = '1'; }}
          >
            Generate Insights
          </button>
        </>
      )}

      {state === 'loading' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: '13px' }}>
          <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
          <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
          <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
          <span>Generating your insights…</span>
        </div>
      )}

      {state === 'done' && (
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
          {insights}
        </div>
      )}

      {state === 'error' && (
        <div style={{ fontSize: '13px', color: '#dc2626' }}>
          Failed to generate insights. Check your connection and try again.
          <button onClick={() => setState('idle')} style={{ marginLeft: 8, fontSize: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function MyProgress({ onReviewMissed }) {
  const progress = loadProgress();
  const hasData = progress.questionsAttempted > 0;

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
        <PerformanceOverview progress={progress} />
        <DomainBreakdown progress={progress} />
        <FlashcardPerformance onReviewMissed={onReviewMissed} />
        <AIInsights progress={progress} hasData={hasData} />
      </div>
    </div>
  );
}
