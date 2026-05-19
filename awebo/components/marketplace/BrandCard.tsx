"use client";

import { Star } from "lucide-react";

interface BrandCardProps {
  name: string;
  description: string;
  category: string;
  itemCount: number;
  rating: number;
  reviews: number;
  image: string;
  crowdfundingProgress?: number;
}

export function BrandCard({
  name,
  description,
  category,
  itemCount,
  rating,
  reviews,
  image,
  crowdfundingProgress,
}: BrandCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 card-hover min-w-[280px] w-[280px] flex-shrink-0">
      {/* Image */}
      <div className="relative mb-4">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-3/4 h-3/4 object-contain"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
        <span className="text-xs text-gray-500">({reviews} reseñas)</span>
      </div>

      {/* Name & Description */}
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

      {/* Category & Count */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[#6e5dcb] bg-purple-50 px-2 py-1 rounded">
          {category}
        </span>
        <span className="text-xs text-gray-400">{itemCount} artículos</span>
      </div>

      {/* Crowdfunding Progress (if applicable) */}
      {crowdfundingProgress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Crowdfunding</span>
            <span className="text-xs font-bold text-[#6e5dcb]">{crowdfundingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6e5dcb] to-[#00d4c8] rounded-full progress-animate"
              style={{ width: `${crowdfundingProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
