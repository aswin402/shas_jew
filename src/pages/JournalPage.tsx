import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, User, Sparkles } from 'lucide-react';

const STORIES = [
  {
    id: 'memory-making',
    title: "A Memory in the Making",
    quote: "One day, it won’t just be jewellery—it will be a memory. ❤️✨",
    body: "Every piece you own carries a story. A celebration, a milestone, a loved one, or a moment you’ll cherish forever. That’s why every SHAS creation begins with more than just a design—it begins with an emotion.\n\nThis soft blush pink piece paired with delicate pearls was born from a simple thought: Why not create something refreshingly elegant? The result is a timeless design that feels graceful, unique, and effortlessly beautiful. Because sometimes, the most memorable jewellery isn’t the boldest—it’s the one that speaks to your heart.\n\nDiscover jewellery that’s designed to become a part of your story. Visit SHAS, Periyar Nagar, Erode. ❤️",
    tags: ["designerjewellery", "blushpink", "pearljewellery", "luxuryjewellery", "erode"],
    date: "July 18, 2026",
    author: "Deepa Sakthi",
    imageUrl: "/images/shas_hero_luxury.jpg",
    readTime: "3 min read"
  },
  {
    id: 'complete-look',
    title: "Complete Your Look",
    quote: "The right jewellery doesn’t just complete your outfit—it completes your look. ✨",
    body: "Sometimes, it’s not about having more jewellery. It’s about choosing the right piece. The wrong styling choice can take away from your entire look, while the perfect one can elevate it effortlessly.\n\nAt SHAS, we believe every jewellery piece has a purpose. Whether it’s a timeless Lakshmi design or a contemporary statement piece, the right styling makes all the difference. Because true elegance lies in knowing what to wear, and when to wear it.\n\nVisit SHAS and let us help you find the jewellery that complements your style perfectly. ❤️",
    tags: ["jewellerystyling", "stylingtips", "traditionaljewellery", "goldjewellery"],
    date: "July 12, 2026",
    author: "Deepa Sakthi",
    imageUrl: "/images/shas_product_necklace.jpg",
    readTime: "2 min read"
  },
  {
    id: 'bridal-show-success',
    title: "Our Bridal Show Success",
    quote: "The greatest reward isn’t just creating beautiful jewellery—it’s knowing it became a part of someone’s story. ❤️✨",
    body: "Our recent Bridal Show in Erode was filled with moments we’ll always cherish. From hearing how every piece felt thoughtfully curated and deeply personal to seeing so many of you connect with our collections, every conversation reminded us why we do what we do.\n\nWhat made it even more special was the love that continued beyond the event. So many customers visited us after the show to customize their dream jewellery, and many even travelled from different places to experience SHAS. Your trust, appreciation, and support mean the world to us.\n\nThank you for making our Bridal Show a beautiful success. We can’t wait to welcome you to SHAS, Athiyar Nagar, Erode, and be a part of your next special moment. ❤️",
    tags: ["bridalshow", "bridaljewellery", "customizedjewellery", "weddingjewellery"],
    date: "July 05, 2026",
    author: "SHAS Atelier",
    imageUrl: "/images/shas_story_macro.jpg",
    readTime: "4 min read"
  },
  {
    id: 'entrepreneurs-journey',
    title: "The Entrepreneur's Journey",
    quote: "Success is visible. The struggle behind it rarely is.",
    body: "Every entrepreneur’s journey looks different. Some battles are seen, while many are fought quietly behind the scenes. No matter where you come from or what people assume about your journey, building something meaningful takes courage, consistency, and unwavering belief.\n\nThe opinions of others will always exist, but they should never define your path. Keep showing up, trust the process, and stay committed to your vision. One step at a time, you’ll find the light at the end of the tunnel.\n\nKeep building. Keep believing. Keep walking. ✨",
    tags: ["entrepreneurship", "founderjourney", "businessgrowth", "consistency"],
    date: "June 28, 2026",
    author: "Deepa Sakthi",
    imageUrl: "/images/shas_product_ring.jpg",
    readTime: "3 min read"
  },
  {
    id: 'natural-light-trust',
    title: "Natural Light & Trust",
    quote: "What you see is what you get ✨",
    body: "At Shas Jewellers, we believe true beauty needs no filters. That’s why every piece is photographed in natural light, allowing its colours, craftsmanship, and brilliance to shine exactly as they do in real life 🧡\n\nFrom the soft glow of pearls to the rich sparkle of rubies, every detail is captured with honesty so when your jewellery reaches you, it feels just as beautiful as the moment you first saw it ✨\n\nBecause at Shas, trust is as important as craftsmanship, and elegance is best experienced in its truest form ❤️",
    tags: ["ShasJewellers", "RealBeauty", "NaturalLight", "TimelessElegance"],
    date: "June 15, 2026",
    author: "SHAS Atelier",
    imageUrl: "/images/shas_product_earrings.jpg",
    readTime: "3 min read"
  },
  {
    id: 'artisanal-perfection',
    title: "Artisanal Perfection",
    quote: "Good things take time, but the best things? They take a little extra care 💎",
    body: "We don’t believe in rushed timelines or false promises. Every piece at SHAS is handcrafted by artisans who take the time they need to ensure absolute perfection.\n\nBecause when it comes to your special moments, you deserve nothing less than a masterpiece. 💕",
    tags: ["HandmadeWithLove", "JewelleryDesign", "ArtisanCrafted", "Craftsmanship"],
    date: "June 08, 2026",
    author: "Deepa Sakthi",
    imageUrl: "/images/shas_product_bracelet.jpg",
    readTime: "2 min read"
  }
];

export function JournalPage() {
  const [selectedStory, setSelectedStory] = useState<typeof STORIES[0] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedStory]);

  const featuredStory = STORIES[0];
  const regularStories = STORIES.slice(1);

  return (
    <main className="pt-32 min-h-screen bg-shas-bg text-shas-heading transition-colors duration-300">
      
      {selectedStory ? (
        /* Full Story View */
        <article className="max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-8 text-left">
          <button
            onClick={() => setSelectedStory(null)}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-shas-secondary hover:text-shas-brand transition-colors group mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Journal</span>
          </button>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xxs uppercase tracking-wider text-shas-secondary font-sans font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-shas-brand" /> {selectedStory.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-shas-brand" /> By {selectedStory.author}
              </span>
              <span>• {selectedStory.readTime}</span>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide leading-tight">
              {selectedStory.title}
            </h1>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 border border-shas-border shadow-md">
            <img
              src={selectedStory.imageUrl}
              alt={selectedStory.title}
              className="w-full h-full object-cover"
            />
          </div>

          <blockquote className="font-serif text-lg md:text-xl text-shas-brand italic leading-relaxed border-l-2 border-shas-brand pl-6 py-1 my-8">
            "{selectedStory.quote}"
          </blockquote>

          <div className="text-sm md:text-base text-shas-secondary font-sans leading-relaxed space-y-6 whitespace-pre-line">
            {selectedStory.body}
          </div>

          <div className="flex flex-wrap gap-2 pt-6 border-t border-shas-border/40">
            {selectedStory.tags.map((tag) => (
              <span key={tag} className="text-[9px] font-mono text-shas-brand bg-shas-brand/5 px-2.5 py-1 border border-shas-brand/10 uppercase tracking-wider">
                #{tag}
              </span>
            ))}
          </div>
        </article>
      ) : (
        /* Journal Grid / List View */
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-shas-brand font-semibold font-sans">
              <BookOpen className="w-4 h-4 text-shas-accent" />
              <span>The Atelier Chronicles</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide">
              The SHAS Journal
            </h1>
            <p className="text-xs md:text-sm text-shas-secondary font-sans leading-relaxed">
              Perspectives on design, slow craftsmanship, founder diaries, and styling guides from the heart of our Erode atelier.
            </p>
          </div>

          {/* Featured Article Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-shas-border/60 bg-shas-bg p-6 md:p-8 shadow-sm group hover:border-shas-brand transition-all duration-300"
          >
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-stone-50 border border-shas-border/40 relative">
              <img
                src={featuredStory.imageUrl}
                alt={featuredStory.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <span className="absolute top-4 left-4 bg-shas-burgundy text-shas-bg dark:bg-shas-brand dark:text-shas-bg px-3 py-1 text-[9px] uppercase tracking-widest font-sans font-bold flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" /> Featured Post
              </span>
            </div>

            <div className="lg:col-span-5 text-left flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-wider text-shas-secondary font-sans font-semibold">
                  <span>{featuredStory.date}</span>
                  <span>By {featuredStory.author}</span>
                  <span>{featuredStory.readTime}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-wide leading-tight text-shas-heading group-hover:text-shas-brand transition-colors">
                  {featuredStory.title}
                </h2>
                <p className="text-xs text-shas-secondary leading-relaxed font-sans line-clamp-4">
                  {featuredStory.body.split('\n\n')[0]}
                </p>
              </div>

              <button
                onClick={() => setSelectedStory(featuredStory)}
                className="w-full sm:w-auto px-6 py-3 bg-shas-burgundy text-shas-bg hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all font-sans text-[10px] uppercase tracking-widest font-bold text-center border border-shas-burgundy shadow-sm dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg dark:hover:bg-shas-bg dark:hover:border-shas-cream dark:hover:text-shas-cream cursor-pointer"
              >
                Read Featured Narrative
              </button>
            </div>
          </motion.div>

          {/* Grid Layout of regular articles */}
          <div className="space-y-8">
            <h3 className="font-serif text-xl font-bold tracking-wide text-left border-b border-shas-border/40 pb-3 uppercase text-shas-secondary text-[11px] tracking-[0.2em]">
              More Stories
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularStories.map((story) => (
                <div
                  key={story.id}
                  className="group flex flex-col h-full bg-transparent border border-shas-border/40 p-5 hover:shadow-md hover:border-shas-brand transition-all duration-300 text-left cursor-pointer"
                  onClick={() => setSelectedStory(story)}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-50 border border-shas-border/40 mb-5">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[9px] uppercase tracking-wider text-shas-secondary font-sans font-medium">
                        <span>{story.date}</span>
                        <span>{story.readTime}</span>
                      </div>
                      
                      <h4 className="font-serif text-lg font-medium text-shas-heading group-hover:text-shas-brand transition-colors line-clamp-2">
                        {story.title}
                      </h4>
                      
                      <p className="text-xs text-shas-secondary font-sans leading-relaxed line-clamp-3">
                        {story.body.split('\n\n')[0]}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-shas-border/30 flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-shas-heading group-hover:text-shas-brand transition-colors">
                      <span>Read Story</span>
                      <span className="text-shas-brand group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </main>
  );
}
