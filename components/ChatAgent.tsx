import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Search, Loader2, Trash2, History, ArrowRight, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessageToAgent } from '../services/geminiService';
import { ChatMessage, AppAction } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const MEMORY_KEY = 'gmb-agent-chat-history';
const RETENTION_DAYS = 30;

const ChatAgent: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Load messages from local storage with retention policy
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MEMORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

        const validMessages = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })).filter((m: ChatMessage) => m.timestamp > cutoff);

        if (validMessages.length > 0) {
          return validMessages;
        }
      }
    } catch (e) {
      console.error("Failed to load chat memory", e);
    }

    // Default welcome message
    return [{
      id: '1',
      role: 'model',
      text: "Bonjour ! Je suis votre Agent SEO Autonome. Je surveille votre Google Business Profile et les tendances de recherche.\n\nComment puis-je vous aider aujourd'hui ? Je peux analyser vos concurrents, rédiger des posts, ou vérifier vos métriques.",
      timestamp: new Date()
    }];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearHistory = () => {
    if (window.confirm("Voulez-vous effacer l'historique de conversation ?")) {
      const resetMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: "Mémoire effacée. Je suis prêt pour une nouvelle session.",
        timestamp: new Date()
      };
      setMessages([resetMessage]);
    }
  };

  const handleActionClick = (action: AppAction) => {
    if (action.type === 'NAVIGATE') {
        navigate(action.path);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert internal message format for the service
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const response = await sendMessageToAgent(input, history);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        sources: response.sources,
        action: response.action
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Désolé, j'ai rencontré une erreur en traitant votre demande. Veuillez réessayer.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] md:h-[calc(100vh-3rem)]">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            Agent SEO Autonome
            <span className="ml-3 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30 flex items-center">
              <History size={10} className="mr-1" />
              Mémoire active (30j)
            </span>
          </h2>
          <p className="text-indigo-300 text-sm">Optimisation Google Business Profile & SEO Local</p>
        </div>
        <div className="flex space-x-3">
            <button 
                onClick={handleClearHistory}
                className="flex items-center justify-center bg-indigo-900/30 hover:bg-red-900/50 text-indigo-300 hover:text-red-200 w-10 rounded-lg border border-indigo-700/30 transition-colors"
                title="Effacer la mémoire"
            >
                <Trash2 size={16} />
            </button>
            <Link to="/content" className="hidden md:flex items-center space-x-2 bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 px-4 py-2 rounded-lg text-sm border border-indigo-700/50 transition-colors">
                <ArrowRight size={16} />
                <span>Rapport</span>
            </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#1e1b4b]/50 rounded-2xl border border-indigo-500/20 flex flex-col overflow-hidden relative backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                    msg.role === 'user' 
                        ? 'bg-indigo-600 ml-3' 
                        : 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 mr-3'
                }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm md:text-base shadow-sm ${
                        msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-[#1e1b4b] border border-indigo-500/20 text-slate-200 rounded-tl-none'
                    }`}>
                        {msg.role === 'model' ? (
                             <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                             </div>
                        ) : (
                            msg.text
                        )}
                    </div>
                    
                    {/* Action Button */}
                    {msg.action && (
                        <div className="mt-3">
                            <button
                                onClick={() => msg.action && handleActionClick(msg.action)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-xl shadow-lg transform transition-all hover:scale-105 group"
                            >
                                <Zap size={16} className="text-yellow-300 group-hover:animate-pulse" />
                                <span className="font-semibold text-sm">Action Suggérée : {msg.action.label}</span>
                                <ArrowRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {/* Sources (if any) */}
                    {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 text-xs bg-[#111827]/50 p-2 rounded-lg border border-indigo-900/50 max-w-full">
                            <div className="flex items-center text-indigo-400 mb-1">
                                <Search size={12} className="mr-1" />
                                <span className="font-semibold">Sources trouvées</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {msg.sources.map((source, idx) => (
                                    <a 
                                        key={idx} 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-300 hover:text-white underline truncate max-w-[200px]"
                                    >
                                        {source.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <span className="text-[10px] text-indigo-400/50 mt-1 px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 mr-3 flex items-center justify-center mt-1">
                    <Bot size={18} />
                </div>
                <div className="bg-[#1e1b4b] border border-indigo-500/20 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    <span className="text-sm text-indigo-300 animate-pulse">Analyse en cours...</span>
                </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-indigo-500/20 bg-[#1e1b4b]/80">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez une question (ex: Mets à jour mes horaires, Analyse mes stats...)"
              className="w-full bg-[#111827]/80 text-white placeholder-indigo-400/50 border border-indigo-500/30 rounded-xl py-4 pl-4 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;