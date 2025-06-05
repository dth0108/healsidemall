import { Helmet } from "react-helmet";

const Shipping = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Policy | Healside</title>
        <meta name="description" content="Learn about Healside's shipping policies, delivery times, and international shipping options for our wellness products." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Shipping Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">Last Updated: May 19, 2025</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
            <p>
              At Healside, we're committed to delivering your wellness products safely and promptly. We ship to customers worldwide and offer various shipping options to meet your needs.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Domestic Shipping (United States)</h2>
            <div className="bg-secondary/30 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-2">Free Standard Shipping</h3>
              <p className="mb-0">
                <strong>Eligible Orders:</strong> All orders over $50<br />
                <strong>Delivery Time:</strong> 3-5 business days<br />
                <strong>Carrier:</strong> USPS or UPS
              </p>
            </div>
            
            <div className="bg-secondary/30 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-2">Standard Shipping</h3>
              <p className="mb-0">
                <strong>Cost:</strong> $5.95<br />
                <strong>Eligible Orders:</strong> Orders under $50<br />
                <strong>Delivery Time:</strong> 3-5 business days<br />
                <strong>Carrier:</strong> USPS or UPS
              </p>
            </div>
            
            <div className="bg-secondary/30 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2">Express Shipping</h3>
              <p className="mb-0">
                <strong>Cost:</strong> $12.95<br />
                <strong>Delivery Time:</strong> 1-2 business days<br />
                <strong>Carrier:</strong> UPS or FedEx
              </p>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
            <p>
              We're proud to ship our wellness products to customers worldwide. International shipping rates and delivery times vary based on destination.
            </p>
            
            <div className="bg-secondary/30 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-2">International Standard</h3>
              <p className="mb-0">
                <strong>Cost:</strong> Starting at $15.95 (calculated at checkout)<br />
                <strong>Delivery Time:</strong> 7-21 business days<br />
                <strong>Carrier:</strong> DHL, UPS, or local carrier
              </p>
            </div>
            
            <div className="bg-secondary/30 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2">International Express</h3>
              <p className="mb-0">
                <strong>Cost:</strong> Starting at $29.95 (calculated at checkout)<br />
                <strong>Delivery Time:</strong> 3-7 business days<br />
                <strong>Carrier:</strong> DHL Express or FedEx
              </p>
            </div>
            
            <div className="mt-6">
              <p>
                <strong>Please Note:</strong> International customers may be subject to customs fees, import duties, and taxes, which are not included in the shipping cost. These charges are the responsibility of the recipient.
              </p>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
            <p>
              Orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.
            </p>
            <p>
              You will receive a shipping confirmation email with tracking information once your order has been shipped.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Shipping Restrictions</h2>
            <p>
              Due to international regulations, some wellness products may not be eligible for shipping to certain countries. We will notify you if your order contains items that cannot be shipped to your location.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
            <p>
              Once your order ships, you'll receive a tracking number via email. You can also view your order status and tracking information in your account dashboard.
            </p>
            <p>
              If you don't receive tracking information within 3 business days after your order confirmation, please contact our customer service team at <a href="mailto:support@healside.net" className="text-accent">support@healside.net</a>.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Delivery Issues</h2>
            <p>
              In the rare case that your package is damaged during shipping, please take photos of the damaged package and contact us within 48 hours of delivery at <a href="mailto:support@healside.net" className="text-accent">support@healside.net</a>.
            </p>
            <p>
              If your package shows as delivered but you haven't received it, please check with neighbors and your local post office. If you still can't locate your package, contact us within 7 days of the delivery date.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Contact Our Shipping Department</h2>
            <p>
              If you have any questions about our shipping policies or need assistance with a specific order, please contact our shipping department:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> <a href="mailto:shipping@healside.net" className="text-accent">shipping@healside.net</a><br />
              <strong>Phone:</strong> 1-800-HEALSIDE (1-800-432-5743)<br />
              <strong>Hours:</strong> Monday to Friday, 9am-5pm EST
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Shipping;