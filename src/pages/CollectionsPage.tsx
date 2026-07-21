import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

const CATEGORY_STYLES: Record<string, {
  tagline: string;
  description: string;
  bannerClass: string;
  bgGlow: string;
  accentText: string;
  title: string;
}> = {
  All: {
    tagline: "Timeless Luxury Collection",
    description: "Designed for the modern romantic and crafted meticulously to celebrate the beauty of intention.",
    bannerClass: "border-shas-border bg-shas-border/10",
    bgGlow: "bg-shas-brand/5",
    accentText: "text-shas-brand",
    title: "Discover Our Creations"
  },
  Necklaces: {
    tagline: "Adornments for the Collar",
    description: "Handcrafted 14k gold chains, statement pendants, and uniform freshwater pearls designed to catch early morning light.",
    bannerClass: "border-shas-brand/30 bg-shas-brand/[0.02]",
    bgGlow: "bg-shas-brand/10",
    accentText: "text-shas-brand",
    title: "Necklaces"
  },
  Earrings: {
    tagline: "Sculptural Facial Accents",
    description: "Delicate soleil studs and organic handpicked baroque pearls suspended from textured, hand-hammered hoops.",
    bannerClass: "border-shas-accent/30 bg-shas-accent/[0.02]",
    bgGlow: "bg-shas-accent/10",
    accentText: "text-shas-accent",
    title: "Earrings"
  },
  Rings: {
    tagline: "Treasures for the Hand",
    description: "Twisted gold rope bands, organic pearl crowns, and topaz stacking sets handcrafted to tell your daily narrative.",
    bannerClass: "border-shas-secondary/35 bg-shas-secondary/[0.03]",
    bgGlow: "bg-shas-secondary/15",
    accentText: "text-shas-secondary",
    title: "Rings"
  },
  Bracelets: {
    tagline: "Elegance in Motion",
    description: "Minimalist link chains and open ripple cuffs evoking organic waves, reflecting luster with every gesture.",
    bannerClass: "border-shas-burgundy/25 bg-shas-burgundy/[0.01]",
    bgGlow: "bg-shas-burgundy/5",
    accentText: "text-shas-burgundy",
    title: "Bracelets"
  },
  Gifts: {
    tagline: "Mindful Offerings Under $100",
    description: "Curated essential keepsakes packaged in our signature velvet-lined linen boxes, perfect for celebrating special moments.",
    bannerClass: "border-stone-300 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/20",
    bgGlow: "bg-stone-500/5",
    accentText: "text-stone-600 dark:text-stone-400",
    title: "Gifts Selection"
  }
};

export function CollectionsPage() {
  const { addItem } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Resolve category filter on path changes helper
  const getCategoryFromPath = (path: string) => {
    const lowercase = path.toLowerCase();
    if (lowercase.includes('necklaces')) return 'Necklaces';
    if (lowercase.includes('earrings')) return 'Earrings';
    if (lowercase.includes('rings')) return 'Rings';
    if (lowercase.includes('bracelets')) return 'Bracelets';
    if (lowercase.includes('gifts')) return 'Gifts';
    return 'All';
  };

  const selectedCategory = getCategoryFromPath(location.pathname);
  const style = CATEGORY_STYLES[selectedCategory] || CATEGORY_STYLES.All;

  // Sort & modal states
  const [selectedSort, setSelectedSort] = useState<string>('Featured');

  // Categories list
  const categories = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Gifts'];

  // Handle filtering & sorting (Memoized)
  const sortedProducts = useMemo(() => {
    const filtered = PRODUCTS.filter((product) => {
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Gifts') {
        // Gifts category returns items under $100
        return product.price < 100;
      }
      return product.category === selectedCategory;
    });

    return [...filtered].sort((a, b) => {
      if (selectedSort === 'Price: Low to High') return a.price - b.price;
      if (selectedSort === 'Price: High to Low') return b.price - a.price;
      if (selectedSort === 'Rating') return b.rating - a.rating;
      return 0; // Featured (Default order)
    });
  }, [selectedCategory, selectedSort]);

  return (
    <main className="pt-24 min-h-screen bg-shas-bg text-shas-heading transition-colors duration-300 relative">
      {/* Background dynamic glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-500 ${style.bgGlow}`} />

      {/* Editorial Hero Header */}
      <section className="py-6 px-6 md:px-12 max-w-7xl mx-auto">
        <div className={`border p-8 md:p-12 text-center space-y-4 shadow-sm transition-all duration-500 ${style.bannerClass}`}>
          <span className={`text-[10px] uppercase tracking-[0.25em] font-semibold font-sans transition-colors duration-500 ${style.accentText}`}>
            {style.tagline}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide">
            {style.title}
          </h1>
          <p className="max-w-xl mx-auto text-xs md:text-sm text-shas-secondary font-sans leading-relaxed">
            {style.description}
          </p>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <section className="border-t border-b border-shas-border bg-shas-bg/50 backdrop-blur-md sticky top-20 z-20 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between font-sans">
          
          {/* Category tabs - Only show on main Collections page */}
          {selectedCategory === 'All' ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(cat === 'All' ? '/collections' : '/' + cat.toLowerCase())}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-shas-burgundy border-shas-burgundy text-shas-bg dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg'
                      : 'border-shas-border/60 hover:border-shas-brand text-shas-secondary hover:text-shas-heading'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            /* On specific category pages, display a back to collections link */
            <div className="text-[10px] uppercase tracking-widest font-semibold text-shas-secondary">
              <Link to="/collections" className="hover:text-shas-brand transition-colors flex items-center gap-1.5">
                ← View All Collections
              </Link>
            </div>
          )}

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-shas-secondary font-medium">Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent border border-shas-border/60 px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Featured">Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Rating">Top Rated</option>
            </select>
          </div>
        </div>
      </section>      {/* Grid display */}
      <section className="py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${selectedSort}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col h-full bg-transparent border border-shas-border/40 p-4 hover:shadow-md transition-all duration-300 relative text-left"
                >
                  {/* Category Flag badge */}
                  <span className="absolute top-6 left-6 z-10 bg-shas-bg/95 border border-shas-border/60 text-shas-secondary text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 shadow-sm font-sans">
                    {product.category}
                  </span>

                  {/* Image container & overlay */}
                  <div 
                    className="relative aspect-square w-full overflow-hidden bg-stone-50 border border-shas-border/40 p-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-shas-brand" 
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem(product);
                        }}
                        className="w-full py-3 bg-shas-burgundy text-shas-bg border border-shas-burgundy hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all font-sans text-[10px] tracking-widest uppercase font-bold shadow-md translate-y-3 group-hover:translate-y-0 group-focus-within:translate-y-0 duration-350 ease-out dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg dark:hover:bg-shas-bg dark:hover:border-shas-brand dark:hover:text-shas-cream"
                      >
                        Quick Add to Bag
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="mt-4 flex-1 flex flex-col justify-between text-left space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[9px] text-shas-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-shas-accent text-shas-accent'
                                : 'text-shas-border'
                            }`}
                          />
                        ))}
                        <span className="text-shas-secondary ml-1">({product.reviews})</span>
                      </div>
                      <h3 className="font-serif text-sm font-medium text-shas-heading dark:text-foreground">
                        {product.title}
                      </h3>
                      <p className="text-[10px] text-shas-secondary font-sans font-normal italic leading-tight">
                        {product.material}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-shas-border/30">
                      <span className="font-serif text-sm font-semibold text-shas-brand dark:text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-[9px] uppercase tracking-widest font-bold text-shas-heading hover:text-shas-brand transition-colors flex items-center gap-1 font-sans cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

    </main>
  );
}
