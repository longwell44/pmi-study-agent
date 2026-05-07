import PracticeQuestion from './PracticeQuestion.jsx';
import Flashcard from './Flashcard.jsx';
import FollowUpChips from './FollowUpChips.jsx';

function renderText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return <p key={i} style={{ fontWeight: 700, margin: '6px 0 2px' }}>{trimmed.slice(2, -2)}</p>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      return <li key={i} style={{ marginLeft: 16, marginBottom: 2 }}>{trimmed.slice(2)}</li>;
    }
    if (trimmed === '') return <br key={i} />;
    return <p key={i} style={{ margin: '2px 0' }}>{line}</p>;
  });
}

export default function ChatMessage({ message, onChipSelect }) {
  const { role, parsed, followUps } = message;
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="msg-enter" style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 0' }}>
        <div style={{
          maxWidth: '70%',
          padding: '12px 16px',
          borderRadius: 'var(--radius) var(--radius) 4px var(--radius)',
          background: 'var(--tangerine)',
          color: '#fff',
          fontSize: '14px',
          lineHeight: 1.6,
          boxShadow: '0 2px 8px rgba(255,97,15,0.22)',
        }}>
          {parsed.text}
        </div>
      </div>
    );
  }

  return (
    <div className="msg-enter" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '4px 0' }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--violet)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
        marginTop: 2,
      }}>
        P
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '0 var(--radius) var(--radius) var(--radius)',
          padding: '14px 18px',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '14px',
          color: 'var(--text)',
          lineHeight: 1.6,
        }}>
          {parsed.text && (
            <div style={{ marginBottom: parsed.type !== 'text' ? 16 : 0 }}>
              {renderText(parsed.text)}
            </div>
          )}

          {parsed.type === 'question' && parsed.data && (
            <PracticeQuestion data={parsed.data} />
          )}

          {parsed.type === 'flashcards' && parsed.data && (
            <Flashcard cards={parsed.data} />
          )}
        </div>

        {followUps && followUps.length > 0 && (
          <FollowUpChips suggestions={followUps} onSelect={onChipSelect} />
        )}
      </div>
    </div>
  );
}
