import React, { useState } from 'react';
import { Target, Search, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { analyzeCompetitors } from '../services/geminiService';
import { CompetitorData } from '../types';

const CompetitorAnalysis: React.FC = () => {
  const [competitorsInput, setCompetitorsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompetitorData[]>([]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorsInput) return;

    setLoading(true);
    const competitorList = competitorsInput.split(',').map(c => c.trim());

    try {
      const data = await analyzeCompetitors("Dootri Agency", competitorList);
      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Target className="mr-2 text-red-500" />
          Analyse Concurrentielle (Semrush Local)
        </h2>
        <p className="text-indigo-200 mt-1">
          Espionnez vos concurrents. Utilisez l'IA pour détecter leurs faiblesses et opportunités de mots-clés.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Noms des concurrents (séparés par des virgules)</label>
            <input
              type="text"
              value={competitorsInput}
              onChange={(e) => setCompetitorsInput(e.target.value)}
              placeholder="ex: Agence Alpha, Studio Beta, Marketing X..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="h-[50px] px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Search className="animate-spin" /> : <Search />}
              <span>Analyser</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((comp, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="bg-slate-50 p-4 border-b border-slate-200">
                        <h3 className="font-bold text-lg text-slate-800">{comp.name}</h3>
                    </div>
                    
                    <div className="p-4 space-y-4 flex-1">
                        <div>
                            <h4 className="text-xs font-bold uppercase text-green-600 mb-2 flex items-center">
                                <CheckCircle size={12} className="mr-1" /> Points Forts
                            </h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                                {comp.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-xs font-bold uppercase text-red-500 mb-2 flex items-center">
                                <AlertCircle size={12} className="mr-1" /> Points Faibles
                            </h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                                {comp.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase text-blue-500 mb-2 flex items-center">
                                <TrendingUp size={12} className="mr-1" /> Mots-clés Cibles
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {comp.keywords.map((k, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                        <button className="w-full py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded transition-colors flex items-center justify-center">
                            <span>Voir Stratégie de contre-attaque</span>
                            <ArrowRight size={14} className="ml-1" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
      
      {!loading && results.length === 0 && (
          <div className="text-center py-12 text-indigo-200 opacity-60">
              <Search size={48} className="mx-auto mb-4" />
              <p>Entrez des concurrents pour commencer l'espionnage stratégique.</p>
          </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;
