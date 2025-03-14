import React from "react";

interface QuantumLogoProps {
  className?: string;
}

const QuantumLogo: React.FC<QuantumLogoProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base circle with gradient */}
      <circle cx="12" cy="12" r="11" fill="url(#quantum-gradient)" />
      
      {/* Quantum probability wave */}
      <path
        d="M4 12C4 12 6 7 12 7C18 7 20 12 20 12C20 12 18 17 12 17C6 17 4 12 4 12Z"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Center particle/die */}
      <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.9" />
      
      {/* Quantum dots/pips representing odds/probability */}
      <circle cx="12" cy="7" r="1" fill="white" />
      <circle cx="17" cy="12" r="1" fill="white" />
      <circle cx="12" cy="17" r="1" fill="white" />
      <circle cx="7" cy="12" r="1" fill="white" />
      
      {/* Probability distribution waves */}
      <path
        d="M5 9C7 11 9 12 12 12C15 12 17 11 19 9"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="0.75"
        fill="none"
      />
      <path
        d="M5 15C7 13 9 12 12 12C15 12 17 13 19 15"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="0.75"
        fill="none"
      />
      
      {/* Orbital ring representing possibilities/outcomes */}
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="5"
        transform="rotate(45 12 12)"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="0.5"
        fill="none"
        strokeDasharray="1 1"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient
          id="quantum-gradient"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#9D4EDD" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default QuantumLogo; 