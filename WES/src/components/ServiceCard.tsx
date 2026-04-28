import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  tag: string;
  icon: any;
  index: number;
  key?: React.Key;
}

export default function ServiceCard({ title, description, tag, icon: Icon, index }: ServiceCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative flex flex-col items-center p-4 h-full"
    >
      <div className="w-full card-border overflow-hidden rounded-2xl flex flex-col group-hover:scale-[1.02] transition-transform duration-500 h-full">
        <div className="p-8 flex items-center justify-center relative overflow-hidden bg-white/[0.01]">
          {/* Glass Icon Container */}
          <div className="relative z-10 w-20 h-20 flex items-center justify-center text-brand-green">
               {/* Glass Background */}
               <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />
               
               {/* Glass Edges (Inner Glow) */}
               <div className="absolute inset-0 rounded-2xl border border-brand-green/20 scale-[0.98] blur-[0.5px]" />
               
               <Icon size={36} className="relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_#D2FF00]" />
               
               {/* Glowing corner accents */}
               <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-brand-green opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[0.2px]" />
               <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-brand-green opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[0.2px]" />
          </div>
          
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="p-8 flex flex-col flex-grow">
          <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-brand-green transition-colors duration-300">
            {title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed mb-8 flex-grow">
            {description}
          </p>
          
          <div className="flex justify-between items-center mt-auto">
            <button className="text-brand-green/60 hover:text-brand-green transition flex items-center text-xs font-mono uppercase tracking-widest group/btn">
              Explore
              <svg className="w-3 h-3 ml-2 transition-transform group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-green/20" />
               <div className="w-1.5 h-1.5 rounded-full bg-brand-green/40" />
               <div className="w-1.5 h-1.5 rounded-full bg-brand-green transition-transform group-hover:scale-125" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
