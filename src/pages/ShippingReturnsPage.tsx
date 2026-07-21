import { Link } from 'react-router-dom';
import { ChevronLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export function ShippingReturnsPage() {
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
            Atelier Logistics
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide leading-tight">
            Shipping & Returns
          </h1>
          <p className="text-[10px] font-mono text-shas-secondary">Policies governing shipments, custom box packaging, and exchanges.</p>
        </div>

        <hr className="border-shas-border/40" />

        {/* Visual Icons Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans py-4">
          <div className="border border-shas-border/60 p-4 space-y-2">
            <Truck className="w-5 h-5 text-shas-brand" />
            <h4 className="font-semibold text-shas-heading text-xs">Complimentary Shipping</h4>
            <p className="text-[10px] text-shas-secondary">On all domestic orders over $150.00.</p>
          </div>
          <div className="border border-shas-border/60 p-4 space-y-2">
            <RefreshCw className="w-5 h-5 text-shas-brand" />
            <h4 className="font-semibold text-shas-heading text-xs">30-Day Return Trial</h4>
            <p className="text-[10px] text-shas-secondary">Signature prepaid return labels included.</p>
          </div>
          <div className="border border-shas-border/60 p-4 space-y-2">
            <ShieldCheck className="w-5 h-5 text-shas-brand" />
            <h4 className="font-semibold text-shas-heading text-xs">Lifetime Guarantee</h4>
            <p className="text-[10px] text-shas-secondary">Covers materials and stone settings.</p>
          </div>
        </div>

        {/* Body content */}
        <div className="text-xs md:text-sm text-shas-secondary font-sans leading-relaxed space-y-6">
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">1. Shipping Processes & Box Curation</h3>
            <p>
              Every SHAS creation is individually wrapped and placed inside our custom recyclable signature linen keepsakes gift box, featuring a microfiber polishing cloth and a signed certificate of material authenticity. Standard secure delivery takes 3 to 7 business days. Express shipping options are available at checkout.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">2. Standard Returns</h3>
            <p>
              We offer complimentary signature returns within 30 days of shipment receipt. To qualify, the jewelry must be in its original, unworn condition with all accompanying packaging, seals, and certificates intact.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">3. Custom Orders & Engravings Exclusions</h3>
            <p>
              Custom-sized rings (other than sizes 6, 7, and 8), customized bridal packages, and items featuring personalized text engravings are considered final sale and cannot be returned or exchanged unless there is an structural defect in the metal casting.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-shas-heading">4. Shipping Address & Erode Showroom Pickup</h3>
            <p>
              Customers located in Tamil Nadu may select the showroom pickup option at checkout to collect their items in person at our Periyar Nagar, Erode showroom. Please coordinate collections with our team at <span className="font-semibold text-shas-brand">atelier@shasjewellers.com</span>.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
