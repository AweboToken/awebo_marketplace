"use client";

import { ShowcaseProductCard } from "./ShowcaseProductCard";
import { DiscoveryBreadcrumb } from "./DiscoveryBreadcrumb";
import { TRENDING_PRODUCTS_MIXES } from "@/lib/discovery-home-mixes";
import { useRotatingMixIndex } from "@/hooks/useRotatingMixIndex";

const products = [
  {
    name: "Pepe Classic viking T-shirt / Summer Collection that you...",
    brandImage: "https://ext.same-assets.com/1892170632/415736903.png",
    reviews: 280,
    rating: 4.5,
    price: 40.99,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "Broken heart brand presents its new shoe, with our new...",
    brandImage: "https://ext.same-assets.com/1892170632/816395812.png",
    reviews: 280,
    rating: 4.5,
    price: 77.99,
  },
  {
    name: "PALTA CLUB socks. funny and atractive style that will ...",
    brandImage: "https://ext.same-assets.com/1892170632/415736903.png",
    reviews: 280,
    rating: 4.5,
    price: 18.25,
  },
  {
    name: "Spliffire shirt with style and comodity. thinking on how t...",
    brandImage: "https://ext.same-assets.com/1892170632/1506333983.png",
    reviews: 280,
    rating: 4.5,
    price: 36.70,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "Crow binnies awtumn collection. have a style and be sur...",
    brandImage: "https://ext.same-assets.com/1892170632/436887372.png",
    reviews: 280,
    rating: 4.5,
    price: 18.00,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "Pepe Classic Pump dump T-shirt / Summer Collection ...",
    brandImage: "https://ext.same-assets.com/1892170632/3667010705.png",
    reviews: 280,
    rating: 4.5,
    price: 48.99,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "Pitbull demon is the actual king of the memecoins. Dark...",
    brandImage: "https://ext.same-assets.com/1892170632/436887372.png",
    reviews: 280,
    rating: 4.5,
    price: 39.99,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "Pepe Classic Pump dump T-shirt / Summer Collection ...",
    brandImage: "https://ext.same-assets.com/1892170632/436887372.png",
    reviews: 280,
    rating: 4.5,
    price: 48.99,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "AWEBO willow ptarmigan realistic collection original de...",
    brandImage: "https://ext.same-assets.com/1892170632/415736903.png",
    reviews: 280,
    rating: 4.5,
    price: 48.99,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "Pepe Classic Pump dump T-shirt / Summer Collection ...",
    brandImage: "https://ext.same-assets.com/1892170632/415736903.png",
    reviews: 280,
    rating: 4.5,
    price: 48.99,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "Pepe Classic Pump dump T-shirt / Summer Collection ...",
    brandImage: "https://ext.same-assets.com/1892170632/816395812.png",
    reviews: 280,
    rating: 4.5,
    price: 48.99,
    originalPrice: 55.99,
    discount: 25,
  },
  {
    name: "Pepe Classic Pump dump T-shirt / Summer Collection ...",
    brandImage: "https://ext.same-assets.com/1892170632/3667010705.png",
    reviews: 280,
    rating: 4.5,
    price: 48.99,
    originalPrice: 55.99,
    discount: 25,
  },
];

export function TrendingProducts() {
  const mixIndex = useRotatingMixIndex(TRENDING_PRODUCTS_MIXES.length, 9000);

  return (
    <section className="py-12 px-4 md:px-8 bg-[#f1f5f5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Trending Products</h2>
          <DiscoveryBreadcrumb
            items={TRENDING_PRODUCTS_MIXES[mixIndex]}
            className="mt-3"
          />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product, index) => (
            <ShowcaseProductCard key={`product-${index}`} {...product} />
          ))}
        </div>

        {/* Show more button */}
        <div className="mt-10 text-center">
          <button
            type="button"
            className="btn-cyan px-8 py-3 rounded-full text-sm font-semibold text-gray-800"
          >
            Show more products
          </button>
        </div>
      </div>
    </section>
  );
}
