import React from 'react';
import coatImg from '../assets/images/product_cashmere_coat_1791194379671.jpg';
import silkImg from '../assets/images/product_silk_dress_1791194422920.jpg';

export const StorySection: React.FC = () => {
  return (
    <section className="bg-white py-20 sm:py-28 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Pair */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-stone-100 rounded-xs overflow-hidden">
                <img
                  src={coatImg}
                  alt="Tailoring craftsmanship at Atelier Étoile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[11px] text-stone-500 font-light italic">
                Double-faced blind-stitched virgin cashmere in our Biella workshop.
              </p>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-[3/4] bg-stone-100 rounded-xs overflow-hidden">
                <img
                  src={silkImg}
                  alt="Silk draping and pattern cutting"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[11px] text-stone-500 font-light italic">
                True bias-cut 22-momme sandwashed mulberry silk.
              </p>
            </div>
          </div>

          {/* Narrative Prose */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-medium mb-3">
              <span>The Atelier Ethos</span>
              <span aria-hidden="true">·</span>
              <span>Slow Fashion Discipline</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-stone-900 leading-tight text-balance mb-6">
              Garments made for decades, not seasons.
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-light">
              We reject the planned obsolescence of modern apparel. Every piece in our collection is produced in numbered micro-batches alongside family-owned textile mills in Northern Italy and Yorkshire.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8 font-light">
              By working strictly with non-mulesed wool, Grade 6A mulberry silk, and raw unbleached Japanese cotton, our fabrics soften and mold to the wearer with time rather than degrading.
            </p>

            {/* Concrete Attributable Testimonial (Rule 1.H) */}
            <div className="bg-[#FAF9F6] border-l-2 border-stone-900 p-5 rounded-r-xs">
              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                &ldquo;The cashmere overcoat has held its razor-sharp shoulder structure through two full winters in Stockholm and Paris. It is easily the best investment piece in my wardrobe.&rdquo;
              </p>
              <div className="mt-3 text-xs text-stone-500 font-normal">
                <strong className="text-stone-900 font-medium">Elena Rostova</strong>
                <span className="mx-1.5">·</span>
                <span>Senior Architect at Studio Kanso, Stockholm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
