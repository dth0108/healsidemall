import { motion } from "framer-motion";

const features = [
  {
    icon: "ri-earth-line",
    title: "Globally Sourced",
    description: "Curated wellness products from traditions around the world, bringing ancient healing wisdom to modern life."
  },
  {
    icon: "ri-leaf-line",
    title: "Eco-Friendly",
    description: "Sustainable packaging and ethically sourced products that are good for you and kind to our planet."
  },
  {
    icon: "ri-truck-line",
    title: "Hassle-Free Delivery",
    description: "Direct shipping from our global partners to your door, with tracking and reliable delivery worldwide."
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <motion.div 
      className="bg-secondary rounded-xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <i className={`${feature.icon} text-2xl text-foreground`}></i>
      </div>
      <h3 className="font-poppins font-semibold text-xl mb-3">{feature.title}</h3>
      <p className="text-foreground/80">{feature.description}</p>
    </motion.div>
  );
};

const WhyHealside = () => {
  return (
    <section className="py-16 bg-white">
      <div className="healside-container">
        <motion.h2 
          className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why Healside?
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyHealside;
