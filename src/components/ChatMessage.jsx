import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PracticeQuestion from './PracticeQuestion.jsx';
import Flashcard from './Flashcard.jsx';
import FollowUpChips from './FollowUpChips.jsx';
import StudyPlanQuestion from './StudyPlanQuestion.jsx';
import StudyPlanCard from './StudyPlanCard.jsx';
import FlashcardTopic from './FlashcardTopic.jsx';
import ConceptTopic from './ConceptTopic.jsx';

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

const mdComponents = {
  h1: ({ children }) => <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#200F3B', margin: '12px 0 6px' }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#200F3B', margin: '10px 0 4px' }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#200F3B', margin: '8px 0 4px' }}>{children}</h3>,
  p:  ({ children }) => <p style={{ margin: '4px 0', lineHeight: 1.7 }}>{children}</p>,
  ul: ({ children }) => <ul style={{ marginLeft: 20, marginTop: 4, marginBottom: 4 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ marginLeft: 20, marginTop: 4, marginBottom: 4 }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 3, lineHeight: 1.6 }}>{children}</li>,
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#200F3B' }}>{children}</strong>,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '8px 0' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '13px' }}>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th style={{ border: '1px solid #e5e7eb', padding: '7px 12px', background: '#f9fafb', fontWeight: 600, textAlign: 'left' }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ border: '1px solid #e5e7eb', padding: '7px 12px' }}>{children}</td>
  ),
  code: ({ inline, children }) => inline
    ? <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: '4px', fontSize: '13px', fontFamily: 'ui-monospace, monospace' }}>{children}</code>
    : <pre style={{ background: '#f3f4f6', padding: '10px 14px', borderRadius: '6px', overflowX: 'auto', fontSize: '13px', fontFamily: 'ui-monospace, monospace', margin: '6px 0' }}><code>{children}</code></pre>,
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '3px solid #d1d5db', margin: '6px 0', paddingLeft: 12, color: '#6b7280' }}>{children}</blockquote>
  ),
};

const SUPPRESS_TEXT_TYPES = new Set(['question', 'study_plan_question', 'tutor_start', 'study_plan', 'flashcard_topic', 'concept_topic']);

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
          {parsed.text && !SUPPRESS_TEXT_TYPES.has(parsed.type) && (
            <div style={{ marginBottom: parsed.type !== 'text' ? 16 : 0 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {parsed.text}
              </ReactMarkdown>
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

          {parsed.type === 'concept_topic' && parsed.data && (
            <ConceptTopic data={parsed.data} onSelect={onChipSelect} />
          )}
        </div>

        {followUps && followUps.length > 0 && (
          <FollowUpChips suggestions={followUps} onSelect={onChipSelect} />
        )}
      </div>
    </div>
  );
}
