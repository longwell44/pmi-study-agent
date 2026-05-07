import { Routes, Route } from 'react-router-dom';
import HubLayout from '../../components/hub/HubLayout.jsx';
import HubHome from './HubHome.jsx';
import LearningPaths from './LearningPaths.jsx';

const Placeholder = ({ text }) => (
  <p style={{ fontSize: '14px', color: '#6b7280', paddingTop: 8 }}>{text}</p>
);

export default function HubRoutes() {
  return (
    <HubLayout>
      <Routes>
        <Route index element={<HubHome />} />
        <Route path="paths"   element={<LearningPaths />} />
        <Route path="content" element={<Placeholder text="Courses and Content — coming soon" />} />
        <Route path="agent"   element={<Placeholder text="AI Agent — coming soon" />} />
      </Routes>
    </HubLayout>
  );
}
