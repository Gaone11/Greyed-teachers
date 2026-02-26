import { supabase } from './supabase';
import { searchKnowledgeBase } from './api/kb-api';

// Constants
const FREE_MESSAGES_DAILY_LIMIT = 10; // Free accounts are limited to 10 messages per day

/**
 * Check if a user has reached their daily message limit
 */
export async function checkMessageLimit(userId: string): Promise<{ limitReached: boolean, count: number }> {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check user's subscription status
    const { data: subscriptionData, error: subError } = await supabase
      .from('stripe_user_subscriptions')
      .select('subscription_status, price_id')
      .maybeSingle();
    
    if (subError) {
      throw subError;
    }
    
    // If user has an active subscription, no limit applies
    if (subscriptionData?.subscription_status === 'active') {
      // Check if it's a premium or hybrid plan based on price_id
      return { limitReached: false, count: 0 };
    }
    
    // Count today's messages for the user
    const { count, error } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('role', 'user')
      .gte('created_at', today.toISOString());
    
    if (error) {
      throw error;
    }
    
    const messageCount = count || 0;
    const limitReached = messageCount >= FREE_MESSAGES_DAILY_LIMIT;
    
    return { limitReached, count: messageCount };
  } catch (error) {
    throw error;
  }
}

/**
 * Send a message to Uhuru AI and get a response
 */
export async function sendMessageToAI(message: string, userId: string): Promise<string> {
  try {
    // Check message limit before sending to API
    const { limitReached } = await checkMessageLimit(userId);
    
    // If free user has reached limit, throw an error
    if (limitReached) {
      throw new Error(`Daily message limit of ${FREE_MESSAGES_DAILY_LIMIT} reached. Please upgrade your plan for unlimited messages.`);
    }
    
    // Get the Supabase URL for the Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    // Get the current user's session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be logged in to send messages');
    }
    
    // Call the Supabase Edge Function (which securely handles Uhuru AI calls)
    const response = await fetch(`${supabaseUrl}/functions/v1/el-ai-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        message,
        userId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from Uhuru AI');
    }
    
    const data = await response.json();
    
    if (!data.response) {
      throw new Error('No response content returned from Uhuru AI');
    }
    
    return data.response;
    
  } catch (error) {
    throw error;
  }
}

/**
 * Save a chat message to the database
 */
export async function saveChatMessage(userId: string, role: 'user' | 'assistant', content: string) {
  try {
    // If this is a user message, check limits before saving
    if (role === 'user') {
      const { limitReached, count } = await checkMessageLimit(userId);
      
      if (limitReached) {
        throw new Error(`Daily message limit of ${FREE_MESSAGES_DAILY_LIMIT} reached. Please upgrade your plan for unlimited messages.`);
      }
    }
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        user_id: userId,
        role,
        content,
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch chat history for a user
 */
export async function fetchChatHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Process a teacher-specific query using the Uhuru AI Teacher model
 */
export async function processTeacherQuery(query: string, teacherId: string) {
  try {
    // Use the existing el-ai-teacher Edge Function which handles Uhuru AI calls
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be logged in to send messages');
    }

    // --- RAG: Retrieve relevant Knowledge Base context ---
    let kbContext = '';
    try {
      const kbResult = await searchKnowledgeBase(query);
      if (kbResult.contextString) {
        kbContext = kbResult.contextString;
      }
    } catch (kbError) {
      // KB search is non-blocking — if it fails, continue without context
      console.warn('Knowledge Base search failed, proceeding without KB context:', kbError);
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/el-ai-teacher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        message: query,
        conversationHistory: [],
        teacherContext: {},
        knowledgeBaseContext: kbContext || undefined,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from Uhuru AI Teacher');
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    throw error;
  }
}