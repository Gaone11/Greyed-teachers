import React, { useState, useRef, useEffect, useCallback } from 'react';
import { processTeacherQuery } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { Snowflake, Send, Loader, Zap, CornerDownLeft } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ElAIChatProps {
  className?: string;
  isFullPage?: boolean;
  conversationId?: string | null;
  userId?: string;
  onConversationCreated?: (id: string) => void;
}

const WELCOME_MESSAGE = "Hello! I'm El AI, your teaching assistant powered by Uhuru AI (GreyEd version). I can help you create lesson plans, assessments, and teaching resources aligned with the Ministry of Education curriculum. I'm here to support your teaching journey - just let me know what you need!";

const ElAIChat: React.FC<ElAIChatProps> = ({ className = '', isFullPage = false, conversationId, userId, onConversationCreated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentConvIdRef = useRef<string | null | undefined>(conversationId);

  // Load messages when conversation changes
  useEffect(() => {
    currentConvIdRef.current = conversationId;

    if (conversationId && userId) {
      loadConversationMessages(conversationId);
    } else {
      // New chat - show welcome message
      setMessages([{
        id: 'welcome',
        content: WELCOME_MESSAGE,
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, [conversationId, userId]);

  const loadConversationMessages = async (convId: string) => {
    try {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('teacher_ai_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages(data.map((m: any) => ({
          id: m.id,
          content: m.content,
          role: m.role,
          timestamp: new Date(m.created_at)
        })));
      } else {
        setMessages([{
          id: 'welcome',
          content: WELCOME_MESSAGE,
          role: 'assistant',
          timestamp: new Date()
        }]);
      }
    } catch {
      console.error('Failed to load messages');
      setMessages([{
        id: 'welcome',
        content: WELCOME_MESSAGE,
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSubmitMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      role: 'user',
      timestamp: new Date()
    };

    const userInput = inputText;
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    // Create or use existing conversation
    let activeConvId = currentConvIdRef.current;

    try {
      // If no conversation exists yet, create one
      if (!activeConvId && userId) {
        const title = userInput.slice(0, 60) + (userInput.length > 60 ? '...' : '');
        const { data: newConv, error: convError } = await supabase
          .from('teacher_ai_conversations')
          .insert({ teacher_id: userId, title })
          .select()
          .single();

        if (convError) throw convError;
        activeConvId = newConv.id;
        currentConvIdRef.current = activeConvId;
        onConversationCreated?.(newConv.id);
      }

      // Save user message to DB
      if (activeConvId && userId) {
        await supabase.from('teacher_ai_messages').insert({
          conversation_id: activeConvId,
          teacher_id: userId,
          role: 'user',
          content: userInput
        });
      }

      // Check if user is asking about El AI's identity
      const identityQuestions = [
        /who (made|created|developed) you/i,
        /who (made|created|developed) el ai/i,
        /what (llm|model|ai) (powers|runs|are you based on|model are you|drives)/i,
        /what (company|organization) (made|created|developed) you/i,
        /who (owns|is behind) (you|el ai|greyed)/i,
        /what (are you|is el ai)/i,
        /tell me about (yourself|el ai)/i
      ];
      
      let aiResponse;
      
      if (identityQuestions.some(pattern => pattern.test(userInput))) {
        aiResponse = "I'm El AI, an education-focused AI assistant developed by GreyEd. I'm powered by the Uhuru 3 LLM combined with GreyEd's proprietary eLLM (emotional Large Language Model), which allows me to understand not just educational content but also the emotional and motivational aspects of teaching. I'm specifically designed to help teachers with lesson planning, assessment creation, and educational resource development — all aligned with the Ministry of Education's curriculum standards including CAPS, IGCSE, BGCSE, and JCE syllabi.";
      } else {
        aiResponse = await processTeacherQuery(userInput, 'teacher');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to DB
      if (activeConvId && userId) {
        await supabase.from('teacher_ai_messages').insert({
          conversation_id: activeConvId,
          teacher_id: userId,
          role: 'assistant',
          content: aiResponse
        });

        // Update conversation timestamp
        await supabase
          .from('teacher_ai_conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', activeConvId);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage();
    }
  };
  
  // Auto-resize textarea as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  // Escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Format message content with basic markdown-like formatting
  const formatMessageContent = (content: string) => {
    // First escape HTML to prevent XSS, then apply markdown formatting
    const escaped = escapeHtml(content);
    return (
      <div dangerouslySetInnerHTML={{
        __html: escaped
          // Bold text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // Italic text
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          // Code blocks
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-gray-800">$1</code>')
          // Line breaks
          .replace(/\n/g, '<br>')
      }} />
    );
  };

  // Example suggested questions for teachers
  const suggestedQuestions = [
    "Create a lesson plan for 8th grade science on the water cycle",
    "What are effective strategies for teaching Shakespeare to high school students?",
    "Help me design a formative assessment for 5th grade math",
    "How can I differentiate instruction for students with diverse learning needs?"
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Messages - Full screen optimized */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6 bg-greyed-beige/5">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-greyed-blue/30 border-t-greyed-blue rounded-full animate-spin" />
            </div>
          ) : (
          <>
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-greyed-blue/20 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-2">
                  <Snowflake size={16} className="text-greyed-navy" />
                </div>
              )}
              
              <div
                className={`
                  max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4
                  ${message.role === 'user'
                    ? 'bg-greyed-navy text-white'
                    : 'bg-white border border-gray-200 shadow-sm text-black'}
                `}
              >
                {formatMessageContent(message.content)}
                <div className="text-right mt-1">
                  <span className={`text-xs ${message.role === 'user' ? 'text-white/60' : 'text-black/60'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-greyed-navy/80 flex items-center justify-center ml-2 flex-shrink-0 self-end mb-2">
                  <span className="text-xs font-medium text-white">You</span>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-greyed-blue/20 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-2">
                <Snowflake size={16} className="text-greyed-navy" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-greyed-blue/50 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-greyed-blue/50 rounded-full animate-bounce delay-100"></div>
                  <div className="h-2 w-2 bg-greyed-blue/50 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          </>
          )}
        </div>
      </div>
      
      {/* Input Area - Fixed at bottom */}
      <div className="bg-white border-t border-gray-200 p-3 md:p-4 relative">
        {/* Suggested Questions - Overlay style */}
        {messages.length === 1 && (
          <div className="absolute inset-x-0 bottom-24 md:bottom-28 px-3 md:px-4 pointer-events-none">
            <div className="max-w-4xl mx-auto pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg border border-greyed-navy/10">
                <h3 className="text-xs md:text-sm font-medium text-greyed-navy mb-2">Try asking:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(question);
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.style.height = 'auto';
                            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
                          }
                        }, 0);
                      }}
                      className="text-xs md:text-sm bg-greyed-navy/5 hover:bg-greyed-navy/10 text-black text-left px-3 py-2 rounded-lg transition-colors flex items-start"
                    >
                      <Zap size={14} className="mr-2 mt-1 text-greyed-blue flex-shrink-0" />
                      <span>{question}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitMessage} className="max-w-4xl mx-auto">
          <div className="relative bg-white shadow-sm rounded-lg border border-gray-300 focus-within:border-greyed-blue focus-within:ring-2 focus-within:ring-greyed-blue/50">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask El AI Teacher Assistant..."
              className="w-full resize-none py-3 px-4 pr-12 focus:outline-none rounded-lg max-h-[120px] md:max-h-[150px]"
              rows={1}
              disabled={isTyping}
            />

            <div className="absolute right-2 bottom-2 flex">
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`p-2 rounded-lg ${
                  !inputText.trim() || isTyping
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-greyed-navy hover:bg-greyed-navy/10'
                } transition-colors`}
                title={inputText.trim() ? "Send message" : "Enter a message"}
              >
                {isTyping ? (
                  <Loader size={20} className="animate-spin" />
                ) : inputText.trim() ? (
                  <Send size={20} />
                ) : (
                  <CornerDownLeft size={20} />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              Press Enter to send
            </div>
            {isFullPage && (
              <div className="text-xs text-gray-500">
                Powered by Uhuru 3 LLM &amp; GreyEd eLLM
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElAIChat;