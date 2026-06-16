import React, { useState, useRef, useEffect } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  HelpCircle,
  Zap
} from 'lucide-react';

const AIStudyAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hi! I am your AI Study Assistant. I can help you explain tricky concepts, generate quizzes, build study schedules, or create flashcards. What would you like to learn today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { id: Date.now(), sender: 'user', text }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let aiResponse = "That's a great question! Let me pull up some resources for you.";
      
      if (text.toLowerCase().includes('quiz')) {
        aiResponse = "I can generate a practice quiz for you. Which subject and topic would you like to focus on?";
      } else if (text.toLowerCase().includes('flashcard')) {
        aiResponse = "Let's create some flashcards! Please paste the terms and definitions, or tell me the topic, and I'll generate them for you.";
      } else if (text.toLowerCase().includes('schedule')) {
        aiResponse = "I can help build a study schedule. When is your next exam, and how many hours a week can you dedicate to studying?";
      }

      setMessages([...newMessages, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickPrompts = [
    { label: 'Explain a Concept', icon: HelpCircle, prompt: 'Can you explain the concept of [insert concept] in simple terms?' },
    { label: 'Generate Quiz', icon: Zap, prompt: 'Generate a 5-question practice quiz for my upcoming test.' },
    { label: 'Create Flashcards', icon: BookOpen, prompt: 'Help me create flashcards for my Biology chapter on cell structure.' },
    { label: 'Build Study Schedule', icon: Calendar, prompt: 'Can you build a 2-week study schedule for my Math finals?' },
  ];

  return (
    <StudentLayout activePage="ai-assistant">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <Bot className="w-8 h-8 text-greyed-blue" />
            AI Study Assistant
          </h1>
          <p className="text-greyed-beige/70 mt-1">Your personal tutor, available 24/7.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        
        {/* Main Chat Interface */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-greyed-navy/5 flex flex-col overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
          
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-greyed-white/30">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex mb-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] sm:max-w-[70%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.sender === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md' : 'bg-[#2a2f6e] text-white'
                  }`}>
                    {msg.sender === 'ai' ? <Sparkles className="w-4 h-4" /> : <span className="text-xs font-bold">You</span>}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 text-sm rounded-2xl shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#2a2f6e] text-white rounded-tr-sm' 
                      : 'bg-white text-greyed-navy border border-greyed-navy/10 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-6">
                <div className="flex max-w-[70%] gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 bg-white border border-greyed-navy/10 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-greyed-navy/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-greyed-navy/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-greyed-navy/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-greyed-navy/10 bg-white">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input 
                  type="text"
                  placeholder="Ask me anything..."
                  className="w-full bg-greyed-white border border-greyed-navy/10 text-greyed-navy text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-indigo-400 transition-colors shadow-inner"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <button 
                onClick={() => handleSend()}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                  inputValue.trim() ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transform hover:scale-105' : 'bg-greyed-navy/10 text-greyed-navy/40 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Prompts Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-indigo-600" />
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              {quickPrompts.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
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
          
          <div className="bg-[#2a2f6e] text-white rounded-2xl p-5 shadow-md flex-1">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#bbd7eb]" />
              Pro Tips
            </h3>
            <ul className="text-sm text-white/80 space-y-3 mt-4 list-disc list-inside">
              <li>Be specific! Mention the exact topic or grade level for better results.</li>
              <li>Ask me to "simplify" if an explanation is too complex.</li>
              <li>You can paste your own notes and ask me to quiz you on them.</li>
            </ul>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
};

export default AIStudyAssistantPage;
