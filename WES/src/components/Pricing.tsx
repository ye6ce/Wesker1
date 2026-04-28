import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { GlassButton } from "./ui/glass-button";

const tiers = [
  {
    name: "Branding",
    price: "5000",
    suffix: " DA",
    description: "Build a powerful identity that resonates with your audience.",
    features: ["Visual Identity", "Logo Design", "Typography System", "Brand Guidelines", "Social Media Kits"],
    buttonText: "Start Brand",
    isPopular: false,
  },
  {
    name: "Website Creation",
    price: "5000",
    suffix: " DA",
    description: "High-performance digital presence with elite speed.",
    features: ["Custom Layouts", "Responsive Design", "SEO Optimization", "Fast Loading", "CMS Integration"],
    buttonText: "Design Site",
    isPopular: true,
  },
  {
    name: "AI Automation",
    price: "Quote",
    suffix: "",
    description: "Custom AI workflows tailored to your operations.",
    features: ["Custom LLM Integration", "Task Automation", "AI Chatbots", "Workflow Mapping", "Operational Support"],
    buttonText: "Get a Quote",
    isPopular: false,
  }
];

const AnimatedPrice = ({ price, name }: { price: string; name: string }) => {
  const [displayPrice, setDisplayPrice] = useState("");
  const isQuote = price === "Quote";

  useEffect(() => {
    let iteration = 0;
    let interval: any = null;

    const startAnimation = () => {
      clearInterval(interval);
      iteration = 0;
      
      if (isQuote) {
        // For AI Automation, keep it changing to simulate dynamic pricing
        interval = setInterval(() => {
          const randomPrice = Math.floor(1000 + Math.random() * 9000).toString();
          const chance = Math.random();
          
          // Show "Quote" about 15% of the time, otherwise show shifting numbers
          if (chance > 0.85) {
            setDisplayPrice("Quote");
          } else {
            setDisplayPrice(randomPrice + " DA");
          }
        }, 100);
      } else {
        interval = setInterval(() => {
          setDisplayPrice(
            price
              .split("")
              .map((char, index) => {
                if (index < iteration) return price[index];
                return Math.floor(Math.random() * 10).toString();
              })
              .join("")
          );

          if (iteration >= price.length) {
            clearInterval(interval);
          }

          iteration += 1 / 3;
        }, 30);
      }
    };

    // Delay start for the AI Automation one specifically if needed, or just run on mount/inView
    const timeout = setTimeout(startAnimation, 500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [price, isQuote]);

  return <>{displayPrice}</>;
};

interface PricingProps {
  onSelectService?: (service: string) => void;
}

const Pricing = memo(function Pricing({ onSelectService }: PricingProps) {
  return (
    <section className="relative w-full bg-black py-20 md:py-32 px-6 md:px-12 lg:px-24 text-white z-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-white font-heading tracking-tight">
            Our Pricing
          </h2>
          <p className="text-white/70 font-poppins max-w-lg mx-auto">
            Professional services at precise rates to scale your digital presence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className={`relative flex flex-col p-8 rounded-2xl border-2 shadow-[0_15px_30px_-10px_rgba(255,255,255,0.15)] ${
                tier.isPopular ? 'border-brand-green bg-white/5' : 'border-white/10 bg-white/5'
              } backdrop-blur-sm transition-colors overflow-hidden`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-brand-green" />
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl mb-2 text-white font-heading tracking-tight">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-4 h-12">
                  <span className="font-poppins text-4xl font-bold tracking-tight text-white">
                    <AnimatedPrice price={tier.price} name={tier.name} />
                    {tier.suffix}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{tier.description}</p>
              </div>

              <div className="flex-1">
                <ul className="flex flex-col gap-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border border-white/20 ${
                        tier.isPopular ? 'bg-brand-green text-black' : 'bg-transparent text-white'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <GlassButton 
                  onClick={() => onSelectService?.(tier.name)}
                  className="w-full"
                  contentClassName="w-full text-center"
                >
                  {tier.buttonText}
                </GlassButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Pricing;
