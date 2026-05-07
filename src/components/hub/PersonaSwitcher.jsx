import { personas } from '../../lib/mockData.js';
import { usePersona } from '../../lib/PersonaContext.jsx';

export default function PersonaSwitcher() {
  const { activePersona, setActivePersona } = usePersona();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '5px 8px',
    }}>
      <span style={{
        fontSize: '10px',
        fontWeight: 600,
        color: '#9ca3af',
        letterSpacing: '0.6px',
        textTransform: 'uppercase',
        marginRight: 2,
      }}>
        Persona
      </span>
      {personas.map((p) => {
        const isActive = activePersona.id === p.id;
        return (
          <button
            key={p.id}
            onClick={() => setActivePersona(p)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: isActive ? '1px solid #4F17A8' : '1px solid #e5e7eb',
              background: isActive ? '#4F17A8' : '#ffffff',
              color: isActive ? '#ffffff' : '#6b7280',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {p.name.split(' ')[0]}
          </button>
        );
      })}
    </div>
  );
}
