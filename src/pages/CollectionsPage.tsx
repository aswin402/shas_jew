import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

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
    <main className="pt-24 min-h-screen bg-shas-bg text-shas-heading transition-colors duration-300">
      {/* Editorial Hero Header */}
      <section className="py-12 md:py-20 px-6 md:px-12 text-center max-w-7xl mx-auto space-y-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-shas-brand font-semibold font-sans">
          Timeless Luxury Collection
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wide">
          {selectedCategory === 'All' ? 'Discover Our Creations' : selectedCategory}
        </h1>
        <p className="max-w-xl mx-auto text-xs md:text-sm text-shas-secondary font-sans leading-relaxed">
          Designed for the modern romantic and crafted meticulously to celebrate the beauty of intention.
        </p>
      </section>

      {/* Filter & Sort Bar */}
      <section className="border-t border-b border-shas-border bg-shas-bg/50 backdrop-blur-md sticky top-20 z-20 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between font-sans">
          {/* Category tabs */}
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
      </section>

      {/* Grid display */}
      <section className="py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col h-full bg-transparent border border-shas-border/40 p-4 hover:shadow-md transition-all duration-300 relative"
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
                    <p className="text-[10px] text-shas-secondary font-sans font-light italic leading-tight">
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
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

    </main>
  );
}
