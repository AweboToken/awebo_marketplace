"use client";

export function HeroSection() {
  return (
    <section className="gradient-hero py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Crea marcas innovadoras con la ayuda de tu comunidad
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/80 mb-10">
            Lanza tu marca en tan solo 4 pasos y hazlo a traves de crowdfunding con tu comunidad!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-cyan px-8 py-4 rounded-full text-base font-semibold text-gray-800 min-w-[200px]">
              Launch your brand
            </button>
            <button className="px-8 py-4 rounded-full text-base font-semibold text-white border-2 border-white/50 hover:bg-white/10 transition-colors min-w-[200px]">
              Get more info
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://ext.same-assets.com/1892170632/734791394.jpeg"
              alt="AWEBO Brand Studio"
              className="w-full h-auto"
            />
            {/* Overlay text */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold">Ahora solo en 4 pasos</p>
              <p className="text-xs">puedes armar tu</p>
              <p className="text-2xl font-bold">Brand</p>
            </div>
            {/* AWEBO badge */}
            <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg flex items-center gap-2">
              <span className="text-[#6e5dcb] font-bold text-sm">AWEBO</span>
              <span className="text-xs text-gray-600">Brand Studio</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
