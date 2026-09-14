import React, { useState, useRef } from 'react';

export function useMagneticSnap(intensity = 10, maxRotation = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState({
    transX: 0,
    transY: 0,
    rotateX: 0,
    rotateY: 0,
    isHovered: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    const transX = normX * intensity;
    const transY = normY * intensity;
    const rotateX = -normY * maxRotation;
    const rotateY = normX * maxRotation;

    setMotion({
      transX,
      transY,
      rotateX,
      rotateY,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setMotion({
      transX: 0,
      transY: 0,
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    });
  };

  const style: React.CSSProperties = {
    transform: `perspective(1000px) translate3d(${motion.transX}px, ${motion.transY}px, 0px) rotateX(${motion.rotateX}deg) rotateY(${motion.rotateY}deg) scale3d(${
      motion.isHovered ? 1.025 : 1
    }, ${motion.isHovered ? 1.025 : 1}, 1)`,
    transition: motion.isHovered
      ? 'transform 0.08s ease-out, box-shadow 0.35s ease, border-color 0.35s ease'
      : 'transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.35s ease, border-color 0.35s ease',
    willChange: 'transform',
  };

  return {
    ref,
    style,
    handleMouseMove,
    handleMouseLeave,
    isHovered: motion.isHovered,
  };
}
