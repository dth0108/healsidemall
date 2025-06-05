import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { AuthContext } from "@/App";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  onLoginClick: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="healside-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center font-poppins font-bold text-2xl text-foreground">
            <img 
              src="./images/healside-logo.png" 
              alt="Healside Logo" 
              className="h-12 mr-1" 
            />
            Healside
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-poppins text-sm font-medium transition-all ${isActive("/") ? "text-accent" : "hover:text-accent"}`}>
              Home
            </Link>
            <Link href="/products" className={`font-poppins text-sm font-medium transition-all ${isActive("/products") ? "text-accent" : "hover:text-accent"}`}>
              Products
            </Link>
            <Link href="/blog" className={`font-poppins text-sm font-medium transition-all ${isActive("/blog") ? "text-accent" : "hover:text-accent"}`}>
              Blog
            </Link>
            <Link href="/cart" className={`font-poppins text-sm font-medium transition-all ${isActive("/cart") ? "text-accent" : "hover:text-accent"}`}>
              Cart
            </Link>
            {isAuthenticated ? (
              <div className="relative group">
                <button className="font-poppins text-sm font-medium hover:text-accent transition-all">
                  {user?.name || user?.username}
                </button>
                <div className="absolute right-0 w-48 bg-white shadow-lg rounded-lg py-2 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <Link href="/account" className="block px-4 py-2 text-sm hover:bg-primary/20">My Account</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-primary/20">My Orders</Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="font-poppins text-sm font-medium hover:text-accent transition-all"
              >
                Login
              </button>
            )}
            <button className="text-lg hover:text-accent transition-all">
              <i className="ri-search-line"></i>
            </button>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <button 
            className="md:hidden text-2xl" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          onLoginClick={onLoginClick}
        />
      </div>
    </header>
  );
};

export default Header;
