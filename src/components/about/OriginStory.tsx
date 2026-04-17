import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';

const OrionXLogo: React.FC = () => (
  <svg viewBox="0 0 200 60" className="h-12 w-auto">
    <circle cx="18" cy="20" r="6" fill="#0EA5E9" />
    <circle cx="42" cy="20" r="6" fill="#0EA5E9" />
    <circle cx="30" cy="8" r="6" fill="#0EA5E9" />
    <circle cx="30" cy="32" r="6" fill="#0EA5E9" />
    <line x1="18" y1="20" x2="30" y2="8" stroke="#0EA5E9" strokeWidth="2" />
    <line x1="42" y1="20" x2="30" y2="8" stroke="#0EA5E9" strokeWidth="2" />
    <line x1="18" y1="20" x2="30" y2="32" stroke="#0EA5E9" strokeWidth="2" />
    <line x1="42" y1="20" x2="30" y2="32" stroke="#0EA5E9" strokeWidth="2" />
    <text x="56" y="28" fontFamily="sans-serif" fontWeight="bold" fontSize="22" fill="#0EA5E9">
      rion
    </text>
    <text x="120" y="28" fontFamily="sans-serif" fontWeight="bold" fontSize="22" fill="#F97316">
      X
    </text>
  </svg>
);

const SkyVerse888Logo: React.FC = () => (
  <svg viewBox="0 0 200 60" className="h-12 w-auto">
    <circle cx="30" cy="30" r="22" fill="none" stroke="#78716C" strokeWidth="2" />
    <path d="M 18 20 Q 30 10 42 20 Q 34 30 42 40 Q 30 50 18 40 Q 26 30 18 20 Z" fill="none" stroke="#78716C" strokeWidth="1.5" />
    <text x="60" y="26" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#78716C">
      SKYVERSE
    </text>
    <text x="60" y="44" fontFamily="sans-serif" fontWeight="bold" fontSize="16" fill="#78716C">
      888
    </text>
  </svg>
);

const OriginStory: React.FC = () => {
  const { enabled } = useContext(MotionContext);

  const leftVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  return (
    <section className="py-20 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Partner logos */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16">
            {enabled ? (
              <>
                <motion.div
                  variants={leftVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <OrionXLogo />
                </motion.div>
                <motion.span
                  className="text-3xl text-greyed-navy/30 font-light"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  &times;
                </motion.span>
                <motion.div
                  variants={rightVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <SkyVerse888Logo />
                </motion.div>
              </>
            ) : (
              <>
                <OrionXLogo />
                <span className="text-3xl text-greyed-navy/30 font-light">&times;</span>
                <SkyVerse888Logo />
              </>
            )}
          </div>

          {/* Partnership description */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-headline font-bold mb-6 text-greyed-navy text-center">
              About the Programme
            </h2>

            <p className="text-greyed-black/80 mb-4">
              This pilot programme is a collaboration between <strong>OrionX</strong>, the company behind the GreyEd education AI platform, and the <strong>SkyVerse888 Foundation NPC</strong>, a non-profit organisation based in South Africa.
            </p>

            <p className="text-greyed-black/80 mb-4">
              Together, the partners are implementing a structured, safeguarded and measurable 12-month pilot at <strong>GreyEd</strong> in Mpumalanga, South Africa. The programme is designed to strengthen learner outcomes, support digital readiness and deliver future-fit education.
            </p>

            <p className="text-greyed-black/80 mb-4">
              The GreyEd platform provides educators and tutors with AI-powered, CAPS-aligned tools for lesson planning, learner assessment and personalised support. The pilot begins with educator enablement, followed by a carefully phased learner rollout, supported by ongoing monitoring, evaluation and learning.
            </p>

            <p className="text-greyed-black/80">
              All activities are guided by strict safeguarding requirements, data protection compliance (including POPIA) and quality assurance measures, with governance provided through a Joint Steering Committee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginStory;
