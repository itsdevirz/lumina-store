import React from 'react';

interface LuminaLogoProps {
  variant?: 'full' | 'symbol';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
  animated?: boolean;
  color?: string;
  monochrome?: boolean;
}

export const LuminaLogo: React.FC<LuminaLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  glow = false,
  animated = false,
  color = '#62DB00', // Exact vivid neon lime from uploaded brand logo
  monochrome = false
}) => {
  // Size classes for responsive scaling
  const sizeClasses = {
    xs: variant === 'full' ? 'h-4 w-auto' : 'h-4 w-4',
    sm: variant === 'full' ? 'h-5 w-auto' : 'h-5 w-5',
    md: variant === 'full' ? 'h-7 w-auto' : 'h-7 w-7',
    lg: variant === 'full' ? 'h-10 w-auto' : 'h-10 w-10',
    xl: variant === 'full' ? 'h-16 w-auto' : 'h-16 w-16',
  };

  const primaryFill = monochrome ? 'currentColor' : color;
  const accentFill = color;

  const glowStyle = glow
    ? {
        filter: `drop-shadow(0 0 16px ${color}88) drop-shadow(0 0 32px ${color}44)`
      }
    : undefined;

  // Standalone Symbol (Stylized 'A' with Dot)
  if (variant === 'symbol') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg
          viewBox="0 0 180 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses[size]} ${animated ? 'animate-pulse' : ''}`}
          style={glowStyle}
        >
          {/* Head / Dot */}
          <circle
            cx="48"
            cy="36"
            r="26"
            fill={accentFill}
            className={animated ? 'animate-bounce' : ''}
          />
          {/* Chevron / Legs */}
          <path
            d="M 8 180 L 90 16 L 172 180 L 132 180 L 90 92 L 48 180 Z"
            fill={accentFill}
          />
        </svg>
      </div>
    );
  }

  // Full Brand Logo: All-Green Geometric "LUMINA" with Stylized 'A'
  return (
    <div className={`relative inline-flex items-center select-none shrink-0 ${className}`}>
      <svg
        viewBox="0 0 920 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]}`}
        style={glowStyle}
      >
        {/* Letter L */}
        <path
          d="M 50 40 H 90 V 140 H 155 V 180 H 50 Z"
          fill={primaryFill}
        />

        {/* Letter U */}
        <path
          d="M 175 40 H 215 V 135 C 215 146 223 154 235 154 C 247 154 255 146 255 135 V 40 H 295 V 135 C 295 162 268 180 235 180 C 202 180 175 162 175 135 Z"
          fill={primaryFill}
        />

        {/* Letter M */}
        <path
          d="M 315 40 H 355 L 395 110 L 435 40 H 475 V 180 H 435 V 105 L 395 165 L 355 105 V 180 H 315 Z"
          fill={primaryFill}
        />

        {/* Letter I */}
        <path
          d="M 495 40 H 535 V 180 H 495 Z"
          fill={primaryFill}
        />

        {/* Letter N */}
        <path
          d="M 555 40 H 595 L 650 125 V 40 H 690 V 180 H 650 L 595 95 V 180 H 555 Z"
          fill={primaryFill}
        />

        {/* Stylized Letter A */}
        <g transform="translate(710, 20)">
          {/* Head / Dot */}
          <circle
            cx="36"
            cy="30"
            r="22"
            fill={accentFill}
            className={animated ? 'animate-pulse' : ''}
          />
          {/* Chevron / Legs */}
          <path
            d="M 0 160 L 70 20 L 140 160 L 105 160 L 70 85 L 35 160 Z"
            fill={accentFill}
          />
        </g>
      </svg>
    </div>
  );
};
