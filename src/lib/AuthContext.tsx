import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile } from './types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const createProfileIfNotExists = async (user: User) => {
    try {
      // Add timeout to prevent hanging
      const checkPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile check timeout')), 5000)
      );

      const { data: existingProfile } = await Promise.race([checkPromise, timeoutPromise]) as any;

      if (!existingProfile) {
        const createPromise = supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            preferences: {
              theme: 'dark',
              language: 'en',
            },
          });

        const createTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile creation timeout')), 5000)
        );

        const { error } = await Promise.race([createPromise, createTimeoutPromise]) as any;

        if (error) {
          console.error('Error creating profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in createProfileIfNotExists:', error);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      // Add timeout to prevent hanging
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 5000)
      );

      const { data: profileData, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Add timeout to prevent infinite loading
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 10000)
        );

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (session?.user) {
          setUser(session.user);
          await createProfileIfNotExists(session.user);
          await loadProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        // Continue without user session - allow login
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        try {
          if (session?.user) {
            setUser(session.user);
            // Add timeout to profile operations
            await Promise.race([
              Promise.all([
                createProfileIfNotExists(session.user),
                loadProfile(session.user.id)
              ]),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile operations timeout')), 10000)
              )
            ]);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Continue even if profile operations fail
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
            setProfile(null);
          }
        } finally {
          setLoading(false);
        }

        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out!');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // If user is immediately confirmed (email confirmation disabled), they'll be signed in
      if (data.user && data.session) {
        await createProfileIfNotExists(data.user);
        await loadProfile(data.user.id);
        return {};
      }

      // If email confirmation is required
      if (data.user && !data.session) {
        return { error: 'Please check your email and click the confirmation link to activate your account.' };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Error signing out');
      }
    } catch (error) {
      console.error('Error in signOut:', error);
      toast.error('Error signing out');
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};