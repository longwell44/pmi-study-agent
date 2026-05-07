import { useState, useRef, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import StarterCards from './components/StarterCards.jsx';
import ChatMessage from './components/ChatMessage.jsx';
import TypingIndicator from './components/TypingIndicator.jsx';
import MessageInput from './components/MessageInput.jsx';
import { useSessionTimer } from './hooks/useSessionTimer.js';
import { parseResponse, detectMode, getFollowUps } from './utils/parseResponse.js';

async function callApi(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const { content } = await res.json();
  return content;
}

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMode, setCurrentMode] = useState('General Study');
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const { formatted: timer, reset: resetTimer } = useSessionTimer();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.parsed.text + (m.role === 'assistant' && m._raw ? '' : ''),
    }));

    // Reconstruct full content for assistant messages (including JSON)
    const fullApiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m._raw ?? m.parsed.text,
    }));

    try {
      const raw = await callApi(fullApiMessages);
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
              <StarterCards onSelect={handleSend} />
              <MessageInput onSend={handleSend} disabled={isTyping} />
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
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} onChipSelect={handleSend} />
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
