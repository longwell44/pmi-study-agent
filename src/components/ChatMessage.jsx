import PracticeQuestion from './PracticeQuestion.jsx';
import Flashcard from './Flashcard.jsx';
import FollowUpChips from './FollowUpChips.jsx';
import StudyPlanQuestion from './StudyPlanQuestion.jsx';
import StudyPlanCard from './StudyPlanCard.jsx';
import FlashcardTopic from './FlashcardTopic.jsx';

const avatarStyle = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: '#e5e7eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 600,
  color: '#6b7280',
  flexShrink: 0,
};

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
      <div className="msg-enter" style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: 8,
        padding: '2px 0',
      }}>
        <div style={{
          maxWidth: '70%',
          padding: '10px 14px',
          borderRadius: '12px 12px 4px 12px',
          background: '#f3f4f6',
          color: '#200F3B',
          fontSize: '14px',
          lineHeight: 1.6,
        }}>
          {parsed.text}
        </div>
        <div style={avatarStyle}>U</div>
      </div>
    );
  }

  return (
    <div className="msg-enter" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '2px 0' }}>
      <div style={{ ...avatarStyle, marginTop: 2 }}>P</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          borderRight: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
          borderLeft: '2px solid #4F17A8',
          borderRadius: '4px 12px 12px 12px',
          padding: '14px 16px',
          fontSize: '14px',
          color: '#200F3B',
          lineHeight: 1.6,
        }}>
          {parsed.text && parsed.type !== 'question' && parsed.type !== 'study_plan_question' && parsed.type !== 'tutor_start' && parsed.type !== 'study_plan' && parsed.type !== 'flashcard_topic' && (
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

          {parsed.type === 'study_plan_question' && parsed.data && (
            <StudyPlanQuestion data={parsed.data} onSelect={onChipSelect} />
          )}

          {parsed.type === 'tutor_start' && parsed.data && (
            <StudyPlanQuestion data={parsed.data} onSelect={onChipSelect} />
          )}

          {parsed.type === 'study_plan' && parsed.data && (
            <StudyPlanCard data={parsed.data} />
          )}

          {parsed.type === 'flashcard_topic' && parsed.data && (
            <FlashcardTopic data={parsed.data} onSelect={onChipSelect} />
          )}
        </div>

        {followUps && followUps.length > 0 && (
          <FollowUpChips suggestions={followUps} onSelect={onChipSelect} />
        )}
      </div>
    </div>
  );
}
