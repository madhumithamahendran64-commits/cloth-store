import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, DollarSign, ArrowRight } from 'lucide-react';
import { CartItem, Order, ShippingDetails } from '../types/clothing';
import { PROMO_CODES } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoCode: string | null;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  promoCode,
  onOrderPlaced,
}) => {
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: 'Camille Laurent',
    email: 'camille.laurent@example.com',
    phone: '+1 (555) 382-9910',
    address: '450 Mercer Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10013',
    country: 'United States',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'cash_on_delivery'>('credit_card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('831');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let discountAmount = 0;
  if (promoCode && PROMO_CODES[promoCode]) {
    discountAmount = Math.round((subtotal * PROMO_CODES[promoCode].discountPercent) / 100);
  }

  const shippingCost = deliveryMethod === 'express' ? 25 : subtotal >= 150 ? 0 : 15;
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.08);
  const total = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `ET-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        items: [...items],
        subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        tax: estimatedTax,
        total,
        promoCode: promoCode || undefined,
        shippingDetails: { ...formData },
        deliveryMethod,
        paymentMethod,
        status: 'confirmed',
        estimatedDelivery: deliveryMethod === 'express' ? 'In 2 business days' : 'In 4-5 business days',
        trackingNumber,
      };

      setConfirmedOrder(newOrder);
      onOrderPlaced(newOrder);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="fixed inset-0" onClick={confirmedOrder ? onClose : undefined} />

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-xs shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight text-stone-900">
              ATELIER ÉTOILE
            </span>
            <span className="text-stone-300">/</span>
            <h2 id="checkout-title" className="text-xs uppercase tracking-wider text-stone-600 font-medium">
              Secure Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="text-stone-400 hover:text-stone-900 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {confirmedOrder ? (
          /* Order Confirmation Receipt View */
          <div className="p-8 sm:p-10 text-center animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-3xl font-medium text-stone-900">
              Order Confirmed
            </h3>
            <p className="text-stone-500 text-sm mt-1">
              Thank you, {confirmedOrder.shippingDetails.fullName}. Your handcrafted garments are being prepared.
            </p>

            {/* Receipt Summary Card */}
            <div className="mt-8 bg-[#FAF9F6] border border-stone-200 rounded-sm p-6 text-left max-w-xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 text-xs text-stone-600">
                <div>
                  <span className="font-mono text-stone-900 font-bold">{confirmedOrder.id}</span>
                  <p className="text-[11px] text-stone-400">Order Reference</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-stone-800">{confirmedOrder.trackingNumber}</span>
                  <p className="text-[11px] text-stone-400">Carbon-Neutral Tracking</p>
                </div>
              </div>

              {/* Items summary */}
              <div className="py-4 space-y-2 border-b border-stone-200">
                {confirmedOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-xs text-stone-800">
                    <span>
                      {it.quantity}x {it.product.name} ({it.selectedSize}, {it.selectedColor})
                    </span>
                    <span className="font-mono tabular-nums">${it.product.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="pt-4 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-900">${confirmedOrder.subtotal}</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${confirmedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({confirmedOrder.deliveryMethod})</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    {confirmedOrder.shipping === 0 ? 'Complimentary' : `$${confirmedOrder.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="font-mono tabular-nums text-stone-900">${confirmedOrder.tax}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Paid</span>
                  <span className="font-mono tabular-nums">${confirmedOrder.total}</span>
                </div>
              </div>

              {/* Delivery Address Note */}
              <div className="mt-4 pt-3 border-t border-stone-200/80 text-[11px] text-stone-500">
                <span>Shipping to: </span>
                <strong className="text-stone-800">
                  {confirmedOrder.shippingDetails.address}, {confirmedOrder.shippingDetails.city} {confirmedOrder.shippingDetails.postalCode}
                </strong>
                <p className="mt-0.5">Estimated delivery: {confirmedOrder.estimatedDelivery}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-stone-900 text-white font-medium text-xs uppercase tracking-wider rounded-sm hover:bg-stone-800 transition-colors"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Input Form */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Shipping & Delivery */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-medium text-stone-900 mb-3">
                    1. Shipping Information
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-600 mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-800"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-stone-600 mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">State / Prov</label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <h3 className="font-serif text-lg font-medium text-stone-900 mb-3">
                    2. Delivery Speed
                  </h3>
                  <div className="space-y-2 text-xs">
                    <label
                      onClick={() => setDeliveryMethod('standard')}
                      className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-all ${
                        deliveryMethod === 'standard' ? 'border-stone-900 bg-stone-50' : 'border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-stone-700" />
                        <div>
                          <p className="font-medium text-stone-900">Carbon-Neutral Standard (3–5 days)</p>
                          <p className="text-stone-500 text-[11px]">Biodegradable cotton garment sleeve</p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold tabular-nums text-stone-900">
                        {subtotal >= 150 ? 'FREE' : '$15'}
                      </span>
                    </label>

                    <label
                      onClick={() => setDeliveryMethod('express')}
                      className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-all ${
                        deliveryMethod === 'express' ? 'border-stone-900 bg-stone-50' : 'border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-stone-900" />
                        <div>
                          <p className="font-medium text-stone-900">Atelier Courier Express (1–2 days)</p>
                          <p className="text-stone-500 text-[11px]">Signature requested upon handoff</p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold tabular-nums text-stone-900">$25</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment & Order Summary */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-medium text-stone-900 mb-3">
                    3. Payment Method
                  </h3>
                  {/* Segmented Payment Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-sm mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`py-1.5 text-xs font-medium rounded-sm flex items-center justify-center gap-1 transition-all ${
                        paymentMethod === 'credit_card' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`py-1.5 text-xs font-medium rounded-sm flex items-center justify-center gap-1 transition-all ${
                        paymentMethod === 'apple_pay' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      <span> Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`py-1.5 text-xs font-medium rounded-sm flex items-center justify-center gap-1 transition-all ${
                        paymentMethod === 'cash_on_delivery' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>COD</span>
                    </button>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-2 text-xs bg-[#FAF9F6] p-3.5 border border-stone-200 rounded-sm">
                      <div>
                        <label className="block text-stone-600 mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm font-mono text-stone-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-stone-600 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm font-mono text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1">CVC Security</label>
                          <input
                            type="text"
                            required
                            placeholder="CVC"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm font-mono text-stone-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'apple_pay' && (
                    <div className="p-4 bg-stone-900 text-stone-100 rounded-sm text-center text-xs">
                      <p className="font-medium">1-Touch Apple Pay Activated</p>
                      <p className="text-[11px] text-stone-400 mt-1">Biometric confirmation will trigger when completing order.</p>
                    </div>
                  )}

                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900">
                      <p className="font-medium">Cash on Delivery Terms:</p>
                      <p className="text-[11px] text-amber-800 mt-1">
                        Please prepare exact payment of <strong className="font-mono tabular-nums">${total}</strong> upon physical receipt. Our courier will provide printed proof of delivery.
                      </p>
                    </div>
                  )}
                </div>

                {/* Mini Order Summary */}
                <div className="bg-stone-50 p-4 rounded-sm border border-stone-200 space-y-2 text-xs">
                  <h4 className="font-medium text-stone-900 uppercase tracking-wider text-[11px]">
                    Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} pieces)
                  </h4>
                  <div className="space-y-1 text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums">${subtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount ({promoCode})</span>
                        <span className="font-mono tabular-nums">-${discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-mono tabular-nums">
                        {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span className="font-mono tabular-nums">${estimatedTax}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-stone-900 text-sm pt-2 border-t border-stone-200">
                      <span>Total Amount</span>
                      <span className="font-mono tabular-nums">${total}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Authorizing Order with Atelier...</span>
                  ) : (
                    <>
                      <span>Complete Order — ${total}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                  <span>256-Bit Encrypted · Certified Carbon Neutral</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
