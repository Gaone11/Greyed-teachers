import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquarePlus,
  MessageSquare,
  Trash2,
  Snowflake,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ElAISidebarProps {
  userId: string;
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ElAISidebar: React.FC<ElAISidebarProps> = ({
  userId,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onToggle
}) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Listen for resize to toggle mobile/desktop mode
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teacher_ai_conversations')
        .select('*')
        .eq('teacher_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch {
      console.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  // Refresh conversations list when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchConversations();
    }
  }, [activeConversationId]);

  const handleDelete = async (id: string) => {
    onDeleteConversation(id);
    setConversations(prev => prev.filter(c => c.id !== id));
    setDeleteConfirmId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce<Record<string, Conversation[]>>((groups, conv) => {
    const label = formatDate(conv.updated_at);
    if (!groups[label]) groups[label] = [];
    groups[label].push(conv);
    return groups;
  }, {});

  return (
    <>
      {/* Sidebar panel — inline push on desktop, overlay on mobile */}
      <div
        className={`bg-greyed-navy flex flex-col ${
          isMobile
            ? `fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `flex-shrink-0 transition-[width] duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-0'} overflow-hidden`
        }`}
      >
        {/* Inner wrapper keeps content at 18rem even when the panel collapses */}
        <div className="w-72 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-greyed-blue/30 flex items-center justify-center">
                <Snowflake size={16} className="text-white" />
              </div>
              <span className="font-headline font-semibold text-white text-sm">GreyEd AI</span>
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>

          {/* New Chat button */}
          <button
            onClick={() => {
              onNewChat();
              if (isMobile) onToggle();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <MessageSquarePlus size={18} />
            New Chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">No conversations yet</p>
              <p className="text-white/30 text-xs mt-1">Start a new chat to get going</p>
            </div>
          ) : (
            Object.entries(groupedConversations).map(([dateLabel, convs]) => (
              <div key={dateLabel} className="mb-3">
                <p className="text-white/40 text-xs font-medium px-2 py-1.5 uppercase tracking-wider">
                  {dateLabel}
                </p>
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center rounded-lg transition-colors cursor-pointer mb-0.5 ${
                      activeConversationId === conv.id
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectConversation(conv.id);
                        if (isMobile) onToggle();
                      }}
                      className="flex-1 flex items-center gap-2 px-3 py-2 text-left min-w-0"
                    >
                      <MessageSquare size={14} className="flex-shrink-0" />
                      <span className="text-sm truncate">{conv.title}</span>
                    </button>

                    {/* Delete button */}
                    {deleteConfirmId === conv.id ? (
                      <div className="flex items-center gap-1 pr-2">
                        <button
                          onClick={() => handleDelete(conv.id)}
                          className="text-xs px-2 py-1 bg-red-500/80 text-white rounded hover:bg-red-500 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(conv.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded transition-all mr-1 text-white/50 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer - Back to Dashboard */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => navigate('/teachers/dashboard')}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
            title="Back to Dashboard"
          >
            <img src="/favicon.svg" alt="GreyEd" className="w-6 h-6" />
            <span>Dashboard</span>
          </button>
        </div>
        </div>{/* end inner wrapper */}
      </div>

      {/* Expand button — visible when sidebar is collapsed on desktop */}
      {!isOpen && !isMobile && (
        <button
          onClick={onToggle}
          className="flex-shrink-0 w-10 bg-greyed-navy flex flex-col items-center justify-start pt-4 gap-3 hover:bg-greyed-navy/90 transition-colors"
          title="Expand sidebar"
        >
          <PanelLeftOpen size={18} className="text-white/70" />
          <div className="w-6 h-6 rounded-full bg-greyed-blue/30 flex items-center justify-center">
            <Snowflake size={12} className="text-white" />
          </div>
        </button>
      )}

      {/* Overlay — only on mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default ElAISidebar;
