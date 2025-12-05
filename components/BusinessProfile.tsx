import React, { useState, useEffect } from 'react';
import { Building, MapPin, FileText, Save, Globe, Phone, List, Check, Store, Link2, CheckCircle2, Loader2 } from 'lucide-react';
import { BusinessProfile } from '../types';

const INITIAL_PROFILE: BusinessProfile = {
  name: "",
  industry: "",
  location: "",
  description: "",
  services: [],
  website: "",
  phone: ""
};

const BusinessProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('gmb-profile-data');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(() => {
    return localStorage.getItem('gmb-connected') === 'true';
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    localStorage.setItem('gmb-profile-data', JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    localStorage.setItem('gmb-profile-data', JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleConnectGoogle = () => {
    setIsConnecting(true);
    // Simulate API authentication delay
    setTimeout(() => {
        setIsGoogleConnected(true);
        localStorage.setItem('gmb-connected', 'true');
        setIsConnecting(false);
    }, 1500);
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...profile.services];
    newServices[index] = value;
    setProfile({ ...profile, services: newServices });
  };

  const addService = () => {
    setProfile({ ...profile, services: [...profile.services, ""] });
  };

  const removeService = (index: number) => {
    const newServices = profile.services.filter((_, i) => i !== index);
    setProfile({ ...profile, services: newServices });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Store className="mr-2 text-indigo-400" />
            Profil GMB
          </h2>
          <p className="text-indigo-200 mt-1">
            Gérez les informations clés de votre fiche Google Business Profile.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
            isSaved 
              ? 'bg-green-100 text-green-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md'
          }`}
        >
          {isSaved ? <Check size={18} /> : <Save size={18} />}
          <span>{isSaved ? 'Enregistré' : 'Enregistrer'}</span>
        </button>
      </div>
      
      {/* Account Connection Status */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${isGoogleConnected ? 'bg-green-100' : 'bg-slate-100'}`}>
                {isGoogleConnected ? <CheckCircle2 size={24} className="text-green-600" /> : <Link2 size={24} className="text-slate-400" />}
            </div>
            <div>
                <h3 className="font-bold text-slate-800">Compte Google</h3>
                <p className="text-sm text-slate-500">
                    {isGoogleConnected 
                        ? "Votre profil est authentifié et lié à votre compte Google Business Profile." 
                        : "Connectez votre compte Google pour synchroniser les données GMB."}
                </p>
            </div>
         </div>
         {isGoogleConnected ? (
             <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wide">
                 Authentifié
             </span>
         ) : (
            <button
                onClick={handleConnectGoogle}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
                {isConnecting ? (
                    <Loader2 size={18} className="animate-spin text-indigo-600" />
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                )}
                <span>{isConnecting ? 'Connexion...' : 'Connecter avec Google'}</span>
            </button>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Building size={18} className="mr-2 text-slate-400" />
              Identité
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Ex: Ma Boulangerie"
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Catégorie / Industrie</label>
                <input
                  type="text"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  placeholder="Ex: Boulangerie Pâtisserie"
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase flex items-center">
                  <MapPin size={12} className="mr-1" /> Localisation
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Ex: Paris, France"
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Globe size={18} className="mr-2 text-slate-400" />
              Contact
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Site Web</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase flex items-center">
                  <Phone size={12} className="mr-1" /> Téléphone
                </label>
                <input
                  type="text"
                  placeholder="+33 ..."
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <FileText size={18} className="mr-2 text-slate-400" />
              Description GMB
            </h3>
            <div className="relative">
              <textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="w-full h-48 p-4 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                placeholder="Description de votre entreprise..."
              />
              <div className={`absolute bottom-3 right-3 text-xs ${profile.description.length > 750 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {profile.description.length} / 750 caractères
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Cette description est utilisée comme contexte pour générer vos posts et optimiser votre fiche.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center">
                <List size={18} className="mr-2 text-slate-400" />
                Services & Offres Clés
              </h3>
              <button 
                onClick={addService}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {profile.services.map((service, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="Service ou offre..."
                  />
                  <button 
                    onClick={() => removeService(index)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {profile.services.length === 0 && (
                  <p className="text-sm text-slate-400 italic">Aucun service ajouté. Cliquez sur Ajouter.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;