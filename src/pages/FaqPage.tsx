import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    question: "What is Gold Vermeil and how is it cared for?",
    answer: "Gold vermeil is a high-quality standard of plating: a solid 14k gold shell of at least 2.5 microns thick layered over 925 sterling silver. To preserve its luster, avoid exposing it to perfumes, pools, or harsh cleaning chemicals. Gently wipe with the provided microfiber polishing cloth after wear, and store it in your custom linen box."
  },
  {
    question: "Are your pearls natural?",
    answer: "Yes, we use handpicked high-luster freshwater cultured pearls and organic baroque pearls. Because they are organic, each pearl possesses subtle shape and color variations, making your selected design uniquely yours."
  },
  {
    question: "Can I customize the sizing for rings or necklaces?",
    answer: "Our standard ring sizes are 6, 7, and 8, and our standard necklace chain lengths are 16\" and 18\". If you require custom sizing, custom engraving, or a matching set for bridal occasions, please select the 'Custom Consultation' option in our contact form or email our atelier directly."
  },
  {
    question: "How does showroom pickup work in Erode?",
    answer: "If you reside near Tamil Nadu, you can select Showroom Pickup during checkout. Once your piece is handcrafted and packaged, we will email you a collection receipt. You can pick up your order at our boutique in Periyar Nagar, Erode, during operating hours."
  },
  {
    question: "What is your warranty policy?",
    answer: "Each creation comes with a material authenticity certificate and a lifetime warranty covering structural craftsmanship, bezel settings, and clasp repairs. It does not cover accidental damages, scratches from wear, or jewelry loss."
  }
];

export function FaqPage() {
  return (
    <main className="relative min-h-[calc(100vh-5rem)] bg-shas-bg text-shas-heading py-16 px-6 md:px-12 overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-shas-brand/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10 space-y-10 text-left">
        
        {/* Back Link */}
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-shas-secondary hover:text-shas-brand transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-shas-brand font-semibold font-sans">
            Customer Care
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wide leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-shas-secondary font-sans leading-relaxed">
            Common inquiries regarding gold quality, pearl care, custom design forgings, and Erode storefront collections.
          </p>
        </div>

        <hr className="border-shas-border/40" />

        {/* Accordions */}
        <div className="font-sans">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border-b border-shas-border/40">
                <AccordionTrigger className="text-left font-serif text-base py-4 hover:no-underline text-shas-heading font-medium cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-shas-secondary leading-relaxed pt-1 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </main>
  );
}
