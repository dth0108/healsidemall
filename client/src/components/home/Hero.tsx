import { Link } from "wouter";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative bg-primary py-16 md:py-24">
      <div className="healside-container">
        <motion.div 
          className="flex flex-col md:flex-row items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <motion.h1 
              className="font-poppins font-bold text-3xl md:text-5xl mb-6 leading-tight text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Curated Wellness from Around the Globe
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-8 text-foreground/80 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Discover handpicked products that elevate your well-being, sourced from healing traditions worldwide.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link href="/products">
                <a className="btn-primary inline-block">
                  Explore Healing
                </a>
              </Link>
            </motion.div>
          </div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Aromatherapy diffuser with essential oils in a calming setting" 
              className="rounded-2xl shadow-xl w-full h-auto"
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Global Shipping Banner */}
      <div className="bg-white py-3 shadow-md mt-16 w-full">
        <div className="healside-container">
          <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
            <span className="font-poppins font-medium md:mr-6 mb-2 md:mb-0">Global Shipping</span>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="text-sm px-3 py-1 bg-secondary rounded-full">US: 5-7 days</span>
              <span className="text-sm px-3 py-1 bg-secondary rounded-full">Europe: 7-10 days</span>
              <span className="text-sm px-3 py-1 bg-secondary rounded-full">Asia: 10-14 days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
