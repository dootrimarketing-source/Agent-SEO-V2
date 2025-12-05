import React from 'react';
import { Copy, Wand2 } from 'lucide-react';

const PROMPTS = [
  { title: "Devanture de Magasin", prompt: "Une photo professionnelle d'une devanture moderne avec des vitres claires, un éclairage accueillant, une enseigne visible, haute résolution, lumière du jour." },
  { title: "Intérieur Large", prompt: "Plan large de l'intérieur, propre, organisé, éclairage chaleureux, atmosphère accueillante, photoréaliste, 4k." },
  { title: "Gros Plan Produit", prompt: "Plan macro de [NOM DU PRODUIT], haute détail, arrière-plan bokeh, éclairage studio, photographie de produit professionnelle." },
  { title: "Équipe au Travail", prompt: "Photo spontanée de membres d'équipe diversifiés souriant et travaillant ensemble dans un environnement de bureau moderne, lumière naturelle vive." },
  { title: "Interaction Client", prompt: "Membre du personnel amical aidant un client heureux au comptoir, arrière-plan flou, moment authentique." },
  { title: "Décor Saisonnier", prompt: "Intérieur d'entreprise décoré pour [SAISON], atmosphère festive, éclairage confortable, haute qualité." },
  { title: "Service en Action", prompt: "Plan d'action d'un service en cours (ex: coupe de cheveux, réparation, cuisine), mise au point nette sur les mains/l'action, angle dynamique." },
  { title: "Flat Lay (Vue de dessus)", prompt: "Flat lay vue de dessus des outils du métier disposés proprement sur une surface texturée, esthétique minimale, composition équilibrée." },
  { title: "Extérieur Nuit", prompt: "Plan de nuit de l'extérieur du bâtiment avec une lueur chaude provenant des fenêtres, lampadaires, atmosphérique, cinématique." },
  { title: "Client Heureux", prompt: "Portrait d'un client satisfait souriant tenant un produit, arrière-plan extérieur naturel, profondeur de champ." }
];

const NanoPrompts: React.FC = () => {
  const [copied, setCopied] = React.useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Wand2 className="mr-2 text-purple-400" />
          Prompts Nano Banana
        </h2>
        <p className="text-indigo-200 mt-1">Des prompts prêts à l'emploi pour générer des photos d'entreprise de haute qualité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROMPTS.map((item, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-purple-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800">{item.title}</h3>
              <button 
                onClick={() => copyToClipboard(item.prompt, index)}
                className={`p-1.5 rounded-lg transition-colors ${copied === index ? 'bg-green-100 text-green-700' : 'bg-slate-50 text-slate-400 hover:text-purple-600 hover:bg-purple-50'}`}
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-600 font-mono">
              {item.prompt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NanoPrompts;