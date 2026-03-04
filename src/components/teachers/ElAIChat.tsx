import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processTeacherQuery } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { Snowflake, ArrowUp, Loader } from 'lucide-react';

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

// Smooth cubic-bezier for message animations
const smoothEase = [0.25, 0.1, 0.25, 1.0];

const ElAIChat: React.FC<ElAIChatProps> = ({ className = '', isFullPage = false, conversationId, userId, onConversationCreated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentConvIdRef = useRef<string | null | undefined>(conversationId);
  const sendingRef = useRef(false);
  const prevConvIdRef = useRef<string | null | undefined>(conversationId);

  // Load messages when conversation changes (but NOT during active sends)
  useEffect(() => {
    const convChanged = conversationId !== prevConvIdRef.current;
    prevConvIdRef.current = conversationId;
    currentConvIdRef.current = conversationId;

    // Skip reload if we're in the middle of sending a message
    // (onConversationCreated fires mid-send and changes the prop)
    if (sendingRef.current && convChanged) {
      return;
    }

    if (conversationId && userId && convChanged) {
      loadConversationMessages(conversationId);
    } else if (!conversationId && convChanged) {
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
      // Only show full spinner if we have no messages yet
      if (messages.length === 0) {
        setLoadingMessages(true);
      }

      const { data, error } = await supabase
        .from('teacher_ai_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Don't update if conversation changed while loading
      if (currentConvIdRef.current !== convId) return;

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

  // Smart scroll: only auto-scroll when near bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom || behavior === 'auto') {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle message submission
  const handleSubmitMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    sendingRef.current = true;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputText,
      role: 'user',
      timestamp: new Date()
    };

    const userInput = inputText;
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

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
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      sendingRef.current = false;
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
    const escaped = escapeHtml(content);
    return (
      <div dangerouslySetInnerHTML={{
        __html: escaped
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm text-gray-800">$1</code>')
          .replace(/\n/g, '<br>')
      }} />
    );
  };

  // Message animation variants
  const messageVariants = {
    hidden: (role: 'user' | 'assistant') => ({
      opacity: 0,
      x: role === 'user' ? 16 : -16,
      y: 8,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.35,
        ease: smoothEase,
      },
    },
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8"
        style={{ backgroundColor: '#fafaf8' }}
      >
        <div className="max-w-3xl mx-auto space-y-5">
          {loadingMessages && messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-16"
            >
              <div className="w-5 h-5 border-2 border-greyed-navy/20 border-t-greyed-navy rounded-full animate-spin" />
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  custom={message.role}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  layout="position"
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant avatar */}
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-greyed-navy/8 flex items-center justify-center mr-2.5 flex-shrink-0 self-start mt-1">
                      <Snowflake size={14} className="text-greyed-navy/70" />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[82%] md:max-w-[75%] rounded-2xl px-4 py-3
                      ${message.role === 'user'
                        ? 'bg-greyed-navy text-white'
                        : 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100'}
                    `}
                  >
                    <div className={`text-[15px] leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {formatMessageContent(message.content)}
                    </div>
                    <div className={`text-right mt-1.5 ${message.role === 'user' ? 'text-white/50' : 'text-gray-400'}`}>
                      <span className="text-[11px]">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  key="typing-indicator"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: smoothEase }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-full bg-greyed-navy/8 flex items-center justify-center mr-2.5 flex-shrink-0 self-start mt-1">
                    <Snowflake size={14} className="text-greyed-navy/70" />
                  </div>
                  <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-gray-100 rounded-2xl px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-1.5 bg-greyed-navy/30 rounded-full"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-100 px-4 md:px-6 py-3 md:py-4">
        <form onSubmit={handleSubmitMessage} className="max-w-3xl mx-auto">
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] focus-within:border-greyed-navy/30 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.03)] transition-all duration-200">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message El AI..."
              className="w-full resize-none py-3.5 pl-4 pr-14 focus:outline-none rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 max-h-[120px] md:max-h-[150px]"
              rows={1}
              disabled={isTyping}
            />

            <div className="absolute right-2.5 bottom-2.5">
              <motion.button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                  !inputText.trim() || isTyping
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-greyed-navy text-white hover:bg-greyed-navy/90'
                }`}
                whileTap={inputText.trim() && !isTyping ? { scale: 0.92 } : undefined}
                title={inputText.trim() ? "Send message" : "Enter a message"}
              >
                {isTyping ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <ArrowUp size={16} strokeWidth={2.5} />
                )}
              </motion.button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[11px] text-gray-400">
              Enter to send
            </span>
            {isFullPage && (
              <span className="text-[11px] text-gray-400">
                Powered by Uhuru 3 LLM &amp; GreyEd eLLM
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElAIChat;
