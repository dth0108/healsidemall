import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary">
      <div className="healside-container max-w-3xl">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-4">Join Our Wellness Journey</h2>
          <p className="mb-8 text-foreground/80">Subscribe to receive exclusive offers, wellness tips, and updates on new globally-sourced products.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mx-auto max-w-xl">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-white font-poppins font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-foreground/60">By subscribing, you agree to our Privacy Policy and consent to receive updates from Healside.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
