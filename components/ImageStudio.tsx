import React, { useState, useRef } from 'react';
import { generateImageFromPrompt, editImageWithGemini } from '../services/geminiService';
import { Image as ImageIcon, Wand2, Upload, Loader2, Download, Eraser, Sparkles } from 'lucide-react';

type StudioMode = 'GENERATE' | 'EDIT';

const ImageStudio: React.FC = () => {
  const [mode, setMode] = useState<StudioMode>('GENERATE');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract base64 data and mime type
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
            setUploadedMimeType(matches[1]);
            setUploadedImage(matches[2]); // Store just the base64 data for the API
            // For display, we can use the full string
            // But we'll reconstruct it for display to be safe or use reader.result directly
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    if (mode === 'EDIT' && !uploadedImage) {
        setError("Veuillez d'abord télécharger une image.");
        return;
    }

    setIsLoading(true);
    setError('');
    setResultImage(null);

    try {
      let imageBase64 = '';
      if (mode === 'GENERATE') {
        imageBase64 = await generateImageFromPrompt(prompt);
      } else {
        if (!uploadedImage) throw new Error("Aucune image téléchargée");
        imageBase64 = await editImageWithGemini(uploadedImage, uploadedMimeType, prompt);
      }
      setResultImage(imageBase64);
    } catch (err) {
      console.error(err);
      setError("Échec du traitement de l'image. Veuillez réessayer. Assurez-vous d'avoir accès à gemini-2.5-flash-image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center">
          <ImageIcon className="mr-2 text-pink-400" />
          Studio Nano Banana
        </h2>
        <p className="text-indigo-200 mt-1">
          Générez de nouvelles photos ou <span className="font-semibold text-pink-400">éditez les existantes avec du texte</span> en utilisant Gemini 2.5 Flash Image.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setMode('GENERATE'); setPrompt(''); setError(''); setResultImage(null); }}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
              mode === 'GENERATE'
                ? 'bg-white text-pink-600 border-b-2 border-pink-500'
                : 'bg-slate-50 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Wand2 size={18} />
            <span>Générer Nouvelle</span>
          </button>
          <button
            onClick={() => { setMode('EDIT'); setPrompt(''); setError(''); setResultImage(null); }}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
              mode === 'EDIT'
                ? 'bg-white text-pink-600 border-b-2 border-pink-500'
                : 'bg-slate-50 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eraser size={18} />
            <span>Éditer avec Texte</span>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {mode === 'EDIT' && (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                 <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    ref={fileInputRef}
                    id="image-upload"
                  />
                {!uploadedImage ? (
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                      <Upload size={24} />
                    </div>
                    <span className="text-slate-700 font-medium">Cliquez pour télécharger une image</span>
                    <span className="text-slate-400 text-sm mt-1">JPG, PNG supportés</span>
                  </label>
                ) : (
                  <div className="relative group inline-block">
                    <img 
                        src={`data:${uploadedMimeType};base64,${uploadedImage}`} 
                        alt="Aperçu" 
                        className="max-h-64 rounded-lg shadow-sm" 
                    />
                    <button
                        type="button"
                        onClick={() => { setUploadedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Eraser size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {mode === 'GENERATE' ? "Description de l'image" : 'Instruction de modification'}
              </label>
              <div className="relative">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={mode === 'GENERATE' ? "Un intérieur de café chaleureux avec un éclairage tamisé..." : "Ajouter un filtre rétro, supprimer la personne en arrière-plan..."}
                    className="w-full p-4 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none shadow-sm"
                    required
                />
                <div className="absolute right-3 top-3.5 text-slate-400">
                    <Wand2 size={20} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (mode === 'EDIT' && !uploadedImage)}
              className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center space-x-2 transition-all ${
                isLoading || (mode === 'EDIT' && !uploadedImage)
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>{mode === 'GENERATE' ? 'Générer Image' : 'Appliquer Modifications'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center">
          {error}
        </div>
      )}

      {resultImage && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
          <h3 className="font-bold text-slate-800 mb-4">Résultat</h3>
          <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex flex-col items-center">
            <img src={resultImage} alt="Résultat généré" className="w-full max-w-2xl h-auto" />
            <div className="w-full p-4 bg-white border-t border-slate-100 flex justify-end">
                <a 
                    href={resultImage} 
                    download={`gmb-image-${Date.now()}.png`}
                    className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-medium px-4 py-2 hover:bg-pink-50 rounded-lg transition-colors"
                >
                    <Download size={18} />
                    <span>Télécharger</span>
                </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageStudio;