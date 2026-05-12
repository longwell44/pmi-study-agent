import { useState, useRef, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import StarterCards from './components/StarterCards.jsx';
import ChatMessage from './components/ChatMessage.jsx';
import TypingIndicator from './components/TypingIndicator.jsx';
import MessageInput from './components/MessageInput.jsx';
import Onboarding from './components/Onboarding.jsx';
import OnboardingTransition from './components/OnboardingTransition.jsx';
import { useSessionTimer } from './hooks/useSessionTimer.js';
import { parseResponse, detectMode, getFollowUps } from './utils/parseResponse.js';

const STAGE_CONTEXT = {
  "I'm figuring out if PMP is right for me": 'The user is exploring whether to pursue the PMP certification.',
  "I'm preparing for the exam": 'The user is actively preparing for the PMP exam.',
  'My exam is scheduled': 'The user has scheduled their PMP exam and is in final preparation mode.',
};

const STRUGGLE_CONTEXT = {
  'Understanding the concepts': 'They are finding the core concepts difficult to grasp. Focus on clear explanations before practice.',
  'Applying them to scenarios': 'They struggle to apply concepts to real scenarios. Prioritize scenario-based practice questions.',
  'Keeping up with agile approaches': 'They find agile and hybrid approaches most challenging. Prioritize agile content and practice questions in that domain.',
  'Knowing where to focus': 'They are unsure where to focus their study. Help them prioritize by domain and suggest a study plan.',
  "Haven't started yet": 'They have not started studying yet. Start with orientation and a clear study plan.',
};

function buildContextString(stage, struggle) {
  const parts = [];
  if (stage && STAGE_CONTEXT[stage]) parts.push(STAGE_CONTEXT[stage]);
  if (struggle && STRUGGLE_CONTEXT[struggle]) parts.push(STRUGGLE_CONTEXT[struggle]);
  parts.push('Do not ask them to re-introduce themselves or repeat anything covered here.');
  return parts.join(' ');
}

const STAGE_SUMMARY = {
  "I'm figuring out if PMP is right for me": "We'll help you work out if PMP is the right move for you.",
  "I'm preparing for the exam": "We'll keep your prep focused and on track.",
  'My exam is scheduled': "Let's make the most of your time before exam day.",
};

const STRUGGLE_SUFFIX = {
  'Understanding the concepts': 'Starting with clear concept explanations.',
  'Applying them to scenarios': 'Focusing on scenario-based practice.',
  'Keeping up with agile approaches': 'Giving extra attention to agile and hybrid approaches.',
  'Knowing where to focus': 'Helping you prioritise where to direct your energy.',
  "Haven't started yet": 'Starting from the beginning with a clear path forward.',
};

function buildWelcomeSummary(stage, struggle) {
  const base = STAGE_SUMMARY[stage] ?? "Welcome — let's get started.";
  const suffix = struggle ? ` ${STRUGGLE_SUFFIX[struggle]}` : '';
  return base + suffix;
}

const RECOMMENDED_MAP = {
  "I'm figuring out if PMP is right for me": () => ['How is the PMP exam structured?', 'Explain a PMBOK concept'],
  "I'm preparing for the exam": (struggle) => {
    const map = {
      'Understanding the concepts':       ['Explain a PMBOK concept', 'Generate flashcards for a topic'],
      'Applying them to scenarios':        ['Give me a practice question', 'Explain a PMBOK concept'],
      'Keeping up with agile approaches':  ['Give me a practice question', 'Generate flashcards for a topic'],
      'Knowing where to focus':            ['Help me build a study plan', 'Explain a PMBOK concept'],
      "Haven't started yet":               ['Help me build a study plan', 'How is the PMP exam structured?'],
    };
    return map[struggle] ?? ['Explain a PMBOK concept', 'Give me a practice question'];
  },
  'My exam is scheduled': () => ['Give me a practice question', 'Help me build a study plan'],
};

function getRecommended(stage, struggle) {
  if (!stage) return [];
  const fn = RECOMMENDED_MAP[stage];
  return fn ? fn(struggle) : [];
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ display: 'block' }}>
      <path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getInitialState() {
  try {
    const stage = sessionStorage.getItem('onboarding_stage');
    const struggle = sessionStorage.getItem('onboarding_struggle');
    if (stage) return { screen: 'welcome', stage, struggle: struggle || null };
  } catch {}
  return { screen: 'onboarding', stage: null, struggle: null };
}

async function callApi(messages, userContext) {
  const body = { messages };
  if (userContext) body.userContext = userContext;

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const { content } = await res.json();
  return content;
}

export default function App() {
  const initial = getInitialState();
  const [screen, setScreen] = useState(initial.screen);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMode, setCurrentMode] = useState('General Study');
  const [error, setError] = useState(null);
  const [userContext, setUserContext] = useState(
    initial.stage ? buildContextString(initial.stage, initial.struggle) : null
  );
  const [onboardingStage, setOnboardingStage] = useState(initial.stage);
  const [onboardingStruggle, setOnboardingStruggle] = useState(initial.struggle);
  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const { formatted: timer, reset: resetTimer } = useSessionTimer();

  useEffect(() => {
    if (isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      lastMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages, isTyping]);

  const handleOnboardingComplete = (stage, struggle) => {
    try {
      sessionStorage.setItem('onboarding_stage', stage ?? '');
      if (struggle) sessionStorage.setItem('onboarding_struggle', struggle);
    } catch {}
    setUserContext(buildContextString(stage, struggle));
    setOnboardingStage(stage);
    setOnboardingStruggle(struggle);
    setScreen('transition');
  };

  const handleTransitionComplete = () => {
    setScreen('welcome');
  };

  const handleEditOnboarding = () => {
    try {
      sessionStorage.removeItem('onboarding_stage');
      sessionStorage.removeItem('onboarding_struggle');
    } catch {}
    setUserContext(null);
    setOnboardingStage(null);
    setOnboardingStruggle(null);
    setMessages([]);
    setScreen('onboarding');
    resetTimer();
  };

  const handleSend = async (text) => {
    if (isTyping) return;
    setError(null);

    const userMsg = {
      id: Date.now(),
      role: 'user',
      parsed: { type: 'text', text },
      followUps: [],
    };

    const newMode = detectMode(text);
    setCurrentMode(newMode);

    if (screen === 'welcome') setScreen('chat');

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const fullApiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m._raw ?? m.parsed.text,
    }));

    try {
      const raw = await callApi(fullApiMessages, userContext);
      const parsed = parseResponse(raw);
      const followUps = getFollowUps(parsed);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', parsed, followUps, _raw: raw },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStartOver = () => {
    setMessages([]);
    setScreen('welcome');
    setCurrentMode('General Study');
    setError(null);
    resetTimer();
  };

  if (screen === 'onboarding') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header timer={timer} onHome={handleStartOver} />
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (screen === 'transition') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header timer={timer} onHome={handleStartOver} />
        <OnboardingTransition
          stage={onboardingStage}
          struggle={onboardingStruggle}
          onContinue={handleTransitionComplete}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header timer={timer} onHome={handleStartOver} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {screen === 'chat' && (
          <Sidebar mode={currentMode} timer={timer} onStartOver={handleStartOver} />
        )}

        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#f9fafb',
        }}>
          {screen === 'welcome' ? (
            <>
              {onboardingStage && (
                <div style={{ padding: '16px 24px 0' }}>
                  <div style={{ maxWidth: 820, margin: '0 auto', width: '100%' }}>
                    <div style={{
                      background: '#F5F3FF',
                      border: '1px solid #E9E3FF',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#7C5CBF', fontWeight: 600, marginBottom: 3 }}>
                          Personalised for you
                        </div>
                        <div style={{ fontSize: '14px', color: '#200F3B', lineHeight: 1.4 }}>
                          {buildWelcomeSummary(onboardingStage, onboardingStruggle)}
                        </div>
                      </div>
                      <button
                        onClick={handleEditOnboarding}
                        title="Edit preferences"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          flexShrink: 0,
                        }}
                      >
                        <PencilIcon />
                        <span style={{ fontSize: '12px', color: '#7C5CBF' }}>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <StarterCards
                onSelect={handleSend}
                recommended={getRecommended(onboardingStage, onboardingStruggle)}
              />
              <MessageInput onSend={handleSend} disabled={isTyping} maxWidth={820} />
            </>
          ) : (
            <>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {messages.map((msg, idx) => (
                  <div key={msg.id} ref={idx === messages.length - 1 ? lastMsgRef : null}>
                    <ChatMessage message={msg} onChipSelect={handleSend} />
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                {error && (
                  <div style={{
                    padding: '10px 14px',
                    background: '#fef2f2',
                    border: '1px solid #dc2626',
                    borderRadius: '6px',
                    color: '#dc2626',
                    fontSize: '13px',
                  }}>
                    Error: {error}. Check that your API key is set in <code>.env</code>.
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <MessageInput onSend={handleSend} disabled={isTyping} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
