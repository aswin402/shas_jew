import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, Gift, Lock } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useState, useEffect } from 'react';

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    getCartTotal,
  } = useCartStore();

  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Escape key handler to close Cart Drawer
  useEffect(() => {
    if (!isCartOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, setCartOpen]);

  const subtotal = getCartTotal();
  const giftWrapCost = giftWrap ? 5 : 0;
  const total = subtotal + giftWrapCost;
  const FREE_SHIPPING_THRESHOLD = 150;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Cart Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-shas-bg text-shas-heading shadow-2xl flex flex-col border-l border-shas-border"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-6 border-b border-shas-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-shas-brand" />
                <h2 className="font-serif text-xl font-medium tracking-wide">Your Jewelry Box</h2>
                <span className="text-xs font-sans px-2 py-0.5 bg-shas-brand/10 text-shas-brand font-medium">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-shas-secondary hover:text-shas-heading transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {cartItems.length > 0 && (
              <div className="px-6 py-4 bg-shas-border/20 border-b border-shas-border">
                <div className="text-xs text-shas-secondary font-sans flex justify-between mb-2">
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      You are{' '}
                      <span className="font-semibold text-shas-brand">${remainingForFreeShipping.toFixed(2)}</span>{' '}
                      away from <strong className="text-shas-heading">Free Shipping</strong>
                    </span>
                  ) : (
                    <span className="text-shas-brand font-semibold flex items-center gap-1">
                      ✨ You qualify for Free Shipping!
                    </span>
                  )}
                  <span>${subtotal.toFixed(0)} / ${FREE_SHIPPING_THRESHOLD}</span>
                </div>
                <div className="w-full h-1 bg-shas-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-shas-brand transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-10">
                  <div className="w-16 h-16 rounded-full bg-shas-border/30 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-shas-secondary" />
                  </div>
                  <h3 className="font-serif text-lg text-shas-heading">Your Jewelry Box is Empty</h3>
                  <p className="text-sm text-shas-secondary max-w-xs">
                    Every piece starts a new narrative. Explore our curated collections to find your signature statement.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-2 px-6 py-2.5 bg-shas-brand text-shas-bg hover:opacity-90 font-sans text-xs tracking-widest uppercase transition-opacity"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-shas-border/60 last:border-0 last:pb-0"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 bg-stone-50 border border-shas-border overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm text-shas-heading leading-tight">{item.title}</h4>
                          <span className="font-sans text-sm font-medium text-shas-brand">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xxs text-shas-secondary uppercase tracking-wider mt-1">
                          {item.material ? `${item.material} • ` : ''}
                          {item.category}
                          {item.size ? ` • Size ${item.size}` : ''}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-shas-border bg-shas-bg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-shas-border/20 text-shas-secondary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono font-medium text-shas-heading">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-shas-border/20 text-shas-secondary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-shas-secondary hover:text-shas-brand transition-colors flex items-center gap-1 font-sans"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-shas-border bg-shas-border/10 space-y-4">
                {/* Gift Wrap & Note Toggle */}
                <div className="border border-shas-border bg-shas-bg p-3.5 space-y-2.5">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="mt-1 accent-shas-brand"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-shas-heading flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-shas-accent" /> Include Signature Gift Box (+$5.00)
                      </span>
                      <p className="text-shas-secondary mt-0.5">
                        Delivered in a velvet pouch, custom linen box, and hand-written envelope.
                      </p>
                    </div>
                  </label>
                  
                  {giftWrap && (
                    <div className="pt-2 border-t border-shas-border/60">
                      {!showNoteInput ? (
                        <button
                          onClick={() => setShowNoteInput(true)}
                          className="text-xxs font-semibold uppercase tracking-wider text-shas-brand hover:opacity-85"
                        >
                          + Add a Gift Note
                        </button>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-xxs uppercase tracking-wider text-shas-secondary">
                            Your Gift Note Message:
                          </label>
                          <textarea
                            value={giftNote}
                            onChange={(e) => setGiftNote(e.target.value)}
                            placeholder="To my favorite, may this keep you glowing..."
                            className="w-full text-xs p-2 border border-shas-border bg-shas-bg focus:outline-none focus:border-shas-brand resize-none h-16 font-sans"
                            maxLength={180}
                          />
                          <div className="flex justify-between items-center text-xxs text-shas-secondary">
                            <span>{giftNote.length}/180 characters</span>
                            <button
                              onClick={() => {
                                setShowNoteInput(false);
                                setGiftNote('');
                              }}
                              className="text-shas-brand hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtotals */}
                <div className="space-y-2 text-sm font-sans">
                  <div className="flex justify-between text-shas-secondary">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {giftWrap && (
                    <div className="flex justify-between text-shas-secondary">
                      <span>Signature Packaging</span>
                      <span>$5.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-shas-secondary">
                    <span>Shipping</span>
                    <span>{remainingForFreeShipping <= 0 ? 'FREE' : 'Calculated at checkout'}</span>
                  </div>
                  <div className="pt-2 border-t border-shas-border/60 flex justify-between font-serif text-base font-semibold text-shas-heading">
                    <span>Estimated Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      alert('Checkout pipeline simulation! Under production.');
                    }}
                    className="w-full py-4 bg-shas-brand text-shas-bg hover:opacity-95 transition-opacity font-sans text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to Checkout</span>
                  </button>
                  <p className="text-center text-xxs text-shas-secondary">
                    Secure checkout. Fully encrypted connections.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
