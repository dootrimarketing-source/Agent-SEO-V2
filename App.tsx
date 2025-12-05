import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardOverview from './components/DashboardOverview';
import ContentGenerator from './components/ContentGenerator';
import ImageStudio from './components/ImageStudio';
import OptimizationChecklist from './components/OptimizationChecklist';
import NanoPrompts from './components/NanoPrompts';
import MetricsTracker from './components/MetricsTracker';
import BusinessProfilePage from './components/BusinessProfile';
import ChatAgent from './components/ChatAgent';
import ReputationManager from './components/ReputationManager';
import CompetitorAnalysis from './components/CompetitorAnalysis';
import LoginPage from './components/LoginPage';
import { UserProfile } from './types';

// Placeholder components for routes not fully detailed in requirement but needed for navigation structure
const CalendarPlaceholder = () => (
  <div className="bg-[#1e1b4b] p-12 rounded-xl border border-indigo-500/20 text-center text-indigo-300 shadow-sm">
    <h3 className="text-xl font-bold text-white mb-2">Vue Calendrier</h3>
    <p>Le calendrier visuel de contenu arrive bientôt.</p>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('gmb-agent-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (newUser: UserProfile) => {
    localStorage.setItem('gmb-agent-user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('gmb-agent-user');
    setUser(null);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#2e1065] flex items-center justify-center text-white">Chargement...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<ChatAgent />} />
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/profile" element={<BusinessProfilePage />} />
          <Route path="/content" element={<ContentGenerator />} />
          <Route path="/images" element={<ImageStudio />} />
          <Route path="/checklist" element={<OptimizationChecklist />} />
          <Route path="/reputation" element={<ReputationManager />} />
          <Route path="/competitors" element={<CompetitorAnalysis />} />
          <Route path="/prompts" element={<NanoPrompts />} />
          <Route path="/calendar" element={<CalendarPlaceholder />} />
          <Route path="/metrics" element={<MetricsTracker />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;