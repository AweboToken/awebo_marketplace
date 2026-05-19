"use client";

import { Search, Menu, ShoppingBag, User } from "lucide-react";

export function TopHeader() {
  return (
    <header className="bg-white py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Logo mascot */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center shadow-sm">
              <span className="text-lg">🦆</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search whatever you want"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6e5dcb] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {/* Categories */}
            <button className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#6e5dcb] transition-colors">
              <Menu className="w-4 h-4" />
              <span>Categorías</span>
            </button>

            {/* Cart */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-gray-200" />

            {/* User */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="w-5 h-5 text-gray-700" />
            </button>

            {/* Launch Brand Button */}
            <button className="btn-cyan px-5 py-2.5 rounded-full text-sm font-semibold text-gray-800 hidden md:block">
              Launch a Brand!
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
