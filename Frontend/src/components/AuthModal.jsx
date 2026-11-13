import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user;
      if (mode === 'login') {
        user = await loginUser({ email, password });
      } else {
        if (!name.trim()) {
          throw new Error('Name is required.');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters.');
        }
        user = await registerUser({ name: name.trim(), email, password });
      }

      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg max-w-sm w-full p-6 shadow-card relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#737373] hover:text-[#191919] rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switch */}
        <div className="flex border-b border-[#EAEAEA] mb-5">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`pb-2.5 text-[14px] font-medium border-b-2 mr-4 transition-colors ${
              mode === 'login'
                ? 'border-[#2383E2] text-[#191919]'
                : 'border-transparent text-[#737373] hover:text-[#191919]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`pb-2.5 text-[14px] font-medium border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-[#2383E2] text-[#191919]'
                : 'border-transparent text-[#737373] hover:text-[#191919]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-status-scamBg border border-status-scamBorder rounded text-[13px] text-status-scamText flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-[13px]">
          {mode === 'register' && (
            <div>
              <label className="block text-[#191919] font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#191919] font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
            />
          </div>

          <div>
            <label className="block text-[#191919] font-medium mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-subtle"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

