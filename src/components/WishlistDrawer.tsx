import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types/clothing';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToBag: (product: Product) => void;
  onExplore: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToBag,
  onExplore,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-stone-900 fill-stone-900" />
              <h2 id="wishlist-title" className="font-serif text-xl font-medium text-stone-900">
                Saved Pieces
              </h2>
              <span className="font-mono text-xs text-stone-500 tabular-nums">
                ({wishlist.length})
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close wishlist"
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                  <Heart className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg font-medium text-stone-800">
                  No saved pieces yet
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Click the heart icon on any overcoat, blazer, or knit to curate your personal wishlist.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExplore();
                  }}
                  className="mt-6 px-5 py-2.5 bg-stone-900 text-stone-100 text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-stone-800 transition-colors"
                >
                  Discover Pieces
                </button>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 pb-4 border-b border-stone-100 last:border-b-0"
                >
                  <div className="w-20 h-24 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base font-medium text-stone-900 leading-tight">
                          {product.name}
                        </h4>
                        <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums shrink-0">
                          ${product.price}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                        {product.material.split(';')[0]}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <button
                        onClick={() => onMoveToBag(product)}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 border-t border-stone-200 bg-[#FAF9F6] text-center">
              <p className="text-xs text-stone-500">
                Pieces in your wishlist remain reserved while stock permits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
