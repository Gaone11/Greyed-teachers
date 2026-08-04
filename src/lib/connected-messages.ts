import { supabase } from './supabase';
import { ConnectionCircle, ConnectionRole } from './connection-circle';

export type ConversationRolePair = [ConnectionRole, ConnectionRole];

export interface ConnectedMessage {
  id: string;
  conversation_key: string;
  sender_role: ConnectionRole;
  sender_name: string;
  sender_email?: string;
  recipient_role: ConnectionRole;
  recipient_name: string;
  recipient_email?: string;
  body: string;
  created_at: string;
}

export const CONNECTED_MESSAGES_UPDATED_EVENT = 'greyed-connected-messages-updated';

const getMessageStorageKey = (conversationKey: string) => `greyed-connected-messages:${conversationKey}`;

const normalizeIdentityPart = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9@._-]+/g, '-');

export const getConversationKey = (circle: ConnectionCircle, roles: ConversationRolePair) => {
  const circleIdentity = (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => {
      const member = circle.members[role];
      return normalizeIdentityPart(member.email || member.name || role);
    })
    .join('|');

  return `greyed:${circleIdentity}:${roles.join('-')}`;
};

export const getOtherConversationRole = (currentRole: ConnectionRole, roles: ConversationRolePair) => {
  return roles.find(role => role !== currentRole) || roles[0];
};

export const getParticipantEmails = (circle: ConnectionCircle) => {
  return (['student', 'teacher', 'parent'] as ConnectionRole[])
    .map(role => circle.members[role].email.trim().toLowerCase())
    .filter(Boolean);
};

const isMissingMessagesTableError = (error: unknown) => {
  const err = error as { code?: string; message?: string };
  const message = err?.message || '';
  return err?.code === '42P01'
    || err?.code === 'PGRST205'
    || /relation .*connected_messages.* does not exist/i.test(message)
    || /schema cache.*public\.connected_messages/i.test(message)
    || /could not find the table .*connected_messages/i.test(message);
};

const readLocalMessages = (conversationKey: string): ConnectedMessage[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(getMessageStorageKey(conversationKey));
    return stored ? JSON.parse(stored) as ConnectedMessage[] : [];
  } catch {
    return [];
  }
};

const writeLocalMessages = (conversationKey: string, messages: ConnectedMessage[]) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(getMessageStorageKey(conversationKey), JSON.stringify(messages));
  window.dispatchEvent(new CustomEvent(CONNECTED_MESSAGES_UPDATED_EVENT, { detail: { conversationKey } }));
};

const mergeMessages = (messages: ConnectedMessage[]) => {
  const seen = new Set<string>();
  return messages
    .filter(message => {
      if (seen.has(message.id)) return false;
      seen.add(message.id);
      return true;
    })
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};

export const loadConnectedMessages = async (
  circle: ConnectionCircle,
  roles: ConversationRolePair
): Promise<ConnectedMessage[]> => {
  const conversationKey = getConversationKey(circle, roles);
  const localMessages = readLocalMessages(conversationKey);

  try {
    const { data, error } = await supabase
      .from('connected_messages')
      .select('id,conversation_key,sender_role,sender_name,sender_email,recipient_role,recipient_name,recipient_email,body,created_at')
      .eq('conversation_key', conversationKey)
      .order('created_at', { ascending: true });

    if (error) {
      if (isMissingMessagesTableError(error)) return localMessages;
      throw error;
    }

    const merged = mergeMessages([...(data || []) as ConnectedMessage[], ...localMessages]);
    writeLocalMessages(conversationKey, merged);
    return merged;
  } catch {
    return localMessages;
  }
};

export const sendConnectedMessage = async (
  circle: ConnectionCircle,
  roles: ConversationRolePair,
  senderRole: ConnectionRole,
  body: string
) => {
  const conversationKey = getConversationKey(circle, roles);
  const recipientRole = getOtherConversationRole(senderRole, roles);
  const sender = circle.members[senderRole];
  const recipient = circle.members[recipientRole];
  const message: ConnectedMessage = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    conversation_key: conversationKey,
    sender_role: senderRole,
    sender_name: sender.name,
    sender_email: sender.email,
    recipient_role: recipientRole,
    recipient_name: recipient.name,
    recipient_email: recipient.email,
    body,
    created_at: new Date().toISOString(),
  };

  const localMessages = mergeMessages([...readLocalMessages(conversationKey), message]);
  writeLocalMessages(conversationKey, localMessages);

  try {
    const { error } = await supabase
      .from('connected_messages')
      .insert({
        conversation_key: conversationKey,
        sender_role: message.sender_role,
        sender_name: message.sender_name,
        sender_email: message.sender_email,
        recipient_role: message.recipient_role,
        recipient_name: message.recipient_name,
        recipient_email: message.recipient_email,
        participant_emails: getParticipantEmails(circle),
        body: message.body,
      });

    if (error && !isMissingMessagesTableError(error)) {
      throw error;
    }
  } catch {
    return message;
  }

  return message;
};
