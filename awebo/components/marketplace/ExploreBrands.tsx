"use client";

import { useState } from "react";
import { DiscoveryBreadcrumb } from "./DiscoveryBreadcrumb";
import { EXPLORE_BRANDS_MIXES } from "@/lib/discovery-home-mixes";
import { useRotatingMixIndex } from "@/hooks/useRotatingMixIndex";

const filters = ["NEW", "Memes", "Live", "Market Cap", "Last Sale", "Trendy"];

const brands = [
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
    name: "Palta Club",
    description: "Comunidad azul con bivra meme y pop.",
    category: "Memes",
    itemCount: 24,
    rating: 4.8,
    reviews: 96,
    image: "https://ext.same-assets.com/1892170632/3584261708.png",
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
    name: "Viking Pepe",
    description: "Humor nórdico para leyendas del meme.",
    category: "Memes",
    itemCount: 24,
    rating: 4.0,
    reviews: 128,
    image: "https://ext.same-assets.com/1892170632/415736903.png",
  },
];

export function ExploreBrands() {
  const [activeFilter, setActiveFilter] = useState("NEW");
  const mixIndex = useRotatingMixIndex(EXPLORE_BRANDS_MIXES.length, 9000);

  return (
    <section className="py-12 px-4 md:px-8 bg-[#f1f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Explore Brands</h2>
          <DiscoveryBreadcrumb
            items={EXPLORE_BRANDS_MIXES[mixIndex]}
            className="mt-3"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? "bg-[#6e5dcb] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {brands.map((brand, index) => (
            <div key={`explore-${brand.name}-${index}`} className="w-full">
              <div className="bg-white rounded-2xl p-4 card-hover">
                <div className="relative mb-4">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-3/4 h-3/4 object-contain"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">★ {brand.rating}</span>
                  <span className="text-xs text-gray-500">({brand.reviews} reseñas)</span>
                </div>
                <h3 className="font-bold text-base mb-1">{brand.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{brand.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#6e5dcb] bg-purple-50 px-2 py-1 rounded">
                    {brand.category}
                  </span>
                  <span className="text-xs text-gray-400">{brand.itemCount} artículos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
