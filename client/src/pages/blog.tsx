import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import BlogGrid from "@/components/blog/BlogGrid";
import ExternalBlogFeed from "@/components/blog/ExternalBlogFeed";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Wellness Journal | Healside</title>
        <meta name="description" content="Discover insights, tips, and stories from global wellness traditions. Learn about relaxation techniques, mindfulness practices, and healing rituals." />
      </Helmet>

      <section className="bg-primary py-12 md:py-20">
        <div className="healside-container">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-poppins font-bold text-3xl md:text-5xl mb-6">Wellness Journal</h1>
            <p className="text-lg md:text-xl text-foreground/80">
              Insights and inspiration from global wellness traditions to enhance your daily rituals.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="healside-container">
          <h2 className="sr-only">Blog Posts</h2>
          <BlogGrid />
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <ExternalBlogFeed />
      </section>

      <section className="py-16 bg-white">
        <div className="healside-container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-4">Subscribe to Our Journal</h2>
            <p className="text-foreground/80">
              Get the latest articles, wellness tips, and exclusive offers delivered to your inbox.
            </p>
          </div>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent" 
              required 
            />
            <button 
              type="submit" 
              className="bg-accent hover:bg-accent/90 text-white font-poppins font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Blog;
