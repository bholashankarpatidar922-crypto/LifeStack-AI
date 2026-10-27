import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useStore();
  const [email, setEmail] = useState('demo@lifestack.ai');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      setAuth(res.access_token, {
        user_id: res.user_id,
        email: res.email,
        full_name: res.full_name,
        role: res.role
      });
      navigate('/');
    } catch (err: any) {
      setError('Invalid email or password. You can also click "Use Demo Credentials" below.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.googleAuth('demo@lifestack.ai', 'Aarav Sharma');
      setAuth(res.access_token, {
        user_id: res.user_id,
        email: res.email,
        full_name: res.full_name,
        role: res.role
      });
      navigate('/');
    } catch (e) {
      setError('Google OAuth failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-6">
      <DisclaimerBanner compact={true} />

      <div className="glass-panel p-8 rounded-3xl glow-card space-y-6 border border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-2">
          <img src="/logo.svg" alt="LifeStack Logo" className="w-12 h-12 mx-auto" />
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Welcome to LifeStack
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your personal decision intelligence dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-submit-login"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow-indigo transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Or Quick Access
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <div className="space-y-2">
          {/* Mock Google OAuth button */}
          <button
            id="btn-google-oauth"
            type="button"
            onClick={handleMockGoogleLogin}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick fill demo credentials */}
          <button
            type="button"
            onClick={() => {
              setEmail('demo@lifestack.ai');
              setPassword('Password123!');
            }}
            className="w-full py-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Pre-Loaded Demo Credentials (Aarav Sharma)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
