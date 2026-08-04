import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link2, Paperclip, Send, Smile } from 'lucide-react';
import {
  ConnectedMessage,
  CONNECTED_MESSAGES_UPDATED_EVENT,
  ConversationRolePair,
  getOtherConversationRole,
  loadConnectedMessages,
  sendConnectedMessage,
} from '../../lib/connected-messages';
import {
  ConnectionRole,
  CONNECTION_UPDATED_EVENT,
  loadConnectionCircle,
} from '../../lib/connection-circle';

interface ConnectedMessageThreadProps {
  currentRole: ConnectionRole;
  roles: ConversationRolePair;
  placeholder: string;
}

const formatMessageTime = (date: string) => {
  const messageDate = new Date(date);
  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();

  return messageDate.toLocaleString('en-US', {
    month: isToday ? undefined : 'short',
    day: isToday ? undefined : 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getInitial = (name: string) => (name.trim()[0] || 'G').toUpperCase();

const ConnectedMessageThread: React.FC<ConnectedMessageThreadProps> = ({
  currentRole,
  roles,
  placeholder,
}) => {
  const [circle, setCircle] = useState(() => loadConnectionCircle());
  const [messages, setMessages] = useState<ConnectedMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const otherRole = useMemo(() => getOtherConversationRole(currentRole, roles), [currentRole, roles]);
  const currentPerson = circle.members[currentRole];
  const otherPerson = circle.members[otherRole];
  const student = circle.members.student;
  const parent = circle.members.parent;

  const refreshMessages = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    const list = await loadConnectedMessages(circle, roles);
    setMessages(list);
    if (showLoading) setLoading(false);
  }, [circle, roles]);

  useEffect(() => {
    refreshMessages(true);
  }, [refreshMessages]);

  useEffect(() => {
    const refreshCircle = () => setCircle(loadConnectionCircle());
    const refreshThread = () => {
      refreshMessages(false);
    };
    const refreshInterval = window.setInterval(refreshThread, 5000);

    window.addEventListener(CONNECTION_UPDATED_EVENT, refreshCircle);
    window.addEventListener(CONNECTED_MESSAGES_UPDATED_EVENT, refreshThread);
    window.addEventListener('storage', refreshThread);

    return () => {
      window.removeEventListener(CONNECTION_UPDATED_EVENT, refreshCircle);
      window.removeEventListener(CONNECTED_MESSAGES_UPDATED_EVENT, refreshThread);
      window.removeEventListener('storage', refreshThread);
      window.clearInterval(refreshInterval);
    };
  }, [refreshMessages]);

  const handleSend = async () => {
    const body = messageInput.trim();
    if (!body) return;

    setSending(true);
    setMessageInput('');
    const sentMessage = await sendConnectedMessage(circle, roles, currentRole, body);
    setMessages(current => [...current, sentMessage]);
    setSending(false);
  };

  if (circle.status !== 'connected') {
    return (
      <div className="flex-1 flex items-center justify-center bg-greyed-navy/5 p-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-greyed-navy/10 text-greyed-navy flex items-center justify-center mx-auto mb-3">
            <Link2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-greyed-navy">Connect your learning circle first</h3>
          <p className="text-sm text-greyed-navy/60 mt-2">
            Once the student, teacher, and parent are connected, messages will appear across their hubs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      <div className="p-4 border-b border-greyed-navy/10 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy font-bold flex-shrink-0">
            {getInitial(otherPerson.name)}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-greyed-navy truncate">{otherPerson.name}</h3>
            <p className="text-xs text-greyed-navy/60 font-medium truncate">
              Student: {student.name} • Parent: {parent.name}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 text-xs font-bold">
          Connected
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-greyed-navy/5">
        {loading ? (
          <div className="text-center text-sm text-greyed-navy/50 py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-greyed-navy/50 py-8">
            No messages yet. Start the conversation with {otherPerson.name}.
          </div>
        ) : (
          messages.map(message => {
            const fromCurrentUser = message.sender_role === currentRole;
            return (
              <div
                key={message.id}
                className={`flex flex-col gap-1 ${fromCurrentUser ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-greyed-navy/45 font-semibold px-1">
                  {fromCurrentUser ? currentPerson.name : message.sender_name} • {formatMessageTime(message.created_at)}
                </span>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] sm:max-w-[72%] text-sm ${
                  fromCurrentUser
                    ? 'bg-greyed-blue text-white rounded-tr-sm'
                    : 'bg-white border border-greyed-navy/10 text-greyed-navy rounded-tl-sm shadow-sm'
                }`}>
                  {message.body}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 bg-white border-t border-greyed-navy/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Attachment picker is a demo action in this preview.')}
            className="p-2 text-greyed-navy/40 hover:text-greyed-blue transition-colors rounded-full hover:bg-greyed-blue/10 flex-shrink-0"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-greyed-navy/5 rounded-2xl border border-greyed-navy/10 flex items-center px-4 py-2 focus-within:border-greyed-blue transition-colors">
            <input
              value={messageInput}
              onChange={event => setMessageInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder={placeholder}
              className="w-full bg-transparent border-transparent focus:ring-0 focus:outline-none text-sm text-greyed-navy placeholder:text-greyed-navy/40"
            />
            <button
              onClick={() => setMessageInput(current => `${current}${current ? ' ' : ''}🙂`)}
              className="p-1 text-greyed-navy/40 hover:text-greyed-navy transition-colors ml-2"
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!messageInput.trim() || sending}
            className="p-2.5 bg-greyed-navy text-white hover:bg-greyed-blue transition-colors rounded-full shadow-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedMessageThread;
