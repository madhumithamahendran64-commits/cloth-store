import React, { useState } from 'react';
import { X, Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types/clothing';

interface CapsuleBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddCapsuleToBag: (items: { product: Product; size: string; color: string }[]) => void;
}

interface CuratedLook {
  id: string;
  title: string;
  narrative: string;
  outerwearId: string;
  topId: string;
  bottomId: string;
}

const PRESET_LOOKS: CuratedLook[] = [
  {
    id: 'executive-minimalist',
    title: 'The Modern Executive',
    narrative: 'Structured Biella wool tailoring balanced with tactile fisherman merino ribs and sharp pleated flannel.',
    outerwearId: 'blazer-charcoal-wool',
    topId: 'knit-ribbed-merino',
    bottomId: 'trouser-pleated-wool',
  },
  {
    id: 'autumn-gallery',
    title: 'The Autumn Gallery Walk',
    narrative: 'Architectural double-faced Mongolian cashmere draped over fluid mulberry silk and heavyweight cotton.',
    outerwearId: 'coat-cashmere-overcoat',
    topId: 'top-heavy-cotton',
    bottomId: 'dress-silk-crepe',
  },
  {
    id: 'studio-weekend',
    title: 'The Studio Atrium',
    narrative: 'Heavy cotton storm-flap trench paired with chunky rib sweater and 12oz raw Japanese twill chinos.',
    outerwearId: 'coat-trench-gabardine',
    topId: 'knit-ribbed-merino',
    bottomId: 'trouser-wide-twill',
  },
];

export const CapsuleBuilder: React.FC<CapsuleBuilderProps> = ({
  isOpen,
  onClose,
  products,
  onAddCapsuleToBag,
}) => {
  if (!isOpen) return null;

  const outerwearOptions = products.filter((p) => p.category === 'outerwear' || p.category === 'tailoring');
  const topOptions = products.filter((p) => p.category === 'knitwear' || p.category === 'tops');
  const bottomOptions = products.filter((p) => p.category === 'trousers' || p.category === 'dresses');

  const [selectedOuterwear, setSelectedOuterwear] = useState<Product>(outerwearOptions[0] || products[0]);
  const [selectedTop, setSelectedTop] = useState<Product>(topOptions[0] || products[1]);
  const [selectedBottom, setSelectedBottom] = useState<Product>(bottomOptions[0] || products[2]);

  const [outerwearSize, setOuterwearSize] = useState('M');
  const [topSize, setTopSize] = useState('M');
  const [bottomSize, setBottomSize] = useState('M');

  const [addedNotice, setAddedNotice] = useState(false);

  const rawTotal = selectedOuterwear.price + selectedTop.price + selectedBottom.price;
  const bundleDiscount = Math.round(rawTotal * 0.15); // 15% capsule bundle savings
  const bundleTotal = rawTotal - bundleDiscount;

  const handleApplyPreset = (look: CuratedLook) => {
    const foundOuter = products.find((p) => p.id === look.outerwearId);
    const foundTop = products.find((p) => p.id === look.topId);
    const foundBottom = products.find((p) => p.id === look.bottomId);

    if (foundOuter) setSelectedOuterwear(foundOuter);
    if (foundTop) setSelectedTop(foundTop);
    if (foundBottom) setSelectedBottom(foundBottom);
  };

  const handleAddCapsule = () => {
    onAddCapsuleToBag([
      { product: selectedOuterwear, size: outerwearSize, color: selectedOuterwear.colors[0]?.name || '' },
      { product: selectedTop, size: topSize, color: selectedTop.colors[0]?.name || '' },
      { product: selectedBottom, size: bottomSize, color: selectedBottom.colors[0]?.name || '' },
    ]);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="capsule-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl bg-[#FAF9F6] rounded-xs shadow-2xl overflow-hidden border border-stone-200 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-stone-900" />
            <h2 id="capsule-title" className="font-serif text-2xl font-medium text-stone-900">
              The Capsule Wardrobe Studio
            </h2>
            <span className="hidden sm:inline text-xs text-stone-500 font-sans">
              · Curate 3 cohesive pieces & save 15%
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close capsule studio"
            className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Curated Preset Looks Selector */}
        <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
            Curated Formations:
          </span>
          {PRESET_LOOKS.map((look) => {
            const isMatch =
              selectedOuterwear.id === look.outerwearId &&
              selectedTop.id === look.topId &&
              selectedBottom.id === look.bottomId;

            return (
              <button
                key={look.id}
                onClick={() => handleApplyPreset(look)}
                className={`px-3 py-1 text-xs rounded-sm transition-all ${
                  isMatch
                    ? 'bg-stone-900 text-stone-100 font-medium shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-900'
                }`}
              >
                {look.title}
              </button>
            );
          })}
        </div>

        {/* Main Outfit Grid & Breakdown */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Slot 1: Outerwear */}
            <div className="bg-white p-5 rounded-xs border border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="uppercase font-medium tracking-wider">Layer 1: Outerwear</span>
                  <span className="font-mono tabular-nums text-stone-900 font-semibold">${selectedOuterwear.price}</span>
                </div>
                <div className="aspect-[3/4] bg-stone-100 rounded-xs overflow-hidden mb-3">
                  <img
                    src={selectedOuterwear.image}
                    alt={selectedOuterwear.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-serif text-lg font-medium text-stone-900 line-clamp-1">
                  {selectedOuterwear.name}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{selectedOuterwear.material.split(';')[0]}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Piece:</span>
                  <select
                    value={selectedOuterwear.id}
                    onChange={(e) => {
                      const found = outerwearOptions.find((p) => p.id === e.target.value);
                      if (found) setSelectedOuterwear(found);
                    }}
                    className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 max-w-[150px] truncate"
                  >
                    {outerwearOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Size:</span>
                  <div className="flex gap-1">
                    {['S', 'M', 'L', 'XL'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setOuterwearSize(s)}
                        className={`w-6 h-6 text-[11px] font-mono border rounded ${
                          outerwearSize === s ? 'bg-stone-900 text-white' : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Slot 2: Knitwear / Top */}
            <div className="bg-white p-5 rounded-xs border border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="uppercase font-medium tracking-wider">Layer 2: Tactile Knit / Top</span>
                  <span className="font-mono tabular-nums text-stone-900 font-semibold">${selectedTop.price}</span>
                </div>
                <div className="aspect-[3/4] bg-stone-100 rounded-xs overflow-hidden mb-3">
                  <img
                    src={selectedTop.image}
                    alt={selectedTop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-serif text-lg font-medium text-stone-900 line-clamp-1">
                  {selectedTop.name}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{selectedTop.material.split(';')[0]}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Piece:</span>
                  <select
                    value={selectedTop.id}
                    onChange={(e) => {
                      const found = topOptions.find((p) => p.id === e.target.value);
                      if (found) setSelectedTop(found);
                    }}
                    className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 max-w-[150px] truncate"
                  >
                    {topOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Size:</span>
                  <div className="flex gap-1">
                    {['S', 'M', 'L', 'XL'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setTopSize(s)}
                        className={`w-6 h-6 text-[11px] font-mono border rounded ${
                          topSize === s ? 'bg-stone-900 text-white' : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Slot 3: Trouser / Dress */}
            <div className="bg-white p-5 rounded-xs border border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="uppercase font-medium tracking-wider">Layer 3: Trouser or Slip</span>
                  <span className="font-mono tabular-nums text-stone-900 font-semibold">${selectedBottom.price}</span>
                </div>
                <div className="aspect-[3/4] bg-stone-100 rounded-xs overflow-hidden mb-3">
                  <img
                    src={selectedBottom.image}
                    alt={selectedBottom.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-serif text-lg font-medium text-stone-900 line-clamp-1">
                  {selectedBottom.name}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{selectedBottom.material.split(';')[0]}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Piece:</span>
                  <select
                    value={selectedBottom.id}
                    onChange={(e) => {
                      const found = bottomOptions.find((p) => p.id === e.target.value);
                      if (found) setSelectedBottom(found);
                    }}
                    className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 max-w-[150px] truncate"
                  >
                    {bottomOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Size:</span>
                  <div className="flex gap-1">
                    {['S', 'M', 'L', 'XL'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setBottomSize(s)}
                        className={`w-6 h-6 text-[11px] font-mono border rounded ${
                          bottomSize === s ? 'bg-stone-900 text-white' : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bundle Summary & One-Click Add */}
          <div className="mt-8 bg-stone-900 text-stone-100 p-6 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Capsule Ensemble (3 Pieces)</span>
                <span className="text-emerald-400 text-xs font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  15% Wardrobe Bundle Savings
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-stone-400 line-through text-sm font-mono tabular-nums">
                  ${rawTotal}
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                  ${bundleTotal}
                </span>
                <span className="text-xs text-stone-300">
                  (You save ${bundleDiscount})
                </span>
              </div>
            </div>

            <button
              onClick={handleAddCapsule}
              disabled={addedNotice}
              className={`w-full sm:w-auto px-8 py-4 font-medium text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all ${
                addedNotice
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-stone-950 hover:bg-stone-200'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Capsule Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Entire Capsule to Bag</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
