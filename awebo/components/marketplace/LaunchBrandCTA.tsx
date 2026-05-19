"use client";

export function LaunchBrandCTA() {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-[#6e5dcb] via-[#8a5bc8] to-[#c86dd7]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Launch a Brand
        </h2>
        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
          Create a Product. Make a Sample!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            className="btn-cyan px-8 py-4 rounded-full text-base font-semibold text-gray-800 min-w-[200px]"
          >
            Launch a brand
          </button>
          <button
            type="button"
            className="px-8 py-4 rounded-full text-base font-semibold text-white border-2 border-white/50 hover:bg-white/10 transition-colors min-w-[200px]"
          >
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}
