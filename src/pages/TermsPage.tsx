import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function TermsPage() {
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
            Terms of Use
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide leading-tight">
            Terms of Service
          </h1>
          <p className="text-[10px] font-mono text-shas-secondary">Last updated: July 20, 2026</p>
        </div>

        <hr className="border-shas-border/40" />

        {/* Body content */}
        <div className="text-xs md:text-sm text-shas-secondary font-sans leading-relaxed space-y-6">
          <p>
            Welcome to the SHAS digital storefront. By accessing or purchasing from our platform, you agree to comply with and be bound by the following Terms of Service.
          </p>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">1. Jewelry Customization & Orders</h3>
            <p>
              Prices, materials description, and availability are subject to change without notice. While we make every attempt to accurately display colors and settings under natural light, gold and pearl items are subject to subtle organic variations. Custom bridal orders require an initial alignment on designs before forge production commences.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">2. Payment Methods & Tokenization</h3>
            <p>
              We accept major credit cards and digital wallets through verified secure processing gateways. You agree to pay all charges incurred at the price listed, including applicable taxes and delivery fees.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">3. Intellectual Property</h3>
            <p>
              All logo assets, pictures, illustrations, product descriptions, custom design systems, and code compiled under this project are owned exclusively by SHAS Jewellers and Deepa Sakthi. Unauthorized use, copying, or replication of these materials is prohibited.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">4. Limitation of Liability</h3>
            <p>
              Under no circumstances shall SHAS Jewellers be liable for any indirect, incidental, or consequential damages arising out of the use or wear of our items, or from shipping disruptions beyond our control.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
