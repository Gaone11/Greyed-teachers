import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { MotionContext } from '../../context/MotionContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schema with zod
const formSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please enter a subject"),
  message: z.string().min(30, "Message must contain at least 30 characters")
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm: React.FC = () => {
  useContext(MotionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Initialize form with react-hook-form
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange"
  });
  
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const onSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send data to your backend
      // For now, simulate a successful form submission with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      setFormSuccess(true);
      reset(); // Reset the form
      
      // Hide success message after 5 seconds
      setTimeout(() => setFormSuccess(false), 5000);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-surface-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-8 text-primary text-center">
            Send us a message
          </h2>
          
          {enabled ? (
            <motion.div
              variants={formVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-md"
            >
              {formSuccess && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert" aria-live="polite">
                  <strong className="font-bold">Message sent! </strong>
                  <span className="block sm:inline">We'll reply soon.</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-primary font-medium mb-1 text-sm">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                    placeholder="John Doe"
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-primary font-medium mb-1 text-sm">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                    placeholder="your.email@example.com"
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-primary font-medium mb-1 text-sm">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject")}
                    className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                    placeholder="How can we help you?"
                    aria-invalid={errors.subject ? "true" : "false"}
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-primary font-medium mb-1 text-sm">
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                    placeholder="Tell us more about your inquiry..."
                    aria-invalid={errors.message ? "true" : "false"}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  aria-disabled={isSubmitting || !isValid}
                  className={`w-full bg-primary text-surface-white py-3 rounded-lg font-medium transition-colors ${
                    isSubmitting || !isValid 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:bg-primary/90'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                <p className="text-text/60 text-sm mt-4 text-center">
                  We'll never share your information with third parties.
                </p>
              </form>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-md">
              {formSuccess && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert" aria-live="polite">
                  <strong className="font-bold">Message sent! </strong>
                  <span className="block sm:inline">We'll reply soon.</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-primary font-medium mb-1 text-sm">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                    placeholder="John Doe"
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-primary font-medium mb-1 text-sm">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                    placeholder="your.email@example.com"
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-primary font-medium mb-1 text-sm">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject")}
                    className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                    placeholder="How can we help you?"
                    aria-invalid={errors.subject ? "true" : "false"}
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-primary font-medium mb-1 text-sm">
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
                    placeholder="Tell us more about your inquiry..."
                    aria-invalid={errors.message ? "true" : "false"}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-600 text-sm mt-1" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  aria-disabled={isSubmitting || !isValid}
                  className={`w-full bg-primary text-surface-white py-3 rounded-lg font-medium transition-colors ${
                    isSubmitting || !isValid 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:bg-primary/90'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                <p className="text-text/60 text-sm mt-4 text-center">
                  We'll never share your information with third parties.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;