import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

interface MetricRowProps {
  metric: string;
  ellmValue: number | string;
  ellmRaw: number | string;
  gptValue: number | string;
  gptRaw: number | string;
  isBetter: 'lower' | 'higher';
  index: number;
  formatter?: (value: number) => string;
}

const SafetyBenchmarks: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const metrics = [
    {
      metric: 'Toxicity (↓ better)',
      ellmValue: 0.001,
      gptValue: 0.010,
      isBetter: 'lower' as const,
      formatter: (value: number) => value.toFixed(3)
    },
    {
      metric: 'Hallucination rate',
      ellmValue: 2.4,
      gptValue: 5.9,
      isBetter: 'lower' as const,
      formatter: (value: number) => `${value}%`
    },
    {
      metric: 'Bias score (StereoSet harm)',
      ellmValue: -8,
      gptValue: '-',
      isBetter: 'lower' as const,
      formatter: (value: number) => `${value}%`
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-greyed-beige/30 snap-start">
      <div className="container mx-auto px-4">
        {enabled ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-headline font-bold mb-10 text-greyed-navy text-center">
              Safety Benchmarks
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-greyed-navy text-greyed-white">
                    <th className="py-4 px-6 text-left">Metric</th>
                    <th className="py-4 px-6 text-center">eLLM</th>
                    <th className="py-4 px-6 text-center">GPT-4 baseline</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <MetricRow
                      key={index}
                      metric={metric.metric}
                      ellmValue={metric.formatter ? metric.formatter(metric.ellmValue as number) : metric.ellmValue}
                      ellmRaw={metric.ellmValue}
                      gptValue={typeof metric.gptValue === 'number' && metric.formatter ? metric.formatter(metric.gptValue) : metric.gptValue}
                      gptRaw={metric.gptValue}
                      isBetter={metric.isBetter}
                      index={index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-headline font-bold mb-10 text-greyed-navy text-center">
              Safety Benchmarks
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-greyed-navy text-greyed-white">
                    <th className="py-4 px-6 text-left">Metric</th>
                    <th className="py-4 px-6 text-center">eLLM</th>
                    <th className="py-4 px-6 text-center">GPT-4 baseline</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <MetricRow
                      key={index}
                      metric={metric.metric}
                      ellmValue={metric.formatter ? metric.formatter(metric.ellmValue as number) : metric.ellmValue}
                      ellmRaw={metric.ellmValue}
                      gptValue={typeof metric.gptValue === 'number' && metric.formatter ? metric.formatter(metric.gptValue) : metric.gptValue}
                      gptRaw={metric.gptValue}
                      isBetter={metric.isBetter}
                      index={index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const MetricRow: React.FC<MetricRowProps> = ({ 
  metric, 
  ellmValue, 
  ellmRaw, 
  gptValue, 
  gptRaw, 
  isBetter, 
  index 
}) => {
  const { enabled } = useContext(MotionContext);
  const [displayedEllmValue, setDisplayedEllmValue] = useState('0');
  const [displayedGptValue, setDisplayedGptValue] = useState('0');
  
  // Odometer animation
  useEffect(() => {
    if (!enabled) {
      setDisplayedEllmValue(String(ellmValue));
      setDisplayedGptValue(String(gptValue));
      return;
    }
    
    let startTimestamp: number;
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / 1500, 1); // 1.5s animation
      
      if (typeof ellmRaw === 'number') {
        const currentEllmValue = progress * ellmRaw;
        
        if (String(ellmValue).includes('%')) {
          setDisplayedEllmValue(`${currentEllmValue.toFixed(1)}%`);
        } else {
          setDisplayedEllmValue(currentEllmValue.toFixed(3));
        }
      }
      
      if (typeof gptRaw === 'number') {
        const currentGptValue = progress * gptRaw;
        
        if (String(gptValue).includes('%')) {
          setDisplayedGptValue(`${currentGptValue.toFixed(1)}%`);
        } else {
          setDisplayedGptValue(currentGptValue.toFixed(3));
        }
      } else {
        setDisplayedGptValue(String(gptValue));
      }
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayedEllmValue(String(ellmValue));
        setDisplayedGptValue(String(gptValue));
      }
    };
    
    // Start animation when component is in view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animationFrameId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    const element = document.getElementById(`metric-row-${index}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      observer.disconnect();
    };
  }, [enabled, ellmValue, gptValue, ellmRaw, gptRaw, index]);
  
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, delay: index * 0.15 }
    }
  };
  
  const isEllmBetter = 
    (isBetter === 'lower' && typeof ellmRaw === 'number' && typeof gptRaw === 'number' && ellmRaw < gptRaw) ||
    (isBetter === 'higher' && typeof ellmRaw === 'number' && typeof gptRaw === 'number' && ellmRaw > gptRaw);

  return (
    enabled ? (
      <motion.tr
        id={`metric-row-${index}`}
        variants={rowVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={index % 2 === 0 ? 'bg-white' : 'bg-greyed-beige/10'}
      >
        <td className="py-4 px-6 border-b border-greyed-navy/10">{metric}</td>
        <td className={`py-4 px-6 border-b border-greyed-navy/10 text-center font-mono ${isEllmBetter ? 'text-cyan-400 font-semibold' : ''}`}>
          {displayedEllmValue}
        </td>
        <td className="py-4 px-6 border-b border-greyed-navy/10 text-center font-mono">
          {displayedGptValue}
        </td>
      </motion.tr>
    ) : (
      <tr
        id={`metric-row-${index}`}
        className={index % 2 === 0 ? 'bg-white' : 'bg-greyed-beige/10'}
      >
        <td className="py-4 px-6 border-b border-greyed-navy/10">{metric}</td>
        <td className={`py-4 px-6 border-b border-greyed-navy/10 text-center font-mono ${isEllmBetter ? 'text-cyan-400 font-semibold' : ''}`}>
          {ellmValue}
        </td>
        <td className="py-4 px-6 border-b border-greyed-navy/10 text-center font-mono">
          {gptValue}
        </td>
      </tr>
    )
  );
};

export default SafetyBenchmarks;