import { useEffect, useRef } from 'react';

const STAGE_LINE = {
  'Just starting to explore': 'Setting up your experience...',
  'exploring':                'Setting up your experience...',
  'Actively studying':        'Personalizing for your study stage...',
  'studying':                 'Personalizing for your study stage...',
  'Exam is booked':           'Tailoring for your exam prep...',
  'exam-booked':              'Tailoring for your exam prep...',
};

export default function OnboardingTransition({ stage, onContinue }) {
  // Capture latest onContinue in a ref so the one-shot timer below
  // never holds a stale closure — even if App re-renders (e.g. session timer)
  // and recreates the function.
  const onContinueRef = useRef(onContinue);
  useEffect(() => { onContinueRef.current = onContinue; });

  useEffect(() => {
    const t = setTimeout(() => {
      console.log('Transitioning to home...');
      onContinueRef.current();
    }, 1500);
    return () => clearTimeout(t);
  }, []); // intentionally empty — fires once on mount

  const line = STAGE_LINE[stage] ?? 'Personalizing your experience...';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: '#f9fafb',
      padding: '24px',
    }}>
      {/* Checkmark — scales in from 0.5 */}
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#d0f5f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        animation: 'ob-scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5 9-9" stroke="#00A9A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Message — fades in slightly after checkmark */}
      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        margin: '0 0 28px',
        animation: 'ob-fade-in 0.35s ease 0.25s both',
      }}>
        {line}
      </p>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        maxWidth: 300,
        height: 3,
        borderRadius: 2,
        background: '#e5e7eb',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: '#6B2D8B',
          animation: 'ob-progress 1.5s linear forwards',
        }} />
      </div>

      <style>{`
        @keyframes ob-scale-in {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes ob-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ob-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
