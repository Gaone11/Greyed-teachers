import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import StudentLayout from '../../components/students/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { AiLimitError, sendMessageToAI } from '../../lib/api';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Calendar,
  HelpCircle,
  Zap,
  FileText,
  List,
  GitBranch,
  BarChart3,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Microscope,
  GraduationCap,
  Target,
  PenTool,
  Brain,
  RotateCcw,
  LucideIcon
} from 'lucide-react';

type ContentType = 'explanation' | 'key-points' | 'diagram' | 'data' | 'questions';

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  meta?: string;
}

const contentTypes: { id: ContentType; label: string; icon: LucideIcon; instruction: string }[] = [
  { id: 'explanation', label: 'Explanation', icon: FileText, instruction: 'a clear written explanation' },
  { id: 'key-points', label: 'Key Points', icon: List, instruction: 'a short bulleted list of key points' },
  { id: 'diagram', label: 'Diagram', icon: GitBranch, instruction: 'a labelled text diagram or flow (use arrows such as ->) inside a code block' },
  { id: 'data', label: 'Data', icon: BarChart3, instruction: 'structured data as a markdown table' },
  { id: 'questions', label: 'Questions', icon: ListChecks, instruction: '3 to 5 practice questions, with answers listed at the end' },
];

const learningModes: { id: string; title: string; description: string; icon: LucideIcon }[] = [
  { id: 'explain', title: 'Explain a concept', description: 'Clear breakdown with examples', icon: Lightbulb },
  { id: 'deep-dive', title: 'Deep dive', description: 'Go beyond the basics', icon: Microscope },
  { id: 'exam-prep', title: 'Exam prep', description: 'Practice questions and revision', icon: GraduationCap },
  { id: 'revision', title: 'Quick revision', description: 'Summary and key takeaways', icon: Target },
  { id: 'homework', title: 'Homework help', description: 'Step-by-step guidance', icon: PenTool },
  { id: 'visualise', title: 'Visualise it', description: 'Diagrams and structured data', icon: Brain },
];

const modeContentDefaults: Record<string, ContentType[]> = {
  explain: ['explanation', 'key-points'],
  'deep-dive': ['explanation', 'key-points', 'diagram'],
  'exam-prep': ['key-points', 'questions'],
  revision: ['key-points'],
  homework: ['explanation', 'questions'],
  visualise: ['diagram', 'data'],
};

const starterQuestions = [
  'How does photosynthesis work?',
  'Explain the water cycle',
  'Break down quadratic equations',
  'What caused World War II?',
  'How do cells divide?',
  'Explain supply and demand',
];

const quickPrompts = [
  { label: 'Explain a Concept', icon: HelpCircle, prompt: 'Can you explain the concept of [insert concept] in simple terms?' },
  { label: 'Generate Quiz', icon: Zap, prompt: 'Generate a 5-question practice quiz for my upcoming test.' },
  { label: 'Create Flashcards', icon: BookOpen, prompt: 'Help me create flashcards for my Biology chapter on cell structure.' },
  { label: 'Build Study Schedule', icon: Calendar, prompt: 'Can you build a 2-week study schedule for my Math finals?' },
];

const buildPrompt = (text: string, selectedTypes: ContentType[], modeId: string | null) => {
  const mode = learningModes.find(item => item.id === modeId);
  const sections = contentTypes
    .filter(type => selectedTypes.includes(type.id))
    .map(type => `- ${type.label}: ${type.instruction}`)
    .join('\n');

  return [
    mode ? `Learning mode: ${mode.title} (${mode.description}).` : '',
    sections ? `Shape your answer into these sections, each under its own markdown heading:\n${sections}` : '',
    `Student request: ${text}`,
  ].filter(Boolean).join('\n\n');
};

const AIStudyAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>(['explanation', 'key-points']);
  const [showTypes, setShowTypes] = useState(true);
  const [modeId, setModeId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    if (hasConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, hasConversation]);

  const toggleType = (type: ContentType) => {
    setSelectedTypes(prev => (prev.includes(type) ? prev.filter(item => item !== type) : [...prev, type]));
  };

  const chooseMode = (id: string) => {
    const next = modeId === id ? null : id;
    setModeId(next);
    if (next) setSelectedTypes(modeContentDefaults[next]);
    inputRef.current?.focus();
  };

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isTyping) return;

    const mode = learningModes.find(item => item.id === modeId);
    const typeLabels = contentTypes.filter(type => selectedTypes.includes(type.id)).map(type => type.label);
    const meta = [mode?.title, ...typeLabels].filter(Boolean).join(' · ');

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text, meta }]);
    setInputValue('');
    setIsTyping(true);

    let reply: string;
    try {
      reply = await sendMessageToAI(buildPrompt(text, selectedTypes, modeId), user?.id || 'student');
    } catch (error) {
      reply = error instanceof AiLimitError
        ? error.message
        : "I couldn't reach El just now. Check that you're signed in and connected, then try again.";
    }

    setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: reply }]);
    setIsTyping(false);
  };

  const resetCanvas = () => {
    setMessages([]);
    setModeId(null);
    setSelectedTypes(['explanation', 'key-points']);
  };

  const composer = (
    <div className="bg-white rounded-3xl border border-greyed-navy/10 shadow-sm p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-greyed-navy text-white flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <textarea
          ref={inputRef}
          rows={hasConversation ? 1 : 2}
          placeholder="What would you like to learn about? e.g. 'Explain photosynthesis with diagrams'"
          className="flex-1 resize-none bg-transparent text-greyed-navy text-base placeholder:text-greyed-navy/35 focus:outline-none pt-2.5"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isTyping}
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            inputValue.trim() && !isTyping ? 'bg-greyed-navy hover:bg-greyed-navy/90 text-white shadow-md' : 'bg-greyed-navy/10 text-greyed-navy/40 cursor-not-allowed'
          }`}
          title="Send"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          type="button"
          onClick={() => setShowTypes(prev => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-greyed-navy/15 text-sm font-semibold text-greyed-navy/70 hover:bg-greyed-navy/5 transition-colors"
        >
          {selectedTypes.length} content type{selectedTypes.length === 1 ? '' : 's'}
          {showTypes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showTypes && contentTypes.map(type => {
          const Icon = type.icon;
          const active = selectedTypes.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => toggleType(type.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                active ? 'bg-greyed-navy text-white border-greyed-navy' : 'bg-white text-greyed-navy/70 border-greyed-navy/15 hover:bg-greyed-navy/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {type.label}
            </button>
          );
        })}
        {hasConversation && modeId && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#bbd7eb]/40 text-sm font-semibold text-greyed-navy">
            {learningModes.find(item => item.id === modeId)?.title}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <StudentLayout activePage="ai-assistant">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <Bot className="w-8 h-8 text-greyed-blue" />
            Ask El
          </h1>
          <p className="text-greyed-navy/75 mt-1 font-medium">Your personal tutor, available 24/7.</p>
        </div>
        {hasConversation && (
          <button
            type="button"
            onClick={resetCanvas}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-greyed-navy/10 text-sm font-bold text-greyed-navy hover:bg-greyed-navy/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New canvas
          </button>
        )}
      </div>

      {!hasConversation ? (
        /* Canvas start surface */
        <div className="max-w-4xl mx-auto pb-10 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-greyed-navy/10 text-xs font-bold tracking-[0.2em] text-greyed-navy/60">
              <Sparkles className="w-3.5 h-3.5" />
              CANVAS
            </span>
            <h2 className="text-2xl sm:text-4xl font-headline font-bold text-greyed-navy mt-4">Create anything you need to learn</h2>
            <p className="text-greyed-navy/60 mt-3 max-w-2xl mx-auto">
              Ask a question or describe a topic. El shapes the answer into text, diagrams, key points and practice questions, around how you learn.
            </p>
          </div>

          {composer}

          <div className="flex justify-center mt-8 mb-5">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-greyed-navy text-white text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              How to learn
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningModes.map(mode => {
              const Icon = mode.icon;
              const active = modeId === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => chooseMode(mode.id)}
                  className={`text-left p-5 rounded-2xl border transition-all ${
                    active
                      ? 'bg-[#bbd7eb]/30 border-greyed-navy/40 shadow-md'
                      : 'bg-white border-greyed-navy/10 hover:shadow-md hover:border-greyed-navy/20'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${active ? 'bg-greyed-navy text-white' : 'bg-greyed-navy/5 text-greyed-navy'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-greyed-navy">{mode.title}</p>
                  <p className="text-sm text-greyed-navy/55 mt-1">{mode.description}</p>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs font-bold tracking-[0.2em] text-greyed-navy/45 mt-10 mb-4">OR JUMP IN WITH A QUESTION</p>
          <div className="flex flex-wrap justify-center gap-3">
            {starterQuestions.map(question => (
              <button
                key={question}
                type="button"
                onClick={() => handleSend(question)}
                className="px-4 py-2.5 rounded-full bg-white border border-greyed-navy/10 text-sm text-greyed-navy/80 hover:bg-greyed-navy/5 hover:text-greyed-navy transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Conversation */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-greyed-navy/5 p-4 sm:p-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex mb-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[92%] sm:max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      msg.sender === 'ai' ? 'bg-greyed-navy text-white shadow-md' : 'bg-[#bbd7eb] text-greyed-navy'
                    }`}>
                      {msg.sender === 'ai' ? <Sparkles className="w-4 h-4" /> : <span className="text-[10px] font-bold">You</span>}
                    </div>
                    <div className="min-w-0">
                      <div className={`px-4 py-3 text-sm rounded-2xl shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-greyed-navy text-white rounded-tr-sm'
                          : 'bg-greyed-white text-greyed-navy border border-greyed-navy/10 rounded-tl-sm'
                      }`}>
                        {msg.sender === 'ai' ? (
                          <div className="prose prose-sm max-w-none prose-headings:text-greyed-navy prose-strong:text-greyed-navy prose-pre:bg-greyed-navy prose-pre:text-white">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                          </div>
                        ) : msg.text}
                      </div>
                      {msg.meta && <p className="text-[11px] text-greyed-navy/45 mt-1 text-right">{msg.meta}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-6">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-greyed-navy text-white shadow-md flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="px-4 py-3 bg-greyed-white border border-greyed-navy/10 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-greyed-navy/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-greyed-navy/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-greyed-navy/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {composer}
          </div>

          {/* Quick Prompts Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-white border border-greyed-navy/10 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-greyed-navy flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-greyed-blue" />
                How to learn
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {learningModes.map(mode => {
                  const Icon = mode.icon;
                  const active = modeId === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => chooseMode(mode.id)}
                      className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-colors ${
                        active ? 'bg-greyed-navy text-white border-greyed-navy' : 'bg-white text-greyed-navy border-greyed-navy/10 hover:bg-greyed-navy/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold leading-tight">{mode.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                {quickPrompts.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.label}
                      onClick={() => handleSend(prompt.prompt)}
                      className="flex items-center gap-3 w-full text-left p-3 rounded-xl bg-white hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <Icon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-semibold text-indigo-900">{prompt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default AIStudyAssistantPage;
