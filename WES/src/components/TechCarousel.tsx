import { motion } from "motion/react";
import React from 'react';
const techs = [
  { name: "Notion", url: "https://simpleicons.org/icons/notion.svg" },
  { name: "GitHub", url: "https://simpleicons.org/icons/github.svg" },
  { name: "OpenAI", url: "https://simpleicons.org/icons/openai.svg" },
  { name: "Python", url: "https://simpleicons.org/icons/python.svg" },
  { name: "Zapier", url: "https://simpleicons.org/icons/zapier.svg" },
  { name: "Airtable", url: "https://simpleicons.org/icons/airtable.svg" },
  { name: "Make", url: "https://simpleicons.org/icons/make.svg" }
];

export default function TechCarousel() {
  return (
    <div className="py-20 bg-black overflow-hidden relative border-y border-white/5">
      <div className="text-center mb-16 text-white/50 uppercase tracking-widest text-xs font-mono">
        Technology Stack
      </div>
      <motion.div 
        className="flex gap-24 items-center"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...techs, ...techs].map((tech, i) => (
          <div key={i} className="whitespace-nowrap">
            <img 
              src={tech.url} 
              alt={tech.name} 
              className="w-12 h-12 invert opacity-50 hover:opacity-100 transition-opacity duration-300" 
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
