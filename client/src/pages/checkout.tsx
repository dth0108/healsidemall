import { useState, useEffect, useContext } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayPalButton from "@/components/checkout/PayPalButton";
import StripePayment from "@/components/checkout/StripePayment";
import { AuthContext } from "@/App";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SiStripe, SiPaypal } from "react-icons/si";

interface CartSummary {
  items: any[];
  subtotal: number;
  total: number;
}

const Checkout = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    items: [],
    subtotal: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Function to handle successful payment
  const handlePaymentSuccess = (paymentIntent: any) => {
    // In a real implementation, we would call API to save order details
    toast({
      title: "Payment Complete",
      description: "Your order has been successfully processed.",
    });
    
    // For guest users, remove cart session
    if (!isAuthenticated) {
      localStorage.removeItem("cartSessionId");
    }
    
    // Redirect to order confirmation page
    setTimeout(() => {
      navigate("/order-confirmation?orderId=123456");
    }, 1500);
  };
  
  // Fetch cart data to calculate total
  const { data: cartData, isLoading: isCartLoading, error: cartError } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: async ({ queryKey }) => {
      const url = queryKey[0] as string;
      let fullUrl = url;
      
      // For guest users, append sessionId
      if (!isAuthenticated) {
        const sessionId = localStorage.getItem("cartSessionId");
        if (sessionId) {
          fullUrl = `${url}?sessionId=${sessionId}`;
        }
      }
      
      const res = await fetch(fullUrl, {
        credentials: "include",
      });
      
      if (res.status === 404) {
        // Cart not found, redirect to cart page
        navigate("/cart");
        return null;
      }
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    },
  });

  useEffect(() => {
    // Redirect if not authenticated (for registered checkout)
    if (!isAuthenticated && !localStorage.getItem("cartSessionId")) {
      navigate("/cart");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cartData && cartData.items && cartData.items.length > 0) {
      // Calculate cart totals
      const subtotal = cartData.items.reduce(
        (sum: number, item: any) => sum + (Number(item.product.price) * item.quantity),
        0
      );
      
      // For simplicity, we're not adding tax or shipping here
      const total = subtotal;
      
      setCartSummary({
        items: cartData.items,
        subtotal,
        total
      });
      
      setLoading(false);
    } else if (!isCartLoading && (!cartData || !cartData.items || cartData.items.length === 0)) {
      // No items in cart, redirect to cart page
      navigate("/cart");
    }
  }, [cartData, isCartLoading, navigate]);

  if (loading || isCartLoading) {
    return (
      <div className="healside-container py-16 text-center">
        <h1 className="text-3xl font-poppins font-bold mb-8">Checkout</h1>
        <div className="flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <p className="mt-4">Preparing your checkout...</p>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="healside-container py-16 text-center">
        <h1 className="text-3xl font-poppins font-bold mb-8">Checkout</h1>
        <p className="text-red-500 mb-4">Failed to load your cart information.</p>
        <Button onClick={() => navigate("/cart")} className="btn-primary">
          Return to Cart
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Healside</title>
        <meta name="description" content="Complete your purchase of wellness products securely." />
      </Helmet>

      <div className="healside-container py-16">
        <motion.h1 
          className="text-3xl font-poppins font-bold mb-10 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Checkout
        </motion.h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CheckoutForm cartSummary={cartSummary} />
            </motion.div>
          </div>
          
          <div>
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-6 md:p-8 sticky top-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-xl font-poppins font-medium mb-6">Order Summary</h2>
              
              {cartSummary.items.length > 0 && (
                <div className="mb-6 max-h-80 overflow-y-auto space-y-4">
                  {cartSummary.items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden shrink-0">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-poppins text-sm font-medium">{item.product.name}</h3>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/60">Qty: {item.quantity}</span>
                          <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-foreground/70">Subtotal</span>
                  <span>${cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-foreground/70">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between py-2 border-t border-border">
                  <span className="font-poppins font-medium">Total</span>
                  <span className="font-poppins font-medium">${cartSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

interface CheckoutFormProps {
  cartSummary: CartSummary;
}

const CheckoutForm = ({ cartSummary }: CheckoutFormProps) => {
  const [_, navigate] = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Shipping details form state
  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping details
    const requiredFields = ["name", "email", "address", "city", "state", "country", "zipCode"];
    const missingFields = requiredFields.filter(field => !shippingDetails[field as keyof typeof shippingDetails]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real application, you would create the order in the database here
    // We're simulating this to show how it would work with PayPal
    try {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Error processing form:", error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "An error occurred while processing your information.",
        variant: "destructive",
      });
    }
  };

  // Function to handle successful PayPal payment
  const handlePaymentSuccess = async (orderData: any) => {
    try {
      // In a real application, you would create the order in your database here
      console.log("PayPal payment successful:", orderData);
      
      // Clear cart session for guest users
      if (!isAuthenticated) {
        localStorage.removeItem("cartSessionId");
      }
      
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!",
      });
      
      // Redirect to order confirmation (You'd typically pass the real order ID here)
      // For now, we'll just simulate it
      setTimeout(() => {
        navigate("/order-confirmation?orderId=123456");
      }, 1500);
    } catch (error) {
      console.error("Error processing PayPal payment:", error);
      toast({
        title: "Order Processing Error",
        description: "Your payment was successful, but there was an issue processing your order. Please contact customer support.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        {/* Shipping Information */}
        <div>
          <h2 className="text-xl font-poppins font-medium mb-6">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                name="state"
                value={shippingDetails.state}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="zipCode">Zip/Postal Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={shippingDetails.zipCode}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={shippingDetails.country}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Payment Information */}
        <div>
          <h2 className="text-xl font-poppins font-medium mb-6">Payment Method</h2>
          
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="mb-4 w-full grid grid-cols-2">
              <TabsTrigger value="card" className="flex items-center justify-center gap-2">
                <SiStripe className="w-6 h-6 text-[#6772e5]" />
                <span>Credit Card</span>
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex items-center justify-center gap-2">
                <SiPaypal className="w-5 h-5 text-[#003087]" />
                <span>PayPal</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="mt-0">
              <div className="w-full p-4 border border-border rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <SiStripe className="w-8 h-8 text-[#6772e5]" />
                  <h3 className="text-lg font-poppins font-medium">Credit Card Payment</h3>
                </div>
                <p className="text-sm text-foreground/70 mb-4">
                  Your card information is securely processed and not stored.
                </p>
                <div className="w-full mb-4">
                  <StripePayment 
                    amount={cartSummary.total} 
                    currency="USD"
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>
                <p className="text-xs text-foreground/60 text-center">
                  Secured by <span className="font-medium text-[#6772e5]">Stripe</span> - Your financial information is protected.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="paypal" className="mt-0">
              <div className="w-full p-4 border border-border rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <SiPaypal className="w-7 h-7 text-[#003087]" />
                  <h3 className="text-lg font-poppins font-medium">PayPal Payment</h3>
                </div>
                <p className="text-sm text-foreground/70 mb-4">
                  You'll be redirected to PayPal to complete your payment securely.
                </p>
                <div className="w-full flex justify-center mb-4">
                  <PayPalButton
                    amount={cartSummary.total.toString()}
                    currency="USD"
                    intent="CAPTURE"
                  />
                </div>
                <p className="text-xs text-foreground/60 text-center">
                  Secured by <span className="font-medium text-[#003087]">PayPal</span> - Fast and secure payment option available in Korea and worldwide.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="border-t border-border pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-poppins font-medium">Total</span>
            <span className="font-poppins font-bold text-xl">${cartSummary.total.toFixed(2)}</span>
          </div>
          
          <p className="text-sm text-foreground/60 mt-4 text-center">
            By completing your purchase, you agree to our <a href="#" className="text-accent">Terms of Service</a> and <a href="#" className="text-accent">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </form>
  );
};

export default Checkout;
