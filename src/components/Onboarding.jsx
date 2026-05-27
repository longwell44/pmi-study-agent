import { useState } from 'react';

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

const PMI_PROFILE_ROWS = [
  {
    label: 'Certification pursuing',
    value: 'PMP',
    isStatus: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F17A8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    label: 'Application status',
    value: 'Approved & eligible',
    isStatus: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F17A8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: 'Exam date',
    value: 'Aug 15, 2026',
    isStatus: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F17A8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Role',
    value: 'IT Project Manager',
    isStatus: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F17A8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
      </svg>
    ),
  },
  {
    label: 'Industry',
    value: 'Technology',
    isStatus: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F17A8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
        <path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>
      </svg>
    ),
  },
  {
    label: 'Member since',
    value: '2021',
    isStatus: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F17A8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Certifications held',
    value: 'CAPM',
    isStatus: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F17A8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
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
        Do this later
      </button>
    </div>
  );
}

function StepDots({ current }) {
  const total = 3;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i < current ? '#4F17A8' : '#e5e7eb',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, fontFamily: 'inherit' }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
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
    weakDomains,
    learningStyle,
    examDate: 'Aug 15, 2026',
    examTiming: '3-6mo',
    journeyStage: 'studying',
    role: 'IT Project Manager',
    industry: 'Technology',
    memberSince: '2021',
    existingCerts: ['CAPM'],
    certPursuing: 'PMP',
    applicationStatus: 'approved',
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

  // Screen 2: myPMI profile confirmation
  if (screen === 2) {
    return (
      <div style={{ ...pageStyle, alignItems: 'flex-start', overflowY: 'auto' }}>
        <div style={{ ...cardStyle, maxWidth: '540px', margin: '0 auto' }}>
          <StepDots current={1} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#EDE9FF', borderRadius: '20px',
            padding: '5px 12px', marginBottom: 20,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4F17A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4F17A8', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
              FROM YOUR PMI ACCOUNT
            </span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#200F3B', marginBottom: 8, lineHeight: 1.3 }}>
            Here's what we already know, John
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
            We've pulled the basics from your PMI profile — just confirm it still looks right.
          </p>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: 24 }}>
            {PMI_PROFILE_ROWS.map((row, i, arr) => (
              <div key={row.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none',
                background: '#ffffff',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '7px',
                  background: '#EDE9FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {row.icon}
                </div>
                <span style={{ flex: 1, fontSize: '13px', color: '#6b7280' }}>{row.label}</span>
                {row.isStatus ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px', fontWeight: 600, color: '#059669' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {row.value}
                  </span>
                ) : (
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#200F3B' }}>{row.value}</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
              Just 2 more questions to personalise your plan
            </span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          <PrimaryBtn onClick={() => setScreen(3)} disabled={false} label="Continue →" />
        </div>
      </div>
    );
  }

  // Screen 3: Weak domains
  if (screen === 3) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <StepDots current={2} />
          <BackBtn onClick={() => setScreen(2)} />
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
          <PrimaryBtn onClick={() => setScreen(4)} disabled={false} label="Next" />
          <SkipLink onClick={skip} />
        </div>
      </div>
    );
  }

  // Screen 4: Learning style
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <StepDots current={3} />
        <BackBtn onClick={() => setScreen(3)} />
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
            Do this later
          </button>
        </div>
      </div>
    </div>
  );
}
