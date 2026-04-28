import React from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import TextType from "../TextType";
import { DarkGradientBg } from "./elegant-dark-pattern";
import { Header } from "./header-2";
import { ShinyButton } from "./shiny-button";

// Hero Component
const Hero = React.memo(() => {
  return (
    <DarkGradientBg className="flex flex-col items-center justify-center">
      <div
        className="relative z-10 flex flex-col items-center justify-center w-full px-6"
        style={{
          animation: "fadeIn 0.6s ease-out"
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .script-text {
            font-family: 'Playwrite TZ', cursive;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <aside className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm max-w-full relative z-10">
          <a
            href="#pricing"
            className="flex items-center gap-1 text-xs hover:text-white transition-all active:scale-95 whitespace-nowrap"
            style={{ color: '#D2FF00' }}
          >
            Competitive pricing
            <ArrowRight size={12} />
          </a>
        </aside>

        <TextType
          text="Build, Automate & Scale Your Business with AI"
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-center max-w-4xl px-6 leading-[1.1] mb-6 font-heading tracking-tighter relative z-10"
          loop={false}
          typingSpeed={40}
          style={{
            background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        />

        <p className="text-sm md:text-lg text-center max-w-2xl px-6 mb-10 text-white/60 leading-relaxed relative z-10">
          We create high-converting websites and AI systems that generate leads, automate sales, and grow your business 24/7
        </p>

        <div className="flex items-center gap-4 relative z-10">
          <ShinyButton
            onClick={() => {
              const el = document.querySelector("#pricing");
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get started
          </ShinyButton>
        </div>
      </div>
    </DarkGradientBg>
  );
});

Hero.displayName = "Hero";

// Main Component
export function SaasHero() {
  return (
    <div className="relative">
      <Header />
      <Hero />
    </div>
  );
}

export default SaasHero;
