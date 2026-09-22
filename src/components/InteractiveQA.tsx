import React, { useState, useRef, useEffect } from 'react';
import { QAMessage } from '../types';
import {
  MessageSquareText,
  Send,
  Sparkles,
  HelpCircle,
  Quote,
  AlertTriangle,
  ArrowRight,
  Bot,
  User,
  CheckCircle,
  Copy,
  Check,
  Download,
  Filter,
  ShieldCheck,
} from 'lucide-react';

interface InteractiveQAProps {
  documentText: string;
  documentTitle: string;
  onAskQuestion: (question: string) => Promise<any>;
  messages: QAMessage[];
  isAsking: boolean;
}

interface QuestionSuggestion {
  category: 'Financial' | 'Termination' | 'Liability' | 'Intellectual Property' | 'Disputes';
  question: string;
}

export const InteractiveQA: React.FC<InteractiveQAProps> = ({
  documentText,
  documentTitle,
  onAskQuestion,
  messages,
  isAsking,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCitationIdx, setCopiedCitationIdx] = useState<string | null>(null);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAsking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isAsking) return;
    const q = inputQuestion.trim();
    setInputQuestion('');
    onAskQuestion(q);
  };

  const handleChipClick = (prompt: string) => {
    if (isAsking) return;
    onAskQuestion(prompt);
  };

  const allSuggestions: QuestionSuggestion[] = [
    { category: 'Termination', question: 'How can I terminate or cancel this agreement early without penalty?' },
    { category: 'Termination', question: 'Does this contract automatically renew, and what is the notice window?' },
    { category: 'Financial', question: 'Can the other party increase fees, rent, or rates unilaterally during the term?' },
    { category: 'Financial', question: 'What are the payment terms, late fees, and interest penalties?' },
    { category: 'Liability', question: 'Are there one-sided indemnification obligations or unlimited liability clauses?' },
    { category: 'Liability', question: 'Is there a cap on total monetary damages if a breach occurs?' },
    { category: 'Intellectual Property', question: 'Who owns newly created intellectual property, source code, and inventions?' },
    { category: 'Intellectual Property', question: 'What is the duration and scope of the confidentiality / non-disclosure duties?' },
    { category: 'Disputes', question: 'Does this agreement mandate binding arbitration or waive trial by jury?' },
    { category: 'Disputes', question: 'Which court and governing law jurisdiction controls disputes?' },
  ];

  const filteredSuggestions = allSuggestions.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitationIdx(id);
    setTimeout(() => setCopiedCitationIdx(null), 2500);
  };

  const handleExportTranscript = () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.role === 'user' ? 'USER' : 'LEXISENSE AI'}:\n${m.content}\n`)
      .join('\n---\n\n');

    navigator.clipboard.writeText(transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[740px] overflow-hidden">
      {/* QA Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
            <MessageSquareText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Interactive Contract Inquiries &amp; Clause Grounding
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-md">
              Target:{' '}
              <strong className="text-amber-300">
                {documentTitle || (documentText ? 'Loaded Agreement' : 'No document active')}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleExportTranscript}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy conversation history"
            >
              {copiedTranscript ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Transcript Copied</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" />
                  <span>Export Chat</span>
                </>
              )}
            </button>
          )}

          {documentText ? (
            <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Document Grounded
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full">
              Load document first
            </span>
          )}
        </div>
      </div>

      {/* Suggestion Filter Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-700" />
          Filter Suggestions:
        </span>
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'financial', label: 'Financial' },
            { id: 'termination', label: 'Exit & Notice' },
            { id: 'liability', label: 'Liability' },
            { id: 'intellectual property', label: 'IP & Code' },
            { id: 'disputes', label: 'Disputes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 border border-amber-400/30 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Ask Any Specific Question About Your Agreement
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed mb-5 max-w-md">
              Every answer is cross-referenced with your agreement's exact text, highlighting obligations, financial hazards, and practical remedies.
            </p>

            <div className="w-full space-y-2 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                Recommended Curated Inquiries ({filteredSuggestions.length}):
              </span>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredSuggestions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipClick(item.question)}
                    disabled={!documentText || isAsking}
                    className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 bg-white text-xs text-slate-800 font-medium text-left transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span>{item.question}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-amber-700 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, mIdx) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-slate-950 text-white rounded-tr-xs shadow-xs font-medium'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.content}</div>

                {/* Relevant Clauses Grounded Citations */}
                {msg.relevantClauses && msg.relevantClauses.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <Quote className="w-3 h-3 text-slate-700" />
                      Grounded Citations from Document:
                    </span>
                    {msg.relevantClauses.map((clause, idx) => {
                      const citeId = `${msg.id}-${idx}`;
                      return (
                        <div
                          key={idx}
                          className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900 block font-semibold">{clause.title}</strong>
                            <button
                              onClick={() => handleCopyCitation(citeId, `"${clause.excerpt}" - ${clause.title}`)}
                              className="text-[10px] text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                              title="Copy citation excerpt"
                            >
                              {copiedCitationIdx === citeId ? (
                                <>
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  <span className="text-emerald-700">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-slate-700 italic font-mono text-[11px] leading-relaxed">
                            "{clause.excerpt}"
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      Recommended Follow-Up Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((fu, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleChipClick(fu)}
                          className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md transition-colors text-left cursor-pointer font-medium"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 font-bold shadow-2xs">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {isAsking && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-700 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing clauses, citations, and legal obligations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3.5 border-t border-slate-200 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={!documentText || isAsking}
            placeholder={
              documentText
                ? 'Ask a specific question about clauses, liabilities, notice windows, or fees...'
                : 'Please load or paste a document first to chat...'
            }
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || !documentText || isAsking}
            className="absolute right-2 p-2 rounded-lg bg-slate-950 text-amber-300 disabled:opacity-40 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
