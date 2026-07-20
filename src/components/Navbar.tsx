import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
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
  const location = useLocation();
  const cartCount = getCartCount();

  const { theme } = useThemeStore();
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const logoSrc = isDark ? logoDark : logoLight;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Necklaces', path: '/necklaces' },
    { label: 'Earrings', path: '/earrings' },
    { label: 'Rings', path: '/rings' },
    { label: 'Bracelets', path: '/bracelets' },
    { label: 'Gifts', path: '/gifts' },
    { label: 'Journal', path: '/journal' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Contact Us', path: '/contact-us' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-shas-border bg-background/95 backdrop-blur-md z-40 flex items-center justify-between px-6 md:px-12 transition-colors duration-300">
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
            className="transition-opacity hover:opacity-90 flex items-center"
          >
            <img src={logoSrc} alt="SHAS Logo" className="h-12 md:h-14 w-auto object-contain" />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-5 xl:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-[10px] xl:text-xs uppercase tracking-widest font-sans font-medium transition-colors duration-350 relative py-2 group ${
                isActive(link.path)
                  ? 'text-shas-brand dark:text-primary'
                  : 'text-shas-heading/70 hover:text-shas-brand dark:text-foreground/75 dark:hover:text-primary'
              }`}
            >
              <span>{link.label}</span>
              {/* Sliding underline hover animation */}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-shas-brand dark:bg-primary origin-left transition-transform duration-350 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
          ))}
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
        <div className="fixed inset-0 top-20 z-30 bg-shas-bg/98 dark:bg-card/98 backdrop-blur-md flex flex-col p-8 space-y-6 md:hidden animate-fade-in border-b border-shas-border">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-widest font-sans font-semibold py-2 border-b border-shas-border/40 ${
                  isActive(link.path)
                    ? 'text-shas-brand dark:text-primary font-bold'
                    : 'text-shas-heading dark:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t border-shas-border flex flex-col gap-4">
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
