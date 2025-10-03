import React from "react";
import HeroSection from "./HeroSection"; // sørg for at stien passer!

export default function HomePage() {
  return (
    <section className="page">
      <HeroSection /> {/* Her indsætter vi din hero sektion */}
      <h1>Home</h1>
      <p>Home is where the heart is 💛</p>
      <p>Oh My, sounds like a bad movie!</p>
    </section>
  );
}
