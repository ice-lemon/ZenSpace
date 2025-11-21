import React, { useState } from 'react';
import { ViewState, Language } from './types';
import RoomAnalyzer from './components/RoomAnalyzer';
import ChatBot from './components/ChatBot';
import { CameraIcon, ChatIcon, SparklesIcon } from './components/Icons';
import { getTranslation } from './utils/localization';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [language, setLanguage] = useState<Language>('en');
  
  const t = getTranslation(language);

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <div className="mb-8 p-6 bg-emerald-100 rounded-full shadow-inner">
              <SparklesIcon className="w-16 h-16 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 tracking-tight">
              {t.appTitle}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-12 leading-relaxed">
              {t.appDesc}
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
              <button
                onClick={() => setView('analyze')}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:bg-emerald-700 hover:-translate-y-1 transition-all"
              >
                <CameraIcon className="w-5 h-5" /> {t.analyzeButton}
              </button>
              <button
                onClick={() => setView('chat')}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-white text-emerald-800 border border-slate-200 rounded-xl font-semibold shadow-md hover:bg-slate-50 hover:-translate-y-1 transition-all"
              >
                <ChatIcon className="w-5 h-5" /> {t.chatButton}
              </button>
            </div>
          </div>
        );
      case 'analyze':
        return <RoomAnalyzer language={language} />;
      case 'chat':
        return <ChatBot language={language} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view !== 'home' && (
              <button 
                onClick={() => setView('home')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
            )}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="bg-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">ZenSpace</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(prev => prev === 'en' ? 'zh' : 'en')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <span className="w-4 h-4 flex items-center justify-center bg-slate-100 rounded-full text-[10px]">🌐</span>
              {language === 'en' ? '中文' : 'English'}
            </button>

            {view !== 'home' && (
              <nav className="hidden sm:flex gap-2 border-l border-slate-200 pl-3 ml-3">
                <button 
                  onClick={() => setView('analyze')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === 'analyze' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {t.analyzeButton}
                </button>
                <button 
                   onClick={() => setView('chat')}
                   className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === 'chat' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {t.chatButton}
                </button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;