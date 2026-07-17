import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, Star, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import backgroundDesktop from '../assets/shashdesktop.png';
import backgroundMobile from '../assets/shashmob.png';
import backgroundDesktopDark from '../assets/shashdesktopdark.png';
import backgroundMobileDark from '../assets/shashmobdark.png';
import { useThemeStore } from '../store/useThemeStore';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 'dlicatine-necklace',
    title: 'Dlicatine Necklace',
    price: 85.00,
    imageUrl: '/images/shas_product_necklace.jpg',
    category: 'Necklaces',
    material: '14k Gold Vermeil',
    rating: 5.0,
    reviews: 24,
    description: 'A delicate 14k gold chain adorned with a single selected freshwater pearl and star accent. Perfect for daily layering.'
  },
  {
    id: 'finellase-bracelet',
    title: 'Finellase Bracelet',
    price: 95.00,
    imageUrl: '/images/shas_product_bracelet.jpg',
    category: 'Bracelets',
    material: '14k Gold Vermeil',
    rating: 4.9,
    reviews: 18,
    description: 'Minimalist links crafted with precision, reflecting light with every movement. Complete with a signature clasp.'
  },
  {
    id: 'hoop-earrings',
    title: 'Hoop Earrings',
    price: 65.00,
    imageUrl: '/images/shas_product_earrings.jpg',
    category: 'Earrings',
    material: '14k Gold & Baroque Pearl',
    rating: 5.0,
    reviews: 32,
    description: 'Organic handpicked baroque pearls suspended from textured, hand-hammered 14k gold hoops.'
  },
  {
    id: 'aurelia-pearl-ring',
    title: 'Aurelia Pearl Ring',
    price: 75.00,
    imageUrl: '/images/shas_product_ring.jpg',
    category: 'Rings',
    material: '14k Gold & Freshwater Pearl',
    rating: 4.8,
    reviews: 15,
    description: 'A twisted rope band meticulously detailed with a central freshwater pearl and micro-pave diamond-like accents.'
  }
];

const NARRATIVES = [
  {
    title: "A Memory in the Making",
    quote: "One day, it won’t just be jewellery—it will be a memory. ❤️✨",
    body: "Every piece you own carries a story. A celebration, a milestone, a loved one, or a moment you’ll cherish forever. That’s why every SHAS creation begins with more than just a design—it begins with an emotion.\n\nThis soft blush pink piece paired with delicate pearls was born from a simple thought: Why not create something refreshingly elegant? The result is a timeless design that feels graceful, unique, and effortlessly beautiful. Because sometimes, the most memorable jewellery isn’t the boldest—it’s the one that speaks to your heart.\n\nDiscover jewellery that’s designed to become a part of your story. Visit SHAS, Periyar Nagar, Erode. ❤️",
    tags: ["designerjewellery", "blushpink", "pearljewellery", "luxuryjewellery", "bridaljewellery", "statementjewellery", "weddingjewellery", "erode", "shasjewellers"]
  },
  {
    title: "Complete Your Look",
    quote: "The right jewellery doesn’t just complete your outfit—it completes your look. ✨",
    body: "Sometimes, it’s not about having more jewellery. It’s about choosing the right piece. The wrong styling choice can take away from your entire look, while the perfect one can elevate it effortlessly.\n\nAt SHAS, we believe every jewellery piece has a purpose. Whether it’s a timeless Lakshmi design or a contemporary statement piece, the right styling makes all the difference. Because true elegance lies in knowing what to wear, and when to wear it.\n\nVisit SHAS and let us help you find the jewellery that complements your style perfectly. ❤️",
    tags: ["jewellerystyling", "stylingtips", "bridaljewellery", "traditionaljewellery", "lakshmijewellery", "goldjewellery", "luxuryjewellery", "erode", "shasjewellers"]
  },
  {
    title: "Our Bridal Show Success",
    quote: "The greatest reward isn’t just creating beautiful jewellery—it’s knowing it became a part of someone’s story. ❤️✨",
    body: "Our recent Bridal Show in Erode was filled with moments we’ll always cherish. From hearing how every piece felt thoughtfully curated and deeply personal to seeing so many of you connect with our collections, every conversation reminded us why we do what we do.\n\nWhat made it even more special was the love that continued beyond the event. So many customers visited us after the show to customize their dream jewellery, and many even travelled from different places to experience SHAS. Your trust, appreciation, and support mean the world to us.\n\nThank you for making our Bridal Show a beautiful success. We can’t wait to welcome you to SHAS, Athiyar Nagar, Erode, and be a part of your next special moment. ❤️",
    tags: ["bridalshow", "bridaljewellery", "customizedjewellery", "weddingjewellery", "erode", "luxuryjewellery", "bridalshopping", "southindianbride", "shasjewellers"]
  },
  {
    title: "The Entrepreneur's Journey",
    quote: "Success is visible. The struggle behind it rarely is.",
    body: "Every entrepreneur’s journey looks different. Some battles are seen, while many are fought quietly behind the scenes. No matter where you come from or what people assume about your journey, building something meaningful takes courage, consistency, and unwavering belief.\n\nThe opinions of others will always exist, but they should never define your path. Keep showing up, trust the process, and stay committed to your vision. One step at a time, you’ll find the light at the end of the tunnel.\n\nKeep building. Keep believing. Keep walking. ✨",
    tags: ["entrepreneurship", "founderjourney", "trusttheprocess", "businessgrowth", "leadership", "consistency", "womenentrepreneurs", "shasjewellers"]
  },
  {
    title: "Founder's GRWM Styling",
    quote: "Getting ready is never just about what you wear, it’s about how you feel. ✨",
    body: "Join Deepa Akka, Founder of SHAS, as she styles some of her favorite jewellery pieces.\n\nFrom timeless classics to statement pieces, every choice tells a story and celebrates individuality.\n\nWhich look is your favorite? Tell us in the comments below. ✨",
    tags: ["getreadywithme", "grwm", "jewellerystyling", "shasjewellers", "bridaljewellery", "goldjewellery", "fashionreel", "southindianjewellery"]
  },
  {
    title: "Details of Ruby",
    quote: "Every piece of jewellery tells a story, but it’s the details that make it unforgettable. ❤️✨",
    body: "The rich ruby at the heart of this design isn’t just a gemstone, it’s the soul of the piece. Its vibrant brilliance adds depth, elegance, and a timeless charm that makes every look feel extraordinary.\n\nWhether you’re the bride or someone celebrating alongside her, this collection is designed to make you feel like the center of every beautiful moment.\n\nDiscover the Ruby Collection at SHAS and find the piece that’s made to shine with you. ❤️",
    tags: ["rubyjewellery", "bridaljewellery", "bridalfashion", "weddingjewellery", "luxuryjewellery", "breadcrumbs", "erode", "shasjewellers"]
  },
  {
    title: "Artisanal Perfection",
    quote: "Good things take time, but the best things? They take a little extra care 💎",
    body: "We don’t believe in rushed timelines or false promises. Every piece at SHAS is handcrafted by artisans who take the time they need to ensure absolute perfection\nBecause when it comes to your special moments, you deserve nothing less than a masterpiece 💕",
    tags: ["ShasJewellery", "HandmadeWithLove", "JewelleryDesign", "ArtisanCrafted", "TraditionalJewellery", "Shas", "Craftsmanship", "PremiumJewellery", "HandcraftedWithCare"]
  },
  {
    title: "Natural Light & Trust",
    quote: "What you see is what you get ✨",
    body: "At Shas Jewellers, we believe true beauty needs no filters. That’s why every piece is photographed in natural light, allowing its colours, craftsmanship, and brilliance to shine exactly as they do in real life 🧡\n\nFrom the soft glow of pearls to the rich sparkle of rubies, every detail is captured with honesty so when your jewellery reaches you, it feels just as beautiful as the moment you first saw it ✨💕\n\nBecause at Shas, trust is as important as craftsmanship, and elegance is best experienced in its truest form ❤️",
    tags: ["ShasJewellers", "RealBeauty", "NaturalLightJewellery", "AuthenticElegance", "PearlsAndRubies", "TimelessJeweller", "CraftedWithLove", "JewelleryWithEmotion", "FineJewellery", "LuxuryJewellery", "TraditionalMeetsModern", "ShasExperience", "TimelessElegance"]
  }
];

export function HomePage() {
  const { addItem } = useCartStore();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const storyImageRef = useRef<HTMLImageElement>(null);

  const { theme } = useThemeStore();
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const desktopBg = isDark ? backgroundDesktopDark : backgroundDesktop;
  const mobileBg = isDark ? backgroundMobileDark : backgroundMobile;

  // Check accessibility reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // GSAP Entrance and Scroll Animations
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Hero Content Entrance Animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-subtitle-tag', 
        { opacity: 0, y: 15 }, 
        { opacity: 0.8, y: 0, duration: 1.0, delay: 0.2 }
      );
      
      tl.fromTo('.hero-title-main', 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 1.2 },
        '-=0.8'
      );

      tl.fromTo('.hero-desc-main', 
        { opacity: 0, y: 20 }, 
        { opacity: 0.8, y: 0, duration: 0.9 },
        '-=0.7'
      );

      tl.fromTo('.hero-cta-group', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.7'
      );

      tl.fromTo('.hero-image-frame', 
        { opacity: 0, scale: 1.05 }, 
        { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
        '-=1.4'
      );

      // 2. ScrollTrigger for Product Cards Grid
      gsap.fromTo('.product-card-reveal',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.products-section',
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );

      // 3. ScrollTrigger for The SHAS Story section
      gsap.fromTo('.story-text-reveal',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.story-section',
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        }
      );

      // 4. Parallax scroll effect for Story Image
      if (storyImageRef.current) {
        gsap.to(storyImageRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.story-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      // 5. Why SHAS grid items reveal
      gsap.fromTo('.value-card-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.values-section',
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
      
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Hotspot details
  const hotspots = [
    {
      id: 'dlicatine-necklace',
      top: '40%',
      left: '42%',
      productIndex: 0,
      label: 'Necklaces'
    },
    {
      id: 'hoop-earrings',
      top: '78%',
      left: '53%',
      productIndex: 2,
      label: 'Earrings'
    },
    {
      id: 'aurelia-pearl-ring',
      top: '58%',
      left: '78%',
      productIndex: 3,
      label: 'Rings'
    }
  ];

  return (
    <div ref={containerRef} className="relative bg-shas-bg text-shas-heading transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-start lg:items-center py-10 sm:py-16 lg:py-20 px-6 md:px-16 overflow-hidden border-b border-shas-border">
        {/* Full-bleed Hero Background Image */}
        <div className="hero-image-frame absolute inset-0 w-full h-full z-0 overflow-hidden">
          <picture className="w-full h-full">
            <source media="(max-width: 1023px)" srcSet={mobileBg} />
            <source media="(min-width: 1024px)" srcSet={desktopBg} />
            <img
              src={desktopBg}
              alt="SHAS Luxury Editorial Jewelry Background"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full relative z-10">
          
          {/* Hero Editorial Text Overlay */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="hero-subtitle-tag flex items-center gap-2 text-[10px] sm:text-xxs uppercase tracking-[0.25em] text-shas-secondary font-sans font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-shas-accent" />
              <span>Heritage in Every Carat • Natural Diamonds & Gold</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="hero-title-main font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide leading-[1.1] text-shas-heading">
                TRADITIONAL <br />
                <span className="font-light italic text-shas-brand">LUXURY.</span>
              </h1>
              
              <p className="hero-desc-main text-sm sm:text-base leading-relaxed text-shas-heading/90 max-w-[310px] sm:max-w-md lg:max-w-lg font-sans">
                Designed by Deepa Sakthi. Experience traditional luxury at our Erode Store. Every piece is handcrafted by artisans to ensure absolute perfection.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta-group flex flex-col sm:flex-row gap-3 w-full max-w-[240px] sm:max-w-none sm:w-auto pt-2">
              <a
                href="#shop-catalog"
                className="w-full sm:w-auto px-4 py-2.5 md:px-8 md:py-4 bg-shas-burgundy text-shas-bg hover:opacity-90 transition-all font-sans text-[9px] md:text-xs uppercase tracking-widest font-semibold text-center border border-shas-burgundy shadow-sm hover:shadow-lg dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg"
              >
                Shop All Jewelry
              </a>
              <a
                href="#shop-look"
                className="w-full sm:w-auto px-4 py-2.5 md:px-8 md:py-4 bg-shas-bg/60 md:bg-transparent text-shas-heading border border-shas-accent hover:bg-shas-accent hover:text-shas-bg transition-all font-sans text-[9px] md:text-xs uppercase tracking-widest font-semibold text-center"
              >
                Explore Collections
              </a>
            </div>

            {/* Editorial Specs Bar */}
            <div className="hero-cta-group hidden md:grid pt-8 border-t border-shas-border/60 grid grid-cols-3 gap-6 w-full max-w-md font-sans text-left">
              <div>
                <span className="block text-xxs text-shas-secondary uppercase tracking-wider">Atelier</span>
                <span className="text-xs font-semibold text-shas-heading dark:text-foreground">Erode Store</span>
              </div>
              <div>
                <span className="block text-xxs text-shas-secondary uppercase tracking-wider">Director</span>
                <span className="text-xs font-semibold text-shas-heading dark:text-foreground">Deepa Sakthi</span>
              </div>
              <div>
                <span className="block text-xxs text-shas-secondary uppercase tracking-wider">Materials</span>
                <span className="text-xs font-semibold text-shas-heading dark:text-foreground">Diamonds & Gold</span>
              </div>
            </div>
          </div>

          {/* Transparent space column on desktop to let the luxury jewelry background image show through */}
          <div className="hidden lg:block lg:col-span-5" />
          
        </div>

        {/* Floating caption overlay on the background image */}
        <div className="absolute bottom-6 right-6 md:right-16 z-10 bg-shas-bg/90 dark:bg-card/90 px-3 py-1.5 border border-shas-border/60 text-[9px] uppercase tracking-widest font-sans text-shas-secondary font-medium">
          Style Study No. 04 / Plinths
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 cursor-pointer text-shas-secondary opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[9px] uppercase tracking-widest font-sans font-bold">Scroll Down</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* 2. INTERACTIVE "SHOP THE LOOK" SECTION */}
      <section id="shop-look" className="py-20 md:py-28 px-6 md:px-16 border-b border-shas-border bg-shas-bg">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xxs uppercase tracking-[0.25em] text-shas-brand font-sans font-bold">Interactive Curation</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-shas-heading">Shop the Studio Look</h2>
            <p className="text-xs md:text-sm text-shas-secondary font-sans leading-relaxed">
              Hover or click the interactive hotspots on our studio scene to details. Layer them together to claim the signature look.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* The Interactive Image Frame */}
            <div className="lg:col-span-8 relative aspect-[3/2] bg-stone-100 border border-shas-border p-3.5 shadow-lg overflow-hidden">
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/images/shas_hero_luxury.jpg"
                  alt="SHAS Interactive Look"
                  className="w-full h-full object-cover"
                />

                {/* Hotspot Pins */}
                {hotspots.map((spot) => {
                  const product = PRODUCTS[spot.productIndex];
                  const isActive = activeHotspot === spot.id;

                  return (
                    <div
                      key={spot.id}
                      className="absolute z-20"
                      style={{ top: spot.top, left: spot.left }}
                      onMouseEnter={() => setActiveHotspot(spot.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                    >
                      {/* Pulse Ring */}
                      <span className="absolute -inset-2 rounded-full bg-shas-accent/30 animate-ping pointer-events-none" />
                      
                      {/* Hotspot Dot */}
                      <button
                        onClick={() => {
                          setActiveHotspot(isActive ? null : spot.id);
                        }}
                        className={`relative w-5 h-5 rounded-full flex items-center justify-center border font-mono text-[9px] font-bold shadow-md transition-all duration-300 ${
                          isActive 
                            ? 'bg-shas-burgundy border-shas-burgundy text-shas-bg scale-110' 
                            : 'bg-shas-bg border-shas-border text-shas-heading hover:scale-108'
                        }`}
                      >
                        +
                      </button>

                      {/* Tooltip Card */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-7 left-1/2 -translate-x-1/2 w-48 bg-shas-bg border border-shas-border p-3.5 shadow-xl text-left z-30 font-sans cursor-default pointer-events-auto"
                          >
                            <span className="block text-[8px] uppercase tracking-wider text-shas-secondary">{product.category}</span>
                            <h4 className="font-serif text-xs font-semibold text-shas-heading mt-0.5">{product.title}</h4>
                            <p className="text-xxs text-shas-secondary mt-1 line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-shas-border/60">
                              <span className="text-xs font-bold text-shas-brand">${product.price.toFixed(2)}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addItem(product);
                                }}
                                className="text-[9px] uppercase tracking-widest font-bold text-shas-heading hover:text-shas-brand flex items-center gap-1"
                              >
                                <span>+ Add</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Look Bundle checklist */}
            <div className="lg:col-span-4 border border-shas-border bg-shas-bg p-6 md:p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg font-medium tracking-wide text-shas-heading">The Travertine Look</h3>
              <p className="text-xxs uppercase tracking-widest text-shas-secondary border-b border-shas-border pb-3">
                Select pieces styled in this set
              </p>

              <div className="space-y-4">
                {hotspots.map((spot) => {
                  const product = PRODUCTS[spot.productIndex];
                  return (
                    <div 
                      key={product.id}
                      className="flex items-center justify-between group border-b border-shas-border/40 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-50 border border-shas-border overflow-hidden">
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif text-xs font-semibold text-shas-heading">{product.title}</h4>
                          <span className="text-[10px] text-shas-secondary">{product.material}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-shas-brand">${product.price.toFixed(2)}</span>
                        <button
                          onClick={() => addItem(product)}
                          className="p-1.5 border border-shas-border text-shas-heading hover:border-shas-brand hover:text-shas-brand transition-all bg-shas-bg cursor-pointer"
                          title="Quick add to box"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-shas-border space-y-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-shas-secondary uppercase tracking-wider">Set Total AOV</span>
                  <span className="text-shas-brand font-bold text-sm">$225.00</span>
                </div>
                <button
                  onClick={() => {
                    // Add all look items to cart
                    hotspots.forEach((spot) => {
                      addItem(PRODUCTS[spot.productIndex]);
                    });
                  }}
                  className="w-full py-3 bg-shas-burgundy text-shas-bg hover:opacity-95 transition-opacity font-sans text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-shas-accent animate-pulse" />
                  <span>Shop The Complete Set</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CURATED CATALOG PRODUCT GRID */}
      <section id="shop-catalog" className="products-section py-20 md:py-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-shas-border pb-6">
            <div className="space-y-2">
              <span className="text-xxs uppercase tracking-[0.25em] text-shas-secondary font-sans font-bold">Curated Selection</span>
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-shas-heading dark:text-foreground">The Signature Artifacts</h2>
            </div>
            <p className="text-xs md:text-sm text-shas-secondary max-w-sm font-sans leading-relaxed">
              Meticulously selected essential everyday items, hand-forged in 14k gold vermeil and ethically harvested pearls.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="product-card-reveal group border border-shas-border bg-shas-bg p-4 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-stone-50 border border-shas-border/40">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Category tag bubble */}
                  <span className="absolute top-2 left-2 bg-shas-bg/90 dark:bg-card/90 px-2 py-0.5 border border-shas-border text-[8px] uppercase tracking-wider font-sans text-shas-secondary">
                    {product.category}
                  </span>

                  {/* Add to Cart Overlay slide up */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <button
                      onClick={() => addItem(product)}
                      className="w-full py-3 bg-shas-burgundy text-shas-bg hover:bg-shas-burgundy/90 transition-colors font-sans text-[10px] tracking-widest uppercase font-bold shadow-md translate-y-3 group-hover:translate-y-0 duration-350 ease-out"
                    >
                      Quick Add to Bag
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-left flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[10px] text-shas-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <span className="text-shas-secondary text-[9px] ml-1 font-sans">({product.reviews})</span>
                    </div>

                    <h3 className="font-serif text-lg text-shas-heading mt-1 font-medium">{product.title}</h3>
                    <p className="text-[10px] text-shas-secondary italic font-sans">{product.material}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-shas-border/40 flex justify-between items-center">
                    <p className="text-sm font-semibold text-shas-brand font-mono">${product.price.toFixed(2)}</p>
                    <button
                      onClick={() => addItem(product)}
                      className="text-[9px] uppercase tracking-widest font-bold text-shas-heading hover:text-shas-brand transition-colors flex items-center gap-1 font-sans cursor-pointer sm:hidden lg:flex"
                    >
                      <span>Add to Bag</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. THE SHAS JOURNAL EDITORIAL */}
      <section className="story-section py-20 md:py-28 px-6 md:px-16 border-t border-b border-shas-border bg-shas-bg text-shas-heading overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-shas-border pb-6">
            <div className="space-y-2">
              <span className="text-xxs uppercase tracking-[0.25em] text-shas-brand font-sans font-bold">Atelier Narrative</span>
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-shas-heading dark:text-foreground">The SHAS Journal</h2>
            </div>
            <p className="text-xs md:text-sm text-shas-secondary max-w-sm font-sans leading-relaxed">
              Discover stories of craft, milestones, and styling from the heart of our Erode studio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left side: Navigation links list */}
            <div className="story-text-reveal lg:col-span-4 space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {NARRATIVES.map((narrative, index) => {
                const isActive = activeStoryIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveStoryIndex(index)}
                    className={`w-full text-left p-4 border transition-all duration-300 flex flex-col gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-shas-burgundy/5 border-shas-burgundy shadow-sm' 
                        : 'bg-transparent border-shas-border/60 hover:border-shas-brand/60'
                    }`}
                  >
                    <span className={`text-[9px] uppercase tracking-wider font-semibold ${isActive ? 'text-shas-brand' : 'text-shas-secondary'}`}>
                      Story 0{index + 1}
                    </span>
                    <h3 className={`font-serif text-sm font-medium ${isActive ? 'text-shas-heading' : 'text-shas-secondary'}`}>
                      {narrative.title}
                    </h3>
                  </button>
                );
              })}
            </div>

            {/* Right side: Detailed narrative card */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Story text info */}
              <div className="md:col-span-7 space-y-6 text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStoryIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="space-y-6"
                  >
                    <blockquote className="font-serif text-lg md:text-xl text-shas-heading italic leading-relaxed border-l-2 border-shas-burgundy pl-6 py-1">
                      "{NARRATIVES[activeStoryIndex].quote}"
                    </blockquote>
                    
                    <p className="text-xs md:text-sm text-shas-secondary font-sans leading-relaxed whitespace-pre-line">
                      {NARRATIVES[activeStoryIndex].body}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {NARRATIVES[activeStoryIndex].tags.map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono text-shas-brand bg-shas-brand/5 px-2 py-0.5 border border-shas-brand/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Parallax Image / Ambient Craftsman image */}
              <div className="md:col-span-5 w-full flex justify-center">
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100 border border-shas-border shadow-md p-3">
                  <div className="w-full h-[115%] overflow-hidden relative -top-[10%]">
                    <img
                      ref={storyImageRef}
                      src="/images/shas_story_macro.jpg"
                      alt="Crafting a SHAS ring"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY SHAS / BRAND VALUES SECTION */}
      <section className="values-section py-20 md:py-24 px-6 md:px-16 border-b border-shas-border bg-shas-bg">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xxs uppercase tracking-[0.25em] text-shas-secondary font-sans font-bold">Uncompromising Quality</span>
            <h2 className="font-serif text-3xl font-light tracking-wide text-shas-heading dark:text-foreground">Designed for the Discerning</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Value Card 1 */}
            <div className="value-card-reveal border border-shas-border p-8 text-left space-y-4 hover:shadow-md hover:border-shas-burgundy bg-shas-bg/50 dark:bg-shas-burgundy/[0.03] dark:hover:bg-shas-burgundy/[0.08] transition-all">
              <span className="font-serif text-xs text-shas-brand font-semibold tracking-wider">01 / Materiality</span>
              <h3 className="font-serif text-xl text-shas-heading font-medium">14k Vermeil & Solid Gold</h3>
              <p className="text-xs text-shas-secondary leading-relaxed font-sans">
                Our vermeil standard is thicker than standard plating: a solid 14k gold shell of at least 2.5 microns thick layered over 925 sterling silver for enduring luster.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="value-card-reveal border border-shas-border p-8 text-left space-y-4 hover:shadow-md hover:border-shas-burgundy bg-shas-bg/50 dark:bg-shas-burgundy/[0.03] dark:hover:bg-shas-burgundy/[0.08] transition-all">
              <span className="font-serif text-xs text-shas-brand font-semibold tracking-wider">02 / Sustainability</span>
              <h3 className="font-serif text-xl text-shas-heading font-medium">Recycled Precious Metals</h3>
              <p className="text-xs text-shas-secondary leading-relaxed font-sans">
                We utilize recycled silver and gold to minimize the environmental footprint of our pieces. Our diamonds and pearls are sourced strictly from suppliers complying with the Kimberly Process.
              </p>
            </div>

            {/* Value Card 3 */}
            <div className="value-card-reveal border border-shas-border p-8 text-left space-y-4 hover:shadow-md hover:border-shas-burgundy bg-shas-bg/50 dark:bg-shas-burgundy/[0.03] dark:hover:bg-shas-burgundy/[0.08] transition-all">
              <span className="font-serif text-xs text-shas-brand font-semibold tracking-wider">03 / Care Package</span>
              <h3 className="font-serif text-xl text-shas-heading font-medium">Custom Linen Gift Boxing</h3>
              <p className="text-xs text-shas-secondary leading-relaxed font-sans">
                Every piece arrives tucked inside a velvet-lined custom linen keepsake box, complete with a microfiber polishing cloth and a signed certificate of material authenticity.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
