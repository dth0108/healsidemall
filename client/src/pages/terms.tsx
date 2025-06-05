import { Helmet } from "react-helmet";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Healside</title>
        <meta name="description" content="Read the terms and conditions for using Healside's website and purchasing our wellness products." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">Last Updated: May 19, 2025</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Healside ("we," "our," or "us"). These Terms and Conditions govern your access to and use of our website, including any content, functionality, and services offered on or through our website.
            </p>
            <p>
              By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms and Conditions, you must not access or use our website.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p>
              When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account or password.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">3. Products and Services</h2>
            <p>
              All products and services displayed on our website are subject to availability. We reserve the right to discontinue any product or service at any time.
            </p>
            <p>
              Prices for our products are subject to change without notice. We reserve the right to modify or discontinue any product or service without notice at any time.
            </p>
            <p>
              We shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of any product or service.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">4. Orders and Payments</h2>
            <p>
              By placing an order through our website, you warrant that you are legally capable of entering into binding contracts and that the information you provide is accurate and complete.
            </p>
            <p>
              All payments are processed securely through our payment processors (PayPal, Stripe, etc.). We do not store your payment information on our servers.
            </p>
            <p>
              We reserve the right to refuse any order you place with us. We may, at our sole discretion, limit or cancel quantities purchased per person, per household, or per order.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
            <p>
              We ship our products globally. Shipping times may vary depending on your location. We are not responsible for delays due to customs, natural disasters, or other events beyond our control.
            </p>
            <p>
              You will receive a shipping confirmation email with tracking information when your order has been shipped. It is your responsibility to ensure that the shipping address you provide is accurate.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
            <p>
              We offer a 30-day return policy for most products. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
            </p>
            <p>
              Due to the nature of some products, we cannot accept returns for certain items (e.g., opened wellness consumables) unless they are defective.
            </p>
            <p>
              To initiate a return, please contact us at support@healside.net with your order number and details about the item you wish to return.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>
              The content on our website, including text, graphics, logos, images, and software, is the property of Healside or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of our website without our express written permission.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p>
              Our website and the products offered on it are provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of our website or the information, content, materials, or products included on it.
            </p>
            <p>
              To the full extent permissible by applicable law, we disclaim all warranties, express or implied, including but not limited to, implied warranties of merchantability and fitness for a particular purpose.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p>
              We will not be liable for any damages of any kind arising from the use of our website, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. We will notify you of any changes by posting the new Terms and Conditions on this page and updating the "Last Updated" date at the top.
            </p>
            <p>
              Your continued use of our website after any such changes constitutes your acceptance of the new Terms and Conditions.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@healside.net<br />
              <strong>Address:</strong> Healside Global Wellness, Inc.<br />
              123 Wellness Way, Suite 500<br />
              New York, NY 10001<br />
              United States
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Terms;