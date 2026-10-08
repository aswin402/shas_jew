import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ChevronDown, Check } from 'lucide-react';
import { PRODUCTS, getProductImage } from '@/data/products';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types/product';
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
  Kadas: {
    tagline: "Royal Heritage Temple Kadas",
    description: "Solid 22k antique gold kadas, intricate nakshi repoussé work, screw clasps, and royal filigree crafted by master jewelers.",
    bannerClass: "border-amber-700/30 bg-amber-700/[0.02]",
    bgGlow: "bg-amber-600/10",
    accentText: "text-amber-800 dark:text-amber-400",
    title: "Kadas Collection"
  },
  Bangles: {
    tagline: "Handcrafted Heirloom Bangles",
    description: "Sets of 2, 4, and 6 daily wear and bridal gold bangles finished with timeless floral, geometric, and embossed motifs.",
    bannerClass: "border-shas-gold/30 bg-shas-gold/[0.02]",
    bgGlow: "bg-shas-gold/10",
    accentText: "text-shas-gold",
    title: "Bangles Collection"
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

const SORT_OPTIONS = [
  { value: 'Featured', label: 'Featured' },
  { value: 'Price: Low to High', label: 'Price: Low to High' },
  { value: 'Price: High to Low', label: 'Price: High to Low' },
  { value: 'Rating', label: 'Top Rated' },
];

export function CollectionsPage() {
  const { addItem } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for dynamic products & categories from Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'All', 'Necklaces', 'Kadas', 'Bangles', 'Bracelets', 'Earrings', 'Rings', 'Gifts'
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayCount, setDisplayCount] = useState<number>(24);

  // Fetch products and categories from Supabase
  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured) {
        setProducts(PRODUCTS);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('*')
        ]);

        if (productsRes.data && productsRes.data.length > 0) {
          const mappedProducts: Product[] = productsRes.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            price: Number(row.price),
            imageUrl: row.image_url || row.imageUrl || getProductImage(row.id),
            category: row.category_name || row.category || 'Necklaces',
            material: row.material || '',
            rating: Number(row.rating ?? 5.0),
            reviews: Number(row.reviews ?? 0),
            description: row.description || '',
            stock: row.stock ?? 0,
            tagNo: row.tag_no || row.tagNo,
            grossWeight: row.gross_weight || row.grossWeight,
            netWeight: row.net_weight || row.netWeight,
          }));
          setProducts(mappedProducts);
        } else {
          setProducts(PRODUCTS);
        }

        if (categoriesRes.data && categoriesRes.data.length > 0) {
          const fetchedCatNames = categoriesRes.data.map((c: any) => c.name);
          const uniqueCats = Array.from(new Set(['All', ...fetchedCatNames, 'Necklaces', 'Kadas', 'Bangles', 'Bracelets', 'Earrings', 'Rings', 'Gifts']));
          setCategories(uniqueCats);
        }
      } catch (err) {
        console.error('Error fetching collections data from Supabase:', err);
        setProducts(PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Resolve category filter from path or search query param
  const getCategoryFromLocation = (pathname: string, search: string) => {
    const params = new URLSearchParams(search);
    const catParam = params.get('category');
    if (catParam) {
      const match = ['Necklaces', 'Kadas', 'Bangles', 'Bracelets', 'Earrings', 'Rings', 'Gifts'].find(
        (c) => c.toLowerCase() === catParam.toLowerCase()
      );
      if (match) return match;
    }
    const lowercase = pathname.toLowerCase();
    if (lowercase.includes('necklaces')) return 'Necklaces';
    if (lowercase.includes('kadas')) return 'Kadas';
    if (lowercase.includes('bangles')) return 'Bangles';
    if (lowercase.includes('earrings')) return 'Earrings';
    if (lowercase.includes('rings')) return 'Rings';
    if (lowercase.includes('bracelets')) return 'Bracelets';
    if (lowercase.includes('gifts')) return 'Gifts';
    return 'All';
  };

  const selectedCategory = getCategoryFromLocation(location.pathname, location.search);
  const style = CATEGORY_STYLES[selectedCategory] || CATEGORY_STYLES.All;

  // Sort & custom dropdown states
  const [selectedSort, setSelectedSort] = useState<string>('Featured');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const mobileSortMenuRef = useRef<HTMLDivElement>(null);
  const desktopSortMenuRef = useRef<HTMLDivElement>(null);

  // Close custom dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(target)) {
        setIsCategoryMenuOpen(false);
      }
      const isInsideMobileSort = mobileSortMenuRef.current?.contains(target);
      const isInsideDesktopSort = desktopSortMenuRef.current?.contains(target);
      if (!isInsideMobileSort && !isInsideDesktopSort) {
        setIsSortMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryMenuOpen(false);
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Reset pagination displayCount when category or sort changes
  useEffect(() => {
    setDisplayCount(24);
  }, [selectedCategory, selectedSort]);

  // Handle filtering & sorting (Memoized)
  const sortedProducts = useMemo(() => {
    const sourceProducts = products.length > 0 ? products : PRODUCTS;
    const filtered = sourceProducts.filter((product) => {
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
  }, [products, selectedCategory, selectedSort]);

  // Paginated visible products for butter-smooth rendering
  const visibleProducts = useMemo(() => {
    return sortedProducts.slice(0, displayCount);
  }, [sortedProducts, displayCount]);

  return (
    <main className="pt-24 min-h-screen bg-shas-bg text-shas-heading transition-colors duration-300 relative">
      {/* Background dynamic glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-500 ${style.bgGlow}`} />

      {/* Filter & Sort Bar - Flush beneath navbar with zero gap */}
      <section className="border-b border-shas-border bg-shas-bg/95 dark:bg-background/95 backdrop-blur-md sticky top-24 z-20 px-4 md:px-12 py-2.5 md:py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between font-sans">
          
          {/* Mobile Filter & Sort (md:hidden): Custom theme-styled single-row dropdowns */}
          <div className="flex md:hidden items-center gap-2.5 w-full">
            {/* Custom Category Dropdown */}
            <div ref={categoryMenuRef} className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryMenuOpen((prev) => !prev);
                  setIsSortMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between bg-shas-bg dark:bg-card border py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-shas-heading focus:outline-none transition-all cursor-pointer rounded-none shadow-xs ${
                  isCategoryMenuOpen ? 'border-shas-burgundy ring-1 ring-shas-burgundy/30' : 'border-shas-border hover:border-shas-brand'
                }`}
                aria-haspopup="listbox"
                aria-expanded={isCategoryMenuOpen}
              >
                <span className="truncate">
                  {selectedCategory === 'All' ? 'Collection: All' : `Collection: ${selectedCategory}`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-shas-secondary transition-transform duration-200 ml-1.5 flex-shrink-0 ${isCategoryMenuOpen ? 'rotate-180 text-shas-burgundy' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1.5 bg-shas-bg dark:bg-card border border-shas-border shadow-2xl z-50 py-1.5 max-h-80 overflow-y-auto no-scrollbar dropdown-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    role="listbox"
                  >
                    {categories.map((cat) => {
                      const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setIsCategoryMenuOpen(false);
                            navigate(cat === 'All' ? '/collections' : '/' + cat.toLowerCase());
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-[10px] uppercase tracking-wider font-semibold text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-shas-burgundy text-white font-bold'
                              : 'text-shas-heading hover:bg-shas-burgundy/10 hover:text-shas-burgundy dark:hover:bg-shas-burgundy/20'
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <span>{cat === 'All' ? 'All Collections' : cat}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Sort Dropdown */}
            <div ref={mobileSortMenuRef} className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  setIsSortMenuOpen((prev) => !prev);
                  setIsCategoryMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between bg-shas-bg dark:bg-card border py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-shas-heading focus:outline-none transition-all cursor-pointer rounded-none shadow-xs ${
                  isSortMenuOpen ? 'border-shas-burgundy ring-1 ring-shas-burgundy/30' : 'border-shas-border hover:border-shas-brand'
                }`}
                aria-haspopup="listbox"
                aria-expanded={isSortMenuOpen}
              >
                <span className="truncate">
                  Sort: {SORT_OPTIONS.find((s) => s.value === selectedSort)?.label || selectedSort}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-shas-secondary transition-transform duration-200 ml-1.5 flex-shrink-0 ${isSortMenuOpen ? 'rotate-180 text-shas-burgundy' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1.5 bg-shas-bg dark:bg-card border border-shas-border shadow-2xl z-50 py-1.5 overflow-hidden"
                    role="listbox"
                  >
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = selectedSort === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedSort(opt.value);
                            setIsSortMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-[10px] uppercase tracking-wider font-semibold text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-shas-burgundy text-white font-bold'
                              : 'text-shas-heading hover:bg-shas-burgundy/10 hover:text-shas-burgundy dark:hover:bg-shas-burgundy/20'
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Filter & Sort (hidden md:flex) */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(cat === 'All' ? '/collections' : '/' + cat.toLowerCase())}
                  className={`px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-semibold border transition-all duration-300 cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-shas-burgundy border-shas-burgundy text-white hover:bg-shas-gold hover:text-black hover:border-shas-gold shadow-sm'
                      : 'border-shas-border/60 hover:border-shas-gold text-shas-secondary hover:text-shas-burgundy'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Desktop Custom Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-shas-secondary font-medium">Sort By:</span>
              <div ref={desktopSortMenuRef} className="relative min-w-[170px]">
                <button
                  type="button"
                  onClick={() => setIsSortMenuOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between bg-shas-bg dark:bg-card border px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-shas-heading focus:outline-none transition-all cursor-pointer shadow-xs ${
                    isSortMenuOpen ? 'border-shas-burgundy ring-1 ring-shas-burgundy/30' : 'border-shas-border/60 hover:border-shas-brand'
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={isSortMenuOpen}
                >
                  <span>{SORT_OPTIONS.find((s) => s.value === selectedSort)?.label || selectedSort}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-shas-secondary transition-transform duration-200 ml-2 ${isSortMenuOpen ? 'rotate-180 text-shas-burgundy' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1.5 w-48 bg-shas-bg dark:bg-card border border-shas-border shadow-2xl z-50 py-1.5"
                      role="listbox"
                    >
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = selectedSort === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSelectedSort(opt.value);
                              setIsSortMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2 text-[10px] uppercase tracking-wider font-semibold text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-shas-burgundy text-white font-bold'
                                : 'text-shas-heading hover:bg-shas-burgundy/10 hover:text-shas-burgundy dark:hover:bg-shas-burgundy/20'
                            }`}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Grid display */}
      <section className="py-6 md:py-16 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse border border-shas-border/40 p-4 space-y-4">
                  <div className="aspect-square bg-stone-200 dark:bg-stone-800 w-full" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 w-3/4" />
                  <div className="h-3 bg-stone-200 dark:bg-stone-800 w-1/2" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${selectedSort}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              >
              {visibleProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col h-full bg-transparent border border-[#ECE3DA] hover:border-[#AE0B36] p-4 hover:shadow-sm transition-all duration-300 relative text-left"
                  >
                    {/* Category Flag badge */}
                    <span className="absolute top-6 left-6 z-10 bg-shas-burgundy text-white hover:bg-shas-gold hover:text-black transition-colors duration-300 text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 shadow-sm font-sans">
                      {product.category}
                    </span>

                    {/* Image container & overlay */}
                    <div 
                      className="relative aspect-square w-full overflow-hidden bg-stone-50 border border-shas-border/40 p-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-shas-burgundy" 
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Quick Add Overlay */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem(product);
                          }}
                          className="w-full py-3 bg-shas-burgundy text-white border border-shas-burgundy hover:bg-shas-burgundy-hover hover:border-shas-burgundy-hover transition-all font-sans text-[10px] tracking-widest uppercase font-bold shadow-md translate-y-3 group-hover:translate-y-0 group-focus-within:translate-y-0 duration-350 ease-out dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg dark:hover:bg-shas-bg dark:hover:border-shas-brand dark:hover:text-shas-cream"
                        >
                          Quick Add to Bag
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="mt-4 flex-1 flex flex-col justify-between text-left space-y-2 font-sans">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[9px] text-shas-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-shas-gold text-shas-gold'
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
                        <span className="text-sm font-semibold text-shas-burgundy font-mono">
                          ${product.price.toFixed(2)}
                        </span>
                        <Link
                          to={`/product/${product.id}`}
                          className="text-[9px] uppercase tracking-widest font-bold text-shas-heading hover:text-shas-burgundy transition-colors flex items-center gap-1 font-sans cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination / Load More Bar */}
              {displayCount < sortedProducts.length && (
                <div className="col-span-full flex flex-col items-center justify-center pt-10 pb-6 space-y-3 font-sans">
                  <span className="text-[10px] uppercase tracking-widest text-shas-secondary font-medium">
                    Showing {Math.min(displayCount, sortedProducts.length)} of {sortedProducts.length} items
                  </span>
                  <button
                    onClick={() => setDisplayCount((prev) => prev + 24)}
                    className="px-8 py-3.5 bg-shas-burgundy text-white hover:bg-shas-gold hover:text-black transition-all font-sans text-xs uppercase tracking-widest font-semibold border border-shas-burgundy shadow-sm hover:shadow-md cursor-pointer"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          )}
        </div>
      </section>

    </main>
  );
}
