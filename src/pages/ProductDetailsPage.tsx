import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  // Find product
  const product = PRODUCTS.find((p) => p.id === id);

  // Option state (size or length)
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Scroll to top on load/change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      // Set default option matching requirements:
      // Ring Sizes: 6, 7, 8 (default 7)
      // Necklace Length: 16", 18" (default 18")
      // Standard for earrings/bracelets
      if (product.category === 'Rings') {
        setSelectedOption('7');
      } else if (product.category === 'Necklaces') {
        setSelectedOption('18"');
      } else {
        setSelectedOption('Standard');
      }
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-shas-bg text-shas-heading p-6 font-sans">
        <h2 className="font-serif text-2xl font-light mb-4">Product Not Found</h2>
        <Link to="/collections" className="text-xs uppercase tracking-widest font-semibold text-shas-brand hover:underline">
          Back to Collections
        </Link>
      </div>
    );
  }

  // Recommendations: same category products first, then fill with others up to 4 items
  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const otherCategories = PRODUCTS.filter((p) => p.category !== product.category && p.id !== product.id);
  const recommendations = [...sameCategory, ...otherCategories].slice(0, 4);

  return (
    <main className="pt-28 pb-20 min-h-screen bg-shas-bg text-shas-heading transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back Navigation Link */}
        <div className="mb-8">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-shas-secondary hover:text-shas-brand transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Collections</span>
          </Link>
        </div>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left side: High-Res Image Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 w-full flex justify-center"
          >
            <div className="relative w-full aspect-square overflow-hidden bg-stone-50 border border-shas-border shadow-md p-4">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right side: Detailed Information Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 space-y-8 text-left"
          >
            {/* Category, Stars & Title */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-shas-brand font-bold font-sans">
                {product.category} Collection
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 pt-1">
                <span className="font-serif text-2xl font-semibold text-shas-brand">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-1 text-xs text-shas-accent border-l border-shas-border/60 pl-4 font-sans">
                  <Star className="w-4 h-4 fill-shas-accent text-shas-accent" />
                  <span className="font-bold text-shas-heading">{product.rating}</span>
                  <span className="text-shas-secondary ml-1">({product.reviews} customer reviews)</span>
                </div>
              </div>
            </div>

            <hr className="border-shas-border/40" />

            {/* Narrative / Material Details */}
            <div className="space-y-4 font-sans">
              <div className="space-y-1">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-shas-secondary">Materiality</h4>
                <p className="text-xs md:text-sm text-shas-heading italic font-serif leading-relaxed">
                  {product.material}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-shas-secondary">The Story</h4>
                <p className="text-xs md:text-sm text-shas-secondary leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Interactive Sizing/Length Selector */}
            {product.category === 'Rings' && (
              <div className="space-y-3 font-sans">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-shas-secondary">Select Ring Size</h4>
                <div className="flex gap-2">
                  {['6', '7', '8'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedOption(size)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all duration-300 cursor-pointer ${
                        selectedOption === size
                          ? 'bg-shas-burgundy border-shas-burgundy text-shas-bg dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg'
                          : 'border-shas-border/60 hover:border-shas-brand text-shas-secondary'
                      }`}
                    >
                      Size {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.category === 'Necklaces' && (
              <div className="space-y-3 font-sans">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-shas-secondary">Select Necklace Length</h4>
                <div className="flex gap-2">
                  {['16"', '18"'].map((length) => (
                    <button
                      key={length}
                      onClick={() => setSelectedOption(length)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all duration-300 cursor-pointer ${
                        selectedOption === length
                          ? 'bg-shas-burgundy border-shas-burgundy text-shas-bg dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg'
                          : 'border-shas-border/60 hover:border-shas-brand text-shas-secondary'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Shopping Bag CTA Button */}
            <div className="pt-4 space-y-3 font-sans">
              <button
                onClick={() => {
                  addItem({ ...product, size: selectedOption });
                }}
                className="w-full py-4 bg-shas-burgundy text-shas-bg border border-shas-burgundy hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 shadow-md dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg dark:hover:bg-shas-bg dark:hover:border-shas-brand dark:hover:text-shas-cream cursor-pointer"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Add to Shopping Bag</span>
              </button>
              <p className="text-center text-[10px] text-shas-secondary italic">
                Arrives in our custom recyclable signature linen gift box with authenticity certificate.
              </p>
            </div>

            <hr className="border-shas-border/40" />

            {/* Collapsible luxury shipping & return accordion details */}
            <div className="pt-2 font-sans text-left">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping" className="border-shas-border/30">
                  <AccordionTrigger className="text-[10px] uppercase tracking-widest font-semibold font-sans py-3 hover:no-underline text-shas-heading cursor-pointer">
                    Shipping & Delivery
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-shas-secondary leading-relaxed font-sans pt-1 pb-4">
                    Every SHAS creation is wrapped with care in our signature custom linen box. We offer complimentary standard shipping on all orders over $150. Express delivery options are available at checkout.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns" className="border-shas-border/30">
                  <AccordionTrigger className="text-[10px] uppercase tracking-widest font-semibold font-sans py-3 hover:no-underline text-shas-heading cursor-pointer">
                    Easy Returns & Exchanges
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-shas-secondary leading-relaxed font-sans pt-1 pb-4">
                    We offer complimentary signature returns or exchanges within 30 days of delivery. The item must be in its original, unworn condition with all packaging intact. A pre-paid return label is included with your order.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="warranty" className="border-shas-border/30">
                  <AccordionTrigger className="text-[10px] uppercase tracking-widest font-semibold font-sans py-3 hover:no-underline text-shas-heading cursor-pointer">
                    Authenticity & Care
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-shas-secondary leading-relaxed font-sans pt-1 pb-4">
                    Each creation comes with an authenticity certificate. To maintain the luster, store your jewelry in the provided linen pouch, and avoid exposure to chemicals, perfumes, or excessive water.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <hr className="border-shas-border/40" />

            {/* Brand Value Quick Accords */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-sans text-left">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-shas-brand mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-[10px] uppercase tracking-wider font-semibold">Free Shipping</h5>
                  <p className="text-[9px] text-shas-secondary leading-tight mt-0.5">Complimentary shipping on orders over $150.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RefreshCw className="w-4 h-4 text-shas-brand mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-[10px] uppercase tracking-wider font-semibold">Easy Returns</h5>
                  <p className="text-[9px] text-shas-secondary leading-tight mt-0.5">30-day signature returns with free labels.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-shas-brand mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-[10px] uppercase tracking-wider font-semibold">Authenticity</h5>
                  <p className="text-[9px] text-shas-secondary leading-tight mt-0.5">Lifetime warranty covering craftsmanship.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendations / You May Also Love Grid */}
        <div className="border-t border-shas-border/40 pt-16 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[9px] uppercase tracking-[0.25em] text-shas-secondary font-bold font-sans">Curated Recommendations</span>
            <h3 className="font-serif text-2xl font-light tracking-wide text-shas-heading dark:text-foreground">You May Also Love</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => navigate(`/product/${rec.id}`)}
                className="group flex flex-col h-full bg-transparent border border-shas-border/40 p-4 hover:shadow-md transition-all duration-300 relative cursor-pointer text-left"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-stone-50 border border-shas-border/40 p-2 mb-4">
                  <img
                    src={rec.imageUrl}
                    alt={rec.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-1 font-sans">
                  <div className="space-y-0.5">
                    <h4 className="font-serif text-sm font-medium text-shas-heading dark:text-foreground">
                      {rec.title}
                    </h4>
                    <p className="text-[9px] text-shas-secondary font-light italic">
                      {rec.material}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-shas-border/30">
                    <span className="font-serif text-xs font-semibold text-shas-brand dark:text-primary">
                      ${rec.price.toFixed(2)}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-shas-heading hover:text-shas-brand transition-colors flex items-center gap-1">
                      <span>Details</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
