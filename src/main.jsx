import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PersonaProvider } from './lib/PersonaContext.jsx';
import App from './App.jsx';
import HubRoutes from './pages/hub/HubRoutes.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PersonaProvider>
        <Routes>
          <Route path="/"     element={<App />} />
          <Route path="/hub/*" element={<HubRoutes />} />
        </Routes>
      </PersonaProvider>
    </BrowserRouter>
  </React.StrictMode>
);
