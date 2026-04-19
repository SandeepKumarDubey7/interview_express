import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface CountUpAnimationProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function CountUpAnimation({ 
  value, 
  duration = 2, 
  suffix = '', 
  className = '' 
}: CountUpAnimationProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration });
    return controls.stop;
  }, [count, value, duration]);

  return (
    <motion.span className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}
