import React, { useState } from 'react';
import { X, Package, Clock, CheckCircle2, Search, Truck, ShieldCheck } from 'lucide-react';
import { Order } from '../types/clothing';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [lookupQuery, setLookupQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(lookupQuery.toLowerCase()) ||
    o.trackingNumber.toLowerCase().includes(lookupQuery.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="orders-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-xs shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-stone-900" />
            <h2 id="orders-title" className="font-serif text-2xl font-medium text-stone-900">
              Order History & Tracking
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close orders modal"
            className="text-stone-400 hover:text-stone-900 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Lookup Bar */}
          <div className="mb-6 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Track by Order # or TRK number..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-sm text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-stone-500">
              <Clock className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-[1.5]" />
              <p className="font-serif text-lg text-stone-800">No matching orders found</p>
              <p className="text-xs text-stone-400 mt-1">
                Completed purchases will automatically record here with live tracking.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order List Column */}
              <div className="space-y-3 md:border-r border-stone-200 pr-0 md:pr-4 max-h-[500px] overflow-y-auto">
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`w-full text-left p-3.5 border rounded-sm transition-all ${
                        isSelected
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-semibold text-stone-900">{ord.id}</span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        {ord.items.length} {ord.items.length === 1 ? 'piece' : 'pieces'} · ${ord.total}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span className="capitalize">{ord.status.replace('_', ' ')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Order Detail & Tracking Timeline Column */}
              <div className="md:col-span-2 space-y-6">
                {selectedOrder && (
                  <div className="bg-[#FAF9F6] p-6 rounded-sm border border-stone-200 space-y-6">
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
                      <div>
                        <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">Order Reference</span>
                        <h3 className="font-mono text-xl font-bold text-stone-900">{selectedOrder.id}</h3>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">Tracking Code</span>
                        <p className="font-mono text-sm font-semibold text-stone-800">{selectedOrder.trackingNumber}</p>
                      </div>
                    </div>

                    {/* Live Progress Stepper */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4">
                        Fulfillment Journey
                      </h4>
                      <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold">
                            ✓
                          </div>
                          <span className="mt-1 font-medium text-stone-900">Registered</span>
                          <span className="text-stone-400 text-[10px]">Verified</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold">
                            ✓
                          </div>
                          <span className="mt-1 font-medium text-stone-900">Tailoring Prep</span>
                          <span className="text-stone-400 text-[10px]">Quality check</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                          <span className="mt-1 font-medium text-emerald-800">In Transit</span>
                          <span className="text-emerald-700 text-[10px]">Courier out</span>
                        </div>
                        <div className="flex flex-col items-center opacity-40">
                          <div className="w-7 h-7 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center">
                            4
                          </div>
                          <span className="mt-1 font-medium text-stone-700">Delivered</span>
                          <span className="text-stone-400 text-[10px]">{selectedOrder.estimatedDelivery}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pieces Breakdown */}
                    <div className="pt-4 border-t border-stone-200">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
                        Curated Pieces in this Delivery
                      </h4>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-10 h-12 object-cover rounded-xs"
                              />
                              <div>
                                <p className="font-medium text-stone-900">{item.product.name}</p>
                                <p className="text-stone-500 text-[11px]">
                                  Size {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono font-semibold tabular-nums text-stone-900">
                              ${item.product.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address & Total */}
                    <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between text-xs text-stone-600 gap-4">
                      <div>
                        <span className="font-medium text-stone-900">Destination:</span>
                        <p>{selectedOrder.shippingDetails.fullName}</p>
                        <p>{selectedOrder.shippingDetails.address}</p>
                        <p>{selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.postalCode}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-500">Total Billed:</span>
                        <p className="font-mono text-lg font-bold text-stone-900">${selectedOrder.total}</p>
                        <p className="text-[11px] text-stone-500 capitalize">
                          Paid via {selectedOrder.paymentMethod.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
