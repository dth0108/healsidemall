import { Variants } from "framer-motion";

// Fade up animation
export const fadeUpAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

// Fade in animation
export const fadeInAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scale animation
export const scaleAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping:
      15
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Card hover animation
export const cardHoverAnimation = {
  rest: { 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeOut"
    }
  },
  hover: { 
    scale: 1.03,
    y: -5,
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
};

// Button tap animation
export const buttonTapAnimation = {
  tap: { scale: 0.97 }
};

// Animation for sections coming into view
export const scrollRevealAnimation: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

// Page transition animation
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

// Cart item animation
export const cartItemAnimation: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.3 } }
};

// Loading spinner animation
export const spinnerAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }
  }
};
