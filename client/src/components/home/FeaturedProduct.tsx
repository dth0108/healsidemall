import { Link } from "wouter";
import { motion } from "framer-motion";

const FeaturedProduct = () => {
  return (
    <section className="py-16 bg-white">
      <div className="healside-container">
        <motion.div 
          className="bg-primary/30 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1620733723572-11c53f73a416?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Woman enjoying essential oils diffuser in living room" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <motion.span 
                className="font-poppins uppercase tracking-wider text-sm font-medium text-accent mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Featured Collection
              </motion.span>
              <motion.h2 
                className="font-poppins font-bold text-2xl md:text-3xl mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Aromatherapy Essentials
              </motion.h2>
              <motion.p 
                className="mb-6 text-foreground/80"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Transform your space into a sanctuary with our premium aromatherapy collection. Sourced from traditional producers around the world, these essential oils and diffusers bring global wellness practices into your daily ritual.
              </motion.p>
              <motion.ul 
                className="mb-8 space-y-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <li className="flex items-center">
                  <i className="ri-check-line text-accent mr-2"></i> 100% pure, therapeutic-grade oils
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-accent mr-2"></i> Sustainably sourced from global producers
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-accent mr-2"></i> Free from synthetic additives
                </li>
              </motion.ul>
              <motion.div
                initial={{ opacity: [0], y: [10] }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href="/products?category=aromatherapy">
                  <a className="btn-primary">
                    Shop Collection
                  </a>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
