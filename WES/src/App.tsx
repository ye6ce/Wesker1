/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useEffect, useState } from "react";
import { Monitor, Cpu } from "lucide-react";
import PlasmaWave from "./PlasmaWave";
import Pricing from "./components/Pricing";
import { ServiceQuiz } from "./components/ServiceQuiz";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3400); // Decreased slightly for snappier pacing
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Background that fades to green during zoom to seamlessly blend the hollow parts of the letter */}
      <motion.div 
        className="absolute inset-0 bg-brand-green"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.3, ease: "easeIn" }}
      />
      
      {/* The scaling letter container */}
      <motion.div 
        className="relative flex items-center justify-center"
        initial={{ scale: 1, originX: 0.5, originY: 0.55 }} // Slightly lower center to hit the solid ink of the 'w'
        animate={{ scale: 300 }} // Huge scale to zoom "into" the letter
        transition={{ duration: 1.2, delay: 2.2, ease: [0.5, 0, 0.2, 1] }} 
      >
        {/* White Base 'w' */}
        <span className="script-text text-8xl text-white select-none">w</span>
        
        {/* Green Filling 'w' Overlay */}
        <motion.div
          initial={{ height: "0%" }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
        >
          <span className="script-text text-8xl text-brand-green select-none absolute bottom-0 left-1/2 -translate-x-1/2">
            w
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroState, setHeroState] = useState<'loading' | 'large' | 'morphed'>('loading');
  const [activeQuizService, setActiveQuizService] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const plasmaY = useTransform(scrollY, [0, 400], [0, -250]);
  const plasmaOpacity = useTransform(scrollY, [0, 300], [0.8, 0]);
  
  // Text moves down on scroll - tightened for even shorter scroll distance
  const textDownY = useTransform(scrollY, [0, 400], [0, 150]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isLoading) {
      // Morph happens almost immediately now
      if (latest > 40 && heroState !== 'morphed') {
        setHeroState('morphed');
      } else if (latest <= 40 && heroState === 'morphed') {
        setHeroState('large');
      }
    }
  });

  useEffect(() => {
    if (!isLoading) {
      setHeroState('large');
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="w-full bg-brand-green text-black overflow-x-hidden selection:bg-black/20"
      >
        {/* Hero Section - Pinned/Sticky Container */}
        <div className="relative h-[115vh] w-full">
          <div className="sticky top-0 h-[100svh] w-full overflow-hidden p-6 md:p-12 flex flex-col items-center justify-between">
            {/* Plasma Background - Moves up independently */}
            <motion.div 
              style={{ y: plasmaY, opacity: plasmaOpacity }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <PlasmaWave colors={['#ffffff', '#ffffff']} dir2={1.0} />
            </motion.div>
            
            {/* Header with Workflow Connections */}
            <header className="w-full relative z-[60]">
              <div className="flex justify-between items-center w-full">
                <div className="script-text text-xl sm:text-2xl font-bold text-black lowercase relative group">
                  Wesker
                </div>
                
                {/* Desktop Navigation with connections */}
                <nav className="hidden sm:flex gap-4 items-center relative">
                  <a href="#" className="font-script text-sm font-bold hover:text-black/80 transition-colors bg-brand-green px-2 py-1 relative z-10 text-black">Home</a>
                  <a href="#pricing" className="font-script text-sm font-bold hover:text-black/80 transition-colors bg-brand-green px-2 py-1 relative z-10 text-black">Pricing</a>
                  <a href="#" className="font-script text-sm font-bold hover:text-black/80 transition-colors bg-brand-green px-2 py-1 relative z-10 text-black">About us</a>
                </nav>
                
                {/* Mobile Menu Toggle Button */}
                <button 
                  className="sm:hidden text-black p-2 -mr-2 hover:bg-black/10 rounded-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  )}
                </button>
              </div>
            </header>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-20 left-4 right-4 bg-brand-green/95 backdrop-blur-xl border border-black/10 rounded-3xl p-8 flex flex-col gap-6 items-center z-[50] sm:hidden shadow-2xl"
                >
                  <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="font-script text-2xl text-black hover:text-black/60 transition-colors">Home</a>
                  <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="font-script text-2xl text-black hover:text-black/60 transition-colors">Pricing</a>
                  <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="font-script text-2xl text-black hover:text-black/60 transition-colors">About us</a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content - Centered via flex-1 inside sticky container */}
            <main className="flex-1 flex items-center justify-center w-full relative z-10 font-sans">
              {/* Ghost 'w' Background - Keep this roughly centered */}
              <motion.div 
                animate={{ opacity: heroState === 'morphed' ? 0.05 : 0.2 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
              >
                <span className="script-text text-[80vw] md:text-[80vh] text-black overflow-visible opacity-50">w</span>
              </motion.div>

              {/* Primary 'w' Monogram and Morphing Text - Moves down on scroll */}
              <motion.div 
                style={{ y: textDownY }}
                className="z-10 text-center flex flex-col items-center justify-center max-w-full px-4"
              >
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
                  transition={{ duration: 1.5, layout: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
                  className="flex items-center justify-center whitespace-nowrap"
                >
                  <motion.span 
                    layout
                    className="script-text flex items-center text-black"
                    animate={{ 
                      fontSize: heroState === 'morphed' ? 'clamp(1.5rem, 4vw, 4rem)' : 'clamp(8rem, 25vw, 320px)',
                      fontStyle: heroState === 'morphed' ? 'normal' : 'italic'
                    }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      // Prevent layout snapping from script font padding differences
                      lineHeight: 1, 
                      transformOrigin: "center right",
                    }}
                  >
                    w
                  </motion.span>
                  
                  <AnimatePresence>
                    {heroState === 'morphed' && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="script-text overflow-hidden whitespace-nowrap flex items-center text-black"
                        style={{ 
                          fontSize: 'clamp(1.5rem, 4vw, 4rem)',
                          lineHeight: 1
                        }}
                      >
                        e turn ideas into reality
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </main>
          </div>
        </div>

        {/* Our Services Title Section */}
        <section className="w-full bg-brand-green py-12 px-6 md:px-12 text-center relative z-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="script-text text-4xl md:text-7xl text-black"
          >
            Our services
          </motion.h2>
        </section>

        {/* Services Workflow Canvas */}
        <section className="w-full bg-brand-green py-32 px-6 md:px-12 relative z-20 overflow-visible">
          {/* Technical Grid Background */}
          <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
               style={{ 
                 backgroundImage: `linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)`,
                 backgroundSize: '40px 40px' 
               }} />
          
          <div className="max-w-4xl mx-auto relative min-h-[1000px]">
            <div className="relative w-full flex flex-col gap-40 py-20">
              {/* Step 01: Branding */}
              <div className="relative flex flex-col lg:flex-row items-center w-full">
                {/* Side Content (Slide from Left) */}
                <motion.div 
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full lg:w-1/2 lg:pr-24 text-center order-2 lg:order-1"
                >
                  <h4 className="micro-text text-black/40 mb-2 uppercase tracking-widest">Phase 01</h4>
                  <h3 className="script-text text-4xl text-black mb-4">Branding</h3>
                  <p className="text-black text-lg leading-relaxed max-w-sm mx-auto">Mapping your digital nervous system for maximum efficiency and growth.</p>
                </motion.div>

                {/* Central Icon */}
                <div className="relative z-10 lg:absolute lg:left-1/2 lg:-translate-x-1/2 mb-8 lg:mb-0 order-1 lg:order-2">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-16 h-16 rounded-2xl bg-black text-brand-green flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6)] border-2 border-black"
                  >
                    <div className="w-3 h-3 rounded-full bg-brand-green" />
                  </motion.div>
                </div>

                {/* Empty Place for alignment */}
                <div className="hidden lg:block lg:w-1/2 order-3" />
              </div>

              {/* Step 02: Website Creation */}
              <div className="relative flex flex-col lg:flex-row items-center w-full">
                {/* Empty Place for alignment */}
                <div className="hidden lg:block lg:w-1/2" />

                {/* Central Icon */}
                <div className="relative z-10 lg:absolute lg:left-1/2 lg:-translate-x-1/2 mb-8 lg:mb-0">
                  <motion.div 
                    initial={{ scale: 0, rotate: 45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-16 h-16 rounded-2xl bg-black text-brand-green flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6)] border-2 border-black"
                  >
                    <Monitor size={24} />
                  </motion.div>
                </div>

                {/* Side Content (Slide from Right) */}
                <motion.div 
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full lg:w-1/2 lg:pl-24 text-center"
                >
                  <h4 className="micro-text text-black/40 mb-2 uppercase tracking-widest">Phase 02</h4>
                  <h3 className="script-text text-4xl text-black mb-4">Website Creation</h3>
                  <p className="text-black text-lg leading-relaxed max-w-sm mx-auto">High-performance digital homes built with elite typography and architectural precision.</p>
                </motion.div>
              </div>

              {/* Step 03: AI Workflows */}
              <div className="relative flex flex-col lg:flex-row items-center w-full">
                {/* Side Content (Slide from Left) */}
                <motion.div 
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full lg:w-1/2 lg:pr-24 text-center order-2 lg:order-1"
                >
                  <h4 className="micro-text text-black/40 mb-2 uppercase tracking-widest">Phase 03</h4>
                  <h3 className="script-text text-4xl text-black mb-4">AI Workflows</h3>
                  <p className="text-black text-lg leading-relaxed max-w-sm mx-auto">Integrating custom LLMs to automate every manual touchpoint in your operations.</p>
                </motion.div>

                {/* Central Icon */}
                <div className="relative z-10 lg:absolute lg:left-1/2 lg:-translate-x-1/2 mb-8 lg:mb-0 order-1 lg:order-2">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-16 h-16 rounded-2xl bg-black text-brand-green flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6)] border-2 border-black"
                  >
                    <Cpu size={24} />
                  </motion.div>
                </div>

                {/* Empty Place for alignment */}
                <div className="hidden lg:block lg:w-1/2 order-3" />
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <div id="pricing" className="relative z-20">
          <Pricing onSelectService={setActiveQuizService} />
        </div>
      </motion.div>

      <AnimatePresence>
        {activeQuizService && (
          <ServiceQuiz 
            serviceName={activeQuizService} 
            onClose={() => setActiveQuizService(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
