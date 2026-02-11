import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { MapPin, ExternalLink } from 'lucide-react';

const OfficeLocations: React.FC = () => {
  const { enabled } = useContext(MotionContext);
  
  const locations = [
    {
      region: "HQ – United Kingdom",
      address: "10 - 16 Tiller Road, London, E14 8PX, United Kingdom",
      mapsLink: "https://www.google.com/maps/place/10-16+Tiller+Rd,+London+E14+8PX"
    },
    {
      region: "R&D – United States",
      address: "690 Saratoga Ave, San Jose, CA 95129",
      mapsLink: "https://www.google.com/maps/place/690+Saratoga+Ave,+San+Jose,+CA+95129"
    }
  ];
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const mapImageUrl = "https://images.pexels.com/photos/12066797/pexels-photo-12066797.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <section className="py-16 bg-surface/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-headline font-bold mb-8 text-primary text-center">
          Our Locations
        </h2>
        
        <div className="max-w-5xl mx-auto">
          {enabled ? (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6">
                  <div className="space-y-6">
                    {locations.map((location, index) => (
                      <div key={index} className="flex items-start">
                        <MapPin className="flex-shrink-0 w-5 h-5 text-accent mt-1 mr-3" />
                        <div>
                          <h3 className="font-headline font-semibold text-primary mb-1">
                            {location.region}
                          </h3>
                          <p className="text-text/80 mb-1">
                            {location.address}
                          </p>
                          <a 
                            href={location.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-accent hover:text-primary"
                          >
                            Open in Google Maps
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:h-full">
                  <a 
                    href="https://www.google.com/maps/place/10-16+Tiller+Rd,+London+E14+8PX" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <img
                      src={mapImageUrl}
                      alt="GreyEd office locations map"
                      className="w-full h-full object-cover min-h-[250px]"
                      loading="lazy"
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6">
                  <div className="space-y-6">
                    {locations.map((location, index) => (
                      <div key={index} className="flex items-start">
                        <MapPin className="flex-shrink-0 w-5 h-5 text-accent mt-1 mr-3" />
                        <div>
                          <h3 className="font-headline font-semibold text-primary mb-1">
                            {location.region}
                          </h3>
                          <p className="text-text/80 mb-1">
                            {location.address}
                          </p>
                          <a 
                            href={location.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-accent hover:text-primary"
                          >
                            Open in Google Maps
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:h-full">
                  <a 
                    href="https://www.google.com/maps/place/10-16+Tiller+Rd,+London+E14+8PX" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <img
                      src={mapImageUrl}
                      alt="GreyEd office locations map"
                      className="w-full h-full object-cover min-h-[250px]"
                      loading="lazy"
                    />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OfficeLocations;