/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Services } from "./components/Services";
import Pricing from "./components/Pricing";
import { ServiceQuiz } from "./components/ServiceQuiz";
import SaasHero from "./components/ui/saa-s-template";
import RuixenMoonChat from "./components/ui/ruixen-moon-chat";
import { Footer } from "./components/ui/footer-section";

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
  const [activeQuizService, setActiveQuizService] = useState<string | null>(null);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="w-full bg-black text-white overflow-x-hidden selection:bg-brand-green/20"
      >
        <SaasHero />
        
        <section id="ai-interface" className="w-full relative">
          {/* Gradient fade from hero section */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
          <RuixenMoonChat />
          {/* Gradient fade to sections below */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </section>

        <Services />

        {/* Pricing Section */}
        <div id="pricing" className="relative z-20">
          <Pricing onSelectService={setActiveQuizService} />
        </div>

        <Footer />
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
