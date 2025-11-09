import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { z } from 'zod';
import Notification from '../components/Notification';

const emailSchema = z.string().email('Invalid email address').max(255);
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(100);

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = '/';
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = '/';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);

      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          showNotification('Invalid email or password', 'error');
        } else if (error.message.includes('Email not confirmed')) {
          showNotification('Please verify your email address before logging in', 'error');
        } else {
          showNotification(error.message, 'error');
        }
        return;
      }

      if (data.session) {
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        showNotification(error.issues[0].message, 'error');
      } else {
        showNotification('An error occurred. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);

      if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email: email.trim(),
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          showNotification('This email is already registered. Please login instead.', 'error');
        } else {
          showNotification(error.message, 'error');
        }
        return;
      }

      if (data.user) {
        showNotification(
          'Registration successful! Please check your email to verify your account.',
          'success'
        );
        setActiveTab('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        showNotification(error.issues[0].message, 'error');
      } else {
        showNotification('An error occurred. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) {
        showNotification(error.message, 'error');
        return;
      }

      showNotification('Password reset email sent! Check your inbox.', 'success');
      setShowForgotPassword(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        showNotification(error.issues[0].message, 'error');
      } else {
        showNotification('An error occurred. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4">
        {notification && <Notification message={notification.message} type={notification.type} />}
        <div className="w-full max-w-md p-8 space-y-6 bg-neutral-800 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>
            <p className="mt-2 text-neutral-400">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full mt-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full py-2 text-neutral-400 hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4">
      {notification && <Notification message={notification.message} type={notification.type} />}
      
      <div className="w-full max-w-md p-8 space-y-6 bg-neutral-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            FUN<span className="text-brand-primary">FANS</span>
          </h1>
          <p className="mt-2 text-neutral-400">Your exclusive content hub.</p>
        </div>

        <div className="flex border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('login')}
            className={`w-1/2 py-3 font-semibold text-center transition-colors ${
              activeTab === 'login'
                ? 'text-white border-b-2 border-brand-primary'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`w-1/2 py-3 font-semibold text-center transition-colors ${
              activeTab === 'register'
                ? 'text-white border-b-2 border-brand-primary'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full mt-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-neutral-300" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-neutral-400 hover:text-brand-light"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full mt-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-300" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full mt-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full mt-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <p className="text-xs text-neutral-400 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full mt-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-neutral-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default Auth;
