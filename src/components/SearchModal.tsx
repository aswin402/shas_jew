import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = ['Pearl', 'Necklace', 'Rings', 'Vermeil', 'Aurelia', 'Gold'];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset query on close in render phase
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setQuery('');
    }
  }

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter products based on search query
  const filteredProducts = query.trim() === '' 
    ? [] 
    : PRODUCTS.filter((product) => {
        const titleMatch = product.title.toLowerCase().includes(query.toLowerCase());
        const materialMatch = product.material.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = product.category.toLowerCase().includes(query.toLowerCase());
        return titleMatch || materialMatch || categoryMatch;
      });

  const handleResultClick = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Search Box Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-shas-bg border-b border-shas-border shadow-2xl py-8 px-6 md:px-12"
            role="dialog"
            aria-modal="true"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Top row: search bar input and close */}
              <div className="flex items-center justify-between gap-4 border-b border-shas-border pb-3">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-shas-brand" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search collections, gold vermeil, baroque pearls..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent text-shas-heading focus:outline-none placeholder:text-shas-secondary/40 text-sm md:text-base font-sans"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-shas-secondary hover:text-shas-heading transition-colors"
                  title="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="text-left font-sans">
                {query.trim() === '' ? (
                  /* Trending Suggestions */
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-shas-secondary flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-shas-accent animate-pulse" /> Trending Searches
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3.5 py-1.5 border border-shas-border/60 hover:border-shas-brand hover:text-shas-brand transition-colors text-xs font-medium text-shas-secondary cursor-pointer bg-shas-bg/50"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Search Results list */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-shas-border/30 pb-2">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-shas-secondary">
                        Search Results ({filteredProducts.length})
                      </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <p className="text-xs text-shas-secondary italic py-6 text-center">
                        No creations found matching "{query}". Try searching for "pearl" or "necklace".
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleResultClick(product.id)}
                            className="flex items-center gap-4 p-3 border border-shas-border/40 hover:border-shas-brand hover:shadow-sm transition-all cursor-pointer group bg-shas-bg"
                          >
                            <div className="w-12 h-12 bg-stone-50 border border-shas-border/40 overflow-hidden flex-shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-sm font-semibold text-shas-heading leading-tight truncate group-hover:text-shas-brand transition-colors">
                                {product.title}
                              </h4>
                              <p className="text-[10px] text-shas-secondary truncate mt-0.5">
                                {product.material} • {product.category}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0 flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-shas-brand">
                                ${product.price.toFixed(2)}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-shas-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
