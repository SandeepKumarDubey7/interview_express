import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface GlowingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function GlowingButton({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'default',
  className = '' 
}: GlowingButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-block"
    >
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 opacity-75 blur-lg"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <Button 
        onClick={onClick} 
        variant={variant} 
        size={size}
        className={`relative ${className}`}
      >
        {children}
      </Button>
    </motion.div>
  );
}
