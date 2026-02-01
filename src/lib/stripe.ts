import { supabase } from './supabase';
import { stripeProducts } from '../stripe-config';

export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription', trialPeriodDays?: number, backToPath?: string) {
  try {
    const product = stripeProducts.find(p => p.priceId === priceId);
    
    if (!product) {
      throw new Error(`Product with price ID ${priceId} not found`);
    }
    
    // Get the current origin for success and cancel URLs
    const origin = window.location.origin;
    
    // Create success and cancel URLs
    const success_url = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    
    // If a backToPath is provided, use it as the cancel URL, otherwise use the default cancel page
    const cancel_url = backToPath ? `${origin}${backToPath}` : `${origin}/checkout/canceled`;
    
    // Get the Supabase URL from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    // Get the current user's session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be logged in to create a checkout session');
    }
    
    // Call the Supabase Edge Function to create a checkout session
    const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        price_id: priceId,
        success_url,
        cancel_url,
        mode: mode,
        allow_promotion_codes: true, // Enable promotion codes
        trial_period_days: trialPeriodDays // Pass trial period days if provided
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }
    
    const { url } = await response.json();
    
    if (!url) {
      throw new Error('No checkout URL returned from server');
    }
    
    return url;
  } catch (error) {
    throw error;
  }
}

export async function redirectToCheckout(priceId: string, trialPeriodDays?: number) {
  try {
    // Find the product to determine the mode
    const product = stripeProducts.find(p => p.priceId === priceId);
    
    if (!product) {
      throw new Error(`Product with price ID ${priceId} not found`);
    }
    
    // Use current path as the back button destination (most likely the dashboard or settings page)
    const currentPath = window.location.pathname;
    
    // Create checkout session with optional trial period and back button destination
    const checkoutUrl = await createCheckoutSession(priceId, product.mode, trialPeriodDays, currentPath);
    
    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl;
    
    // Return true to indicate success
    return true;
  } catch (error) {
    throw error;
  }
}

export async function getUserSubscription() {
  try {
    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    // Handle session error
    if (sessionError) {
      return null;
    }
    
    // Make sure user is logged in before querying
    if (!sessionData?.session?.user) {
      return null;
    }
    
    // Add retry mechanism to handle potential network issues
    let attempts = 0;
    const maxAttempts = 3;
    const retryDelay = 1000; // 1 second
    
    while (attempts < maxAttempts) {
      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();
        
        if (error) {
          attempts++;

          if (attempts >= maxAttempts) {
            return null;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
          continue;
        }
        
        return data;
      } catch (fetchError) {
        attempts++;
        if (attempts >= maxAttempts) {
          return null;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

export function formatPrice(amount: number, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}