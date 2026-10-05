import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCategory, FilterOptions } from '../types/clothing';

interface FilterBarProps {
  filters: FilterOptions;
  onChangeFilters: (newFilters: Partial<FilterOptions>) => void;
  totalProductsCount: number;
  filteredCount: number;
}

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'All Pieces', value: 'all' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Tailoring', value: 'tailoring' },
  { label: 'Knitwear', value: 'knitwear' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Trousers', value: 'trousers' },
  { label: 'Tops', value: 'tops' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  totalProductsCount,
  filteredCount,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.size !== null ||
    filters.maxPrice < 1000 ||
    filters.searchQuery.trim() !== '' ||
    filters.sort !== 'featured';

  const resetFilters = () => {
    onChangeFilters({
      category: 'all',
      size: null,
      color: null,
      maxPrice: 1000,
      sort: 'featured',
      searchQuery: '',
    });
  };

  return (
    <div className="w-full bg-[#FAF9F6] border-b border-stone-200/90 py-5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Filter Row: Category Segmented Bar + Search & Advanced toggle */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = filters.category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onChangeFilters({ category: cat.value })}
                  className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-stone-900 text-stone-100 shadow-sm'
                      : 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Instant Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search cashmere, silk, blazer..."
                value={filters.searchQuery}
                onChange={(e) => onChangeFilters({ searchQuery: e.target.value })}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-stone-300 rounded-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 transition-colors"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => onChangeFilters({ searchQuery: '' })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => onChangeFilters({ sort: e.target.value as any })}
              className="py-1.5 px-2.5 text-xs bg-white border border-stone-300 rounded-sm text-stone-800 focus:outline-none focus:border-stone-800 transition-colors"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Season</option>
            </select>

            {/* Toggle More Filters (Sizes & Price) */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-1.5 border rounded-sm transition-colors flex items-center gap-1.5 text-xs ${
                showAdvancedFilters || filters.size || filters.maxPrice < 1000
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
              }`}
              title="Filter by size or price"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refine</span>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters (Sizes, Max Price Range) */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-6 text-xs text-stone-700 animate-fadeIn">
            {/* Size Filter */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-stone-500 uppercase tracking-wider text-[11px]">Size:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onChangeFilters({ size: null })}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    filters.size === null
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  All
                </button>
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onChangeFilters({ size: filters.size === sz ? null : sz })}
                    className={`w-7 h-7 flex items-center justify-center rounded text-xs transition-colors font-mono ${
                      filters.size === sz
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="flex items-center gap-3">
              <span className="font-medium text-stone-500 uppercase tracking-wider text-[11px]">
                Under: <span className="font-mono text-stone-900 font-semibold tabular-nums">${filters.maxPrice}</span>
              </span>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => onChangeFilters({ maxPrice: Number(e.target.value) })}
                className="w-32 accent-stone-900 cursor-pointer"
              />
            </div>

            {/* Active summary & reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-stone-500 hover:text-stone-950 underline text-xs transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}

        {/* Results Count Line with typographic separator (Section 1.A zero-pill) */}
        <div className="mt-3 flex items-center justify-between text-xs text-stone-500 font-normal">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="font-mono text-stone-900 tabular-nums">{filteredCount}</strong> of <strong className="font-mono text-stone-900 tabular-nums">{totalProductsCount}</strong> handcrafted pieces</span>
            {filters.category !== 'all' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{filters.category}</span>
              </>
            )}
            {filters.searchQuery && (
              <>
                <span aria-hidden="true">·</span>
                <span>Searching &ldquo;{filters.searchQuery}&rdquo;</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
