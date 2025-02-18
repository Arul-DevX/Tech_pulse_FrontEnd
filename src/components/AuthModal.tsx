import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Account created successfully! Please log in.');
        onSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Logged in successfully!');
        onSuccess();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          {mode === 'login' ? (
            <>
              <LogIn size={24} className="text-indigo-400" />
              Log In
            </>
          ) : (
            <>
              <UserPlus size={24} className="text-indigo-400" />
              Sign Up
            </>
          )}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin">⌛</span>
                Loading...
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} />
                Log In
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Sign Up
              </>
            )}
          </button>
          <div className="text-center mt-4 text-sm text-gray-400">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('');
                    setPassword('');
                    onSuccess();
                    setTimeout(() => {
                      onClose();
                      const signupButton = document.querySelector('[data-signup-button]');
                      if (signupButton) {
                        (signupButton as HTMLElement).click();
                      }
                    }, 100);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('');
                    setPassword('');
                    onSuccess();
                    setTimeout(() => {
                      onClose();
                      const loginButton = document.querySelector('[data-login-button]');
                      if (loginButton) {
                        (loginButton as HTMLElement).click();
                      }
                    }, 100);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}