import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '../types/clothing';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleQuickSizeSelect = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    onQuickAdd(product, size, selectedColor);
    setShowQuickSizes(false);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1800);
  };

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-[#FBFBF9] border border-stone-200/70 rounded-xs overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-stone-300"
    >
      {/* Visual Image Container with 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        {/* Subtle tag kicker if present (clean text, no pill clutter) */}
        {product.tag && (
          <div className="absolute top-3 left-3 z-10 text-[11px] font-medium uppercase tracking-wider text-stone-900 bg-white/90 backdrop-blur-sm px-2 py-0.5 shadow-xs">
            {product.tag}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm ${
            isWishlisted
              ? 'bg-stone-900 text-stone-100'
              : 'bg-white/80 text-stone-700 hover:text-stone-950 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-stone-100' : ''}`} />
        </button>

        {/* Fallback container if image fails or before load */}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 bg-stone-200 flex flex-col items-center justify-center p-6 text-stone-400">
            <span className="font-serif text-lg text-stone-600 font-medium text-center">{product.name}</span>
            <span className="text-xs text-stone-500 mt-1 uppercase tracking-widest">{product.material.split(',')[0]}</span>
          </div>
        )}

        {/* Product Image */}
        {!imageError && (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Quick Add Overlay on Hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
          {showQuickSizes ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-md p-2.5 rounded shadow-md text-stone-900 animate-fadeIn"
            >
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-stone-500">
                <span className="uppercase font-medium">Select Size:</span>
                <button
                  onClick={() => setShowQuickSizes(false)}
                  className="text-stone-400 hover:text-stone-900 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={(e) => handleQuickSizeSelect(e, sz)}
                    className="flex-1 min-w-[32px] py-1 text-xs font-mono font-medium border border-stone-200 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-colors text-center"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickSizes(true);
              }}
              className="w-full py-2.5 bg-stone-900/90 text-stone-100 backdrop-blur-sm text-xs font-medium tracking-wide uppercase flex items-center justify-center gap-1.5 hover:bg-stone-950 transition-colors shadow-sm"
            >
              {addedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Product Card Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Unboxed Metadata with Typographic Separator (Rule 1.A) */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[150px]">{product.material.split(';')[0].split(',')[0]}</span>
          </div>

          {/* Product Title */}
          <h2 className="font-serif text-lg font-medium text-stone-900 leading-snug group-hover:text-stone-700 transition-colors line-clamp-1">
            {product.name}
          </h2>

          <p className="text-xs text-stone-500 font-light line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom row: Color Swatches & Price */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          {/* Color preview dots */}
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {product.colors.map((c) => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === c.name
                    ? 'ring-1 ring-stone-900 ring-offset-1 scale-110'
                    : 'border-stone-300'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-stone-400 font-mono">+{product.colors.length - 3}</span>
            )}
          </div>

          {/* Price with tabular numerals */}
          <div className="flex items-baseline gap-1.5 text-right font-mono tabular-nums">
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-sm font-semibold text-stone-900">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
