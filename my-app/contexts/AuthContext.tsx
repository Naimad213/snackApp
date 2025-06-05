import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../app/config/supabase';
import { Session } from '@supabase/supabase-js';
import { Alert } from 'react-native';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  error: null,
  retry: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      setSession(session);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch session'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      await fetchSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setSession(session);
          setLoading(false);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    };

    initialize();
  }, [retryCount]);

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <AuthContext.Provider value={{ session, loading, error, retry }}>
      {children}
    </AuthContext.Provider>
  );
}; 