import React, { useState, useRef } from 'react';
import { analyzeRoomImage } from '../services/geminiService';
import { RoomAnalysis, Language } from '../types';
import { UploadIcon, SparklesIcon, CheckCircleIcon } from './Icons';
import { getTranslation } from '../utils/localization';

interface RoomAnalyzerProps {
  language: Language;
}

const RoomAnalyzer: React.FC<RoomAnalyzerProps> = ({ language }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = getTranslation(language);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t.errorImage);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setAnalysis(null); // Reset analysis on new image
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data without the prefix
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const result = await analyzeRoomImage(base64Data, mimeType, language);
      setAnalysis(result);
    } catch (err) {
      setError(t.errorAnalysis);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getLocalizedEnum = (value: string) => {
    if (language === 'en') return value;
    const map: Record<string, string> = {
      'Easy': t.easy,
      'Medium': t.medium,
      'Hard': t.hard,
      'High': t.high,
      'Low': t.low
    };
    return map[value] || value;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{t.analyzerTitle}</h2>
        <p className="text-slate-600">{t.analyzerSubtitle}</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-slate-200 p-8 mb-8 transition-all hover:border-emerald-400">
        {!image ? (
          <div 
            className="flex flex-col items-center justify-center cursor-pointer h-64"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="bg-emerald-50 p-4 rounded-full mb-4">
              <UploadIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-lg font-medium text-slate-700">{t.uploadText}</p>
            <p className="text-sm text-slate-400 mt-2">{t.uploadSubtext}</p>
          </div>
        ) : (
          <div className="relative group">
            <img 
              src={image} 
              alt="Room Preview" 
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <button 
              onClick={() => { setImage(null); setAnalysis(null); }}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
        />
      </div>

      {/* Action Button */}
      {image && !analysis && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold text-white shadow-lg transition-all transform hover:scale-105
              ${isAnalyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}
            `}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin">⟳</span> {t.analyzing}
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" /> {t.generatePlan}
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center border border-red-100">
          {error}
        </div>
      )}

      {/* Results Section */}
      {analysis && (
        <div className="animate-fade-in space-y-8">
          {/* Header Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.roomType}</p>
                <p className="text-xl font-bold text-slate-800">{analysis.roomType}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.clutterLevel}</p>
                <span className={`
                  inline-block px-3 py-1 rounded-full text-sm font-medium mt-1
                  ${analysis.clutterLevel.toLowerCase().includes('low') ? 'bg-green-100 text-green-700' : 
                    analysis.clutterLevel.toLowerCase().includes('severe') ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'}
                `}>
                  {analysis.clutterLevel}
                </span>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.vibe}</p>
                <p className="text-lg text-slate-700 italic">"{analysis.vibe}"</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Quick Wins */}
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                </div>
                {t.quickWins}
              </h3>
              <div className="space-y-4">
                {analysis.quickWins.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-emerald-400 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{getLocalizedEnum(item.difficulty)}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Long Term */}
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                 <div className="p-1.5 bg-blue-100 rounded-lg">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                </div>
                {t.longTerm}
              </h3>
              <div className="space-y-4">
                {analysis.longTermSolutions.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-400 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{getLocalizedEnum(item.impact)} {t.impact}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Observations */}
           <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">{t.observations}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              {analysis.observations.map((obs, idx) => (
                <li key={idx}>{obs}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAnalyzer;