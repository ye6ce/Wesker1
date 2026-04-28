import React from 'react';

export default function ContourFlow() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(210, 255, 0, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(210, 255, 0, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
