import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const TechDiagram: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Arrow drawing animation
  useEffect(() => {
    if (!enabled || !svgRef.current) return;
    
    const paths = svgRef.current.querySelectorAll('path.arrow');
    
    paths.forEach(path => {
      const length = (path as SVGPathElement).getTotalLength();
      
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      
      // Reset before animation
      path.style.transition = 'none';
      path.style.strokeDashoffset = `${length}`;
      
      // Trigger reflow
      path.getBoundingClientRect();
      
      // Animate
      path.style.transition = 'stroke-dashoffset 0.8s ease-in-out';
      path.style.strokeDashoffset = '0';
    });
  }, [enabled]);
  
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-headline font-bold mb-12 text-greyed-navy text-center">
              eLLM Architecture
            </h2>
            
            <div className="bg-white rounded-xl p-8 shadow-md">
              <svg
                ref={svgRef}
                viewBox="0 0 600 400"
                className="w-full h-auto"
                aria-labelledby="tech-diagram-title"
                role="img"
              >
                <title id="tech-diagram-title">eLLM Technology Flow Diagram</title>
                <desc>Flow showing how student queries go through eLLM processing</desc>
                
                {/* Boxes */}
                <rect x="200" y="50" width="200" height="60" rx="8" fill="#bbd7eb" />
                <rect x="200" y="150" width="200" height="60" rx="8" fill="#bbd7eb" />
                <rect x="200" y="250" width="200" height="60" rx="8" fill="#bbd7eb" />
                <rect x="200" y="350" width="200" height="60" rx="8" fill="#dedbc2" />
                
                {/* Text */}
                <text x="300" y="85" textAnchor="middle" fill="#212754" fontWeight="bold">Student Query</text>
                <text x="300" y="185" textAnchor="middle" fill="#212754" fontWeight="bold">Intent & Emotion</text>
                <text x="300" y="285" textAnchor="middle" fill="#212754" fontWeight="bold">eLLM Core</text>
                <text x="300" y="385" textAnchor="middle" fill="#212754" fontWeight="bold">Personalised Response</text>
                
                {/* Labels */}
                <text x="360" y="130" textAnchor="middle" fill="#212754" fontSize="12">prosody analyser</text>
                <text x="360" y="230" textAnchor="middle" fill="#212754" fontSize="12">curriculum tagger</text>
                <text x="360" y="330" textAnchor="middle" fill="#212754" fontSize="12">safety filter</text>
                
                {/* Arrows */}
                <path 
                  d="M300,110 L300,150" 
                  stroke="#212754" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead)"
                  className="arrow"
                />
                <path 
                  d="M300,210 L300,250" 
                  stroke="#212754" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead)"
                  className="arrow"
                />
                <path 
                  d="M300,310 L300,350" 
                  stroke="#212754" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead)"
                  className="arrow"
                />
                
                {/* Markers */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#212754" />
                  </marker>
                </defs>
              </svg>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-headline font-bold mb-12 text-greyed-navy text-center">
              eLLM Architecture
            </h2>
            
            <div className="bg-white rounded-xl p-8 shadow-md">
              <svg
                viewBox="0 0 600 400"
                className="w-full h-auto"
                aria-labelledby="tech-diagram-title"
                role="img"
              >
                <title id="tech-diagram-title">eLLM Technology Flow Diagram</title>
                <desc>Flow showing how student queries go through eLLM processing</desc>
                
                {/* Boxes */}
                <rect x="200" y="50" width="200" height="60" rx="8" fill="#bbd7eb" />
                <rect x="200" y="150" width="200" height="60" rx="8" fill="#bbd7eb" />
                <rect x="200" y="250" width="200" height="60" rx="8" fill="#bbd7eb" />
                <rect x="200" y="350" width="200" height="60" rx="8" fill="#dedbc2" />
                
                {/* Text */}
                <text x="300" y="85" textAnchor="middle" fill="#212754" fontWeight="bold">Student Query</text>
                <text x="300" y="185" textAnchor="middle" fill="#212754" fontWeight="bold">Intent & Emotion</text>
                <text x="300" y="285" textAnchor="middle" fill="#212754" fontWeight="bold">eLLM Core</text>
                <text x="300" y="385" textAnchor="middle" fill="#212754" fontWeight="bold">Personalised Response</text>
                
                {/* Labels */}
                <text x="360" y="130" textAnchor="middle" fill="#212754" fontSize="12">prosody analyser</text>
                <text x="360" y="230" textAnchor="middle" fill="#212754" fontSize="12">curriculum tagger</text>
                <text x="360" y="330" textAnchor="middle" fill="#212754" fontSize="12">safety filter</text>
                
                {/* Arrows */}
                <path 
                  d="M300,110 L300,150" 
                  stroke="#212754" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead)"
                />
                <path 
                  d="M300,210 L300,250" 
                  stroke="#212754" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead)"
                />
                <path 
                  d="M300,310 L300,350" 
                  stroke="#212754" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead)"
                />
                
                {/* Markers */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#212754" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechDiagram;