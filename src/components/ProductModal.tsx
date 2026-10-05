import React, { useState } from 'react';
import { X, Heart, Star, Check, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { Product } from '../types/clothing';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care'>('details');
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-xs shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-950 bg-white/80 hover:bg-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Gallery / High-Res Image */}
          <div className="relative bg-stone-100 aspect-[3/4] md:aspect-auto flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-stone-900 text-stone-100 text-[11px] uppercase tracking-wider px-2.5 py-1 font-medium">
                {product.tag}
              </span>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="uppercase tracking-widest font-medium text-stone-600">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 font-mono text-stone-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 id="modal-title" className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Price row */}
              <div className="mt-3 flex items-baseline gap-2 font-mono tabular-nums">
                <span className="text-2xl font-bold text-stone-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-stone-500 font-sans ml-2">
                  Tax included · Duties covered
                </span>
              </div>

              {/* Short subtitle / description */}
              <p className="mt-3 text-sm text-stone-600 leading-relaxed font-light">
                {product.subtitle}
              </p>

              {/* Color Swatch Selection */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-medium text-stone-900">
                    Color: <span className="font-normal text-stone-600">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`group relative flex items-center justify-center p-1 rounded-full border transition-all ${
                        selectedColor === c.name
                          ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-2'
                          : 'border-stone-300 hover:border-stone-500'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-medium text-stone-900">
                    Select Size: <span className="font-mono text-stone-600 font-normal">{selectedSize}</span>
                  </span>
                  <span className="text-stone-400 text-[11px]">True to tailoring standard</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 text-xs font-mono font-medium rounded-sm border transition-all text-center ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-stone-500 font-light flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  <span>Only {product.inventory} garments crafted in this small batch</span>
                </p>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-medium text-stone-900">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30 text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono text-xs font-semibold tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    disabled={quantity >= product.inventory}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Action Button */}
            <div className="mt-8 pt-6 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  disabled={addedNotice}
                  className={`flex-1 py-3.5 px-6 font-medium text-xs tracking-wider uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    addedNotice
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Wardrobe Bag</span>
                    </>
                  ) : (
                    <span>Add to Bag — ${(product.price * quantity).toLocaleString()}</span>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  aria-label={isWishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
                  className={`p-3.5 border rounded-sm transition-colors ${
                    isWishlisted
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-300 text-stone-700 hover:border-stone-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Informative Specs Accordion/Tabs */}
              <div className="mt-6 border-t border-stone-100 pt-4">
                <div className="flex items-center gap-4 text-xs border-b border-stone-100 pb-2">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`font-medium transition-colors ${
                      activeTab === 'details' ? 'text-stone-950 font-semibold underline' : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Tailoring & Details
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`font-medium transition-colors ${
                      activeTab === 'materials' ? 'text-stone-950 font-semibold underline' : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Fibers & Origin
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`font-medium transition-colors ${
                      activeTab === 'care' ? 'text-stone-950 font-semibold underline' : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Garment Care
                  </button>
                </div>

                <div className="py-3 text-xs text-stone-600 leading-relaxed">
                  {activeTab === 'details' && (
                    <ul className="space-y-1.5 list-disc list-inside">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                      <li>Fit guide: {product.fit}</li>
                    </ul>
                  )}
                  {activeTab === 'materials' && (
                    <p>{product.material}</p>
                  )}
                  {activeTab === 'care' && (
                    <p>{product.care}</p>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-700" />
                  <span>Free express &gt;$150</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-stone-700" />
                  <span>30-Day returns</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                  <span>Lifetime repair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
