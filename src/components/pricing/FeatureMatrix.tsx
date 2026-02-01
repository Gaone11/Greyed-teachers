import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { Check, X } from 'lucide-react';
import { featureMatrix } from '../../data/pricingData';

const FeatureMatrix: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const tableVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  // For desktop: a sticky scrollable feature matrix
  const DesktopMatrix = () => (
    <div className="max-w-6xl mx-auto overflow-x-auto">
      {enabled ? (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="min-w-full"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-greyed-navy/10">
                <th className="text-left py-4 pl-4 pr-8 sticky left-0 bg-greyed-white">Feature</th>
                <th className="px-8 py-4 text-center font-semibold">Free</th>
                <th className="px-8 py-4 text-center font-semibold">Premium</th>
                <th className="px-8 py-4 text-center font-semibold">Hybrid</th>
                <th className="px-8 py-4 text-center font-semibold">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((feature, index) => (
                <tr key={feature.id} className={index % 2 === 0 ? 'bg-greyed-white' : 'bg-greyed-beige/20'}>
                  <td className="py-3 pl-4 pr-8 sticky left-0 font-medium"
                    style={{ backgroundColor: index % 2 === 0 ? 'var(--greyed-white)' : 'rgba(222, 219, 194, 0.2)' }}>
                    {feature.name}
                  </td>
                  <td className="px-8 py-3 text-center">
                    {feature.availableIn.free ? 
                      <Check size={16} className="mx-auto text-green-600" /> : 
                      <X size={16} className="mx-auto text-gray-400" />}
                  </td>
                  <td className="px-8 py-3 text-center">
                    {feature.availableIn.premium ? 
                      <Check size={16} className="mx-auto text-green-600" /> : 
                      <X size={16} className="mx-auto text-gray-400" />}
                  </td>
                  <td className="px-8 py-3 text-center">
                    {feature.availableIn.hybrid ? 
                      <Check size={16} className="mx-auto text-green-600" /> : 
                      <X size={16} className="mx-auto text-gray-400" />}
                  </td>
                  <td className="px-8 py-3 text-center">
                    {feature.availableIn.teacher ? 
                      <Check size={16} className="mx-auto text-green-600" /> : 
                      <X size={16} className="mx-auto text-gray-400" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-greyed-navy/10">
                <th className="text-left py-4 pl-4 pr-8 sticky left-0 bg-greyed-white">Feature</th>
                <th className="px-8 py-4 text-center font-semibold">Free</th>
                <th className="px-8 py-4 text-center font-semibold">Premium</th>
                <th className="px-8 py-4 text-center font-semibold">Hybrid</th>
                <th className="px-8 py-4 text-center font-semibold">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((feature, index) => (
                <tr key={feature.id} className={index % 2 === 0 ? 'bg-greyed-white' : 'bg-greyed-beige/20'}>
                  <td className="py-3 pl-4 pr-8 sticky left-0 font-medium"
                    style={{ backgroundColor: index % 2 === 0 ? 'var(--greyed-white)' : 'rgba(222, 219, 194, 0.2)' }}>
                    {feature.name}
                  </td>
                  <td className="px-8 py-3 text-center">
                    {feature.availableIn.free ? 
                      <Check size={16} className="mx-auto text-green-600" /> : 
                      <X size={16} className="mx-auto text-gray-400" />}
                  </td>
                  <td className="px-8 py-3 text-center">
                    {feature.availableIn.premium ? 
                      <Check size={16} className="mx-auto text-green-600" /> : 
                      <X size={16} className="mx-auto text-gray-400" />}
                  </td>
                  <td className="px-8 py-3 text-center">
                    {feature.availableIn.hybrid ? 
                      <Check size={16} className="mx-auto text-green-600" /> : 
                      <X size={16} className="mx-auto text-gray-400" />}
                  </td>
                  <td className="px-8 py-3 text-center">
                    {feature.availableIn.teacher ? 
                      <Check size={16} className="mx-auto text-green-600" /> : 
                      <X size={16} className="mx-auto text-gray-400" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // For mobile: collapsible sections under each plan
  const MobileMatrix = () => (
    <div className="space-y-6">
      <div className="rounded-lg border border-greyed-navy/10 p-4">
        <h3 className="font-headline font-semibold mb-3">Free Plan Features</h3>
        <ul className="space-y-2">
          {featureMatrix.map(feature => (
            <li key={feature.id} className="flex items-center">
              {feature.availableIn.free ? 
                <Check size={16} className="mr-2 text-green-600" /> : 
                <X size={16} className="mr-2 text-gray-400" />}
              <span className={`text-sm ${feature.availableIn.free ? '' : 'text-gray-400'}`}>
                {feature.name}
                {feature.id === 'video-calls' && feature.availableIn.free && (
                  <span className="ml-2 text-xs text-gray-500">5 min/day</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-greyed-navy/10 p-4">
        <h3 className="font-headline font-semibold mb-3">Premium Plan Features</h3>
        <ul className="space-y-2">
          {featureMatrix.map(feature => (
            <li key={feature.id} className="flex items-center">
              {feature.availableIn.premium ? 
                <Check size={16} className="mr-2 text-green-600" /> : 
                <X size={16} className="mr-2 text-gray-400" />}
              <span className={`text-sm ${feature.availableIn.premium ? '' : 'text-gray-400'}`}>
                {feature.name}
                {feature.id === 'video-calls' && feature.availableIn.premium && (
                  <span className="ml-2 text-xs text-gray-500">unlimited</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-greyed-navy/10 p-4">
        <h3 className="font-headline font-semibold mb-3">Hybrid Plan Features</h3>
        <ul className="space-y-2">
          {featureMatrix.map(feature => (
            <li key={feature.id} className="flex items-center">
              {feature.availableIn.hybrid ? 
                <Check size={16} className="mr-2 text-green-600" /> : 
                <X size={16} className="mr-2 text-gray-400" />}
              <span className={`text-sm ${feature.availableIn.hybrid ? '' : 'text-gray-400'}`}>
                {feature.name}
                {feature.id === 'video-calls' && feature.availableIn.hybrid && (
                  <span className="ml-2 text-xs text-gray-500">unlimited</span>
                )}
                {feature.id === 'human-tutors' && feature.availableIn.hybrid && (
                  <span className="ml-2 text-xs text-gray-500">4/mo</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="rounded-lg border border-greyed-navy/10 p-4">
        <h3 className="font-headline font-semibold mb-3">Teacher Plan Features</h3>
        <ul className="space-y-2">
          {featureMatrix.map(feature => (
            <li key={feature.id} className="flex items-center">
              {feature.availableIn.teacher ? 
                <Check size={16} className="mr-2 text-green-600" /> : 
                <X size={16} className="mr-2 text-gray-400" />}
              <span className={`text-sm ${feature.availableIn.teacher ? '' : 'text-gray-400'}`}>
                {feature.name}
                {feature.id === 'lesson-plans' && feature.availableIn.teacher && (
                  <span className="ml-2 text-xs text-gray-500">unlimited</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-greyed-white snap-start">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-center text-greyed-navy mb-10">
          Compare All Features
        </h2>
        
        <div className="hidden md:block">
          <DesktopMatrix />
        </div>
        
        <div className="md:hidden">
          <MobileMatrix />
        </div>
      </div>
    </section>
  );
};

export default FeatureMatrix;