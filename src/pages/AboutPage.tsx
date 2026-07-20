import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';

export function AboutPage() {
  return (
    <main className="relative min-h-[calc(100vh-5rem)] bg-shas-bg text-shas-heading py-16 px-6 md:px-12 overflow-hidden transition-colors duration-300">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-shas-brand/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-shas-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        
        {/* Back Link */}
        <div className="text-left">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-shas-secondary hover:text-shas-brand transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Brand Header */}
        <section className="text-left space-y-4 max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.25em] text-shas-brand font-semibold font-sans">
            Atelier & Heritage
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide leading-tight">
            The Philosophy of <br />
            <span className="font-light italic text-shas-brand">Mindful Creation.</span>
          </h1>
          <p className="text-sm md:text-base text-shas-secondary font-sans leading-relaxed pt-2">
            SHAS is a DTC luxury jewelry storefront founded by Deepa Sakthi. Operating from our boutique showroom in Erode, Tamil Nadu, we dedicate ourselves to designing timeless vermeil gold and hand-selected baroque pearl jewelry for the modern romantic.
          </p>
        </section>

        {/* Large Editorial Image & Quote Row */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-shas-border bg-shas-bg p-6 md:p-10 shadow-sm">
          <div className="lg:col-span-5 aspect-[4/5] overflow-hidden border border-shas-border/60 bg-stone-50">
            <img 
              src="/images/shas_hero_luxury.jpg" 
              alt="Deepa Sakthi styling jewelry" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="lg:col-span-7 space-y-6 text-left">
            <QuoteIcon className="w-8 h-8 text-shas-accent/40" />
            <blockquote className="font-serif text-lg md:text-2xl text-shas-heading italic leading-relaxed">
              "We believe that jewelry is never just an accessory. It is a vessel of memories, a celebrate of intention, and a reflection of the soul. We design pieces to be lived in, layered, and passed down."
            </blockquote>
            <div className="pt-2">
              <span className="block font-serif text-base font-semibold text-shas-brand">Deepa Sakthi</span>
              <span className="text-[9px] uppercase tracking-widest text-shas-secondary font-sans font-medium">Founder & Creative Director, SHAS</span>
            </div>
          </div>
        </section>

        {/* Our Three Pillars */}
        <section className="space-y-8">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-left border-b border-shas-border/40 pb-3">
            Our Materials & Commitments
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="border border-shas-border/80 bg-shas-bg/30 p-8 space-y-4 hover:border-shas-brand transition-colors text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-shas-accent/40 rounded-full flex items-center justify-center text-shas-brand">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-shas-heading">14k Gold Vermeil</h3>
                <p className="text-xs text-shas-secondary font-sans leading-relaxed">
                  Our vermeil pieces feature a thick coating of 14k solid gold—at least 2.5 microns thick—electroplated over premium 925 sterling silver. This standard is five times thicker than typical gold plating, providing lasting brilliance and weight.
                </p>
              </div>
              <span className="text-[9px] font-mono text-shas-brand pt-4">Enduring Quality</span>
            </div>

            {/* Pillar 2 */}
            <div className="border border-shas-border/80 bg-shas-bg/30 p-8 space-y-4 hover:border-shas-brand transition-colors text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-shas-accent/40 rounded-full flex items-center justify-center text-shas-brand">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-shas-heading">Ethically Harvested</h3>
                <p className="text-xs text-shas-secondary font-sans leading-relaxed">
                  Every baroque pearl, diamond, and gemstone we select is ethically sourced from suppliers complying with the Kimberly Process. We celebrate organic variations: no two pearls are identical, reflecting your unique story.
                </p>
              </div>
              <span className="text-[9px] font-mono text-shas-brand pt-4">Responsible Sourcing</span>
            </div>

            {/* Pillar 3 */}
            <div className="border border-shas-border/80 bg-shas-bg/30 p-8 space-y-4 hover:border-shas-brand transition-colors text-left flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 border border-shas-accent/40 rounded-full flex items-center justify-center text-shas-brand">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-shas-heading">Artisanal Timelines</h3>
                <p className="text-xs text-shas-secondary font-sans leading-relaxed">
                  We reject rushed timelines and mass factory production. Our jewelry is hand-forged by skilled artisans in limited micro-batches, taking the required hours to ensure perfect bezel finishes and clasp security.
                </p>
              </div>
              <span className="text-[9px] font-mono text-shas-brand pt-4">Slow Craftsmanship</span>
            </div>

          </div>
        </section>

        {/* Brand Story narrative section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-start">
          <div className="md:col-span-4 space-y-2">
            <span className="text-xxs uppercase tracking-wider text-shas-secondary font-sans font-bold">The Showroom</span>
            <h3 className="font-serif text-xl font-medium text-shas-heading">Visit Us in Erode</h3>
          </div>
          <div className="md:col-span-8 text-xs md:text-sm text-shas-secondary font-sans leading-relaxed space-y-4">
            <p>
              Located in the heart of Periyar Nagar, Erode, our boutique showroom invites you to experience SHAS collections in person. See the luster of freshwater baroque pearls, explore customized bridal fittings, and hold the weight of hand-finished gold.
            </p>
            <p>
              Our design team, directed by Deepa Sakthi, is available for private appointments to design personalized wedding jewelry packages, ring size adjustments, or bespoke engravings.
            </p>
          </div>
        </section>

        {/* Call to action */}
        <div className="border border-shas-border bg-shas-bg/50 p-8 md:p-12 text-center space-y-6">
          <h3 className="font-serif text-2xl md:text-3xl font-light text-shas-heading">Begin Your Story</h3>
          <p className="text-xs text-shas-secondary max-w-md mx-auto font-sans leading-relaxed">
            Browse our core signature catalog of everyday gold vermeil rings, droplets, necklaces, and signature cuffs.
          </p>
          <div className="pt-2 flex justify-center">
            <Link 
              to="/collections" 
              className="px-8 py-3.5 bg-shas-burgundy text-shas-bg hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all font-sans text-xs tracking-widest uppercase font-semibold border border-shas-burgundy shadow-sm dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg dark:hover:bg-shas-bg dark:hover:border-shas-brand dark:hover:text-shas-cream flex items-center gap-2"
            >
              <span>Explore Curation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

// Simple custom inline SVG component to render quote quote tags
function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}
