"use client";

import { BrandCard } from "./BrandCard";
import { DiscoveryBreadcrumb } from "./DiscoveryBreadcrumb";
import { CROWDFUNDING_MIXES } from "@/lib/discovery-home-mixes";
import { useRotatingMixIndex } from "@/hooks/useRotatingMixIndex";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const crowdfundingBrands = [
  {
    name: "Viking Pepe",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/415736903.png",
    crowdfundingProgress: 100,
  },
  {
    name: "Viking Pepe",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/436887372.png",
    crowdfundingProgress: 50,
  },
  {
    name: "Viking Pepe",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/1506333983.png",
    crowdfundingProgress: 35,
  },
  {
    name: "Viking Pepe",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/3584261708.png",
    crowdfundingProgress: 90,
  },
  {
    name: "Viking Pepe",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/3667010705.png",
    crowdfundingProgress: 90,
  },
];

export function CrowdfundingBrands() {
  const mixIndex = useRotatingMixIndex(CROWDFUNDING_MIXES.length, 9000);
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
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Crowdfunding brands</h2>
          <DiscoveryBreadcrumb
            items={CROWDFUNDING_MIXES[mixIndex]}
            className="mt-3"
          />
        </div>

        {/* Brands Slider */}
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

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2"
          >
            {crowdfundingBrands.map((brand, index) => (
              <BrandCard key={`crowdfunding-${index}`} {...brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
