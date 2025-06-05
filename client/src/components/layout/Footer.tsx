import { Link } from "wouter";
import { FaInstagram, FaFacebookF, FaTiktok, FaLinkedinIn, FaPinterestP, FaYoutube, FaCcStripe, FaCcAmex } from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="healside-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="font-poppins font-bold text-xl mb-4">Healside</h3>
            <p className="text-white/70 mb-6">Curated wellness products from global traditions, delivered to your door.</p>
            <div className="flex flex-wrap gap-3">
              <a href="#" aria-label="Instagram" className="text-white hover:text-accent transition-all bg-white/10 rounded-full p-2 hover:bg-white/20">
                <FaInstagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="text-white hover:text-accent transition-all bg-white/10 rounded-full p-2 hover:bg-white/20">
                <FaFacebookF size={18} />
              </a>
              <a href="#" aria-label="Pinterest" className="text-white hover:text-accent transition-all bg-white/10 rounded-full p-2 hover:bg-white/20">
                <FaPinterestP size={18} />
              </a>
              <a href="#" aria-label="TikTok" className="text-white hover:text-accent transition-all bg-white/10 rounded-full p-2 hover:bg-white/20">
                <FaTiktok size={18} />
              </a>
              <a href="#" aria-label="Threads" className="text-white hover:text-accent transition-all bg-white/10 rounded-full p-2 hover:bg-white/20">
                <SiThreads size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="font-poppins font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/70 hover:text-accent transition-all">Home</Link></li>
              <li><Link href="/products" className="text-white/70 hover:text-accent transition-all">Products</Link></li>
              <li><Link href="/blog" className="text-white/70 hover:text-accent transition-all">Blog</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-accent transition-all">About Us</Link></li>
              <li><Link href="/faq" className="text-white/70 hover:text-accent transition-all">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Customer Care */}
          <div className="md:col-span-1">
            <h4 className="font-poppins font-medium text-lg mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-white/70 hover:text-accent transition-all">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-white/70 hover:text-accent transition-all">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-white/70 hover:text-accent transition-all">Returns & Exchanges</Link></li>
              <li><Link href="/privacy" className="text-white/70 hover:text-accent transition-all">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white/70 hover:text-accent transition-all">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="font-poppins font-medium text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="ri-mail-line mr-3 mt-1"></i>
                <span className="text-white/70">support@healside.net</span>
              </li>
              <li className="flex items-start">
                <i className="ri-customer-service-2-line mr-3 mt-1"></i>
                <span className="text-white/70">Mon-Fri: 9am-5pm EST</span>
              </li>
              <li className="flex items-start">
                <i className="ri-global-line mr-3 mt-1"></i>
                <span className="text-white/70">We ship worldwide</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Payment Methods and Copyright */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Healside. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white/50 text-sm">Payment Methods:</span>
            <div className="flex items-center justify-center bg-white/10 rounded-md px-3 py-1.5">
              <i className="ri-visa-line text-xl text-white/80"></i>
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded-md px-3 py-1.5">
              <i className="ri-mastercard-line text-xl text-white/80"></i>
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded-md px-3 py-1.5">
              <i className="ri-paypal-line text-xl text-white/80"></i>
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded-md px-3 py-1.5">
              <FaCcAmex size={24} className="text-white/80" />
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded-md px-3 py-1.5">
              <FaCcStripe size={24} className="text-white/80" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
