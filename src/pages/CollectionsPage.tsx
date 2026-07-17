import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, X, Star } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

export function CollectionsPage() {
  const { addItem } = useCartStore();
  const location = useLocation();
  
  // Resolve category filter on path changes helper
  const getCategoryFromPath = (path: string) => {
    if (path.includes('necklaces')) return 'Necklaces';
    if (path.includes('earrings')) return 'Earrings';
    if (path.includes('rings')) return 'Rings';
    if (path.includes('gifts')) return 'Gifts';
    return 'All';
  };

  // Sort & filter states
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => getCategoryFromPath(location.pathname));
  const [selectedSort, setSelectedSort] = useState<string>('Featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync category state if the router path changes
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setSelectedCategory(getCategoryFromPath(location.pathname));
  }

  // Categories list
  const categories = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Gifts'];

  // Handle filtering
  const filteredProducts = PRODUCTS.filter((product) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Gifts') {
      // Gifts category returns items under $100
      return product.price < 100;
    }
    return product.category === selectedCategory;
  });

  // Handle sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'Price: Low to High') return a.price - b.price;
    if (selectedSort === 'Price: High to Low') return b.price - a.price;
    if (selectedSort === 'Rating') return b.rating - a.rating;
    return 0; // Featured (Default order)
  });

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
                onClick={() => setSelectedCategory(cat)}
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
                <div className="relative aspect-square w-full overflow-hidden bg-stone-50 border border-shas-border/40 p-2 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(product);
                      }}
                      className="w-full py-3 bg-shas-burgundy text-shas-bg border border-shas-burgundy hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all font-sans text-[10px] tracking-widest uppercase font-bold shadow-md translate-y-3 group-hover:translate-y-0 duration-350 ease-out dark:hover:bg-shas-cream dark:hover:text-shas-charcoal dark:hover:border-shas-brand"
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
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-[9px] uppercase tracking-widest font-bold text-shas-heading hover:text-shas-brand transition-colors flex items-center gap-1 font-sans cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Detailed Product Drawer Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 cursor-pointer"
            />

            {/* Side Drawer content panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-shas-bg border-l border-shas-border p-8 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl text-left"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-shas-brand dark:text-primary">
                    {selectedProduct.category}
                  </span>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-1 rounded-full hover:bg-shas-border/30 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-shas-heading" />
                  </button>
                </div>

                {/* Product Image */}
                <div className="aspect-square w-full overflow-hidden bg-stone-50 border border-shas-border shadow-sm p-2">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Price */}
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-medium tracking-wide">
                    {selectedProduct.title}
                  </h2>
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg font-semibold text-shas-brand dark:text-primary">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-shas-accent">
                      <Star className="w-3.5 h-3.5 fill-shas-accent text-shas-accent" />
                      <span className="font-bold text-shas-heading">{selectedProduct.rating}</span>
                      <span className="text-shas-secondary ml-1">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <hr className="border-shas-border/40" />

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-shas-secondary font-sans">
                    The Narrative
                  </h4>
                  <p className="text-xs md:text-sm text-shas-secondary leading-relaxed font-sans">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-shas-secondary font-sans">
                    Specifications
                  </h4>
                  <ul className="text-xs space-y-1.5 text-shas-secondary font-sans">
                    <li className="flex justify-between border-b border-shas-border/20 pb-1">
                      <span className="font-medium">Materiality:</span>
                      <span>{selectedProduct.material}</span>
                    </li>
                    <li className="flex justify-between border-b border-shas-border/20 pb-1">
                      <span className="font-medium">Collection:</span>
                      <span>Designed by Deepa Sakthi</span>
                    </li>
                    <li className="flex justify-between border-b border-shas-border/20 pb-1">
                      <span className="font-medium">Origin:</span>
                      <span>Meticulously Crafted • Erode Store</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Add to Bag CTA */}
              <div className="pt-6 mt-8 border-t border-shas-border/40 space-y-3">
                <button
                  onClick={() => {
                    addItem(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-4 bg-shas-burgundy text-shas-bg border border-shas-burgundy hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all font-sans text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 shadow-md dark:hover:bg-shas-cream dark:hover:text-shas-charcoal dark:hover:border-shas-brand cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>
                <p className="text-center text-[9px] text-shas-secondary font-sans italic">
                  Arrives in custom recyclable velvet-lined signature linen gift box.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
