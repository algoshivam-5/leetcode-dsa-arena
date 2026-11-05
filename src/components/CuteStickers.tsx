"use client";

import React from "react";

// 1. Cute Bunny with Cherries (from Canva template)
export function BunnyCherrySticker({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`inline-block relative select-none sticker-badge ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* White Sticker Outline */}
        <ellipse cx="50" cy="52" rx="34" ry="32" fill="white" />
        <ellipse cx="38" cy="24" rx="9" ry="20" fill="white" transform="rotate(-10 38 24)" />
        <ellipse cx="62" cy="24" rx="9" ry="20" fill="white" transform="rotate(10 62 24)" />
        <circle cx="36" cy="74" r="18" fill="white" />
        <circle cx="64" cy="74" r="18" fill="white" />

        {/* Bunny Body */}
        <ellipse cx="50" cy="52" rx="30" ry="28" fill="#FFF5F7" />
        {/* Ears */}
        <ellipse cx="38" cy="24" rx="7" ry="17" fill="#FFF5F7" transform="rotate(-10 38 24)" />
        <ellipse cx="38" cy="24" rx="4" ry="12" fill="#FBCFE8" transform="rotate(-10 38 24)" />
        <ellipse cx="62" cy="24" rx="7" ry="17" fill="#FFF5F7" transform="rotate(10 62 24)" />
        <ellipse cx="62" cy="24" rx="4" ry="12" fill="#FBCFE8" transform="rotate(10 62 24)" />

        {/* Eyes & Cheeks */}
        <circle cx="42" cy="48" r="2.5" fill="#4A3E3D" />
        <circle cx="58" cy="48" r="2.5" fill="#4A3E3D" />
        <ellipse cx="36" cy="54" rx="4.5" ry="3" fill="#F472B6" opacity="0.6" />
        <ellipse cx="64" cy="54" rx="4.5" ry="3" fill="#F472B6" opacity="0.6" />
        {/* Cute Nose/Mouth */}
        <ellipse cx="50" cy="52" rx="2" ry="1.5" fill="#FB7185" />
        <path d="M47 55 Q50 57 53 55" stroke="#4A3E3D" strokeWidth="1.2" strokeLinecap="round" />

        {/* Cherries */}
        <path d="M50 60 Q44 68 36 74 M50 60 Q56 68 64 74" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 60 Q54 55 60 56" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="74" r="15" fill="#F43F5E" />
        <circle cx="33" cy="71" r="3.5" fill="#FDA4AF" />
        <circle cx="64" cy="74" r="15" fill="#E11D48" />
        <circle cx="61" cy="71" r="3.5" fill="#FDA4AF" />
      </svg>
    </div>
  );
}

// 2. Cute Strawberry Soft Ice Cream Cone (from Canva template)
export function IceCreamSticker({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`inline-block relative select-none sticker-badge ${className}`}>
      <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* White Outline */}
        <path d="M30 65 L50 115 L70 65 Z" fill="white" stroke="white" strokeWidth="6" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="28" fill="white" />
        <circle cx="38" cy="62" r="16" fill="white" />
        <circle cx="62" cy="62" r="16" fill="white" />
        <circle cx="50" cy="25" r="16" fill="white" />

        {/* Waffle Cone */}
        <path d="M32 65 L50 112 L68 65 Z" fill="#FDE047" />
        <path d="M32 65 L50 112 L68 65 Z" fill="#F59E0B" opacity="0.35" />
        {/* Waffle grid lines */}
        <path d="M36 72 L62 90 M40 82 L58 100 M44 92 L54 105" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M64 72 L38 90 M60 82 L42 100 M56 92 L46 105" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Swirl Ice Cream */}
        <circle cx="38" cy="60" r="14" fill="#FBCFE8" />
        <circle cx="62" cy="60" r="14" fill="#F472B6" />
        <circle cx="50" cy="46" r="22" fill="#F9A8D4" />
        <circle cx="50" cy="28" r="14" fill="#F472B6" />
        <path d="M47 16 Q50 8 53 14" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" />

        {/* Sprinkles & Glaze */}
        <rect x="42" y="38" width="4" height="2" rx="1" fill="#FEF08A" transform="rotate(25 42 38)" />
        <rect x="56" y="44" width="4" height="2" rx="1" fill="#67E8F9" transform="rotate(-30 56 44)" />
        <rect x="46" y="52" width="4" height="2" rx="1" fill="#FFFFFF" transform="rotate(15 46 52)" />
        <rect x="36" y="46" width="3.5" height="1.8" rx="1" fill="#FEF08A" transform="rotate(-45 36 46)" />
      </svg>
    </div>
  );
}

// 3. Cute Teddy Bear Sticker (from Canva template)
export function TeddyBearSticker({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`inline-block relative select-none sticker-badge ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* White Outline */}
        <circle cx="50" cy="54" r="32" fill="white" />
        <circle cx="28" cy="28" r="16" fill="white" />
        <circle cx="72" cy="28" r="16" fill="white" />

        {/* Ears */}
        <circle cx="28" cy="28" r="13" fill="#D97706" />
        <circle cx="28" cy="28" r="7" fill="#FDE68A" />
        <circle cx="72" cy="28" r="13" fill="#D97706" />
        <circle cx="72" cy="28" r="7" fill="#FDE68A" />

        {/* Head */}
        <circle cx="50" cy="54" r="29" fill="#B45309" />
        <ellipse cx="50" cy="62" rx="14" ry="11" fill="#FEF3C7" />

        {/* Snout & Nose */}
        <ellipse cx="50" cy="58" rx="4" ry="3" fill="#78350F" />
        <path d="M47 64 Q50 67 53 64" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

        {/* Eyes & Rosy Cheeks */}
        <circle cx="40" cy="50" r="3" fill="#451A03" />
        <circle cx="60" cy="50" r="3" fill="#451A03" />
        <ellipse cx="33" cy="58" rx="5" ry="3.5" fill="#F87171" opacity="0.6" />
        <ellipse cx="67" cy="58" rx="5" ry="3.5" fill="#F87171" opacity="0.6" />
      </svg>
    </div>
  );
}

// 4. Fluffy Heart Cloud Sticker (from Canva template)
export function HeartCloudSticker({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`inline-block relative select-none sticker-badge ${className}`}>
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Cloud Body */}
        <ellipse cx="40" cy="35" rx="32" ry="20" fill="white" opacity="0.95" />
        <circle cx="25" cy="26" r="18" fill="white" opacity="0.95" />
        <circle cx="52" cy="24" r="20" fill="white" opacity="0.95" />
        {/* Heart Center */}
        <path
          d="M40 38 C40 38 31 31 31 24 C31 20 34 17 38 17 C40 17 40 19 40 19 C40 19 40 17 42 17 C46 17 49 20 49 24 C49 31 40 38 40 38 Z"
          fill="#F472B6"
        />
      </svg>
    </div>
  );
}

// 5. Cute Cool Blue Teddy Sticker (for Shivam)
export function BlueTeddySticker({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`inline-block relative select-none sticker-badge ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* White Outline */}
        <circle cx="50" cy="54" r="32" fill="white" />
        <circle cx="28" cy="28" r="16" fill="white" />
        <circle cx="72" cy="28" r="16" fill="white" />

        {/* Ears */}
        <circle cx="28" cy="28" r="13" fill="#0284C7" />
        <circle cx="28" cy="28" r="7" fill="#BAE6FD" />
        <circle cx="72" cy="28" r="13" fill="#0284C7" />
        <circle cx="72" cy="28" r="7" fill="#BAE6FD" />

        {/* Head */}
        <circle cx="50" cy="54" r="29" fill="#0369A1" />
        <ellipse cx="50" cy="62" rx="14" ry="11" fill="#E0F2FE" />

        {/* Snout & Nose */}
        <ellipse cx="50" cy="58" rx="4" ry="3" fill="#0C4A6E" />
        <path d="M47 64 Q50 67 53 64" stroke="#0C4A6E" strokeWidth="1.5" strokeLinecap="round" />

        {/* Eyes & Cool Cheeks */}
        <circle cx="40" cy="50" r="3" fill="#082F49" />
        <circle cx="60" cy="50" r="3" fill="#082F49" />
        <ellipse cx="33" cy="58" rx="5" ry="3.5" fill="#38BDF8" opacity="0.6" />
        <ellipse cx="67" cy="58" rx="5" ry="3.5" fill="#38BDF8" opacity="0.6" />
      </svg>
    </div>
  );
}

// 6. Cute Bunny with Umbrella (from Canva Template Image 2)
export function BunnyUmbrellaSticker({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`inline-block relative select-none sticker-badge ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* White Outline */}
        <ellipse cx="45" cy="62" rx="26" ry="24" fill="white" />
        <ellipse cx="34" cy="38" rx="7" ry="16" fill="white" transform="rotate(-12 34 38)" />
        <ellipse cx="54" cy="38" rx="7" ry="16" fill="white" transform="rotate(12 54 38)" />
        <path d="M40 38 Q65 10 90 38 Z" fill="white" stroke="white" strokeWidth="6" strokeLinejoin="round" />

        {/* Umbrella */}
        <path d="M42 38 Q65 14 88 38 Z" fill="#BAE6FD" />
        <path d="M42 38 Q50 34 58 38 Q65 34 72 38 Q80 34 88 38" fill="#7DD3FC" />
        <path d="M65 14 L65 10" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M65 38 L65 58 Q65 64 59 64" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Bunny Body */}
        <ellipse cx="45" cy="62" rx="22" ry="20" fill="#FFF5F7" />
        <ellipse cx="34" cy="38" rx="5" ry="14" fill="#FFF5F7" transform="rotate(-12 34 38)" />
        <ellipse cx="34" cy="38" rx="2.5" ry="9" fill="#FBCFE8" transform="rotate(-12 34 38)" />
        <ellipse cx="54" cy="38" rx="5" ry="14" fill="#FFF5F7" transform="rotate(12 54 38)" />
        <ellipse cx="54" cy="38" rx="2.5" ry="9" fill="#FBCFE8" transform="rotate(12 54 38)" />

        {/* Eyes & Cheeks */}
        <circle cx="39" cy="58" r="2" fill="#374151" />
        <circle cx="51" cy="58" r="2" fill="#374151" />
        <circle cx="45" cy="62" r="1.5" fill="#FB7185" />
        <ellipse cx="34" cy="62" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.8" />
        <ellipse cx="56" cy="62" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.8" />
      </svg>
    </div>
  );
}

// 7. Cute Flower Sticker (from Canva Template Image 2)
export function FlowerSticker({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`inline-block relative select-none sticker-badge ${className}`}>
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* White Outline */}
        <circle cx="25" cy="14" r="8" fill="white" />
        <circle cx="25" cy="36" r="8" fill="white" />
        <circle cx="14" cy="25" r="8" fill="white" />
        <circle cx="36" cy="25" r="8" fill="white" />
        <circle cx="25" cy="25" r="9" fill="white" />

        {/* Petals */}
        <circle cx="25" cy="14" r="6.5" fill="#FBCFE8" />
        <circle cx="25" cy="36" r="6.5" fill="#FBCFE8" />
        <circle cx="14" cy="25" r="6.5" fill="#FBCFE8" />
        <circle cx="36" cy="25" r="6.5" fill="#FBCFE8" />

        {/* Flower Center */}
        <circle cx="25" cy="25" r="6.5" fill="#FEF08A" />
      </svg>
    </div>
  );
}

// 8. Cute Ribbon Bow Sticker
export function RibbonBowSticker({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`inline-block relative select-none sticker-badge ${className}`}>
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* White Outline */}
        <path d="M40 30 Q20 10 10 25 Q20 45 40 30 Z" fill="white" stroke="white" strokeWidth="5" />
        <path d="M40 30 Q60 10 70 25 Q60 45 40 30 Z" fill="white" stroke="white" strokeWidth="5" />
        <circle cx="40" cy="30" r="10" fill="white" />

        {/* Bow Wings */}
        <path d="M40 30 Q20 12 12 25 Q22 43 40 30 Z" fill="#FB7185" />
        <path d="M40 30 Q60 12 68 25 Q58 43 40 30 Z" fill="#FB7185" />
        {/* Ribbons hanging */}
        <path d="M36 32 Q25 45 22 56 L30 52 L34 46" fill="#F43F5E" />
        <path d="M44 32 Q55 45 58 56 L50 52 L46 46" fill="#F43F5E" />
        {/* Knot */}
        <circle cx="40" cy="30" r="7" fill="#F43F5E" />
        <circle cx="38" cy="28" r="2" fill="#FDA4AF" />
      </svg>
    </div>
  );
}
