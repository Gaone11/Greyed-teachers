import { useEffect, useState, useRef } from 'react';

interface InViewOptions {
  threshold?: number;
  once?: boolean;
}

export const useInView = ({ threshold = 0.1, once = false }: InViewOptions = {}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.unobserve(currentRef);
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    
    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);
  
  return { ref, inView };
};