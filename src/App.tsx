import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CapsuleBuilder } from './components/CapsuleBuilder';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrdersModal } from './components/OrdersModal';
import { StorySection } from './components/StorySection';
import { Footer } from './components/Footer';

import { Product, CartItem, Order, FilterOptions, ProductCategory } from './types/clothing';
import { PRODUCTS, PROMO_CODES } from './data/products';

const INITIAL_FILTERS: FilterOptions = {
  category: 'all',
  minPrice: 0,
  maxPrice: 1000,
  size: null,
  color: null,
  sort: 'featured',
  searchQuery: '',
};

export default function App() {
  const collectionRef = useRef<HTMLDivElement>(null);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist');
      return saved ? JSON.parse(saved) : [PRODUCTS[0]];
    } catch {
      return [PRODUCTS[0]];
    }
  });

  // Orders State (Persisted in localStorage with sample seed)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_orders');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Initial seed order so user can explore tracking journey
    return [
      {
        id: 'ET-819204',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        items: [
          {
            id: 'coat-cashmere-overcoat-M-Camel Tan',
            product: PRODUCTS[0],
            selectedSize: 'M',
            selectedColor: 'Camel Tan',
            quantity: 1,
          },
        ],
        subtotal: 680,
        discount: 68,
        shipping: 0,
        tax: 49,
        total: 661,
        promoCode: 'FIRST10',
        shippingDetails: {
          fullName: 'Madhumitha M.',
          email: 'madhumithamahendran64@gmail.com',
          phone: '+1 (555) 019-2834',
          address: '88 Orchard Boulevard, Suite 12A',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States',
        },
        deliveryMethod: 'standard',
        paymentMethod: 'credit_card',
        status: 'dispatched',
        estimatedDelivery: 'Tomorrow by 4:00 PM',
        trackingNumber: 'TRK-99201482',
      },
    ];
  });

  // Applied Promo Code
  const [promoCode, setPromoCode] = useState<string | null>('FIRST10');

  // Filter State
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);

  // Modals & Drawers Visibility
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCapsuleOpen, setIsCapsuleOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('atelier_orders', JSON.stringify(orders));
  }, [orders]);

  // Handlers for cart
  const handleAddToCart = (product: Product, size: string, color: string, quantity = 1) => {
    const itemId = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, selectedSize: size, selectedColor: color, quantity }];
    });
  };

  const handleQuickAdd = (product: Product, size: string, color: string) => {
    handleAddToCart(product, size, color, 1);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Handlers for wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleMoveWishlistToBag = (product: Product) => {
    handleAddToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || '', 1);
    handleToggleWishlist(product);
    setIsCartOpen(true);
  };

  // Promo code validation
  const handleApplyPromoCode = (code: string): { success: boolean; message: string } => {
    const promo = PROMO_CODES[code];
    if (!promo) {
      return { success: false, message: `Code "${code}" is not valid.` };
    }
    const currentSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (promo.minSpend && currentSubtotal < promo.minSpend) {
      return {
        success: false,
        message: `Code requires a minimum spend of $${promo.minSpend}.`,
      };
    }
    setPromoCode(code);
    return {
      success: true,
      message: `Code applied: ${promo.description}`,
    };
  };

  const handleRemovePromoCode = () => {
    setPromoCode(null);
  };

  // Place order
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
  };

  // Add Capsule items
  const handleAddCapsuleToBag = (items: { product: Product; size: string; color: string }[]) => {
    items.forEach(({ product, size, color }) => {
      handleAddToCart(product, size, color, 1);
    });
    setIsCartOpen(true);
  };

  // Open product modal
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setFilters((prev) => ({ ...prev, category: cat }));
    scrollToCollection();
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.size && !p.sizes.includes(filters.size)) return false;
      if (filters.color && !p.colors.some((c) => c.name.toLowerCase().includes(filters.color!.toLowerCase()))) return false;
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSub = p.subtitle.toLowerCase().includes(q);
        const matchesMaterial = p.material.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesMaterial && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price;
      if (filters.sort === 'price-desc') return b.price - a.price;
      if (filters.sort === 'rating') return b.rating - a.rating;
      if (filters.sort === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured default
    });
  }, [filters]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] selection:bg-stone-900 selection:text-white">
      {/* Top Bar following 3-Zone Contract */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        ordersCount={orders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onSelectCategory={handleSelectCategory}
        activeCategory={filters.category}
        onOpenSearch={() => {
          scrollToCollection();
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          searchInput?.focus();
        }}
        onOpenCapsule={() => setIsCapsuleOpen(true)}
      />

      {/* Main Campaign Hero */}
      <Hero
        onExploreCollection={scrollToCollection}
        onOpenCapsule={() => setIsCapsuleOpen(true)}
      />

      {/* Collection Anchor & Interactive Refinement Bar */}
      <main id="collection" ref={collectionRef} className="flex-1">
        <FilterBar
          filters={filters}
          onChangeFilters={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
          totalProductsCount={PRODUCTS.length}
          filteredCount={filteredProducts.length}
        />

        {/* Product Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center">
              <h3 className="font-serif text-2xl text-stone-800 font-medium">No garments match your filters</h3>
              <p className="text-stone-500 text-xs mt-2 max-w-sm mx-auto">
                Try widening your price range, choosing another category, or resetting your active criteria.
              </p>
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-6 px-5 py-2.5 bg-stone-900 text-stone-100 text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-stone-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.some((p) => p.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={handleSelectProduct}
                    onQuickAdd={handleQuickAdd}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Story & Craftsmanship Section */}
        <StorySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlist.some((p) => p.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={promoCode}
        onApplyPromoCode={handleApplyPromoCode}
        onRemovePromoCode={handleRemovePromoCode}
        onExplore={() => {
          setIsCartOpen(false);
          scrollToCollection();
        }}
      />

      {/* Capsule Wardrobe Builder Modal */}
      <CapsuleBuilder
        isOpen={isCapsuleOpen}
        onClose={() => setIsCapsuleOpen(false)}
        products={PRODUCTS}
        onAddCapsuleToBag={handleAddCapsuleToBag}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToBag={handleMoveWishlistToBag}
        onExplore={() => {
          setIsWishlistOpen(false);
          scrollToCollection();
        }}
      />

      {/* Orders & Live Tracking Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      {/* Checkout Simulator Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        promoCode={promoCode}
        onOrderPlaced={handleOrderPlaced}
      />
    </div>
  );
}
