import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types/clothing';
import { PROMO_CODES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  promoCode: string | null;
  onApplyPromoCode: (code: string) => { success: boolean; message: string };
  onRemovePromoCode: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  promoCode,
  onApplyPromoCode,
  onRemovePromoCode,
  onExplore,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  if (promoCode && PROMO_CODES[promoCode]) {
    const promo = PROMO_CODES[promoCode];
    discountAmount = Math.round((subtotal * promo.discountPercent) / 100);
  }

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 15;
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.08);
  const total = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = onApplyPromoCode(inputCode.trim().toUpperCase());
    if (res.success) {
      setPromoMessage({ text: res.message, error: false });
      setInputCode('');
    } else {
      setPromoMessage({ text: res.message, error: true });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5 text-stone-900" />
              <h2 id="cart-title" className="font-serif text-xl font-medium text-stone-900">
                Wardrobe Bag
              </h2>
              <span className="font-mono text-xs text-stone-500 tabular-nums">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors rounded-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-stone-100/70 border-b border-stone-200/80 text-xs">
            {amountUntilFreeShipping > 0 ? (
              <p className="text-stone-700">
                Add <span className="font-mono font-semibold text-stone-900 tabular-nums">${amountUntilFreeShipping}</span> more for complimentary express delivery
              </p>
            ) : (
              <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>You unlocked complimentary carbon-neutral delivery!</span>
              </p>
            )}
            <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-stone-900 transition-all duration-300 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg font-medium text-stone-800">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Explore our seasonal tailoring, heavy knits, and silk dresses to begin your capsule.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExplore();
                  }}
                  className="mt-6 px-5 py-2.5 bg-stone-900 text-stone-100 text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-stone-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-stone-100 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200/60">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base font-medium text-stone-900 leading-tight">
                          {item.product.name}
                        </h4>
                        <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums shrink-0">
                          ${item.product.price * item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                        <span>Size: <strong className="font-mono text-stone-800">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>{item.selectedColor}</span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-200 rounded-sm">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-500 hover:text-stone-900 text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs font-medium tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-500 hover:text-stone-900 text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Pricing Breakdown */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#FAF9F6] space-y-4">
              {/* Promo Code Input */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-stone-100 px-3 py-2 rounded-sm text-xs">
                    <div className="flex items-center gap-1.5 text-stone-800">
                      <Tag className="w-3.5 h-3.5 text-stone-700" />
                      <span className="font-mono font-semibold">{promoCode}</span>
                      <span className="text-stone-500">applied</span>
                    </div>
                    <button
                      onClick={onRemovePromoCode}
                      className="text-stone-500 hover:text-stone-900 font-medium underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. FIRST10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-sm text-stone-900 uppercase font-mono placeholder:normal-case placeholder:font-sans placeholder-stone-400 focus:outline-none focus:border-stone-800"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium text-xs rounded-sm transition-colors whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && (
                  <p className={`mt-1.5 text-[11px] ${promoMessage.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/70 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-900">${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({promoCode})</span>
                    <span className="font-mono tabular-nums">-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-mono tabular-nums text-stone-900">${estimatedTax}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-base">${total}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-stone-900 text-white hover:bg-stone-800 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[10px] text-stone-500">
                Taxes & carbon offsets calculated at checkout. 30-day effortless returns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
