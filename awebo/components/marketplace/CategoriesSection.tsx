"use client";

import { Star, Zap, Heart, Smile, Gamepad2 } from "lucide-react";

const categories = [
  { name: "Viking Pepe", image: "https://ext.same-assets.com/1892170632/415736903.png", icon: Star, color: "bg-yellow-500" },
  { name: "Pingus", image: "https://ext.same-assets.com/1892170632/436887372.png", icon: Zap, color: "bg-cyan-500" },
  { name: "Broken Heart", image: "https://ext.same-assets.com/1892170632/1506333983.png", icon: Heart, color: "bg-red-500" },
  { name: "Palta Club", image: "https://ext.same-assets.com/1892170632/3584261708.png", icon: Smile, color: "bg-green-500" },
  { name: "Pixel Life", image: "https://ext.same-assets.com/1892170632/3667010705.png", icon: Gamepad2, color: "bg-purple-500" },
];

export function CategoriesSection() {
  return (
    <section className="py-12 px-4 md:px-8 bg-[#f1f5f5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={`category-${index}`}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white shadow-lg group-hover:shadow-xl transition-shadow">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain p-2"
                  />
                  {/* Badge icon */}
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${category.color} rounded-full flex items-center justify-center shadow-md`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
