import { useState } from 'react';

const JOURNEY_OPTIONS = [
  { label: 'Just starting to explore', value: 'exploring' },
  { label: 'Actively studying',         value: 'studying' },
  { label: 'Exam is booked',            value: 'exam-booked' },
];

const TIMING_OPTIONS = [
  { label: 'Within 30 days',    value: '30days' },
  { label: '1–3 months away',   value: '1-3mo' },
  { label: '3–6 months away',   value: '3-6mo' },
  { label: 'Not scheduled yet', value: 'unscheduled' },
];

const DOMAIN_OPTIONS = [
  { label: 'People',               value: 'People' },
  { label: 'Process',              value: 'Process' },
  { label: 'Business Environment', value: 'Business Environment' },
  { label: 'Not sure yet',         value: null },
];

const STYLE_CARDS = [
  {
    value: 'structured',
    title: 'Follow a structured plan',
    description: 'Weekly milestones, recommended tasks each day, and progress tracking.',
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    value: 'freeform',
    title: 'Explore freely',
    description: 'Jump between topics, flashcards, and practice on your own schedule.',
    icon: (color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
      </svg>
    ),
  },
];

function Chip({ label, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 18px',
        borderRadius: '24px',
        border: `${selected ? '2px' : '1.5px'} solid ${selected ? '#200F3B' : hovered ? '#9ca3af' : '#d1d5db'}`,
        background: '#ffffff',
        color: '#200F3B',
        fontSize: '14px',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        lineHeight: 1.4,
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

function PrimaryBtn({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '11px',
        borderRadius: '8px',
        border: 'none',
        background: disabled ? '#e5e7eb' : '#4F17A8',
        color: disabled ? '#9ca3af' : '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s',
        marginBottom: 14,
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

function SkipLink({ onClick }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={onClick}
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          fontSize: '13px',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#6b7280'}
        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
      >
        Skip setup
      </button>
    </div>
  );
}

function StepDots({ current }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
      {[2, 3, 4, 5].map((n) => (
        <div key={n} style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: n <= current ? '#4F17A8' : '#e5e7eb',
          transition: 'background 0.2s',
        }} />
      ))}
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: '#6b7280',
        fontSize: '13px',
        marginBottom: 20,
        fontFamily: 'inherit',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 11L5 7l4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  );
}

const pageStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  background: '#f9fafb',
  padding: '24px',
};

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '40px 48px',
  maxWidth: '520px',
  width: '100%',
};

export default function Onboarding({ onComplete }) {
  const [screen, setScreen] = useState(1);
  const [journeyStage, setJourneyStage] = useState(null);
  const [examTiming, setExamTiming] = useState(null);
  const [weakDomains, setWeakDomains] = useState([]);
  const [notSureSelected, setNotSureSelected] = useState(false);
  const [learningStyle, setLearningStyle] = useState(null);

  const skip = () => onComplete({
    skipped: true,
    journeyStage: null,
    examTiming: null,
    weakDomains: [],
    learningStyle: null,
  });

  const complete = () => onComplete({
    skipped: false,
    journeyStage,
    examTiming,
    weakDomains,
    learningStyle,
  });

  const toggleDomain = (value) => {
    if (value === null) {
      setNotSureSelected(prev => !prev);
      setWeakDomains([]);
      return;
    }
    setNotSureSelected(false);
    setWeakDomains(prev => {
      if (prev.includes(value)) return prev.filter(d => d !== value);
      if (prev.length >= 2) return prev;
      return [...prev, value];
    });
  };

  // Screen 1: Welcome gate
  if (screen === 1) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '10px',
              background: '#4F17A8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700 }}>PMI</span>
            </div>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#200F3B', marginBottom: 8, lineHeight: 1.3, textAlign: 'center' }}>
            Get a personalised PMP study plan
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: 14, lineHeight: 1.6, textAlign: 'center' }}>
            Answer 4 quick questions and we'll build a study plan tailored to your timeline, surface your weak areas, and match every recommendation to where you are in your prep.
          </p>

          <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: 24 }}>
            ⏱ About 30 seconds &nbsp;·&nbsp; 4 questions
          </p>

          <button
            onClick={() => setScreen(2)}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '8px',
              border: 'none',
              background: '#4F17A8',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 14,
              fontFamily: 'inherit',
            }}
          >
            Build my Study Plan →
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={skip}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                fontSize: '13px',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#200F3B'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              Do this later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Journey stage
  if (screen === 2) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <StepDots current={2} />
          <BackBtn onClick={() => setScreen(1)} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#200F3B', marginBottom: 8 }}>
            Where are you in your PMP journey?
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 28, lineHeight: 1.5 }}>
            Your answer helps us recommend the right tools and focus areas straight away.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {JOURNEY_OPTIONS.map(({ label, value }) => (
              <Chip
                key={value}
                label={label}
                selected={journeyStage === value}
                onClick={() => setJourneyStage(value)}
              />
            ))}
          </div>
          <PrimaryBtn onClick={() => setScreen(3)} disabled={!journeyStage} label="Next" />
          <SkipLink onClick={skip} />
        </div>
      </div>
    );
  }

  // Screen 3: Exam timing
  if (screen === 3) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <StepDots current={3} />
          <BackBtn onClick={() => setScreen(2)} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#200F3B', marginBottom: 8 }}>
            When is your exam?
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 28, lineHeight: 1.5 }}>
            This helps us tailor the plan length and pacing to your timeline.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {TIMING_OPTIONS.map(({ label, value }) => (
              <Chip
                key={value}
                label={label}
                selected={examTiming === value}
                onClick={() => setExamTiming(value)}
              />
            ))}
          </div>
          <PrimaryBtn onClick={() => setScreen(4)} disabled={!examTiming} label="Next" />
          <SkipLink onClick={skip} />
        </div>
      </div>
    );
  }

  // Screen 4: Weak domains (multi-select, up to 2)
  if (screen === 4) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <StepDots current={4} />
          <BackBtn onClick={() => setScreen(3)} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#200F3B', marginBottom: 8 }}>
            Which domains feel weakest right now?
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 28, lineHeight: 1.5 }}>
            Pick up to 2 — we'll prioritise these in your study plan.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {DOMAIN_OPTIONS.map(({ label, value }) => {
              const isSelected = value === null
                ? notSureSelected
                : weakDomains.includes(value);
              return (
                <Chip
                  key={label}
                  label={label}
                  selected={isSelected}
                  onClick={() => toggleDomain(value)}
                />
              );
            })}
          </div>
          <PrimaryBtn onClick={() => setScreen(5)} disabled={false} label="Next" />
          <SkipLink onClick={skip} />
        </div>
      </div>
    );
  }

  // Screen 5: Learning style
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <StepDots current={5} />
        <BackBtn onClick={() => setScreen(4)} />
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#200F3B', marginBottom: 8 }}>
          How do you prefer to study?
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 28, lineHeight: 1.5 }}>
          We'll match the format of your study plan and recommendations to this.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
          {STYLE_CARDS.map(({ value, title, description, icon }) => {
            const selected = learningStyle === value;
            return (
              <button
                key={value}
                onClick={() => setLearningStyle(value)}
                style={{
                  background: '#ffffff',
                  border: `${selected ? '2px' : '1.5px'} solid ${selected ? '#200F3B' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  padding: '20px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'border-color 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                  background: selected ? '#200F3B' : '#EDE9FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}>
                  {icon(selected ? '#ffffff' : '#4F17A8')}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#200F3B', marginBottom: 4, lineHeight: 1.3 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
                    {description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={complete}
          disabled={!learningStyle}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '8px',
            border: 'none',
            background: learningStyle ? '#4F17A8' : '#e5e7eb',
            color: learningStyle ? '#ffffff' : '#9ca3af',
            fontSize: '14px',
            fontWeight: 600,
            cursor: learningStyle ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
            marginBottom: 14,
            fontFamily: 'inherit',
          }}
        >
          Build my study plan
        </button>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={skip}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '13px',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#200F3B'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
