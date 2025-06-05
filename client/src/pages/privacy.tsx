import { Helmet } from "react-helmet";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Healside</title>
        <meta name="description" content="Learn about how Healside collects, uses, and protects your personal information." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">Last Updated: May 19, 2025</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Healside ("we," "our," or "us"). We are committed to protecting your privacy and maintaining the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make purchases from us.
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account</li>
              <li>Place an order</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact our customer service</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p>
              This information may include your name, email address, shipping address, billing address, phone number, and payment information.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages you view</li>
              <li>Time spent on pages</li>
              <li>Links you click</li>
              <li>Search terms you enter</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>
              We use the information we collect for various business purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Processing and fulfilling your orders</li>
              <li>Managing your account</li>
              <li>Sending you order confirmations and updates</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Sending marketing communications (with your consent)</li>
              <li>Improving our website, products, and services</li>
              <li>Conducting analytics and research</li>
              <li>Detecting and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">4. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small files placed on your device that enable us to: remember your preferences, understand how you use our website, and customize your experience.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">5. Sharing Your Information</h2>
            <p>
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as payment processing, order fulfillment, data analysis, email delivery, and customer service.</li>
              <li><strong>Business Partners:</strong> With your consent, we may share your information with business partners who offer products or services that may interest you.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing of your personal information</li>
              <li>Data portability</li>
              <li>Objection to processing of your personal information</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@healside.net.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@healside.net<br />
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

export default Privacy;