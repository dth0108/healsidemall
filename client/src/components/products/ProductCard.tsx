import { Link } from "wouter";
import { motion } from "framer-motion";
import Rating from "@/components/ui/Rating";
import { useContext } from "react";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

export interface ProductType {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  supplier?: string;
  origin?: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: ProductType;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // For guest users we'd use a session ID stored in localStorage
      const sessionId = !isAuthenticated 
        ? localStorage.getItem('cartSessionId') || `guest-${Date.now()}`
        : undefined;
      
      if (!isAuthenticated && sessionId && !localStorage.getItem('cartSessionId')) {
        localStorage.setItem('cartSessionId', sessionId);
      }
      
      const response = await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
        sessionId: !isAuthenticated ? sessionId : undefined
      });
      
      const data = await response.json();
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
      
      // Invalidate cart cache
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/products/${product.id}`}>
        <a className="block">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-poppins font-semibold text-lg">{product.name}</h3>
                {product.origin && (
                  <p className="text-sm text-foreground/60">{product.origin}</p>
                )}
              </div>
              <span className="font-poppins font-medium text-lg">${product.price.toFixed(2)}</span>
            </div>
            <p className="mb-4 text-sm">{product.description.length > 100 
              ? product.description.substring(0, 100) + '...' 
              : product.description}</p>
            <div className="flex justify-between items-center">
              <Rating value={4.5} count={42} />
              <Button 
                onClick={handleAddToCart}
                className="bg-accent hover:bg-accent/80 text-white font-bold px-5 py-2 rounded-lg font-poppins text-sm transition-all shadow-md hover:shadow-lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </a>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
