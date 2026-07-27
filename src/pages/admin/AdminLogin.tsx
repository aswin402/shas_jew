import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Invalid credentials. Access denied.');
        setIsLoading(false);
        return;
      }

      if (data.session?.user) {
        const userEmail = data.session.user.email || email;
        const userName =
          data.session.user.user_metadata?.full_name ||
          userEmail.split('@')[0].toUpperCase();

        setUser({
          name: userName,
          email: userEmail,
        });

        navigate('/admin-dashboard');
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-900/10 via-slate-900/40 to-yellow-900/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Floating Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 flex items-center gap-3"
      >
        <Link to="/" className="group flex items-center gap-2 text-xs tracking-widest text-slate-400 hover:text-amber-400 transition-colors uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
          Back to Main Store
        </Link>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-slate-900/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Top Metallic Glow Edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 via-slate-800 to-amber-900/30 border border-amber-500/40 text-amber-400 shadow-inner mb-4"
          >
            <Sparkles className="w-7 h-7" />
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl font-serif tracking-wider text-slate-100 uppercase">
            Shas <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 font-sans font-light">Jewelry</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-400/80 font-medium mt-1">
            Admin Authentication Portal
          </p>
        </div>

        {/* Error Notification Alert */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-start gap-3 p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-sm backdrop-blur-md">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs leading-relaxed">{errorMessage}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Floating Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4 text-amber-400/70" />
            </div>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
              className="peer w-full pl-10 pr-4 pt-5 pb-2 text-sm bg-slate-950/60 text-slate-100 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all duration-200"
            />
            <label
              htmlFor="admin-email"
              className="absolute left-10 top-3.5 text-slate-400 text-xs transition-all duration-200 pointer-events-none origin-[0] 
                peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 
                peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-amber-400 
                peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-amber-400"
            >
              Administrator Email
            </label>
          </div>

          {/* Password Floating Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4 text-amber-400/70" />
            </div>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              className="peer w-full pl-10 pr-11 pt-5 pb-2 text-sm bg-slate-950/60 text-slate-100 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all duration-200"
            />
            <label
              htmlFor="admin-password"
              className="absolute left-10 top-3.5 text-slate-400 text-xs transition-all duration-200 pointer-events-none origin-[0] 
                peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 
                peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-amber-400 
                peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-amber-400"
            >
              Security Key / Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="relative w-full py-3.5 px-6 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Authenticating...
              </span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-500/60" />
            Protected by Supabase Encrypted Session Security
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
