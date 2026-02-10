import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

interface MapPinProps {
  x: string;
  y: string;
  label: string;
  program: string;
  delay: number;
}

const GlobalFootprint: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const locations = [
    {
      x: "55%", // Mpumalanga
      y: "68%",
      label: "Cophetsheni, Mpumalanga",
      program: "Home School",
      delay: 0
    },
    {
      x: "50%", // Nelspruit / Mbombela
      y: "64%",
      label: "Mbombela, Mpumalanga",
      program: "Partner Schools",
      delay: 0.3
    },
    {
      x: "48%", // Pretoria / Gauteng
      y: "62%",
      label: "Gauteng, South Africa",
      program: "Expansion",
      delay: 0.6
    }
  ];
  
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const mapVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.7, delay: 0.2 }
    }
  };

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.h2 
            className="text-3xl font-headline font-bold mb-12 text-greyed-navy text-center"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Community Impact — Mpumalanga Schools
          </motion.h2>
        ) : (
          <h2 className="text-3xl font-headline font-bold mb-12 text-greyed-navy text-center">
            Community Impact — Mpumalanga Schools
          </h2>
        )}
        
        <div className="max-w-4xl mx-auto">
          {enabled ? (
            <motion.div
              variants={mapVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <svg 
                viewBox="0 0 1000 500" 
                className="w-full h-auto"
                aria-label="Map showing Cophetsheni Primary School and Siyafunda partner locations in Mpumalanga"
                role="img"
              >
                <title>Siyafunda — Cophetsheni Primary School Locations</title>
                <desc>Map showing Siyafunda locations in Mpumalanga Province, South Africa</desc>
                
                {/* Simplified South Africa map path - this would be a more detailed SVG in production */}
                <path 
                  d="M170,120 L280,120 L300,180 L250,250 L160,240 L140,170 Z M350,140 L420,100 L490,110 L510,200 L470,230 L400,220 L380,180 Z M550,120 L600,150 L630,120 L700,130 L730,170 L690,230 L630,210 L580,170 Z M180,270 L260,280 L290,350 L220,380 L170,340 Z M400,260 L480,250 L500,290 L490,340 L420,330 Z M570,280 L650,270 L680,320 L640,370 L580,350 Z" 
                  fill="#dedbc2" 
                  stroke="#D4A843" 
                  strokeWidth="2"
                />
                
                {/* Pins for locations */}
                {locations.map((location, index) => (
                  <MapPin
                    key={index}
                    x={location.x}
                    y={location.y}
                    label={location.label}
                    program={location.program}
                    delay={location.delay}
                  />
                ))}
              </svg>
            </motion.div>
          ) : (
            <div className="relative">
              <svg 
                viewBox="0 0 1000 500" 
                className="w-full h-auto"
                aria-label="Map showing Cophetsheni Primary School and Siyafunda partner locations in Mpumalanga"
                role="img"
              >
                <title>Siyafunda — Cophetsheni Primary School Locations</title>
                <desc>Map showing Siyafunda locations in Mpumalanga Province, South Africa</desc>
                
                {/* Simplified South Africa map path - this would be a more detailed SVG in production */}
                <path 
                  d="M170,120 L280,120 L300,180 L250,250 L160,240 L140,170 Z M350,140 L420,100 L490,110 L510,200 L470,230 L400,220 L380,180 Z M550,120 L600,150 L630,120 L700,130 L730,170 L690,230 L630,210 L580,170 Z M180,270 L260,280 L290,350 L220,380 L170,340 Z M400,260 L480,250 L500,290 L490,340 L420,330 Z M570,280 L650,270 L680,320 L640,370 L580,350 Z" 
                  fill="#dedbc2" 
                  stroke="#D4A843" 
                  strokeWidth="2"
                />
                
                {/* Pins for locations */}
                {locations.map((location, index) => (
                  <g key={index} transform={`translate(${location.x}, ${location.y})`}>
                    <circle cx="0" cy="0" r="8" fill="#1B4332" />
                    <circle cx="0" cy="0" r="4" fill="#D4A843" />
                    
                    <foreignObject x="10" y="-15" width="150" height="50">
                      <div xmlns="http://www.w3.org/1999/xhtml" className="text-xs bg-white p-1 rounded shadow-sm">
                        <p className="font-semibold text-greyed-navy">{location.label}</p>
                        <p className="text-greyed-navy/70">{location.program}</p>
                      </div>
                    </foreignObject>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const MapPin: React.FC<MapPinProps> = ({ x, y, label, program, delay }) => {
  const { enabled } = useContext(MotionContext);
  
  const pinVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        delay, 
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    }
  };
  
  const tooltipVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: delay + 0.2, 
        duration: 0.3
      }
    }
  };

  if (!enabled) {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <circle cx="0" cy="0" r="8" fill="#1B4332" />
        <circle cx="0" cy="0" r="4" fill="#D4A843" />
        
        <foreignObject x="10" y="-15" width="150" height="50">
          <div xmlns="http://www.w3.org/1999/xhtml" className="text-xs bg-white p-1 rounded shadow-sm">
            <p className="font-semibold text-greyed-navy">{label}</p>
            <p className="text-greyed-navy/70">{program}</p>
          </div>
        </foreignObject>
      </g>
    );
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        variants={pinVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <circle cx="0" cy="0" r="8" fill="#1B4332" />
        <circle cx="0" cy="0" r="4" fill="#D4A843" />
      </motion.g>
      
      <foreignObject x="10" y="-15" width="150" height="50">
        <motion.div 
          xmlns="http://www.w3.org/1999/xhtml" 
          className="text-xs bg-white p-1 rounded shadow-sm"
          variants={tooltipVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-semibold text-greyed-navy">{label}</p>
          <p className="text-greyed-navy/70">{program}</p>
        </motion.div>
      </foreignObject>
    </g>
  );
};

export default GlobalFootprint;