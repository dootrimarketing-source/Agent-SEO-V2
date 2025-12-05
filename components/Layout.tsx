import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  CheckSquare, 
  BarChart2, 
  Wand2,
  Menu,
  X,
  Store,
  Bot,
  Activity,
  TrendingUp,
  Eye,
  MousePointer,
  MessageSquare,
  Zap,
  Search,
  Shield,
  Target,
  LogOut,
  ChevronUp
} from 'lucide-react';
import { TrackerEntry, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState<TrackerEntry[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Load metrics for sidebar summary
    const saved = localStorage.getItem('gmb-metrics-data');
    if (saved) {
      setMetrics(JSON.parse(saved));
    }
  }, [location]); // Refresh when location changes (potential updates)

  // Get latest metrics or defaults
  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const impressions = latestMetric?.impressions || 0;
  const clicks = latestMetric?.clicks || 0;
  const reviews = latestMetric?.reviews || 0;
  
  // Calculate simplistic trends just for UI show
  const prevMetric = metrics.length > 1 ? metrics[metrics.length - 2] : null;
  const impTrend = prevMetric && impressions > prevMetric.impressions ? '+12%' : '+0%';

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const sidebarActions = [
    { path: '/', label: 'Agent SEO', icon: <Bot size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  const quickActions = [
    { path: '/content', label: 'Générateur Contenu', icon: <FileText size={18} /> },
    { path: '/images', label: 'Studio Image', icon: <ImageIcon size={18} /> },
    { path: '/checklist', label: 'Audit GMB', icon: <CheckSquare size={18} /> },
    { path: '/metrics', label: 'Analyse Stats', icon: <BarChart2 size={18} /> },
    { path: '/reputation', label: 'Réputation', icon: <Shield size={18} /> }, 
    { path: '/competitors', label: 'Concurrents', icon: <Target size={18} /> },
    { path: '/profile', label: 'Profil GMB', icon: <Store size={18} /> },
    { path: '/prompts', label: 'Prompts Nano', icon: <Wand2 size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#2e1065] text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#1e1b4b] border-r border-indigo-900/50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center space-x-3 border-b border-indigo-900/50">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Agent SEO GMB</h1>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-indigo-300 font-medium">Actif 24/7</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Surveillance Card */}
            <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-500/20">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-indigo-200">Surveillance</h3>
                <Activity size={16} className="text-green-400" />
              </div>
              <p className="text-xs text-indigo-400">Dernière vérification : Il y a 5 min</p>
            </div>

            {/* Main Nav */}
            <div className="space-y-1">
              {sidebarActions.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-indigo-300 hover:bg-indigo-900/50 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Metrics Section */}
            <div>
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3 px-2">Métriques Clés</h3>
              <div className="space-y-3">
                <div className="bg-[#111827]/50 rounded-lg p-3 border border-indigo-900/30">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-2 text-sm text-indigo-200">
                      <TrendingUp size={14} className="text-green-400" />
                      <span>Visibilité</span>
                    </div>
                    <span className="text-xs font-bold text-green-400">{impTrend}</span>
                  </div>
                </div>

                <div className="bg-[#111827]/50 rounded-lg p-3 border border-indigo-900/30">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-2 text-sm text-indigo-200">
                      <Eye size={14} className="text-blue-400" />
                      <span>Impressions</span>
                    </div>
                    <span className="text-sm font-bold text-white">{impressions.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-[#111827]/50 rounded-lg p-3 border border-indigo-900/30">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-2 text-sm text-indigo-200">
                      <MousePointer size={14} className="text-purple-400" />
                      <span>Actions</span>
                    </div>
                    <span className="text-sm font-bold text-white">{clicks}</span>
                  </div>
                </div>

                <div className="bg-[#111827]/50 rounded-lg p-3 border border-indigo-900/30">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-2 text-sm text-indigo-200">
                      <MessageSquare size={14} className="text-yellow-400" />
                      <span>Avis</span>
                    </div>
                    <span className="text-sm font-bold text-white flex items-center">
                        {reviews} <span className="text-xs text-indigo-400 ml-1 font-normal">nouveaux</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Menu */}
            <div>
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3 px-2">Actions Rapides</h3>
              <div className="space-y-1">
                {quickActions.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group ${
                        isActive
                          ? 'bg-indigo-900/60 text-white'
                          : 'text-indigo-300 hover:bg-indigo-900/30 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`p-1.5 rounded-md ${isActive ? 'bg-indigo-600' : 'bg-indigo-900/50 group-hover:bg-indigo-800'}`}>
                            {item.icon}
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="p-4 border-t border-indigo-900/50 bg-[#171436]">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-indigo-500/50" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                    <span className="text-xs text-indigo-300 truncate">{user.email}</span>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-800/50 rounded-lg transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
                <div className="text-center text-xs text-indigo-400">Non connecté</div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header Overlay */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#1e1b4b] border-b border-indigo-900 z-40 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Bot size={24} className="text-indigo-400" />
            <span className="font-bold">Agent SEO</span>
        </div>
        <button onClick={toggleMenu} className="text-indigo-200 hover:text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 md:ml-80 min-h-screen relative overflow-hidden`}>
        {/* Background gradient effects */}
        <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 p-4 pt-20 md:p-6 md:pt-6 h-full flex flex-col">
            {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;