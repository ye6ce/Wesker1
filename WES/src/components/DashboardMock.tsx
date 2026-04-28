import React from 'react';
import { motion } from "motion/react";

export default function DashboardMock() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto mt-12 bg-neutral-900 rounded-2xl border border-white/10 shadow-2xl p-6 overflow-hidden relative"
    >
      {/* Fake Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-white font-heading text-xl">Dashboard</div>
        <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-white/50 text-xs mb-1">Total Revenue</div>
            <div className="text-white text-xl font-bold">$52.6k</div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-white/50 text-xs mb-1">Total Products</div>
            <div className="text-white text-xl font-bold">236</div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-white/50 text-xs mb-1">Items Sold</div>
            <div className="text-white text-xl font-bold">22</div>
        </div>
      </div>

      {/* Chart Mock */}
      <div className="h-48 w-full bg-white/5 rounded-xl flex items-end p-4 gap-2">
         {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
             <div key={i} className="bg-brand-green/50 flex-1 rounded-t-sm" style={{ height: `${h}%`}} />
         ))}
      </div>
    </motion.div>
  );
}
