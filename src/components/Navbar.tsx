import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { useCartStore } from '../store/useCartStore';
import { useThemeStore } from '../store/useThemeStore';
import logoLight from '../assets/shaslogo.png';
import logoDark from '../assets/shaslogodark.png';
import { SearchModal } from '@/components/SearchModal';

export function Navbar() {
  const { setCartOpen, getCartCount } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false);
  
  const location = useLocation();
  const cartCount = getCartCount();

  const { theme } = useThemeStore();
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const logoSrc = isDark ? logoDark : logoLight;

  const mainNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections', hasDropdown: true },
    { label: 'Journal', path: '/journal' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Contact Us', path: '/contact-us' },
  ];

  const collectionSubCategories = [
    { label: 'All Collections', path: '/collections', desc: 'Browse full signature catalog' },
    { label: 'Necklaces', path: '/necklaces', desc: 'Chains & freshwater pearls' },
    { label: 'Earrings', path: '/earrings', desc: 'Baroque drops & studs' },
    { label: 'Rings', path: '/rings', desc: 'Rope & stacking bands' },
    { label: 'Bracelets', path: '/bracelets', desc: 'Minimal links & cuffs' },
    { label: 'Gifts', path: '/gifts', desc: 'Offerings under $100' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-24 border-b border-shas-border bg-background/95 backdrop-blur-md z-40 flex items-center justify-between px-6 md:px-12 transition-colors duration-300">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-shas-heading dark:text-foreground focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link 
            to="/" 
            className="transition-opacity hover:opacity-90 flex items-center py-1"
          >
            <img src={logoSrc} alt="SHAS Logo" className="h-16 md:h-20 w-auto object-contain" />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 font-sans">
          {mainNavLinks.map((link) => {
            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  className="relative group py-2"
                  onMouseEnter={() => setIsCollectionsDropdownOpen(true)}
                  onMouseLeave={() => setIsCollectionsDropdownOpen(false)}
                >
                  <Link
                    to={link.path}
                    className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 flex items-center gap-1.5 py-2 ${
                      isActive('/collections') || isActive('/necklaces') || isActive('/earrings') || isActive('/rings') || isActive('/bracelets') || isActive('/gifts')
                        ? 'text-shas-brand dark:text-primary font-bold'
                        : 'text-shas-heading/80 hover:text-shas-brand dark:text-foreground/80 dark:hover:text-primary'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollectionsDropdownOpen ? 'rotate-180 text-shas-brand' : ''}`} />
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isCollectionsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-shas-bg dark:bg-card border border-shas-border shadow-2xl p-4 z-50 text-left"
                      >
                        <div className="space-y-2">
                          <span className="block text-[8px] uppercase tracking-[0.2em] font-sans font-bold text-shas-brand px-2 pb-1 border-b border-shas-border/40">
                            Jewelry Categories
                          </span>
                          <div className="space-y-0.5">
                            {collectionSubCategories.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.path}
                                onClick={() => setIsCollectionsDropdownOpen(false)}
                                className="group/sub flex flex-col p-2 hover:bg-shas-burgundy/5 dark:hover:bg-shas-brand/10 transition-colors border border-transparent hover:border-shas-border/40"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-serif text-sm font-semibold text-shas-heading group-hover/sub:text-shas-brand transition-colors">
                                    {sub.label}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-shas-brand opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all" />
                                </div>
                                <span className="text-[10px] text-shas-secondary font-sans font-normal">
                                  {sub.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                to={link.path}
                className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 relative py-2 group ${
                  isActive(link.path)
                    ? 'text-shas-brand dark:text-primary font-bold'
                    : 'text-shas-heading/80 hover:text-shas-brand dark:text-foreground/80 dark:hover:text-primary'
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-shas-brand dark:bg-primary origin-left transition-transform duration-300 ${
                    isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mock Search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="h-10 w-10 flex items-center justify-center rounded-full text-shas-heading dark:text-foreground hover:bg-shas-border/40 transition-colors focus:outline-none"
            title="Search Products"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggleButton />

          {/* Shopping Bag Trigger with Badge Count */}
          <button
            onClick={() => setCartOpen(true)}
            className="h-10 w-10 flex items-center justify-center rounded-full text-shas-heading dark:text-foreground hover:bg-shas-border/40 transition-colors relative focus:outline-none cursor-pointer"
            title="Open Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-shas-brand dark:text-primary" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-shas-accent text-shas-heading font-sans font-bold text-[9px] flex items-center justify-center border border-shas-bg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-24 z-30 bg-shas-bg/98 dark:bg-card/98 backdrop-blur-md flex flex-col p-8 space-y-6 md:hidden animate-fade-in border-b border-shas-border overflow-y-auto">
          <div className="flex flex-col space-y-3 text-left">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-sans font-bold py-2 border-b border-shas-border/40 text-shas-heading"
            >
              Home
            </Link>

            {/* Mobile Collections Expandable / Categories */}
            <div className="py-2 border-b border-shas-border/40 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-shas-brand block">
                Collections & Categories
              </span>
              <div className="pl-2 flex flex-col space-y-2">
                {collectionSubCategories.map((sub) => (
                  <Link
                    key={sub.label}
                    to={sub.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs uppercase tracking-wider font-sans font-semibold text-shas-heading hover:text-shas-brand transition-colors flex items-center justify-between py-1"
                  >
                    <span>{sub.label}</span>
                    <ArrowRight className="w-3 h-3 text-shas-secondary" />
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/journal"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-sans font-bold py-2 border-b border-shas-border/40 text-shas-heading"
            >
              Journal
            </Link>
            <Link
              to="/about-us"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-sans font-bold py-2 border-b border-shas-border/40 text-shas-heading"
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-sans font-bold py-2 border-b border-shas-border/40 text-shas-heading"
            >
              Contact Us
            </Link>
          </div>
          
          <div className="pt-4 border-t border-shas-border flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCartOpen(true);
              }}
              className="w-full py-3 bg-shas-brand text-shas-bg text-center font-sans text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag ({cartCount})</span>
            </button>
          </div>
        </div>
      )}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
