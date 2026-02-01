import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../context/AuthContext';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface UseWaitlistDataOptions {
  limit?: number;
  page?: number;
  filter?: string;
}

export function useWaitlistData({ limit = 10, page = 1, filter = '' }: UseWaitlistDataOptions = {}) {
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchWaitlistData() {
      setLoading(true);
      try {
        // Check if user is authenticated using the AuthContext
        if (!user) {
          setError(new Error('You must be logged in to access this data'));
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        setIsAuthenticated(true);

        // Fetch actual waitlist data from Supabase
        let dataQuery = supabase
          .from('waitlist')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });
          
        // Apply filter if provided
        if (filter) {
          dataQuery = dataQuery.or(`name.ilike.%${filter}%,email.ilike.%${filter}%`);
        }
        
        // Apply pagination
        const from = (page - 1) * limit;
        dataQuery = dataQuery.range(from, from + limit - 1);
        
        const { data, error: dataError, count } = await dataQuery;
        
        if (dataError) {
          throw dataError;
        }

        // Set the waitlist data from Supabase
        setWaitlistData(data || []);
        setTotalCount(count || 0);
        setError(null);
        
      } catch (err: any) {
        setError(err);
        setWaitlistData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchWaitlistData();
  }, [limit, page, filter, user]);

  return { 
    waitlistData, 
    loading, 
    error, 
    totalCount, 
    pageCount: Math.ceil(totalCount / limit),
    isAuthenticated 
  };
}