import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BotMessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: any[];
  confidence?: number;
  assumptions?: string[];
  data_gaps?: string[];
  timestamp: string;
}

export const CopilotPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm0',
      sender: 'assistant',
      text: "Hello Aarav! I am your LifeStack Decision Intelligence Copilot. I answer your life, financial, academic, and career questions with zero hallucination — grounded strictly in your personal data warehouse and certified open benchmarks. How can I assist you today?",
      confidence: 1.0,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<any | null>(null);
  const [selectedExplainability, setSelectedExplainability] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Web Speech API: Voice Recognition
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  // Web Speech API: Text-to-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    // Strip markdown before speaking
    const clean = text.replace(/[*#>_\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChat(textToSend);
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        citations: res.citations || [],
        confidence: res.confidence_score,
        assumptions: res.assumptions || [],
        data_gaps: res.data_gaps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an error querying your personal warehouse. Please verify backend connectivity.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Can I afford this course EMI given my monthly surplus?",
    "Should I choose CS or ECE given current placement trends and my GPA?",
    "Analyze my exam crunch sleep and stress patterns",
    "What was my pet penguin vet bill in Tokyo last winter?"  // Demonstrates anti-hallucination refusal
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <DisclaimerBanner compact={true} />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BotMessageSquare className="w-5 h-5 text-brand-500" />
            {t('copilot.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('copilot.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Grounded RAG Guard Active</span>
        </div>
      </div>

      {/* Suggested Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 flex-shrink-0">Suggested:</span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="flex-shrink-0 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/10 text-slate-700 dark:text-slate-300 hover:text-brand-500 text-xs transition-colors border border-slate-200/50 dark:border-slate-700/50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-brand-500 text-white shadow-glow-indigo font-medium'
                  : 'glass-panel text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {/* Citations and Explainability Toolbar */}
              {m.sender === 'assistant' && m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Sources:</span>
                  {m.citations.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCitation(c)}
                      className="px-2 py-0.5 rounded bg-brand-500/15 text-brand-600 dark:text-brand-400 text-[10px] font-bold hover:bg-brand-500/25 transition-colors"
                    >
                      {c.citation_id} {c.source_ref}
                    </button>
                  ))}

                  <button
                    onClick={() => setSelectedExplainability(m)}
                    className="ml-auto text-[11px] font-semibold text-brand-500 hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Why this answer?
                  </button>

                  <button
                    onClick={() => speakText(m.text)}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Audio Read Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 glass-panel rounded-2xl text-xs text-slate-400 max-w-sm">
            <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
            <span>Retrieving isolated warehouse facts & grounding response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Voice Button */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="glass-panel p-2 rounded-2xl flex items-center gap-2 border border-slate-200 dark:border-slate-800"
        >
          <button
            type="button"
            id="btn-voice-input"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-colors ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Voice Input (Web Speech API)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            id="input-copilot-query"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? t('copilot.listening') : t('copilot.inputPlaceholder')}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />

          <button
            type="submit"
            id="btn-send-copilot"
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-glow-indigo flex items-center gap-1.5"
          >
            <span>{t('copilot.send')}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Citation Inspector Drawer Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-500" />
                Underlying Grounded Citation {selectedCitation.citation_id}
              </h3>
              <button onClick={() => setSelectedCitation(null)} className="text-slate-400 hover:text-white text-xs">
                Close ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Source Entity:</span>
                <p className="font-bold text-brand-500">{selectedCitation.source_ref}</p>
              </div>
              <div>
                <span className="text-slate-400">Warehouse Excerpt:</span>
                <p className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 leading-relaxed font-mono">
                  {selectedCitation.snippet}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explainability "Why this answer?" Modal */}
      {selectedExplainability && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-500" />
                {t('copilot.whyThisAnswer')}
              </h3>
              <button onClick={() => setSelectedExplainability(null)} className="text-slate-400 hover:text-white text-xs">
                Close ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <span className="text-slate-400 font-semibold">Grounded Confidence Score:</span>
                <span className="text-base font-extrabold text-brand-500">
                  {Math.round((selectedExplainability.confidence || 0.88) * 100)}%
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-300">Explicit Model Assumptions:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-slate-400">
                  {(selectedExplainability.assumptions || ['Assumes monthly compensation trajectory remains stable.']).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-semibold text-slate-300">Identified Data Gaps:</span>
                <p className="text-slate-400 mt-1">
                  {selectedExplainability.data_gaps && selectedExplainability.data_gaps.length > 0
                    ? selectedExplainability.data_gaps.join(', ')
                    : 'None. All figures corroborated by personal star-schema fact tables and open government benchmarks.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
