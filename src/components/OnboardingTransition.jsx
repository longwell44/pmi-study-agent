const STAGE_SENTENCE = {
  "I'm figuring out if PMP is right for me": "We've set things up to help you explore whether PMP is the right move for you.",
  "I'm preparing for the exam": "We've tailored your experience to keep your prep on track.",
  'My exam is scheduled': "We've set you up to make the most of your time before exam day.",
};

const STRUGGLE_SENTENCE = {
  'Understanding the concepts': "You'll get clear concept explanations before moving into practice.",
  'Applying them to scenarios': "You'll see scenario-based practice questions front and centre.",
  'Keeping up with agile approaches': "Agile and hybrid content will be prioritised throughout.",
  'Knowing where to focus': "We'll help you identify where to direct your energy.",
  "Haven't started yet": "We'll start from the beginning with a clear, simple path forward.",
};

function buildMessage(stage, struggle) {
  const s1 = STAGE_SENTENCE[stage] ?? "We've tailored your experience based on where you are in your journey.";
  const s2 = (struggle && STRUGGLE_SENTENCE[struggle]) ?? "You'll see recommended tools and focused content to help you prepare with confidence.";
  return `${s1} ${s2}`;
}

function CheckIcon() {
  return (
    <div style={{
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: '#D1FAE5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5 9-9" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function OnboardingTransition({ stage, struggle, onContinue }) {
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 440,
        gap: 20,
      }}>
        <CheckIcon />

        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#200F3B', marginBottom: 12 }}>
            You're all set
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
            {buildMessage(stage, struggle)}
          </p>
        </div>

        <button
          onClick={onContinue}
          style={{
            padding: '11px 28px',
            borderRadius: '8px',
            border: 'none',
            background: '#4F17A8',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Let's get started
        </button>
      </div>
    </div>
  );
}
