import { useState, useRef, useEffect } from 'react';

export default function MessageInput({ onSend, disabled }) {
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

  return (
    <div style={{
      padding: '12px 20px 16px',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        background: 'var(--bg)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '8px 8px 8px 16px',
        transition: 'border-color 0.15s',
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--tangerine)'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about the PMP exam…"
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: 'none',
            background: 'transparent',
            fontSize: '14px',
            color: 'var(--text)',
            outline: 'none',
            lineHeight: 1.6,
            overflowY: 'auto',
            maxHeight: 160,
            paddingTop: 4,
          }}
        />
        <button
          onClick={submit}
          disabled={!value.trim() || disabled}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: !value.trim() || disabled
              ? 'var(--border)'
              : 'linear-gradient(135deg, var(--tangerine) 0%, var(--tangerine-dark) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0,
            boxShadow: !value.trim() || disabled ? 'none' : '0 2px 8px rgba(245,130,31,0.3)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: '11px', color: 'var(--text-muted)' }}>
        Enter to send · Shift+Enter for new line
      </div>
    </div>
  );
}
