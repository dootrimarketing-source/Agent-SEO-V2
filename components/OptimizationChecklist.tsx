import React, { useState } from 'react';
import { CheckSquare, Square, Info } from 'lucide-react';
import { ChecklistItem } from '../types';

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: '1', task: 'Mettre à jour les horaires (Vérification jours fériés)', completed: false, category: 'Optimization' },
  { id: '2', task: 'Répondre à tous les nouveaux avis de la semaine dernière', completed: false, category: 'Weekly' },
  { id: '3', task: 'Ajouter 5 nouvelles photos (Extérieur & Intérieur)', completed: false, category: 'Monthly' },
  { id: '4', task: 'Publier l\'offre hebdomadaire', completed: true, category: 'Weekly' },
  { id: '5', task: 'Vérifier la section Q&A pour les nouvelles questions', completed: false, category: 'Weekly' },
  { id: '6', task: 'Examiner les statistiques et ajuster la stratégie', completed: false, category: 'Monthly' },
  { id: '7', task: 'S\'assurer que les attributs (Wifi, Parking) sont corrects', completed: true, category: 'Optimization' },
];

const OptimizationChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const categories = ['Optimization', 'Weekly', 'Monthly'];
  const categoryLabels: Record<string, string> = {
    'Optimization': 'Optimisation',
    'Weekly': 'Hebdomadaire',
    'Monthly': 'Mensuel'
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <CheckSquare className="mr-2 text-green-400" />
          Checklist d'Optimisation
        </h2>
        <p className="text-indigo-200 mt-1">Suivez vos tâches récurrentes pour garder votre profil actif et bien classé.</p>
      </div>

      <div className="grid gap-8">
        {categories.map(category => (
          <div key={category} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Tâches {categoryLabels[category]}</h3>
              <span className="text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded text-slate-500">
                {items.filter(i => i.category === category && i.completed).length} / {items.filter(i => i.category === category).length}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {items.filter(item => item.category === category).map(item => (
                <div 
                    key={item.id} 
                    onClick={() => toggleItem(item.id)}
                    className="p-4 flex items-center space-x-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className={`transition-colors ${item.completed ? 'text-green-500' : 'text-slate-300 group-hover:text-slate-400'}`}>
                    {item.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                  </div>
                  <span className={`flex-1 ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item.task}
                  </span>
                  <Info size={16} className="text-slate-300 hover:text-blue-500" />
                </div>
              ))}
              {items.filter(i => i.category === category).length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm">Aucune tâche dans cette catégorie.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptimizationChecklist;