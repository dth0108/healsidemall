import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Healside</title>
        <meta name="description" content="Learn about Healside's mission to bring global wellness products to your doorstep through ethical sourcing and sustainable practices." />
      </Helmet>

      <section className="bg-primary py-12 md:py-20">
        <div className="healside-container">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-poppins font-bold text-3xl md:text-5xl mb-6">Our Story</h1>
            <p className="text-lg md:text-xl text-foreground/80">
              Connecting global wellness traditions with modern lifestyles
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="healside-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=700&q=80" 
                alt="Person examining wellness products"
                className="rounded-2xl shadow-lg"
              />
            </motion.div>
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-poppins font-bold text-2xl md:text-3xl">Our Mission</h2>
              <p className="text-foreground/80">
                At Healside, we believe that wellness traditions from around the world offer invaluable wisdom for modern living. Our mission is to curate and deliver authentic, ethically-sourced wellness products that connect you with healing practices from diverse cultures.
              </p>
              <p className="text-foreground/80">
                By partnering directly with artisans, small-scale producers, and wellness experts globally, we're able to bring you high-quality wellness tools while supporting traditional craftsmanship and sustainable practices.
              </p>
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-heart-line text-accent text-xl"></i>
                  <p className="font-poppins font-medium">Thoughtfully Curated</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-earth-line text-accent text-xl"></i>
                  <p className="font-poppins font-medium">Globally Sourced</p>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-leaf-line text-accent text-xl"></i>
                  <p className="font-poppins font-medium">Sustainably Packaged</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="healside-container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-4">The Healside Difference</h2>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              What makes our approach to wellness products unique
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                <i className="ri-search-line text-2xl"></i>
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Meticulous Curation</h3>
              <p className="text-foreground/80">
                Each product in our collection is personally vetted for authenticity, quality, and effectiveness. We research traditions, test products, and build relationships with suppliers to ensure we offer only the best.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                <i className="ri-global-line text-2xl"></i>
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Direct Sourcing</h3>
              <p className="text-foreground/80">
                Our dropshipping model connects you directly with the best wellness producers worldwide. This allows us to offer authentic products while supporting small businesses and traditional artisans directly.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                <i className="ri-book-open-line text-2xl"></i>
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Contextual Education</h3>
              <p className="text-foreground/80">
                We believe in honoring the cultures behind our products. That's why we provide in-depth information about each item's origins, traditional uses, and the people who create them.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="healside-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 md:order-1 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="font-poppins font-bold text-2xl md:text-3xl">Our Team</h2>
              <p className="text-foreground/80">
                Healside was founded by a diverse team of wellness enthusiasts, cultural anthropologists, and e-commerce experts who share a passion for global healing traditions.
              </p>
              <p className="text-foreground/80">
                We've spent years traveling the world, building relationships with producers of exceptional wellness products, and studying traditional practices. Our combined expertise allows us to bridge the gap between ancient wisdom and modern convenience.
              </p>
              <p className="text-foreground/80">
                Our team is committed to ethical business practices, environmental sustainability, and cultural respect in everything we do.
              </p>
            </motion.div>
            <motion.div 
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=700&q=80" 
                alt="Healside team members discussing product sourcing"
                className="rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/30">
        <div className="healside-container text-center">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-6">Our Commitment to Sustainability</h2>
            <p className="text-foreground/80 mb-8">
              We believe that wellness extends beyond personal health to the wellbeing of our planet. That's why we prioritize eco-friendly packaging, carbon-neutral shipping options, and partnerships with suppliers who share our environmental values.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="bg-white p-4 rounded-full shadow-sm">
                <img src="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/icons/Others/recycle-fill.svg" alt="Recyclable packaging icon" className="w-12 h-12" />
              </div>
              <div className="bg-white p-4 rounded-full shadow-sm">
                <img src="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/icons/Weather/sun-fill.svg" alt="Renewable energy icon" className="w-12 h-12" />
              </div>
              <div className="bg-white p-4 rounded-full shadow-sm">
                <img src="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/icons/Map/earth-fill.svg" alt="Global sustainability icon" className="w-12 h-12" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
