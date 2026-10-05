import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-stone-800/80">
          {/* Brand & Ethos */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-semibold text-white tracking-tight">
              ATELIER ÉTOILE
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed font-light">
              Contemporary tailoring, sustainable natural fibers, and capsule wardrobe architecture. Designed in Paris, woven in Biella and Yorkshire.
            </p>
            <div className="text-xs text-stone-400 pt-2 font-mono">
              Concierge: concierge@atelier-etoile.com
            </div>
          </div>

          {/* Nav: Wardrobe */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Wardrobe
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#collection" className="hover:text-white transition-colors">Overcoats & Outerwear</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Tailored Wool Blazers</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Fisherman Knitwear</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Mulberry Silk Slip Dresses</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Japanese Twill Trousers</a></li>
            </ul>
          </div>

          {/* Nav: Client Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><span className="text-stone-300">Complimentary Global Shipping</span></li>
              <li><span className="text-stone-300">30-Day Effortless Returns</span></li>
              <li><span className="text-stone-300">Garment Care & Repair Service</span></li>
              <li><span className="text-stone-300">Bespoke Size Consultation</span></li>
              <li><span className="text-stone-300">Carbon Offset Certification</span></li>
            </ul>
          </div>

          {/* Newsletter / The Gazette */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              The Atelier Gazette
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Receive private notices for small-batch fabric releases and private sample previews.
            </p>

            {subscribed ? (
              <div className="p-2.5 bg-stone-900 border border-emerald-800 text-emerald-400 text-xs rounded-sm flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>You are subscribed to the private registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 text-xs text-white border border-stone-800 rounded-l-sm focus:outline-none focus:border-stone-500 placeholder-stone-500"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="px-3.5 bg-stone-100 text-stone-900 hover:bg-stone-200 transition-colors rounded-r-sm flex items-center justify-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quiet, Clean Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} ATELIER ÉTOILE S.A. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Carbon Neutral Checkout</span>
            <span>·</span>
            <span>Biella Certified Mill No. 89</span>
            <span>·</span>
            <span>Fair Labor Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
