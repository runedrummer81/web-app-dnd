import React from "react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        {/* Tekst indhold */}
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Velkommen til dit nye projekt 🚀
          </h1>
          <p className="text-lg text-gray-200">
            Byg hurtigt og nemt med en moderne hero-sektion. Tilpas teksten,
            farverne og knapperne, så det passer til dit brand.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-2xl shadow hover:bg-gray-100 transition">
              Kom i gang
            </button>
            <button className="border border-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/10 transition">
              Læs mere
            </button>
          </div>
        </div>

        {/* Billede eller illustration */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="https://via.placeholder.com/500x400"
            alt="Hero illustration"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
