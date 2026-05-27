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
import { loadProgress, recordAnswer, recordTutorSession } from './utils/progress.js';
import MyDashboard from './components/MyProgress.jsx';
import ModeEvent from './components/ModeEvent.jsx';
import PlanReveal from './components/PlanReveal.jsx';
import StudyPlan from './components/StudyPlan.jsx';

const RECOMMENDED_MAP = {
  'exam-booked': ['Give me a practice question', 'Help me build a study plan'],
  'studying':    ['Give me a practice question', 'Help me build a study plan'],
  'exploring':   ['Help me build a study plan', 'How is the PMP exam structured?'],
};

function getRecommended(userProfile) {
  if (!userProfile || userProfile.skipped) return [];
  return RECOMMENDED_MAP[userProfile.journeyStage] ?? [];
}

function buildContextFromProfile(profile) {
  if (!profile) return null;
  if (profile.skipped) {
    return "User skipped setup. Treat all domains equally. Do not ask them to introduce themselves.";
  }
  const stageLabel = {
    'exploring':  'just starting to explore PMP',
    'studying':   'actively studying',
    'exam-booked':'exam is booked',
  }[profile.journeyStage] ?? profile.journeyStage;
  const timingLabel = {
    '30days':      '30 days',
    '1-3mo':       '1–3 months',
    '3-6mo':       '3–6 months',
    'unscheduled': 'not yet scheduled',
  }[profile.examTiming] ?? 'unknown';
  const domains = profile.weakDomains?.length > 0
    ? profile.weakDomains.join(', ')
    : 'none specified';
  const style = profile.learningStyle === 'structured'
    ? 'structured'
    : profile.learningStyle === 'freeform'
      ? 'freeform exploration'
      : 'unspecified';
  return `User profile: journey stage is ${stageLabel}, exam is ${timingLabel} away, weakest domains are ${domains}, learning style is ${style}. Prioritise content for their weak domains. Do not ask them to re-introduce themselves.`;
}

const MODE_PLACEHOLDERS = {
  'Tutor Mode':        'Type your answer…',
  'Practice Questions':'Type your answer…',
  'Flashcards':        'Ask for more cards or type a topic…',
  'Study Planning':    'Ask to adjust your plan…',
  'Concept Review':    'Ask a follow-up question…',
  'Exam Overview':     'Ask a follow-up question…',
};

function getInitialState() {
  try {
    const profileStr = sessionStorage.getItem('onboarding_profile');
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      return { screen: 'welcome', userProfile: profile };
    }
  } catch {}
  return { screen: 'onboarding', userProfile: null };
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
  const [userProfile, setUserProfile] = useState(initial.userProfile);
  const [userContext, setUserContext] = useState(
    initial.userProfile ? buildContextFromProfile(initial.userProfile) : null
  );
  const [practiceProgress, setPracticeProgress] = useState(() => loadProgress());
  const [flashcardProgress, setFlashcardProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('study');
  const [autoplan, setAutoplan] = useState({ status: 'idle', text: '' });
  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const planFetchedRef = useRef(false);
  const hasSeenReveal = useRef(initial.userProfile != null);
  const { formatted: timer, reset: resetTimer } = useSessionTimer();

  const startPlanFetch = (profile) => {
    if (planFetchedRef.current || !profile || profile.skipped) return;
    planFetchedRef.current = true;
    setAutoplan({ status: 'loading', text: '' });

    const stageLabel = {
      'exploring':   'just starting to explore PMP',
      'studying':    'actively studying',
      'exam-booked': 'has an exam booked',
    }[profile.journeyStage] ?? profile.journeyStage;

    const timingLabel = {
      '30days':      'within 30 days',
      '1-3mo':       '1–3 months',
      '3-6mo':       '3–6 months',
      'unscheduled': 'not yet scheduled',
    }[profile.examTiming] ?? 'unknown';

    const domains = profile.weakDomains?.length > 0
      ? profile.weakDomains.join(' and ')
      : 'no specific domains specified';

    const style = profile.learningStyle === 'structured'
      ? 'following a structured plan'
      : profile.learningStyle === 'freeform'
        ? 'exploring topics freely'
        : 'no specific preference';

    const prompt = `Generate a personalised PMP study plan for someone who is ${stageLabel}, has their exam ${timingLabel} away, finds ${domains} most challenging, and prefers ${style}. Format it clearly with weeks or phases.`;

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        systemOverride: "You are a PMP study plan generator. Generate a clear, personalised week-by-week study plan in plain text. Use concise headers and bullet points. Tailor it specifically to the user's profile. Do not use JSON. Do not add preamble — go straight into the plan.",
      }),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setAutoplan({ status: 'done', text: data.content ?? '' }))
      .catch(() => setAutoplan({ status: 'error', text: '' }));
  };

  useEffect(() => {
    if (isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      lastMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages, isTyping]);

  const handleOnboardingComplete = (profile) => {
    try {
      sessionStorage.setItem('onboarding_profile', JSON.stringify(profile));
    } catch {}
    setUserProfile(profile);
    setUserContext(buildContextFromProfile(profile));
    if (profile.skipped) {
      setScreen('welcome');
    } else {
      setScreen('transition');
    }
  };

  const handleTransitionComplete = () => {
    if (!hasSeenReveal.current) {
      hasSeenReveal.current = true;
      startPlanFetch(userProfile);
      setScreen('revealing');
    } else {
      setScreen('welcome');
    }
  };

  const handleEditOnboarding = () => {
    try {
      sessionStorage.removeItem('onboarding_profile');
    } catch {}
    hasSeenReveal.current = false;
    planFetchedRef.current = false;
    setAutoplan({ status: 'idle', text: '' });
    setUserContext(null);
    setUserProfile(null);
    setMessages([]);
    setScreen('onboarding');
    resetTimer();
  };

  const handleSend = async (text, { explicitModeSwitch = false } = {}) => {
    if (isTyping) return;
    setError(null);

    const userMsg = {
      id: Date.now(),
      role: 'user',
      parsed: { type: 'text', text },
      followUps: [],
    };

    const newMode = detectMode(text);
    const modeIsChanging = explicitModeSwitch && newMode !== 'General Study' && newMode !== currentMode;

    if (newMode !== 'General Study') {
      setCurrentMode(newMode);
      if (newMode === 'Tutor Mode' && currentMode !== 'Tutor Mode') recordTutorSession();
    }

    if (screen === 'welcome' || screen === 'revealing') setScreen('chat');

    setMessages((prev) => {
      if (modeIsChanging) {
        const modeEvent = { id: Date.now() - 1, role: 'mode_event', mode: newMode };
        return [...prev, modeEvent, userMsg];
      }
      return [...prev, userMsg];
    });
    setIsTyping(true);

    const fullApiMessages = [...messages, userMsg]
      .filter((m) => m.role !== 'mode_event')
      .map((m) => ({
        role: m.role,
        content: m._raw ?? m.parsed.text,
      }));

    try {
      const raw = await callApi(fullApiMessages, userContext);
      const parsed = parseResponse(raw);
      const followUps = getFollowUps(parsed, newMode !== 'General Study' ? newMode : currentMode);

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

  const handleAnswer = (domain, isCorrect) => {
    const updated = recordAnswer(domain, isCorrect);
    setPracticeProgress(updated);
  };

  const handleFlashcardProgress = (current, total) => {
    setFlashcardProgress({ current, total });
  };

  const handleStartOver = () => {
    setMessages([]);
    setScreen('welcome');
    setCurrentMode('General Study');
    setFlashcardProgress(null);
    setActiveTab('study');
    setError(null);
    resetTimer();
  };

  const handleTabChange = (tab) => {
    if (tab === 'progress') {
      setActiveTab('progress');
      startPlanFetch(userProfile);
    } else if (tab === 'studyplan') {
      setActiveTab('studyplan');
      if (screen === 'revealing') setScreen('welcome');
      startPlanFetch(userProfile);
    } else if (tab === 'study') {
      setActiveTab('study');
      if (messages.length > 0) {
        setScreen('chat');
      } else {
        handleSend('Give me a practice question');
      }
    }
  };

  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
  const isStudyPlanActive = !isTyping && (
    lastAssistantMsg?.parsed?.type === 'study_plan_question' ||
    lastAssistantMsg?.parsed?.type === 'tutor_start' ||
    lastAssistantMsg?.parsed?.type === 'flashcard_topic' ||
    lastAssistantMsg?.parsed?.type === 'concept_topic'
  );

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
        <Header timer={timer} onHome={handleStartOver} userProfile={userProfile} />
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (screen === 'transition') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header timer={timer} onHome={handleStartOver} userProfile={userProfile} />
        <OnboardingTransition
          stage={userProfile?.journeyStage}
          onContinue={handleTransitionComplete}
        />
      </div>
    );
  }

  if (screen === 'revealing') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header timer={timer} onHome={handleStartOver} activeTab={activeTab} onTabChange={handleTabChange} screen={screen} userProfile={userProfile} />
        <PlanReveal
          userProfile={userProfile}
          onStart={(prompt) => handleSend(prompt, { explicitModeSwitch: true })}
          onHome={() => setScreen('welcome')}
          onViewPlan={() => handleTabChange('studyplan')}
        />
      </div>
    );
  }

  const handleReviewMissed = (missed) => {
    setActiveTab('study');
    handleSend(`Generate flashcards focusing on the concepts I struggled with: ${missed.join('; ')}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header timer={timer} onHome={handleStartOver} activeTab={activeTab} onTabChange={handleTabChange} screen={screen} userProfile={userProfile} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {screen === 'chat' && activeTab === 'study' && (
          <Sidebar
            onModeSelect={(prompt) => { setActiveTab('study'); handleSend(prompt, { explicitModeSwitch: true }); }}
            currentMode={currentMode}
            flashcardProgress={currentMode === 'Flashcards' ? flashcardProgress : null}
          />
        )}

        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#f9fafb',
        }}>
          {activeTab === 'studyplan' ? (
            <StudyPlan
              autoplan={autoplan}
              userProfile={userProfile}
              onStart={(prompt) => { setActiveTab('study'); handleSend(prompt, { explicitModeSwitch: true }); }}
            />
          ) : activeTab === 'progress' ? (
            <MyDashboard
              onReviewMissed={handleReviewMissed}
              onNavigate={(prompt) => { setActiveTab('study'); handleSend(prompt, { explicitModeSwitch: true }); }}
              userProfile={userProfile}
              onOpenOnboarding={handleEditOnboarding}
              autoplan={autoplan}
            />
          ) : screen === 'welcome' ? (
            <>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <StarterCards
                  onSelect={(text) => handleSend(text, { explicitModeSwitch: true })}
                  recommended={getRecommended(userProfile)}
                  userProfile={userProfile}
                  onEdit={handleEditOnboarding}
                  onViewDashboard={() => handleTabChange('progress')}
                />
              </div>
              <MessageInput onSend={handleSend} disabled={isTyping} maxWidth={820} placeholder={MODE_PLACEHOLDERS[currentMode] ?? 'Ask anything about the PMP exam…'} />
            </>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{
                  maxWidth: '960px',
                  margin: '0 auto',
                  width: '100%',
                  padding: '12px 24px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  {messages.map((msg, idx) => (
                    <div key={msg.id} ref={idx === messages.length - 1 ? lastMsgRef : null}>
                      {msg.role === 'mode_event'
                        ? <ModeEvent mode={msg.mode} />
                        : <ChatMessage message={msg} onChipSelect={handleSend} onAnswer={handleAnswer} onFlashcardProgress={handleFlashcardProgress} />
                      }
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
              </div>
              {!isStudyPlanActive && <MessageInput onSend={handleSend} disabled={isTyping} placeholder={MODE_PLACEHOLDERS[currentMode] ?? 'Ask anything about the PMP exam…'} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
