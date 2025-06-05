import { Helmet } from "react-helmet";
import Hero from "@/components/home/Hero";
import WhyHealside from "@/components/home/WhyHealside";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter from "@/components/products/CategoryFilter";
import FeaturedProduct from "@/components/home/FeaturedProduct";
import BlogGrid from "@/components/blog/BlogGrid";
import Newsletter from "@/components/home/Newsletter";
import Testimonials from "@/components/home/Testimonials";
import BenefitsBanner from "@/components/BenefitsBanner";
import { ExternalBlogSection } from "@/components/blog/ExternalBlogSection";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Healside - Global Wellness Select Shop</title>
        <meta name="description" content="Discover curated wellness products for relaxation and healing from around the globe. Ethically sourced and sustainably packaged." />
      </Helmet>

      <Hero />
      
      <BenefitsBanner />
      
      <WhyHealside />
      
      <section id="products" className="py-16 bg-secondary">
        <div className="healside-container">
          <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-4">Our Curated Collection</h2>
          <p className="text-center text-foreground/80 max-w-2xl mx-auto mb-12">Discover wellness products handpicked for quality and effectiveness from healing traditions worldwide.</p>
          
          <CategoryFilter />
          
          <ProductGrid />
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="btn-secondary">
                View More Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <FeaturedProduct />
      
      <section id="blog" className="py-16 bg-secondary">
        <div className="healside-container">
          <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-4">Wellness Journal</h2>
          <p className="text-center text-foreground/80 max-w-2xl mx-auto mb-12">Discover insights, tips, and stories from global wellness traditions.</p>
          
          <BlogGrid />
          
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" className="btn-secondary">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <ExternalBlogSection />
      
      <Newsletter />
      
      <Testimonials />
    </>
  );
};

export default Home;
