import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MapPin, Phone } from 'lucide-react';

const data = [
  { name: 'Sem 1', views: 400, actions: 240 },
  { name: 'Sem 2', views: 300, actions: 139 },
  { name: 'Sem 3', views: 200, actions: 980 },
  { name: 'Sem 4', views: 278, actions: 390 },
  { name: 'Sem 5', views: 189, actions: 480 },
  { name: 'Sem 6', views: 239, actions: 380 },
  { name: 'Sem 7', views: 349, actions: 430 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-green-600 font-medium flex items-center">
        <TrendingUp size={14} className="mr-1" />
        {change}
      </span>
      <span className="text-slate-400 ml-2">vs le mois dernier</span>
    </div>
  </div>
);

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Vue d'ensemble</h2>
        <p className="text-indigo-200">Suivez vos performances GMB et votre pipeline de contenu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Vues Totales" value="12,450" change="+12%" icon={Users} color="bg-blue-500" />
        <StatCard title="Demandes d'itinéraire" value="1,203" change="+5%" icon={MapPin} color="bg-indigo-500" />
        <StatCard title="Appels" value="432" change="+18%" icon={Phone} color="bg-green-500" />
        <StatCard title="Visites Site Web" value="892" change="+3%" icon={TrendingUp} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tendances de performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="actions" stroke="#6366f1" strokeWidth={2} fillOpacity={0} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tâches en attente</h3>
          <div className="space-y-4">
            {[
              { label: 'Répondre au nouvel avis', time: 'il y a 2h', urgent: true },
              { label: 'Publier offre hebdo', time: 'Aujourd\'hui', urgent: false },
              { label: 'Mettre à jour horaires vacances', time: 'Demain', urgent: true },
              { label: 'Mettre en ligne photos intérieur', time: 'Semaine pro.', urgent: false },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${task.urgent ? 'bg-red-500' : 'bg-blue-400'}`} />
                  <span className="text-sm font-medium text-slate-700">{task.label}</span>
                </div>
                <span className="text-xs text-slate-400">{task.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Voir la Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;