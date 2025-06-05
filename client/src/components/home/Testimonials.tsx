import { motion } from "framer-motion";

const testimonials = [
  {
    text: "The aromatherapy oils from Healside have transformed my evening routine. The quality is outstanding, and I love knowing they're ethically sourced from around the world.",
    author: "Sarah L.",
    location: "New York, USA",
    rating: 5
  },
  {
    text: "I was skeptical about ordering wellness products online, but Healside exceeded my expectations. The meditation cushion from Japan is beautifully crafted and arrived faster than expected.",
    author: "Mark K.",
    location: "London, UK",
    rating: 4.5
  },
  {
    text: "The herbal tea blend from Kerala is the most authentic I've tried outside of India. I appreciate Healside's commitment to supporting traditional producers while making global wellness accessible.",
    author: "Anita P.",
    location: "Melbourne, Australia",
    rating: 5
  }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  return (
    <motion.div 
      className="bg-secondary rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
            <i key={`star-${i}`} className="ri-star-fill text-accent"></i>
          ))}
          {testimonial.rating % 1 === 0.5 && (
            <i className="ri-star-half-fill text-accent"></i>
          )}
        </div>
      </div>
      <p className="italic mb-6">{testimonial.text}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
          <span className="font-poppins font-medium text-foreground">
            {testimonial.author.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-poppins font-medium">{testimonial.author}</p>
          <p className="text-xs text-foreground/60">{testimonial.location}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
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
          What Our Customers Say
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
