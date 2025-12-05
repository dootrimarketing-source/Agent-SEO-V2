import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Plus, Trash2, Save, TrendingUp, BarChart2, Star, MousePointer, Phone, Eye, MessageSquare } from 'lucide-react';
import { TrackerEntry } from '../types';

const INITIAL_DATA: TrackerEntry[] = [
  { id: '1', period: 'Semaine 1', impressions: 1200, clicks: 45, calls: 12, reviews: 2, rating: 4.8 },
  { id: '2', period: 'Semaine 2', impressions: 1350, clicks: 52, calls: 15, reviews: 1, rating: 4.9 },
  { id: '3', period: 'Semaine 3', impressions: 1100, clicks: 38, calls: 10, reviews: 3, rating: 4.7 },
  { id: '4', period: 'Semaine 4', impressions: 1500, clicks: 65, calls: 22, reviews: 5, rating: 5.0 },
];

const MetricsTracker: React.FC = () => {
  const [data, setData] = useState<TrackerEntry[]>(() => {
    const saved = localStorage.getItem('gmb-metrics-data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [newEntry, setNewEntry] = useState<Omit<TrackerEntry, 'id'>>({
    period: '',
    impressions: 0,
    clicks: 0,
    calls: 0,
    reviews: 0,
    rating: 5.0
  });

  useEffect(() => {
    localStorage.setItem('gmb-metrics-data', JSON.stringify(data));
  }, [data]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.period) return;

    const entry: TrackerEntry = {
      ...newEntry,
      id: Date.now().toString()
    };

    setData([...data, entry]);
    setNewEntry({
      period: '',
      impressions: 0,
      clicks: 0,
      calls: 0,
      reviews: 0,
      rating: 5.0
    });
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <BarChart2 className="mr-2 text-blue-400" />
          Suivi Métriques GMB
        </h2>
        <p className="text-indigo-200 mt-1">
          Suivez vos performances hebdomadaires : Impressions, Clics, Appels et Réputation.
        </p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Eye className="mr-2 text-blue-500" size={20} />
            Volume & Trafic
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{fontSize: 12}} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tick={{fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="impressions" name="Impressions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorImpressions)" />
                <Area yAxisId="right" type="monotone" dataKey="clicks" name="Clics" stroke="#10b981" fill="none" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Phone className="mr-2 text-indigo-500" size={20} />
            Conversion & Avis
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="calls" name="Appels" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviews" name="Nouveaux Avis" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Entry Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Journal des Données</h3>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <TrendingUp size={16} />
            <span>Mis à jour en temps réel</span>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Période</label>
              <input
                type="text"
                placeholder="ex: Semaine 5"
                value={newEntry.period}
                onChange={(e) => setNewEntry({...newEntry, period: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center"><Eye size={12} className="mr-1"/> Impress.</label>
              <input
                type="number"
                min="0"
                value={newEntry.impressions || ''}
                onChange={(e) => setNewEntry({...newEntry, impressions: parseInt(e.target.value) || 0})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center"><MousePointer size={12} className="mr-1"/> Clics</label>
              <input
                type="number"
                min="0"
                value={newEntry.clicks || ''}
                onChange={(e) => setNewEntry({...newEntry, clicks: parseInt(e.target.value) || 0})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center"><Phone size={12} className="mr-1"/> Appels</label>
              <input
                type="number"
                min="0"
                value={newEntry.calls || ''}
                onChange={(e) => setNewEntry({...newEntry, calls: parseInt(e.target.value) || 0})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center"><MessageSquare size={12} className="mr-1"/> Avis</label>
              <input
                type="number"
                min="0"
                value={newEntry.reviews || ''}
                onChange={(e) => setNewEntry({...newEntry, reviews: parseInt(e.target.value) || 0})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider flex items-center"><Star size={12} className="mr-1"/> Note</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={newEntry.rating || ''}
                onChange={(e) => setNewEntry({...newEntry, rating: parseFloat(e.target.value) || 0})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div className="md:col-span-7 flex justify-end">
                <button 
                    type="submit" 
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    <span>Ajouter Entrée</span>
                </button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Période</th>
                  <th className="px-6 py-3 font-semibold text-center">Impressions</th>
                  <th className="px-6 py-3 font-semibold text-center">Clics</th>
                  <th className="px-6 py-3 font-semibold text-center">Appels</th>
                  <th className="px-6 py-3 font-semibold text-center">Nouv. Avis</th>
                  <th className="px-6 py-3 font-semibold text-center">Note Moy.</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry) => (
                  <tr key={entry.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{entry.period}</td>
                    <td className="px-6 py-4 text-center">{entry.impressions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">{entry.clicks}</td>
                    <td className="px-6 py-4 text-center">{entry.calls}</td>
                    <td className="px-6 py-4 text-center">{entry.reviews}</td>
                    <td className="px-6 py-4 text-center flex justify-center items-center">
                        <span className="bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full font-medium flex items-center">
                            <Star size={10} className="mr-1 fill-yellow-600 text-yellow-600" />
                            {entry.rating}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      Aucune donnée enregistrée. Commencez par ajouter votre première semaine ci-dessus.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsTracker;