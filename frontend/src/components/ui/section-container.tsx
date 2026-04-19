import { ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  id?: string;
  background?: 'light' | 'dark' | 'primary' | 'white';
  className?: string;
}

export function SectionContainer({ 
  children, 
  id, 
  background = 'white',
  className = '' 
}: SectionContainerProps) {
  const bgClasses = {
    light: 'bg-gray-50 dark:bg-slate-900',
    dark: 'bg-gray-900 dark:bg-black',
    primary: 'bg-primary',
    white: 'bg-white dark:bg-slate-950',
  };

  return (
    <section 
      id={id} 
      className={`py-16 ${bgClasses[background]} ${className}`}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}
