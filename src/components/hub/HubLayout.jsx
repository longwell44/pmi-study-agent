import { NavLink, useLocation } from 'react-router-dom';
import { usePersona } from '../../lib/PersonaContext.jsx';
import PersonaSwitcher from './PersonaSwitcher.jsx';

const NAV_LINKS = [
  { to: '/hub',         label: 'Home',              end: true },
  { to: '/hub/paths',   label: 'Learning Paths',    end: false },
  { to: '/hub/content', label: 'Courses & Content', end: false },
  { to: '/hub/agent',   label: 'AI Agent',          end: false },
];

const PAGE_TITLES = {
  '/hub':         'Home',
  '/hub/paths':   'Learning Paths',
  '/hub/content': 'Courses & Content',
  '/hub/agent':   'AI Agent',
};

export default function HubLayout({ children }) {
  const { activePersona } = usePersona();
  const { pathname } = useLocation();
  const pageTitle = PAGE_TITLES[pathname] ?? 'Home';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Wordmark */}
        <div style={{
          padding: '18px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            background: '#4F17A8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.3px' }}>
              PMI
            </span>
          </div>
          <span style={{ color: '#4F17A8', fontSize: '14px', fontWeight: 600 }}>
            Learning Hub
          </span>
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px 8px', flex: 1 }}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'block',
                padding: '8px 12px',
                borderRadius: '6px',
                background: isActive ? '#4F17A8' : 'transparent',
                color: isActive ? '#ffffff' : '#6b7280',
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
                textDecoration: 'none',
                marginBottom: 2,
                transition: 'all 0.15s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid #e5e7eb',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#200F3B', marginBottom: 4 }}>
            {activePersona.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{activePersona.title}</span>
            {activePersona.cert && (
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#4F17A8',
                background: '#EFEDF3',
                border: '1px solid rgba(79,23,168,0.15)',
                borderRadius: '4px',
                padding: '1px 6px',
              }}>
                {activePersona.cert}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          height: 56,
          flexShrink: 0,
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}>
          <span style={{ fontSize: '15px', fontWeight: 500, color: '#200F3B' }}>
            {pageTitle}
          </span>
          <PersonaSwitcher />
        </div>

        {/* Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
          background: '#f9fafb',
        }}>
          {children}
        </main>
      </div>

    </div>
  );
}
