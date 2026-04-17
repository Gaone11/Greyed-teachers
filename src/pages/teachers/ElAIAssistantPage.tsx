import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Loader,
  PanelLeftOpen,
  PanelLeftClose
} from 'lucide-react';
import ElAIChat from '../../components/teachers/ElAIChat';
import ElAISidebar from '../../components/teachers/ElAISidebar';
import { supabase } from '../../lib/supabase';

const ElAIAssistantPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);
  
  // Set document title
  useEffect(() => {
    document.title = "El AI Assistant | GreyEd Teachers";
  }, []);

  // Auto-collapse sidebar after 5 seconds
  const autoCollapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (showSidebar && window.innerWidth >= 768) {
      autoCollapseTimerRef.current = setTimeout(() => {
        setShowSidebar(false);
      }, 5000);
    }
    return () => {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
      }
    };
  }, [showSidebar]);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      // Delete messages first (cascade should handle this but being explicit)
      await supabase
        .from('teacher_ai_messages')
        .delete()
        .eq('conversation_id', id);
      
      await supabase
        .from('teacher_ai_conversations')
        .delete()
        .eq('id', id);

      // If we deleted the active conversation, start a new chat
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch {
      console.error('Failed to delete conversation');
    }
  }, [activeConversationId]);

  const handleConversationCreated = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-greyed-white">
        <Loader className="w-12 h-12 text-greyed-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-greyed-beige/5">
      {/* AI Sidebar with chat history - push layout */}
      {user && (
        <ElAISidebar
          userId={user.id}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          isOpen={showSidebar}
          onToggle={() => setShowSidebar(prev => !prev)}
        />
      )}

      {/* Chat container - takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Minimal top bar */}
        <div className="bg-white border-b border-greyed-navy/10 p-3 flex items-center">
          <button
            type="button"
            onClick={() => setShowSidebar(prev => !prev)}
            className="w-8 h-8 rounded-lg hover:bg-greyed-navy/10 flex items-center justify-center mr-2 transition-colors"
            title={showSidebar ? "Collapse sidebar" : "Expand sidebar"}
          >
            {showSidebar ? (
              <PanelLeftClose size={18} className="text-greyed-navy" />
            ) : (
              <PanelLeftOpen size={18} className="text-greyed-navy" />
            )}
          </button>
          <div className="flex-1">
            <h2 className="font-headline font-semibold text-black text-sm">GreyEd AI Teacher Assistant</h2>
          </div>
        </div>

        {/* Chat component */}
        <ElAIChat
          isFullPage={true}
          conversationId={activeConversationId}
          userId={user?.id}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </div>
  );
};

export default ElAIAssistantPage;