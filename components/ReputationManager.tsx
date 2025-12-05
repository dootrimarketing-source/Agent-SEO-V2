import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Minus, RefreshCw, Send, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { generateReviewResponse } from '../services/geminiService';
import { CustomerReview } from '../types';

const MOCK_REVIEWS: CustomerReview[] = [
  { id: '1', author: 'Sophie Martin', rating: 5, text: 'Super expérience ! Le service était impeccable et rapide. Je recommande vivement pour tous vos besoins en digital.', date: 'Il y a 2 jours' },
  { id: '2', author: 'Jean Dupont', rating: 3, text: 'Correct, mais un peu cher pour la prestation fournie. Le résultat est bon mais le délai était long.', date: 'Il y a 1 semaine' },
  { id: '3', author: 'Marie Curie', rating: 1, text: 'Très déçue. Personne ne répond au téléphone et mon problème n\'est toujours pas résolu.', date: 'Il y a 2 semaines' },
  { id: '4', author: 'Lucas B.', rating: 5, text: 'Une équipe au top ! Merci pour l\'accompagnement sur notre projet SEO.', date: 'Il y a 3 jours' },
];

const ReputationManager: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(MOCK_REVIEWS);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleGenerateResponse = async (review: CustomerReview) => {
    setLoadingId(review.id);
    try {
      const result = await generateReviewResponse(
        review.text,
        review.rating,
        review.author,
        "Dootri Agency" // Ideally comes from context/profile
      );
      
      setReviews(prev => prev.map(r => 
        r.id === review.id 
          ? { ...r, response: result.response, sentiment: result.sentiment } 
          : r
      ));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération de la réponse.");
    } finally {
      setLoadingId(null);
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch(sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      case 'neutral': return 'text-yellow-500';
      default: return 'text-slate-400';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch(sentiment) {
      case 'positive': return <ThumbsUp size={16} />;
      case 'negative': return <ThumbsDown size={16} />;
      case 'neutral': return <Minus size={16} />;
      default: return <RefreshCw size={16} />;
    }
  };

  // Mock data for chart
  const sentimentData = [
    { name: 'Positif', value: 65, color: '#22c55e' },
    { name: 'Neutre', value: 25, color: '#eab308' },
    { name: 'Négatif', value: 10, color: '#ef4444' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Shield className="mr-2 text-yellow-400" />
          Gestion de Réputation (Brandwatch Style)
        </h2>
        <p className="text-indigo-200 mt-1">
          Analysez le sentiment de vos clients et répondez automatiquement grâce à l'IA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4">Analyse de Sentiment</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
            <p><strong>Insight IA :</strong> Votre sentiment global est majoritairement positif. Les clients apprécient la "rapidité" mais signalent parfois des "délais" sur les gros projets.</p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-indigo-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{review.author}</h4>
                    <div className="flex items-center text-xs text-slate-500">
                      <span>{review.date}</span>
                      <span className="mx-2">•</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {review.sentiment && (
                   <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full bg-slate-100 ${getSentimentColor(review.sentiment)}`}>
                      {getSentimentIcon(review.sentiment)}
                      <span className="capitalize">{review.sentiment}</span>
                   </div>
                )}
              </div>

              <p className="text-slate-700 text-sm mb-4 leading-relaxed">"{review.text}"</p>

              {review.response ? (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <div className="flex items-center text-xs font-bold text-indigo-800 mb-2">
                    <Send size={12} className="mr-1" />
                    Réponse publiée
                  </div>
                  <p className="text-sm text-indigo-700 italic">{review.response}</p>
                </div>
              ) : (
                <button
                  onClick={() => handleGenerateResponse(review)}
                  disabled={loadingId === review.id}
                  className="flex items-center space-x-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loadingId === review.id ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Rédaction IA...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      <span>Générer réponse IA</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReputationManager;
