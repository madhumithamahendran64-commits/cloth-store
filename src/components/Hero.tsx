import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_fashion_editorial_1791194363519.jpg';

interface HeroProps {
  onExploreCollection: () => void;
  onOpenCapsule: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCollection, onOpenCapsule }) => {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      {/* Background Image Container with Measured Gradient Scrim for WCAG AA compliance */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Atelier Étoile Autumn/Winter Campaign"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Measured scrims ensuring legibility across light & dark areas */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 flex flex-col justify-end min-h-[560px] sm:min-h-[640px]">
        <div className="max-w-2xl">
          {/* Quiet editorial kicker */}
          <div className="flex items-center gap-2 text-stone-300 text-xs tracking-[0.2em] uppercase font-medium mb-4">
            <span>Autumn / Winter Collection 2026</span>
            <span aria-hidden="true">·</span>
            <span>Handmade in Biella & Yorkshire</span>
          </div>

          {/* Headline in Cormorant Garamond with balanced wrapping */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] text-white text-balance mb-6">
            Timeless tailoring for deliberate living.
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-9">
            Precision outerwear, pure Mongolian cashmere, and fluid silk essentials crafted to outlast seasonal cycles.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreCollection}
              className="px-6 py-3.5 bg-stone-50 text-stone-950 font-medium text-xs tracking-wider uppercase rounded-sm hover:bg-stone-200 transition-all flex items-center gap-2 group whitespace-nowrap shadow-sm"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onOpenCapsule}
              className="px-6 py-3.5 bg-stone-900/80 backdrop-blur-sm border border-stone-600/70 text-stone-100 font-medium text-xs tracking-wider uppercase rounded-sm hover:bg-stone-800 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-300" />
              <span>Capsule Wardrobe Builder</span>
            </button>
          </div>
        </div>

        {/* Adjacency Trust Metrics (Section 1.H) */}
        <div className="mt-16 pt-8 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-stone-300">
          <div>
            <p className="text-xl sm:text-2xl font-serif text-white tabular-nums font-semibold">100%</p>
            <p className="text-xs text-stone-400 mt-0.5">Traceable natural fibers</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif text-white tabular-nums font-semibold">Biella</p>
            <p className="text-xs text-stone-400 mt-0.5">Italian wool weavers</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif text-white tabular-nums font-semibold">Zero-Plastic</p>
            <p className="text-xs text-stone-400 mt-0.5">Biodegradable packaging</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif text-white tabular-nums font-semibold">Lifetime</p>
            <p className="text-xs text-stone-400 mt-0.5">Complimentary repair guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
};
