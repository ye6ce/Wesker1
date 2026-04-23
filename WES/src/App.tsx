/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useEffect, useState } from "react";
import { Monitor, Cpu, Instagram, MessageCircle } from "lucide-react";
import ContourFlow from "./ContourFlow";
import Pricing from "./components/Pricing";
import { ServiceQuiz } from "./components/ServiceQuiz";
import StaggeredMenu from "./components/StaggeredMenu";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800); // Shortened since we removed the slow zoom
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ backgroundColor: "#000000" }}
      animate={{ backgroundColor: "#D2FF00" }}
      transition={{ 
        backgroundColor: { duration: 0.8, delay: 1.8, ease: "easeInOut" },
        opacity: { duration: 0.6 }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        {/* White Base 'w' - Turns black as background floods */}
        <motion.span 
          initial={{ color: "#ffffff" }}
          animate={{ color: "#000000" }}
          transition={{ duration: 0.8, delay: 1.8, ease: "easeInOut" }}
          className="script-text text-8xl select-none"
        >
          w
        </motion.span>
        
        {/* Green Filling 'w' Overlay - Height fills first, then color turns black */}
        <motion.div
          initial={{ height: "0%" }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
        >
          <motion.span 
            initial={{ color: "#D2FF00" }} // brand-green
            animate={{ color: "#000000" }}
            transition={{ duration: 0.8, delay: 1.8, ease: "easeInOut" }}
            className="script-text text-8xl select-none absolute bottom-0 left-1/2 -translate-x-1/2"
          >
            w
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [heroState, setHeroState] = useState<'loading' | 'large' | 'morphed'>('loading');
  const [activeQuizService, setActiveQuizService] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const plasmaY = useTransform(scrollY, [0, 400], [0, -150]);
  const plasmaOpacity = useTransform(scrollY, [0, 200], [0.8, 0]);
  const plasmaScale = useTransform(scrollY, [0, 200], [1, 0.95]);
  
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
            {/* Plasma Background - Moves up and scales down on scroll */}
            <motion.div 
              style={{ y: plasmaY, opacity: plasmaOpacity, scale: plasmaScale }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <ContourFlow />
            </motion.div>
            
            {/* Header with Workflow Connections */}
            <header className="w-full relative z-[60]">
              {/* Desktop Header */}
              <div className="hidden sm:flex justify-between items-center w-full">
                <div className="script-text text-xl sm:text-2xl font-bold text-black lowercase relative group">
                  Wesker
                </div>
                
                <nav className="flex gap-4 items-center relative group/nav">
                  {[
                    { label: 'Home', href: '#' },
                    { label: 'Pricing', href: '#pricing' }
                  ].map((item) => (
                    <a 
                      key={item.label}
                      href={item.href} 
                      className="font-script text-sm font-bold hover:text-black/60 transition-colors relative py-1 px-2 group/item text-black"
                      onClick={(e) => {
                        if (item.href.startsWith('#')) {
                          e.preventDefault();
                          const el = document.querySelector(item.href);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {item.label}
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left"
                        initial={false}
                      />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Mobile Staggered Menu */}
              <div className="sm:hidden">
                <StaggeredMenu 
                  position="right"
                  isFixed={true}
                  colors={['#000000', '#D2FF00', '#111111']}
                  accentColor="#000000"
                  menuButtonColor="#000000"
                  openMenuButtonColor="#000000"
                  displayItemNumbering={true}
                  items={[
                    { label: 'Home', link: '#' },
                    { label: 'Pricing', link: '#pricing' }
                  ]}
                  socialItems={[
                    { label: 'Instagram', link: 'https://instagram.com/wesker_dev', icon: <Instagram size={24} /> },
                    { label: 'WhatsApp', link: 'https://wa.me/213542465402', icon: <MessageCircle size={24} /> }
                  ]}
                />
              </div>
            </header>

            {/* Main Content - Centered via flex-1 inside sticky container */}
            <main className="flex-1 flex items-center justify-center w-full relative z-10 font-sans">
              {/* Ghost 'w' Background - Keep this roughly centered */}
              <motion.div 
                animate={{ opacity: heroState === 'morphed' ? 0.1 : 0.3 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
              >
                <span className="script-text text-[80vw] md:text-[80vh] text-black overflow-visible opacity-60">w</span>
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
                  className="flex items-center justify-center whitespace-nowrap px-4"
                >
                  <motion.span 
                    layout
                    className="script-text flex items-center text-black z-10"
                    animate={{ 
                      fontSize: heroState === 'morphed' ? 'clamp(1.75rem, 5vw, 6rem)' : 'clamp(8rem, 25vw, 320px)',
                      fontStyle: heroState === 'morphed' ? 'normal' : 'italic'
                    }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      lineHeight: 1.2, 
                      transformOrigin: "center center",
                    }}
                  >
                    w
                  </motion.span>
                  
                  <AnimatePresence>
                    {heroState === 'morphed' && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="script-text whitespace-nowrap flex items-center text-black -ml-[0.05em]"
                        style={{ 
                          fontSize: 'clamp(1.75rem, 5vw, 6rem)',
                          lineHeight: 1.2
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
