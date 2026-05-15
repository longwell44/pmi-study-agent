import { useState, useRef, useEffect } from 'react';

export default function MessageInput({ onSend, disabled, maxWidth, placeholder = 'Ask anything about the PMP exam…' }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [value]);

  const submit = () => {
    const msg = value.trim();
    if (!msg || disabled) return;
    onSend(msg);
    setValue('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const hasContent = value.trim() && !disabled;

  return (
    <div style={{
      padding: '12px 20px 16px',
      background: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      flexShrink: 0,
    }}>
      <div style={maxWidth ? { maxWidth, margin: '0 auto', width: '100%' } : undefined}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px 8px 8px 14px',
          transition: 'border-color 0.15s',
        }}
        onFocusCapture={e => e.currentTarget.style.borderColor = '#4F17A8'}
        onBlurCapture={e => e.currentTarget.style.borderColor = '#e5e7eb'}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: 'none',
            background: 'transparent',
            fontSize: '14px',
            color: '#200F3B',
            outline: 'none',
            lineHeight: 1.6,
            overflowY: 'auto',
            maxHeight: 160,
            padding: 0,
          }}
        />
        <button
          onClick={submit}
          disabled={!hasContent}
          style={{
            width: 34,
            height: 34,
            borderRadius: '6px',
            background: hasContent ? '#4F17A8' : '#d1d5db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 7, fontSize: '11px', color: '#9ca3af' }}>
        Enter to send · Shift+Enter for new line
      </div>
      </div>
    </div>
  );
}
