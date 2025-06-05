import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

const faqCategories = [
  {
    name: "Orders & Shipping",
    items: [
      {
        question: "How do you ship your products?",
        answer: "We use a global dropshipping network to send products directly from producers to your door. This ensures freshness and reduces our carbon footprint. All orders include tracking information so you can monitor your package's journey."
      },
      {
        question: "Why are shipping times longer than usual?",
        answer: "As a global wellness select shop, our products are shipped directly from artisans and producers worldwide. This direct-to-consumer model ensures authenticity and quality, but it means shipping can take 5-14 days depending on your location. We believe the quality and authenticity are worth the wait."
      },
      {
        question: "Can I track my order?",
        answer: "Yes, you'll receive a shipping confirmation email with tracking information once your order ships. You can also view tracking details in your account dashboard under 'Order History'."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes! We ship to over 150 countries worldwide. Shipping times and costs vary by location. You can see estimated delivery times for your country in the shipping banner on our homepage."
      },
      {
        question: "What if my order arrives damaged?",
        answer: "We carefully vet our suppliers for quality packaging, but if your product arrives damaged, please email support@healside.net within 48 hours with photos of the damage. We'll arrange a replacement or refund."
      }
    ]
  },
  {
    name: "Products & Quality",
    items: [
      {
        question: "How do you ensure product quality?",
        answer: "We personally vet all suppliers and test products before adding them to our collection. We maintain direct relationships with artisans and producers to ensure consistent quality. All products meet our strict standards for authenticity, effectiveness, and ethical production."
      },
      {
        question: "Are your products organic/natural?",
        answer: "Whenever possible, we prioritize organic and natural products. Each product listing specifies whether it's certified organic. Even our non-certified products are selected for their minimal processing and clean ingredient lists."
      },
      {
        question: "Do you test on animals?",
        answer: "Never. We're firmly committed to cruelty-free practices and only partner with suppliers who share this value. All our beauty and skincare products are certified cruelty-free."
      },
      {
        question: "Where do your products come from?",
        answer: "Our products come from over 25 countries around the world. We source directly from traditional artisans, small-scale producers, and wellness experts who specialize in their region's healing traditions. Each product page indicates the country of origin."
      }
    ]
  },
  {
    name: "Returns & Refunds",
    items: [
      {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of delivery for unused items in original packaging. Due to the nature of our products, we cannot accept returns on opened wellness consumables (oils, teas, etc.) unless they're defective. Please email support@healside.net to initiate a return."
      },
      {
        question: "How long do refunds take to process?",
        answer: "Once we receive your returned item, refunds are processed within 3-5 business days. The funds may take an additional 5-10 business days to appear in your account, depending on your payment provider."
      },
      {
        question: "What if my order never arrives?",
        answer: "In the rare event that a package is lost, please contact us after the maximum estimated delivery time has passed. We'll work with the supplier and shipping partner to locate your package or issue a replacement/refund."
      }
    ]
  },
  {
    name: "Business Model",
    items: [
      {
        question: "What is dropshipping and how does it benefit me?",
        answer: "Dropshipping allows us to connect you directly with specialized producers worldwide without warehousing inventory. Benefits include: access to authentic products from their original sources, fresher products that haven't sat in warehouses, and supporting small producers directly. While shipping may take slightly longer, the quality and authenticity of direct-sourced products make it worthwhile."
      },
      {
        question: "How do you select your suppliers?",
        answer: "We have a rigorous vetting process that evaluates production methods, ingredient quality, cultural authenticity, ethical practices, and consistency. We build personal relationships with each supplier and regularly review product quality. Only about 20% of the suppliers we evaluate meet our standards."
      },
      {
        question: "Do you support fair trade practices?",
        answer: "Absolutely. We prioritize suppliers who compensate workers fairly and maintain ethical working conditions. Many of our products are certified Fair Trade, and we're working toward having our entire collection meet fair trade standards."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>FAQ | Healside</title>
        <meta name="description" content="Find answers to frequently asked questions about Healside's global wellness products, shipping, returns, and our dropshipping business model." />
      </Helmet>

      <section className="bg-primary py-12 md:py-20">
        <div className="healside-container">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-poppins font-bold text-3xl md:text-5xl mb-6">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl text-foreground/80">
              Find answers to common questions about our products, shipping, and business model
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="healside-container max-w-4xl">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div 
                key={category.name}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/20 px-6 py-4">
                  <h2 className="font-poppins font-bold text-xl">{category.name}</h2>
                </div>
                <div className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left font-poppins font-medium">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground/80">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-12 bg-primary/10 rounded-xl p-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-semibold text-xl mb-4">Still have questions?</h2>
            <p className="mb-6 text-foreground/80">
              Can't find the answer you're looking for? Please reach out to our customer support team.
            </p>
            <a 
              href="mailto:support@healside.net" 
              className="inline-flex items-center bg-accent hover:bg-accent/90 text-white font-poppins font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <i className="ri-mail-line mr-2"></i>
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
