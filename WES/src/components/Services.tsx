import React from 'react';
import { motion } from 'motion/react';
import { Palette, Globe, Cpu, ArrowRight } from 'lucide-react';

const services = [
  {
    title: "Branding",
    description: "Elite visual identities and logo systems designed to command attention and build instant trust.",
    icon: <Palette className="w-8 h-8 text-brand-green" />,
    direction: -100, // slide from left
  },
  {
    title: "Website Creation",
    description: "High-performance, conversion-focused websites built with precision engineering and elite design.",
    icon: <Globe className="w-8 h-8 text-brand-green" />,
    direction: 100, // slide from right
  },
  {
    title: "AI Workflows Creation",
    description: "Custom automation systems and LLM integrations that replace manual labor with clockwork efficiency.",
    icon: <Cpu className="w-8 h-8 text-brand-green" />,
    direction: -100, // slide from left
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading text-white tracking-tight"
          >
            Precision <span className="text-white/40">Services.</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: service.direction, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-green/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="mb-6 p-3 bg-brand-green/10 rounded-xl w-fit group-hover:scale-110 transition-transform duration-500">
                  {service.icon}
                </div>
                
                <h4 className="text-xl font-heading text-white mb-3 tracking-tight">{service.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                
                <div className="flex items-center gap-2 text-brand-green text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                  Execute <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative vertical lines */}
      <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/[0.02] hidden md:block" />
      <div className="absolute right-1/4 top-0 bottom-0 w-px bg-white/[0.02] hidden md:block" />
    </section>
  );
}
