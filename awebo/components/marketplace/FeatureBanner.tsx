"use client";

export function FeaturedBanner() {
  return (
    <section className="py-12 px-4 md:px-8 bg-[#f1f5f5]">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left content */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#6e5dcb] mb-2">TRENDING NOW</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Viking Pepe Apparel Collection V1
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Short large old school style T-shirt. Jouvenile fashion for all Pepe loves generations.
              </p>
              <div className="inline-block bg-[#6e5dcb] text-white px-4 py-2 rounded-lg text-sm font-medium">
                Male apparel
              </div>
            </div>

            {/* Right image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden bg-white shadow-xl">
                <img
                  src="https://ext.same-assets.com/1892170632/415736903.png"
                  alt="Viking Pepe"
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-orange-200/30 blur-xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-amber-200/30 blur-xl" />
        </div>
      </div>
    </section>
  );
}
