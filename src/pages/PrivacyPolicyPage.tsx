import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function PrivacyPolicyPage() {
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
            Legal & Compliance
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wide leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[10px] font-mono text-shas-secondary">Last updated: July 20, 2026</p>
        </div>

        <hr className="border-shas-border/40" />

        {/* Body content */}
        <div className="text-xs md:text-sm text-shas-secondary font-sans leading-relaxed space-y-6">
          <p>
            At SHAS Jewellers, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy details how we collect, use, disclose, and safeguard your information when you visit our showroom in Erode or use our DTC storefront.
          </p>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">1. Information We Collect</h3>
            <p>
              We collect information that you provide directly to us when purchasing jewelry, signing up for notifications, filling out our contact form, or booking a custom design fitting. This includes your name, shipping address, billing address, email, telephone number, and payment information processed through secure tokenized portals.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">2. How We Use Your Information</h3>
            <p>
              We process your personal details to fulfill purchases, verify credentials, coordinate shipments, handle returns, process communications, and notify you about new jewelry arrivals. We do not sell or trade your details to external brokers.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">3. Security and Local State Persistence</h3>
            <p>
              We deploy industry-standard Secure Socket Layer (SSL) encryption to protect transaction information. In addition, our storefront utilizes local storage persistence strictly to maintain state integrity for your active theme preference and shopping bag items.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">4. Contact & Compliance</h3>
            <p>
              If you have inquiries regarding our data handling procedures, wish to request access to or erasure of your records, please contact our compliance officer at <span className="font-semibold text-shas-brand">compliance@shasjewellers.com</span>.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
