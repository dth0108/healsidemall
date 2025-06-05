import { useState, useEffect, useContext } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AuthContext } from "@/App";
import { useToast } from "@/hooks/use-toast";

interface CartItemType {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
}

interface CartType {
  cart: {
    id: number;
    userId?: number;
    sessionId?: string;
  };
  items: CartItemType[];
}

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get existing session ID from localStorage for guest users
    if (!isAuthenticated) {
      const storedSessionId = localStorage.getItem("cartSessionId");
      setSessionId(storedSessionId);
    }
  }, [isAuthenticated]);

  const { 
    data: cartData, 
    isLoading,
    error,
    refetch
  } = useQuery<CartType>({
    queryKey: ["/api/cart"],
    queryFn: async ({ queryKey }) => {
      const url = queryKey[0] as string;
      let fullUrl = url;
      
      // For guest users, append sessionId
      if (!isAuthenticated && sessionId) {
        fullUrl = `${url}?sessionId=${sessionId}`;
      }
      
      const res = await fetch(fullUrl, {
        credentials: "include",
      });
      
      if (res.status === 404) {
        // Cart not found is not an error for us
        return { cart: null, items: [] };
      }
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    },
    enabled: isAuthenticated || !!sessionId,
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number, quantity: number }) => {
      await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update cart item. Please try again.",
        variant: "destructive",
      });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemMutation.mutate({ itemId, quantity: newQuantity });
  };

  const removeItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  // Calculate total
  const calculateTotal = () => {
    if (!cartData?.items?.length) return 0;
    
    return cartData.items.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="healside-container py-16">
        <h1 className="text-3xl font-poppins font-bold mb-10 text-center">Your Cart</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-6 py-6 border-b border-border last:border-0">
              <Skeleton className="w-24 h-24 rounded-lg sm:shrink-0" />
              <div className="w-full space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
                <div className="flex justify-between items-center pt-3">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 md:col-start-2">
            <Skeleton className="h-6 w-1/3 mb-6" />
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between py-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between py-2 border-t border-border">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-12 w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="healside-container py-16 text-center">
        <h1 className="text-3xl font-poppins font-bold mb-8">Your Cart</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto">
          <h2 className="text-xl font-poppins font-medium mb-4 text-red-500">Error Loading Cart</h2>
          <p className="mb-6">There was a problem loading your cart. Please try again later.</p>
          <Button onClick={() => refetch()} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !cartData || !cartData.items || cartData.items.length === 0;
  const total = calculateTotal();

  return (
    <>
      <Helmet>
        <title>Your Cart | Healside</title>
        <meta name="description" content="Review your selected wellness products and proceed to checkout." />
      </Helmet>

      <div className="healside-container py-16">
        <motion.h1 
          className="text-3xl font-poppins font-bold mb-10 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Cart
        </motion.h1>

        {isEmpty ? (
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <i className="ri-shopping-cart-line text-5xl text-foreground/30 mb-4"></i>
            <h2 className="text-xl font-poppins font-medium mb-4">Your cart is empty</h2>
            <p className="mb-6 text-foreground/70">
              Looks like you haven't added any wellness products to your cart yet.
            </p>
            <Link href="/products">
              <Button className="btn-primary">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Cart Items */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {cartData.items.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row gap-6 py-6 border-b border-border last:border-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                >
                  <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden shrink-0 mx-auto sm:mx-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-poppins font-medium">{item.product.name}</h3>
                        <p className="text-foreground/60 text-sm">${item.product.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/40 hover:text-accent transition-colors"
                      >
                        <i className="ri-close-line text-xl"></i>
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-sm border-r border-border hover:bg-secondary transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-sm border-l border-border hover:bg-secondary transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-poppins font-medium">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Cart Summary */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-start-2">
                <motion.div 
                  className="bg-white rounded-xl shadow-sm p-6 md:p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h2 className="text-xl font-poppins font-medium mb-6">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-foreground/70">Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-foreground/70">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-border">
                      <span className="font-poppins font-medium">Total</span>
                      <span className="font-poppins font-medium">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/checkout">
                      <Button className="w-full btn-primary">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/products" className="text-accent hover:text-accent/80 transition-colors">
                      <i className="ri-arrow-left-line mr-1"></i> Continue Shopping
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
