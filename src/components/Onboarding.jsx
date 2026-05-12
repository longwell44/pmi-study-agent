import { useState } from 'react';

const STAGE_OPTIONS = [
  "I'm figuring out if PMP is right for me",
  "I'm preparing for the exam",
  "My exam is scheduled",
];

const STRUGGLE_OPTIONS = [
  'Understanding the concepts',
  'Applying them to scenarios',
  'Keeping up with agile approaches',
  'Knowing where to focus',
  "Haven't started yet",
];

function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(label)}
      style={{
        padding: '10px 18px',
        borderRadius: '24px',
        border: `${selected ? '2px' : '1.5px'} solid ${selected ? '#200F3B' : '#e5e7eb'}`,
        background: '#ffffff',
        color: selected ? '#200F3B' : '#9ca3af',
        fontSize: '14px',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        lineHeight: 1.4,
      }}
    >
      {label}
    </button>
  );
}

export default function Onboarding({ onComplete }) {
  const [screen, setScreen] = useState(1);
  const [stage, setStage] = useState(null);
  const [struggle, setStruggle] = useState(null);

  const handleComplete = (selectedStruggle) => {
    onComplete(stage, selectedStruggle ?? struggle);
  };

  const handleSkip = () => {
    onComplete(stage, null);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: '#f9fafb',
      padding: '24px',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '40px 48px',
        maxWidth: '520px',
        width: '100%',
      }}>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {[1, 2].map((n) => (
            <div key={n} style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: n <= screen ? '#4F17A8' : '#e5e7eb',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        {screen === 1 ? (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#200F3B', marginBottom: 8 }}>
              Where are you in your PMP journey?
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 28, lineHeight: 1.5 }}>
              Your answer helps us recommend the right tools and focus areas straight away.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {STAGE_OPTIONS.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={stage === opt}
                  onClick={setStage}
                />
              ))}
            </div>

            <button
              onClick={() => setScreen(2)}
              disabled={!stage}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '8px',
                border: 'none',
                background: stage ? '#4F17A8' : '#e5e7eb',
                color: stage ? '#ffffff' : '#9ca3af',
                fontSize: '14px',
                fontWeight: 600,
                cursor: stage ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
                marginBottom: 14,
              }}
            >
              Next
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => onComplete(null, null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Skip for now
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setScreen(1)}
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
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7l4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>

            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#200F3B', marginBottom: 28 }}>
              What's feeling hardest about your prep right now?
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {STRUGGLE_OPTIONS.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={struggle === opt}
                  onClick={setStruggle}
                />
              ))}
            </div>

            <button
              onClick={() => handleComplete(struggle)}
              disabled={!struggle}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '8px',
                border: 'none',
                background: struggle ? '#4F17A8' : '#e5e7eb',
                color: struggle ? '#ffffff' : '#9ca3af',
                fontSize: '14px',
                fontWeight: 600,
                cursor: struggle ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
                marginBottom: 14,
              }}
            >
              Start studying
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleSkip}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
