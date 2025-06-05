import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ProductType } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CartRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  addedProduct?: ProductType;
}

const CartRecommendModal = ({ isOpen, onClose, addedProduct }: CartRecommendModalProps) => {
  const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  // 관련 제품 가져오기 (같은 카테고리의 제품)
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!addedProduct) return;
      
      setLoading(true);
      try {
        // 같은 카테고리의 제품을 가져옵니다
        const response = await fetch(`/api/products?category=${addedProduct.category}`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        
        const products: ProductType[] = await response.json();
        
        // 현재 추가된 제품을 제외하고, 최대 4개까지만 표시
        const filtered = products
          .filter(p => p.id !== addedProduct.id)
          .slice(0, 4);
          
        setRecommendedProducts(filtered);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && addedProduct) {
      fetchRecommendedProducts();
    }
  }, [isOpen, addedProduct]);

  const handleAddToCart = async (product: ProductType) => {
    try {
      // 세션 ID 처리 (비로그인 사용자를 위한)
      const sessionId = localStorage.getItem('cartSessionId') || `guest-${Date.now()}`;
      
      if (!localStorage.getItem('cartSessionId')) {
        localStorage.setItem('cartSessionId', sessionId);
      }
      
      const response = await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
        sessionId
      });
      
      await response.json();
      
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-poppins font-bold">Complete Your Wellness Journey</h2>
                <p className="text-foreground/70 mt-1">Customers who purchased this item also bought:</p>
              </div>
              <button
                onClick={onClose}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg mb-6">
                <img 
                  src={addedProduct?.imageUrl} 
                  alt={addedProduct?.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-poppins font-medium">{addedProduct?.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-lg font-semibold">${addedProduct?.price.toFixed(2)}</p>
                    <div className="text-green-600 font-medium text-sm bg-green-100 px-3 py-1 rounded-full">
                      Added to Cart
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-poppins font-semibold text-xl mb-4">Recommended for You</h3>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-secondary animate-pulse h-[200px] rounded-lg"></div>
                  ))}
                </div>
              ) : recommendedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedProducts.map(product => (
                    <div key={product.id} className="border border-border rounded-lg p-4 flex flex-col">
                      <div className="flex items-center mb-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md mr-2"
                        />
                        <div>
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-foreground/70 text-xs">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-semibold">${product.price.toFixed(2)}</span>
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-accent hover:bg-accent/80 text-white font-bold px-3 py-1 rounded-lg font-poppins text-xs transition-all shadow-sm h-auto"
                          size="sm"
                        >
                          + Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-foreground/70">No related products found.</p>
              )}

              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/products');
                  }}
                  className="text-accent hover:text-accent/80 font-medium border border-accent px-5 py-2 rounded-lg hover:bg-accent/10 transition-all"
                >
                  Continue Shopping
                </button>
                <Button
                  onClick={() => window.location.href = '/cart'}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg font-poppins text-sm transition-all shadow-md"
                >
                  View Cart & Checkout
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartRecommendModal;