import React, { useState, useEffect } from 'react';
import { generateMarketingStrategy } from '../services/geminiService';
import { Loader2, Sparkles, Copy, Check, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BusinessProfile } from '../types';

interface GeneratedContent {
  description: string;
  posts: Array<{
    title: string;
    content: string;
    type: string;
  }>;
}

const ContentGenerator: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [offers, setOffers] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [usingProfile, setUsingProfile] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('gmb-profile-data');
    if (savedProfile) {
      const profile: BusinessProfile = JSON.parse(savedProfile);
      if (profile.name) {
        setBusinessName(profile.name);
        setUsingProfile(true);
      }
      if (profile.industry) setIndustry(profile.industry);
      if (profile.services && profile.services.length > 0) {
        setOffers(profile.services.join(', '));
      }
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !industry) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const jsonString = await generateMarketingStrategy(businessName, industry, offers);
      const parsedData = JSON.parse(jsonString);
      setResult(parsedData);
    } catch (err) {
      setError('Échec de la génération du contenu. Veuillez réessayer. Assurez-vous que votre clé API autorise Gemini 3 Pro.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Sparkles className="mr-2 text-indigo-400" />
          Générateur de Stratégie de Contenu
        </h2>
        <p className="text-indigo-200 mt-1">
          Utilise <span className="font-semibold text-indigo-400">Gemini 3 Pro (Mode Pensée)</span> pour analyser votre entreprise et créer 8 Google Posts optimisés + une description d'entreprise.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        {usingProfile && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-start">
                <Info size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>Informations pré-remplies depuis votre Profil GMB. Vous pouvez les modifier pour cette génération spécifique.</span>
            </div>
        )}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="ex: Pizza chez Joe"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Industrie / Catégorie</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="ex: Restaurant Italien"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Offres Clés / Focus / Services</label>
            <textarea
              value={offers}
              onChange={(e) => setOffers(e.target.value)}
              placeholder="ex: -50% sur le menu midi, four à bois, ambiance familiale, nouveau menu végétalien..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24 resize-none"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-all ${
                isLoading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Génération de la Stratégie (Réflexion)...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Générer le Plan de Contenu</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Description Section */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Description de l'entreprise (Générée)</h3>
              <button
                onClick={() => copyToClipboard(result.description, -1)}
                className="text-slate-500 hover:text-indigo-600 transition-colors"
                title="Copier dans le presse-papier"
              >
                {copiedIndex === -1 ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="p-6 prose prose-slate max-w-none text-slate-600">
              <ReactMarkdown>{result.description}</ReactMarkdown>
            </div>
          </section>

          {/* Posts Grid */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4">Posts Générés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.posts.map((post, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col hover:border-indigo-200 transition-colors">
                  <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center rounded-t-xl">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      post.type.toLowerCase().includes('offer') ? 'bg-green-100 text-green-700' :
                      post.type.toLowerCase().includes('event') ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {post.type}
                    </span>
                    <button
                      onClick={() => copyToClipboard(post.content, idx)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {copiedIndex === idx ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="p-4 flex-1">
                    <h4 className="font-semibold text-slate-800 mb-2">{post.title}</h4>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap">{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;