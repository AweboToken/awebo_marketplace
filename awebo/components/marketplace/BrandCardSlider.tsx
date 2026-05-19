"use client";

import { BrandCard } from "./BrandCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const brands = [
  {
    name: "Viking Pepe",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/415736903.png",
  },
  {
    name: "Pingus",
    description: "Comunidad azul con bivra meme y pop.",
    category: "Memes",
    itemCount: 24,
    rating: 4.8,
    reviews: 96,
    image: "https://ext.same-assets.com/1892170632/436887372.png",
  },
  {
    name: "Palta Club",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/3584261708.png",
  },
  {
    name: "Broken Heart Society",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/1506333983.png",
  },
  {
    name: "Pixel Life",
    description: "Comunidad azul con bivra meme y pop.",
    category: "Memes",
    itemCount: 24,
    rating: 4.8,
    reviews: 96,
    image: "https://ext.same-assets.com/1892170632/3667010705.png",
  },
];

export function BrandCardsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 bg-[#f1f5f5]">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Scroll buttons */}
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -ml-5"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -mr-5"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2"
          >
            {brands.map((brand, index) => (
              <BrandCard key={`${brand.name}-${index}`} {...brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
