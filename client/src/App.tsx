import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Register from "@/pages/register";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Shipping from "@/pages/shipping";
import Returns from "@/pages/returns";
import NotFound from "@/pages/not-found";
import AdminPage from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";

// Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/layout/LoginModal";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/register" component={Register} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/returns" component={Returns} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/:tab" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export type User = {
  id: number;
  username: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
};

export type AuthContextType = {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create auth context to track user login state
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for existing token
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
          try {
            setUser(JSON.parse(userData));
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Failed to parse user data:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
        
        // If no token in localStorage, check if we're authenticated via cookie
        // (this happens after Google OAuth login)
        const response = await fetch('/auth/user', {
          credentials: 'include' // Important for cookies
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Store in localStorage for future sessions
          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const authContextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authContextValue}>
        <TooltipProvider>
          <Helmet 
            titleTemplate="%s | Healside - Global Wellness Select Shop"
            defaultTitle="Healside - Global Wellness Select Shop"
          >
            <meta name="description" content="Discover curated wellness products for relaxation and healing from around the globe" />
          </Helmet>

          <div className="min-h-screen flex flex-col">
            <Header onLoginClick={() => setIsLoginModalOpen(true)} />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>

          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
          />
          <Toaster />
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
