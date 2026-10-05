import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Clock, X } from 'lucide-react';
import { ProductCategory } from '../types/clothing';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  activeCategory: ProductCategory;
  onOpenSearch: () => void;
  onOpenCapsule: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  ordersCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onSelectCategory,
  activeCategory,
  onOpenSearch,
  onOpenCapsule,
}) => {
  const [showPromo, setShowPromo] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Slim Promotional Announcement Bar */}
      {showPromo && (
        <aside 
          aria-label="Promotional announcement"
          className="bg-stone-900 text-stone-200 text-xs px-4 py-2 flex items-center justify-between tracking-wide"
        >
          <div className="flex-1 text-center font-normal">
            <span>Complimentary worldwide carbon-neutral delivery on orders over $150</span>
            <span className="mx-2 text-stone-500">·</span>
            <span className="text-stone-300 font-medium">Use code FIRST10 for 10% off</span>
          </div>
          <button
            onClick={() => setShowPromo(false)}
            aria-label="Dismiss promotional banner"
            className="text-stone-400 hover:text-white transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Main Top Bar strictly obeying the 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Zone */}
        <button
          onClick={() => onSelectCategory('all')}
          className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 hover:text-stone-700 transition-colors text-left"
        >
          ATELIER ÉTOILE
        </button>

        {/* Zone 2: 4-6 clean text navigation links with subtle underline */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium tracking-wide uppercase text-stone-600">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors hover:text-stone-950 pb-1 relative ${
              activeCategory === 'all'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-stone-950'
                : ''
            }`}
          >
            All Pieces
          </button>
          <button
            onClick={() => onSelectCategory('outerwear')}
            className={`transition-colors hover:text-stone-950 pb-1 relative ${
              activeCategory === 'outerwear'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-stone-950'
                : ''
            }`}
          >
            Outerwear
          </button>
          <button
            onClick={() => onSelectCategory('tailoring')}
            className={`transition-colors hover:text-stone-950 pb-1 relative ${
              activeCategory === 'tailoring'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-stone-950'
                : ''
            }`}
          >
            Tailoring
          </button>
          <button
            onClick={() => onSelectCategory('knitwear')}
            className={`transition-colors hover:text-stone-950 pb-1 relative ${
              activeCategory === 'knitwear'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-stone-950'
                : ''
            }`}
          >
            Knitwear
          </button>
          <button
            onClick={() => onSelectCategory('dresses')}
            className={`transition-colors hover:text-stone-950 pb-1 relative ${
              activeCategory === 'dresses'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-stone-950'
                : ''
            }`}
          >
            Dresses
          </button>
          <button
            onClick={onOpenCapsule}
            className="text-stone-800 hover:text-stone-950 pb-1 transition-colors flex items-center gap-1.5"
          >
            <span>Capsule Studio</span>
          </button>
        </nav>

        {/* Zone 3: Primary functional actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            aria-label="Search collection"
            className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/70 rounded-full transition-colors"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Order Tracking / History */}
          <button
            onClick={onOpenOrders}
            aria-label="Order history"
            title="Order History & Tracking"
            className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/70 rounded-full transition-colors relative"
          >
            <Clock className="w-4.5 h-4.5" />
            {ordersCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-stone-900 rounded-full" />
            )}
          </button>

          {/* Saved Wishlist */}
          <button
            onClick={onOpenWishlist}
            aria-label="Saved wishlist"
            title="Saved Pieces"
            className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/70 rounded-full transition-colors relative"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-stone-900 text-stone-100 text-[10px] font-medium flex items-center justify-center rounded-full tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Bag with Count */}
          <button
            onClick={onOpenCart}
            aria-label="Shopping bag"
            className="flex items-center gap-2.5 px-3.5 py-2 bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors text-xs font-medium tracking-wide rounded-sm whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-stone-800 text-stone-200 px-1.5 py-0.5 rounded text-[11px] tabular-nums font-mono">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
