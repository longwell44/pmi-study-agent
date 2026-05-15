import { useState, useRef, useEffect } from 'react';
import PasswordGate from './components/PasswordGate.jsx';
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

const CONTEXT_MAP = {
  "Just starting to explore": {
    _default: "The user is just beginning to explore PMP certification. Orient them to what the PMP is, who it's for, and what the exam covers. Lead with big-picture framing before any practice questions.",
    "Understanding the concepts": "The user is exploring PMP and finds the core concepts hard to grasp. Use simple analogies, avoid jargon, and focus on PMBOK 7 principles and performance domains before any practice.",
    "Applying concepts to exam-style questions": "The user is exploring PMP and struggles to apply concepts to real situations. Use scenario-based examples to make concepts concrete. Explain the 'why' behind each answer.",
    "Agile and hybrid approaches": "The user is exploring PMP and finds agile and hybrid approaches confusing. Clarify the difference between predictive, agile, and hybrid. Use real project examples to ground the concepts.",
    "I'm not sure where to start": "The user is exploring PMP and has no study plan. Begin with a clear orientation: what the exam tests, how it's structured (ECO domains), and what a realistic prep path looks like.",
  },
  "Actively studying": {
    _default: "The user is actively studying for the PMP exam with the exam likely 2–6 months away. Offer a balanced mix of concept explanations, flashcards, and scenario-based practice questions. Match their pace.",
    "Understanding the concepts": "The user is actively studying but struggles with core concepts. Prioritize clear concept explanations tied to PMBOK 7 principles and the ECO domains. Use flashcards to reinforce. Introduce practice questions only after concepts are grounded.",
    "Applying concepts to exam-style questions": "The user is actively studying but struggles to apply knowledge to exam-style questions. Default to scenario-based practice questions. Always explain why each answer is correct or incorrect using PMI reasoning, not just facts.",
    "Agile and hybrid approaches": "The user is actively studying and finds agile and hybrid approaches most challenging. Agile and hybrid content spans all three ECO domains and represents a major portion of the exam. Prioritize servant leadership, iteration planning, team empowerment, retrospectives, and hybrid decision-making. Lead with agile scenario questions and connect every concept to how PMI frames it in the ECO.",
    "I'm not sure where to start": "The user is actively studying but does not know where to focus. Generate a prioritized study plan based on the three ECO domains: People (42%), Process (50%), Business Environment (8%). Recommend starting with their weakest domain and suggest a weekly study structure.",
  },
  "Exam is booked": {
    _default: "The user has booked their PMP exam and is in final preparation mode — likely within 60 days. Focus exclusively on exam readiness: scenario-based practice questions, timed drills, and weak spot targeting. Do not spend time on broad orientation.",
    "Understanding the concepts": "The user has booked their PMP exam but still struggles with core concepts. This is urgent — focus on the highest-frequency PMBOK 7 concepts that appear in exam scenarios. Connect every explanation directly to how it would be tested. Use flashcards for rapid reinforcement.",
    "Applying concepts to exam-style questions": "The user has booked their PMP exam and struggles with scenario-based questions — the dominant question type on the PMP. Drill scenario questions relentlessly. After every answer explain the PMI mindset behind it. Help them recognize patterns in how PMI frames correct answers.",
    "Agile and hybrid approaches": "The user has booked their PMP exam and is weakest on agile and hybrid. This is a critical gap — agile/hybrid content is heavily weighted across all ECO domains. Immediately prioritize agile scenario questions. Focus on servant leadership, adaptive planning, team dynamics, and hybrid approaches. Every session should include at least one agile scenario question.",
    "I'm not sure where to start": "The user has booked their PMP exam and still has no clear study plan — this is urgent. Immediately generate a focused 4–8 week study plan based on ECO domain weighting. Prioritize Process (50%) and People (42%) domains. Focus on practice questions over concept reading at this stage.",
  },
};

function buildContextString(stage, struggle) {
  if (!stage) return null;
  const stageMap = CONTEXT_MAP[stage];
  if (!stageMap) return null;
  const base = (struggle && stageMap[struggle]) || stageMap._default || '';
  return `${base} Do not ask them to re-introduce themselves or repeat anything covered here.`;
}


const RECOMMENDED_MAP = {
  "Just starting to explore": () => ['How is the PMP exam structured?', 'Explain a PMBOK concept'],
  "Actively studying": (struggle) => {
    const map = {
      'Understanding the concepts':       ['Explain a PMBOK concept', 'Generate flashcards for a topic'],
      'Applying concepts to exam-style questions':   ['Give me a practice question', 'Explain a PMBOK concept'],
      'Agile and hybrid approaches':       ['Give me a practice question', 'Generate flashcards for a topic'],
      "I'm not sure where to start":       ['Help me build a study plan', 'Explain a PMBOK concept'],
    };
    return map[struggle] ?? ['Explain a PMBOK concept', 'Give me a practice question'];
  },
  "Exam is booked": () => ['Give me a practice question', 'Help me build a study plan'],
};

function getRecommended(stage, struggle) {
  if (!stage) return [];
  const fn = RECOMMENDED_MAP[stage];
  return fn ? fn(struggle) : [];
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
  const [accessGranted, setAccessGranted] = useState(
    () => sessionStorage.getItem('pmi_access_granted') === '1'
  );
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

  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
  const isStudyPlanActive = !isTyping && (lastAssistantMsg?.parsed?.type === 'study_plan_question' || lastAssistantMsg?.parsed?.type === 'tutor_start' || lastAssistantMsg?.parsed?.type === 'flashcard_topic');

  if (!accessGranted) {
    return (
      <PasswordGate onSuccess={() => {
        sessionStorage.setItem('pmi_access_granted', '1');
        setAccessGranted(true);
      }} />
    );
  }

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
              <StarterCards
                onSelect={handleSend}
                recommended={getRecommended(onboardingStage, onboardingStruggle)}
                stage={onboardingStage}
                struggle={onboardingStruggle}
                onEdit={handleEditOnboarding}
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

              {!isStudyPlanActive && <MessageInput onSend={handleSend} disabled={isTyping} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
