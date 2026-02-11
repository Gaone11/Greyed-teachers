import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { ExternalLink } from 'lucide-react';

const HeroELLM: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Animated waveform background
  useEffect(() => {
    if (!enabled || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; color: string; }[] = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(187, 215, 235, ${Math.random() * 0.3 + 0.1})` // greyed-blue with random opacity
      });
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });
      
      // Draw wave patterns
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let i = 0; i < canvas.width; i++) {
        const amplitude = 15;
        const wave1 = Math.sin(i * 0.01 + Date.now() * 0.001) * amplitude;
        const wave2 = Math.sin(i * 0.02 + Date.now() * 0.0015) * amplitude * 0.5;
        ctx.lineTo(i, canvas.height / 2 + wave1 + wave2);
      }
      
      ctx.strokeStyle = 'rgba(187, 215, 235, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled]);

  const headlineVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const subheadVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center relative bg-primary">
      {/* Animated background */}
      {enabled && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />
      )}
      
      <div className="container mx-auto px-4 z-10 text-center py-20">
        {enabled ? (
          <>
            <motion.h1 
              className="text-5xl md:text-6xl font-headline font-bold text-surface-white mb-6"
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              Empathy meets intelligence.
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-accent max-w-3xl mx-auto mb-10"
              initial="hidden"
              animate="visible"
              variants={subheadVariants}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              GreyEd's eLLM understands not just what you say, but how you feel when you say it.
            </motion.p>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <a 
                href="/docs/ellm_whitepaper.pdf" 
                className="inline-flex items-center border border-surface-white text-surface-white hover:bg-surface-white/10 px-8 py-3 rounded-full font-medium transition-colors"
                
                target="_blank"
                rel="noopener noreferrer"
              >
                Download the White Paper
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
          </>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-surface-white mb-6">
              Empathy meets intelligence.
            </h1>
            
            <p className="text-xl md:text-2xl text-accent max-w-3xl mx-auto mb-10">
              GreyEd's eLLM understands not just what you say, but how you feel when you say it.
            </p>
            
            <div>
              <a 
                href="/docs/ellm_whitepaper.pdf" 
                className="inline-flex items-center border border-surface-white text-surface-white hover:bg-surface-white/10 px-8 py-3 rounded-full font-medium transition-colors"
                
                target="_blank"
                rel="noopener noreferrer"
              >
                Download the White Paper
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroELLM;