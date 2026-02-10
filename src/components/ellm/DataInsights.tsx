import React, { useContext, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const DataInsights: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Frustration detection data (mocked)
  const data = [
    { week: 1, detections: 30 },
    { week: 2, detections: 28 },
    { week: 3, detections: 25 },
    { week: 4, detections: 27 },
    { week: 5, detections: 24 },
    { week: 6, detections: 22 },
    { week: 7, detections: 20 },
    { week: 8, detections: 21 },
    { week: 9, detections: 19 },
    { week: 10, detections: 18 },
    { week: 11, detections: 16 },
    { week: 12, detections: 15 }
  ];
  
  // Draw a simple line chart
  useEffect(() => {
    if (!canvasRef.current || enabled) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = 'rgba(33, 39, 84, 0.2)';
    ctx.stroke();
    
    // Draw line
    const xStep = (width - padding * 2) / (data.length - 1);
    const yMax = Math.max(...data.map(d => d.detections));
    const yScale = (height - padding * 2) / yMax;
    
    ctx.beginPath();
    ctx.moveTo(
      padding,
      height - padding - data[0].detections * yScale
    );
    
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(
        padding + i * xStep,
        height - padding - data[i].detections * yScale
      );
    }
    
    ctx.strokeStyle = 'rgba(187, 215, 235, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [enabled]);
  
  const columnVariants = {
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
        <h2 className="text-3xl font-headline font-bold mb-12 text-greyed-navy text-center">
          Data Insights
        </h2>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {enabled ? (
            <>
              <motion.div
                variants={columnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-xl font-headline font-semibold mb-4 text-greyed-navy">
                  Frustration Detection Trend
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <Tooltip 
                        formatter={(value) => [`${value} instances`, 'Frustration Detections']}
                        labelFormatter={(label) => `Week ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="detections" 
                        stroke="#D4A843" 
                        strokeWidth={2} 
                        dot={{ r: 4, strokeWidth: 1 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2 text-greyed-navy/60 text-sm">
                  25% reduction in frustration detections over a term
                </div>
              </motion.div>
              
              <motion.div
                variants={columnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <h3 className="text-2xl font-headline font-semibold mb-4 text-greyed-navy">
                  Continuous improvement
                </h3>
                <p className="text-greyed-black/80 mb-6">
                  GreyEd logs academic and emotional signals (anonymised) to refine eLLM weekly.
                </p>
                <div className="bg-greyed-blue/20 rounded-lg p-4 text-greyed-navy/70 text-sm">
                  All data GDPR/UK DPA compliant; opt-out anytime.
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-headline font-semibold mb-4 text-greyed-navy">
                  Frustration Detection Trend
                </h3>
                <div className="h-64">
                  <canvas ref={canvasRef} width="400" height="200" className="w-full h-full"></canvas>
                </div>
                <div className="text-center mt-2 text-greyed-navy/60 text-sm">
                  25% reduction in frustration detections over a term
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-headline font-semibold mb-4 text-greyed-navy">
                  Continuous improvement
                </h3>
                <p className="text-greyed-black/80 mb-6">
                  GreyEd logs academic and emotional signals (anonymised) to refine eLLM weekly.
                </p>
                <div className="bg-greyed-blue/20 rounded-lg p-4 text-greyed-navy/70 text-sm">
                  All data GDPR/UK DPA compliant; opt-out anytime.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DataInsights;