import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  LogOut,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Store,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

export const AdminLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    let isMounted = true;

    // Check current auth session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        setIsAuthenticated(true);
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Admin',
          email: session.user.email || '',
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setIsAuthenticated(true);
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Admin',
          email: session.user.email || '',
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/admin-dashboard/login', { replace: true });
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  // 1. Loading State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-400 rounded-full mb-4"
        />
        <p className="text-xs uppercase tracking-widest text-amber-400/80 animate-pulse">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State -> Declarative redirect
  if (!isAuthenticated) {
    return <Navigate to="/admin-dashboard/login" replace />;
  }

  const navItems = [
    { label: 'Overview', path: '/admin-dashboard', icon: LayoutDashboard, end: true },
    { label: 'Products', path: '/admin-dashboard/products', icon: Package, end: false },
    { label: 'Categories', path: '/admin-dashboard/categories', icon: FolderTree, end: false },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Subtle Accent Gradients */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-slate-900/40 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile Header Bar */}
      <header className="lg:hidden z-30 sticky top-0 bg-slate-900/90 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-serif text-sm tracking-wider uppercase">
            Shas <span className="text-amber-400 font-sans">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Desktop & Mobile Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900/90 backdrop-blur-2xl border-r border-amber-500/20 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-slate-800 to-amber-900/40 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif text-base tracking-wider uppercase text-slate-100">
                  Shas <span className="text-amber-400 font-sans font-light">Jewelry</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Admin Console
                </div>
              </div>
            </div>
          </div>

          {/* User Badge Info */}
          <div className="mx-4 my-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@shasjewels.com'}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = item.end
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group relative flex items-center justify-between px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-900/10 text-amber-300 border border-amber-500/30 shadow-[0_2px_12px_rgba(245,158,11,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <NavLink
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors uppercase tracking-wider"
          >
            <Store className="w-4 h-4 text-slate-400" />
            <span>View Live Store</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Admin Content View Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
