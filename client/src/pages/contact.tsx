import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log(data);
    // Here you would typically send the form data to your backend
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you shortly.",
    });
    form.reset();
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Healside</title>
        <meta name="description" content="Get in touch with our customer support team for any questions or concerns about our wellness products." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
            <p className="text-foreground/80 mb-6">
              We're here to help with any questions about our products, orders, or wellness advice. Reach out to us using the contact form or through the following channels:
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Support</h3>
                <div className="flex items-center space-x-3">
                  <i className="ri-mail-line text-accent"></i>
                  <a href="mailto:support@healside.net" className="text-accent hover:underline">support@healside.net</a>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <i className="ri-customer-service-2-line text-accent"></i>
                  <span>Mon-Fri: 9am-5pm EST</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Business Inquiries</h3>
                <div className="flex items-center space-x-3">
                  <i className="ri-mail-line text-accent"></i>
                  <a href="mailto:business@healside.net" className="text-accent hover:underline">business@healside.net</a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Headquarters</h3>
                <address className="not-italic leading-relaxed">
                  Healside Global Wellness, Inc.<br />
                  123 Wellness Way, Suite 500<br />
                  New York, NY 10001<br />
                  United States
                </address>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Connect With Us</h3>
                <div className="flex space-x-4 mt-2">
                  <a href="https://instagram.com/healside" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors">
                    <i className="ri-instagram-line text-xl"></i>
                  </a>
                  <a href="https://facebook.com/healside" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors">
                    <i className="ri-facebook-circle-line text-xl"></i>
                  </a>
                  <a href="https://pinterest.com/healside" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors">
                    <i className="ri-pinterest-line text-xl"></i>
                  </a>
                  <a href="https://tiktok.com/@healside" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors">
                    <i className="ri-tiktok-line text-xl"></i>
                  </a>
                  <a href="https://threads.net/@healside" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors">
                    <i className="ri-chat-3-line text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What's this about?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us what you need help with..." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Send Message</Button>
                
                <p className="text-xs text-foreground/60 mt-4">
                  By submitting this form, you agree to our <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;