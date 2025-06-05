import React, { useEffect, useRef } from 'react';
import { 
  TruckIcon, 
  GlobeIcon, 
  ShieldIcon, 
  LeafIcon, 
  MoonIcon, 
  CreditCardIcon 
} from '@/components/ui/BenefitIcons';

type BenefitItem = {
  icon: React.ReactNode;
  text: string;
  subText?: string;
};

const benefits: BenefitItem[] = [
  {
    icon: <TruckIcon />,
    text: 'Free International Shipping',
    subText: 'On orders over $50',
  },
  {
    icon: <CreditCardIcon />,
    text: 'Flexible Payment Options',
    subText: 'Buy now, pay later',
  },
  {
    icon: <GlobeIcon />,
    text: 'Globally Sourced Ingredients',
    subText: 'From trusted suppliers',
  },
  {
    icon: <ShieldIcon />,
    text: '30-Day Satisfaction Guarantee',
    subText: 'Risk-free trial',
  },
  {
    icon: <LeafIcon />,
    text: 'Eco-Friendly Packaging',
    subText: 'Sustainable choices',
  },
  {
    icon: <MoonIcon />,
    text: 'Holistic Approach to Wellness',
    subText: 'Mind, body & spirit',
  },
];

const BenefitsBanner: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scrollAnimation = () => {
      if (scrollRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const containerWidth = scrollRef.current.offsetWidth;
        
        if (scrollWidth > containerWidth) {
          let scrollAmount = 0;
          const speed = 0.3; // Slower speed for a more elegant scroll
          
          const scroll = () => {
            if (scrollRef.current) {
              scrollAmount += speed;
              
              // Reset when reaching the end
              if (scrollAmount >= scrollWidth / 2) {
                scrollAmount = 0;
              }
              
              scrollRef.current.scrollLeft = scrollAmount;
              requestAnimationFrame(scroll);
            }
          };
          
          const animationFrame = requestAnimationFrame(scroll);
          return () => cancelAnimationFrame(animationFrame);
        }
      }
    };
    
    const animationTimeout = setTimeout(scrollAnimation, 1500);
    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <div className="bg-blue-50 border-y border-blue-100 py-5 overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex items-center space-x-12 md:space-x-20 whitespace-nowrap overflow-x-hidden"
      >
        {/* Duplicate the items to create an infinite scroll effect */}
        {[...benefits, ...benefits].map((benefit, index) => (
          <div 
            key={index} 
            className="inline-flex items-center px-3 py-1 text-primary-800 group"
          >
            <div className="flex items-center justify-center mr-3 text-primary-600 w-10 h-10 transition-all duration-300 group-hover:text-primary-800">
              {benefit.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm md:text-base">{benefit.text}</span>
              {benefit.subText && (
                <span className="text-xs text-gray-500">{benefit.subText}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsBanner;