import { createContext, useContext, useState } from 'react';
import { personas } from './mockData.js';

const PersonaContext = createContext(null);

export function PersonaProvider({ children }) {
  const [activePersona, setActivePersona] = useState(personas[0]);

  return (
    <PersonaContext.Provider value={{ activePersona, setActivePersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within a PersonaProvider');
  return ctx;
}
