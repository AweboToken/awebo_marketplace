"use client";

export function Footer() {
  return (
    <footer className="bg-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          {/* Loading text */}
          <p className="text-sm text-gray-500">Loading more ...</p>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200 my-4" />

          {/* Footer content */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Designed with</span>
              <span className="font-black text-[#6e5dcb] text-lg">AWEBO</span>
            </div>

            <p className="text-xs text-gray-400 text-center max-w-md">
              This website has been created with AWEBO Marketplace. The content is User Content that is subject to our Terms of Use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
