"use client";

import { Star, Heart } from "lucide-react";

export interface ShowcaseProductCardProps {
  name: string;
  brandImage: string;
  productImage?: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: number;
}

export function ShowcaseProductCard({
  name,
  brandImage,
  productImage,
  rating,
  reviews,
  price,
  originalPrice,
  discount,
}: ShowcaseProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden card-hover group">
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="absolute top-3 left-3 w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm">
          <img src={brandImage} alt="Brand" className="w-full h-full object-contain p-1" />
        </div>

        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {discount ? (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        ) : null}

        <div className="w-full h-full flex items-center justify-center">
          {productImage ? (
            <img src={productImage} alt={name} className="w-3/4 h-3/4 object-contain" />
          ) : (
            <img src={brandImage} alt={name} className="w-1/2 h-1/2 object-contain opacity-50" />
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm text-gray-700 line-clamp-2 mb-2 min-h-[40px]">{name}</h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={`star-${name}-${i}`}
                className={`w-3 h-3 ${
                  i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">USD {price.toFixed(2)}</span>
          {originalPrice ? (
            <span className="text-sm text-gray-400 line-through">USD {originalPrice.toFixed(2)}</span>
          ) : null}
        </div>
        {discount ? <span className="text-xs text-green-600">({discount}% discount)</span> : null}
      </div>
    </div>
  );
}
