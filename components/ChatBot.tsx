import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage, Sender, Language } from '../types';
import { SendIcon, ChatIcon } from './Icons';
import { Chat, GenerateContentResponse } from '@google/genai';
import { getTranslation } from '../utils/localization';

interface ChatBotProps {
  language: Language;
}

const ChatBot: React.FC<ChatBotProps> = ({ language }) => {
  const t = getTranslation(language);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or reset chat session when language changes
  useEffect(() => {
    chatSessionRef.current = createChatSession(language);
    setMessages([
      {
        id: 'welcome',
        text: t.welcomeMessage,
        sender: Sender.BOT,
        timestamp: new Date()
      }
    ]);
  }, [language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !chatSessionRef.current) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: userText,
      sender: Sender.USER,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const responseText = (result as GenerateContentResponse).text || "I'm sorry, I couldn't process that.";

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: Sender.BOT,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: t.connectionError,
        sender: Sender.BOT,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-4">
      {/* Header */}
      <div className="bg-emerald-600 p-4 text-white flex items-center gap-3 shadow-md">
        <div className="p-2 bg-white/20 rounded-full">
          <ChatIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg">{t.chatTitle}</h2>
          <p className="text-emerald-100 text-xs">{t.chatSubtitle}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                ${msg.sender === Sender.USER 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t.chatPlaceholder}
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 outline-none text-slate-700 placeholder:text-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;