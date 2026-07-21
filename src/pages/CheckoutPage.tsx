import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { ChevronLeft, Lock, CreditCard, CheckCircle, Truck, Sparkles, AlertCircle } from 'lucide-react';

export function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Checkout flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mockOrderId, setMockOrderId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if cart is empty and not in success state
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/collections');
    }
  }, [cartItems, navigate, orderSuccess]);

  // Cart total summary
  const subtotal = getCartTotal();
  const shipping = subtotal >= 150 ? 0 : 15;
  const tax = subtotal * 0.08; // 8% simulated tax
  const total = subtotal + shipping + tax;

  // Format Card Number with space spacing
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  // Format Expiry date as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiry(value.slice(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCvv(value.slice(0, 4));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic Validations
    if (!email || !firstName || !lastName || !address || !city || !postalCode || !phoneNumber) {
      setErrorMsg('Please complete all shipping address fields.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setErrorMsg('Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length < 5) {
      setErrorMsg('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvv.length < 3) {
      setErrorMsg('Please enter a valid CVV.');
      return;
    }

    // Trigger simulation
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setMockOrderId(`SHAS-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderSuccess(true);
      clearCart(); // Clear state
    }, 2500);
  };

  return (
    <main className="relative min-h-[calc(100vh-5rem)] bg-shas-bg text-shas-heading py-16 px-6 md:px-12 overflow-hidden transition-colors duration-300">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-shas-brand/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-shas-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!orderSuccess ? (
            /* Checkout split form view */
            <motion.div 
              key="checkout-gate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              
              {/* Left Column: Forms */}
              <div className="lg:col-span-7 space-y-8 text-left">
                {/* Back link */}
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-shas-secondary hover:text-shas-brand transition-colors group cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Return to Shopping Bag</span>
                </button>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-shas-brand font-semibold font-sans flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Secure Checkout Portal
                  </span>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide leading-tight">
                    Order Details
                  </h1>
                </div>

                <form onSubmit={handlePay} className="space-y-8 font-sans">
                  
                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-medium text-shas-heading border-b border-shas-border pb-2">
                      Shipping Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Email for Order Updates</label>
                        <input
                          type="email"
                          required
                          placeholder="anne.elliot@kellynhall.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">First Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Anne"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Last Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Elliot"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Shipping Address</label>
                        <input
                          type="text"
                          required
                          placeholder="12 Kellynch Hall Lane"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">City / Town</label>
                          <input
                            type="text"
                            required
                            placeholder="Somerset"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Postal Code</label>
                          <input
                            type="text"
                            required
                            placeholder="TA1 1AA"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+44 7911 123456"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-medium text-shas-heading border-b border-shas-border pb-2 flex items-center justify-between">
                      <span>Payment Method</span>
                      <span className="text-[9px] font-sans text-shas-secondary flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-shas-accent" /> Simulated Card Payment
                      </span>
                    </h3>

                    <div className="border border-shas-border bg-shas-border/10 p-5 space-y-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="4000 1234 5678 9010"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="w-full h-11 pl-10 pr-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs font-mono"
                          />
                          <CreditCard className="w-4 h-4 text-shas-secondary/60 absolute left-3.5 top-3.5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Expiration Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">CVV</label>
                          <input
                            type="password"
                            required
                            placeholder="***"
                            value={cvv}
                            onChange={handleCvvChange}
                            maxLength={4}
                            className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs font-mono"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-3.5 border border-red-200 bg-red-50 text-red-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Pay Action Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4.5 bg-shas-burgundy text-shas-bg border border-shas-burgundy hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 cursor-pointer dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg dark:hover:bg-shas-bg dark:hover:border-shas-brand dark:hover:text-shas-cream disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-shas-bg border-t-transparent rounded-full animate-spin inline-block" />
                        <span>Processing Payment Securely...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorize Payment • ${total.toFixed(2)}</span>
                      </>
                    )}
                  </button>

                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 border border-shas-border bg-shas-bg p-6 md:p-8 space-y-6 shadow-sm text-left">
                <h3 className="font-serif text-lg font-medium text-shas-heading border-b border-shas-border pb-3 uppercase tracking-wider text-[11px] font-semibold text-shas-secondary">
                  Your Selection
                </h3>

                {/* Items List */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center justify-between border-b border-shas-border/40 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-stone-50 border border-shas-border overflow-hidden flex-shrink-0">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif text-xs font-semibold text-shas-heading leading-tight">{item.title}</h4>
                          <span className="text-[10px] text-shas-secondary font-sans mt-0.5 block">
                            Qty {item.quantity} {item.size && item.size !== 'Standard' ? `• Size ${item.size}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-shas-heading">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="pt-4 border-t border-shas-border space-y-2 font-sans text-xs">
                  <div className="flex justify-between text-shas-secondary">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-shas-secondary">
                    <span>Shipping & Secure Delivery</span>
                    <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-shas-secondary">
                    <span>Simulated Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-shas-border flex justify-between font-serif text-base font-bold text-shas-heading">
                    <span>Selection Total</span>
                    <span className="text-shas-brand">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="pt-4 border-t border-shas-border/40 flex items-center gap-2.5 text-[10px] text-shas-secondary font-sans leading-tight">
                  <Lock className="w-4 h-4 text-shas-brand flex-shrink-0" />
                  <span>256-Bit SSL protection. Authorized transaction simulated for testing purposes only. No actual funds are exchanged.</span>
                </div>
              </div>

            </motion.div>
          ) : (
            /* Success confirmation screen */
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl mx-auto border border-shas-border bg-shas-bg p-8 md:p-12 shadow-lg text-center space-y-6"
            >
              <div className="inline-flex p-4 bg-shas-brand/10 border border-shas-brand/20 rounded-full text-shas-brand">
                <CheckCircle className="w-12 h-12 text-shas-accent animate-bounce" />
              </div>

              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-shas-brand font-semibold font-sans flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-shas-accent animate-pulse" /> Order Confirmed
                </div>
                
                <h1 className="font-serif text-3xl font-bold text-shas-heading leading-tight">
                  Thank You For Buying.
                </h1>
                
                <p className="text-xs text-shas-secondary font-sans leading-relaxed max-w-sm mx-auto">
                  Your checkout simulation was authorized. A mock order invoice has been generated for your review.
                </p>
              </div>

              {/* Order Details box */}
              <div className="border border-shas-border bg-shas-border/10 p-5 text-left font-sans text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-shas-secondary uppercase tracking-wider text-[10px] font-semibold">Order ID</span>
                  <span className="font-mono text-shas-heading font-bold">{mockOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-shas-secondary uppercase tracking-wider text-[10px] font-semibold">Delivery Address</span>
                  <span className="text-shas-heading text-right">{firstName} {lastName}<br />{address}, {city}</span>
                </div>
                <div className="flex justify-between border-t border-shas-border/40 pt-2">
                  <span className="text-shas-secondary uppercase tracking-wider text-[10px] font-semibold">Shipping Status</span>
                  <span className="text-shas-brand font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Handcrafting Atelier
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3 font-sans">
                <Link
                  to="/collections"
                  className="w-full py-3.5 bg-shas-burgundy text-shas-bg border border-shas-burgundy hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all text-xs tracking-widest uppercase font-bold text-center dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg dark:hover:bg-shas-bg dark:hover:border-shas-brand dark:hover:text-shas-cream"
                >
                  Continue Curation
                </Link>
                <Link
                  to="/"
                  className="text-[10px] uppercase tracking-widest font-semibold text-shas-secondary hover:text-shas-brand transition-colors block py-2"
                >
                  Return to Home
                </Link>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
