import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import logoLight from '../assets/shaslogo.png';
import logoDark from '../assets/shaslogodark.png';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const logoSrc = isDark ? logoDark : logoLight;

  return (
    <footer className="w-full border-t border-shas-border bg-shas-bg text-shas-heading relative z-10 py-16 px-6 md:px-12 transition-colors duration-300">
      
      {/* Brand Value Pre-Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-shas-border/60 mb-12 font-sans">
        <div className="flex gap-4 items-start">
          <Truck className="w-5 h-5 text-shas-brand mt-0.5" />
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-shas-heading">Complimentary Shipping</h4>
            <p className="text-xxs text-shas-secondary mt-1">Enjoy free secure shipping on all domestic orders over $150.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <RefreshCw className="w-5 h-5 text-shas-brand mt-0.5" />
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-shas-heading">Signature Returns</h4>
            <p className="text-xxs text-shas-secondary mt-1">30-day trial period. Free return shipping labels provided.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <ShieldCheck className="w-5 h-5 text-shas-brand mt-0.5" />
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-shas-heading">Material Guarantee</h4>
            <p className="text-xxs text-shas-secondary mt-1">Lifetime warranty covering craftsmanship and stone settings.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <ShoppingBag className="w-5 h-5 text-shas-brand mt-0.5" />
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-shas-heading">Linen Kept Box</h4>
            <p className="text-xxs text-shas-secondary mt-1">Arrives packaged in our custom recyclable signature linen box.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4 text-left">
          <Link to="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-90">
            <img src={logoSrc} alt="SHAS Logo" className="h-16 md:h-20 w-auto object-contain" />
          </Link>
          <p className="text-shas-secondary text-xs leading-relaxed max-w-sm font-sans">
            At SHAS, we believe that luxury isn't about excess; it's about the beauty of intention. Every piece is sustainably sourced, hand-crafted, and packaged to celebrate your unique narrative.
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            {/* Social Icons with elegant borders */}
            <a 
              href="#" 
              className="w-9 h-9 rounded-full border border-shas-border flex items-center justify-center text-shas-secondary hover:text-shas-brand hover:border-shas-brand transition-all duration-300"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" className="w-4 h-4">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full border border-shas-border flex items-center justify-center text-shas-secondary hover:text-shas-brand hover:border-shas-brand transition-all duration-300"
              title="Pinterest"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" className="w-4 h-4">
                <path d="M8 22a9 9 0 0 1-2.2-6.2c0-3.6 2.3-7.5 6.2-7.5s6.2 3.1 6.2 6.5c0 3.7-2 6.5-4.8 6.5s-2.8-2-1.3-4.5l1.1-2.9c.7-1.7-.1-3.6-2-3.6-2.2 0-3.8 2.3-3.8 5.2 0 1.8.6 3.1.6 3.1l-1.3 5.4A9.1 9.1 0 0 1 8 22z" />
              </svg>
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full border border-shas-border flex items-center justify-center text-shas-secondary hover:text-shas-brand hover:border-shas-brand transition-all duration-300"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" className="w-4 h-4">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="space-y-4 text-left">
          <h4 className="font-sans font-semibold text-xs uppercase tracking-widest text-shas-heading">Catalog</h4>
          <ul className="space-y-2 font-sans text-xs">
            <li>
              <Link to="/collections" className="text-shas-secondary hover:text-shas-brand transition-colors">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/necklaces" className="text-shas-secondary hover:text-shas-brand transition-colors">
                Necklaces
              </Link>
            </li>
            <li>
              <Link to="/earrings" className="text-shas-secondary hover:text-shas-brand transition-colors">
                Earrings
              </Link>
            </li>
            <li>
              <Link to="/rings" className="text-shas-secondary hover:text-shas-brand transition-colors">
                Rings
              </Link>
            </li>
            <li>
              <Link to="/gifts" className="text-shas-secondary hover:text-shas-brand transition-colors">
                Gifts Selection
              </Link>
            </li>
            <li>
              <Link to="/journal" className="text-shas-secondary hover:text-shas-brand transition-colors">
                The Journal
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support Info Column */}
        <div className="space-y-4 text-left">
          <h4 className="font-sans font-semibold text-xs uppercase tracking-widest text-shas-heading">The Atelier</h4>
          <ul className="space-y-3 font-sans text-xs text-shas-secondary">
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-shas-brand" />
              <span>atelier@shasjewelry.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-shas-brand" />
              <span>+1 (800) 555-SHAS</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-shas-brand flex-shrink-0" />
              <span>120 Mercer St, Soho<br />New York, NY 10012</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright bar */}
      <div className="max-w-7xl mx-auto border-t border-shas-border/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[10px] text-shas-secondary">
        <p>© {currentYear} SHAS Jewelry. Designed with Intention. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-shas-brand fill-shas-brand animate-pulse" /> for the modern romantic.
        </p>
      </div>
    </footer>
  );
}
