import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'សួស្តី! តើប្អូនមានចម្ងល់អ្វីបន្ថែមអំពីការសិក្សា ឬអាជីពការងារទេ? (Hello! Any questions about your career path?)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage(userMsg);
      const responseText = result.response.text();
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'សូមអភ័យទោស មានបញ្ហាបច្ចេកទេស។' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      <div className="bg-primary-600 p-4 text-white flex items-center gap-2 shadow-sm">
        <Sparkles size={20} className="text-yellow-300" />
        <h3 className="font-bold">គ្រូជំនួយការ (AI Advisor)</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-primary-100'}`}>
              {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} className="text-primary-600" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Bot size={16} className="text-primary-600" />
             </div>
             <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="សួរអ្វីផ្សេងទៀត..."
            className="flex-1 border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};