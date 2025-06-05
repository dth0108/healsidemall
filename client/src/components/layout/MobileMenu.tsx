import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "@/App";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const MobileMenu = ({ isOpen, onClose, onLoginClick }: MobileMenuProps) => {
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLinkClick = () => {
    onClose();
  };

  const handleLoginClick = () => {
    onLoginClick();
    onClose();
  };

  const handleLogoutClick = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="md:hidden py-4 space-y-4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            href="/" 
            className={`block font-poppins text-sm font-medium transition-all py-2 ${isActive("/") ? "text-accent" : "hover:text-accent"}`}
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className={`block font-poppins text-sm font-medium transition-all py-2 ${isActive("/products") ? "text-accent" : "hover:text-accent"}`}
            onClick={handleLinkClick}
          >
            Products
          </Link>
          <Link 
            href="/blog" 
            className={`block font-poppins text-sm font-medium transition-all py-2 ${isActive("/blog") ? "text-accent" : "hover:text-accent"}`}
            onClick={handleLinkClick}
          >
            Blog
          </Link>
          <Link 
            href="/cart" 
            className={`block font-poppins text-sm font-medium transition-all py-2 ${isActive("/cart") ? "text-accent" : "hover:text-accent"}`}
            onClick={handleLinkClick}
          >
            Cart
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                href="/account" 
                className="block font-poppins text-sm font-medium transition-all py-2 hover:text-accent"
                onClick={handleLinkClick}
              >
                My Account
              </Link>
              <Link 
                href="/orders" 
                className="block font-poppins text-sm font-medium transition-all py-2 hover:text-accent"
                onClick={handleLinkClick}
              >
                My Orders
              </Link>
              <button
                className="block font-poppins text-sm font-medium transition-all py-2 hover:text-accent w-full text-left"
                onClick={handleLogoutClick}
              >
                Logout ({user?.username})
              </button>
            </>
          ) : (
            <button
              className="block font-poppins text-sm font-medium transition-all py-2 hover:text-accent w-full text-left"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
          
          <div className="relative mt-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-secondary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="absolute right-3 top-2 text-lg text-foreground">
              <i className="ri-search-line"></i>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
