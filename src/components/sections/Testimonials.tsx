import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Alex K.",
    school: "GCSE Student, Year 11",
    text: "El AI helped me jump from a 5 to an 8 in my maths mock exam. It finds different ways to explain concepts until I actually get them.",
    subject: "Mathematics"
  },
  {
    id: 2,
    name: "Priya S.",
    school: "A Level Student, Year 13",
    text: "I was struggling with Chemistry and nearly dropped it. El AI helped me understand reaction mechanisms in a way my textbook never could.",
    subject: "Chemistry"
  },
  {
    id: 3,
    name: "Marcus T.",
    school: "IGCSE Student, Year 10",
    text: "What I love about El AI is that it doesn't judge me for asking the same question multiple times. It just finds a new way to explain it.",
    subject: "Physics"
  }
];

const Testimonials: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(enabled);
  
  // Auto advance testimonials
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [autoplay]);
  
  // Update autoplay when enabled changes
  useEffect(() => {
    setAutoplay(enabled);
  }, [enabled]);
  
  const handlePrevious = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  const quoteIconVariants = {
    initial: { y: 0 },
    animate: { y: -4 }
  };

  return (
    <section className="py-20 bg-greyed-navy text-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            {enabled ? (
              <motion.div
                variants={quoteIconVariants}
                initial="initial"
                animate={currentIndex === 0 ? "animate" : "initial"}
                transition={{ duration: 0.3 }}
              >
                <Quote className="w-12 h-12 text-greyed-blue opacity-60" />
              </motion.div>
            ) : (
              <Quote className="w-12 h-12 text-greyed-blue opacity-60" />
            )}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            Real Student Stories
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto relative">
          <div className="h-64 md:h-48">
            {enabled ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonials[currentIndex].id}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                    <p className="text-lg mb-6 text-greyed-white/90">
                      "{testimonials[currentIndex].text}"
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-semibold text-greyed-blue">
                          {testimonials[currentIndex].name}
                        </p>
                        <p className="text-sm text-greyed-white/60">
                          {testimonials[currentIndex].school}
                        </p>
                      </div>
                      <div className="bg-greyed-blue/20 py-1 px-3 rounded-full text-sm">
                        {testimonials[currentIndex].subject}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0">
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                  <p className="text-lg mb-6 text-greyed-white/90">
                    "{testimonials[currentIndex].text}"
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-semibold text-greyed-blue">
                        {testimonials[currentIndex].name}
                      </p>
                      <p className="text-sm text-greyed-white/60">
                        {testimonials[currentIndex].school}
                      </p>
                    </div>
                    <div className="bg-greyed-blue/20 py-1 px-3 rounded-full text-sm">
                      {testimonials[currentIndex].subject}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={handlePrevious}
              className="p-2 rounded-full bg-greyed-white/10 hover:bg-greyed-white/20 transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-greyed-blue" : "bg-greyed-white/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
            <button 
              onClick={handleNext}
              className="p-2 rounded-full bg-greyed-white/10 hover:bg-greyed-white/20 transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;