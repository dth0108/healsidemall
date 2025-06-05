import { Helmet } from "react-helmet";

const Returns = () => {
  return (
    <>
      <Helmet>
        <title>Returns & Exchanges | Healside</title>
        <meta name="description" content="Learn about Healside's return and exchange policies for our wellness products." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Returns & Exchanges</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">Last Updated: May 19, 2025</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Return Policy</h2>
            <p>
              At Healside, we stand behind the quality of our products. We want you to be completely satisfied with your purchase. If for any reason you're not happy with your order, we're here to help.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Return Eligibility</h2>
            <div className="bg-secondary/30 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-2">30-Day Return Window</h3>
              <p>
                We accept returns within 30 days of delivery for most products. To be eligible for a return, your item must be:
              </p>
              <ul className="list-disc pl-6 mb-0">
                <li>Unused and in the same condition that you received it</li>
                <li>In the original packaging</li>
                <li>Accompanied by the original receipt or proof of purchase</li>
              </ul>
            </div>
            
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2">Non-Returnable Items</h3>
              <p className="mb-2">
                Due to health and safety regulations, the following items cannot be returned unless they are defective:
              </p>
              <ul className="list-disc pl-6 mb-0">
                <li>Wellness consumables (oils, teas, supplements) that have been opened</li>
                <li>Personal care items that have been opened or had seals broken</li>
                <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                <li>Gift cards</li>
              </ul>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">How to Initiate a Return</h2>
            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-3">
                <strong>Contact Our Customer Service:</strong> Email <a href="mailto:support@healside.net" className="text-accent">support@healside.net</a> with your order number and details about the item(s) you wish to return.
              </li>
              <li className="mb-3">
                <strong>Receive Return Authorization:</strong> Our team will review your request and send you a Return Merchandise Authorization (RMA) number and return instructions.
              </li>
              <li className="mb-3">
                <strong>Package Your Return:</strong> Securely package the item(s) in their original packaging if possible. Include your RMA number and order information.
              </li>
              <li className="mb-3">
                <strong>Ship Your Return:</strong> Send your package to the address provided in the return instructions. We recommend using a tracked shipping method.
              </li>
              <li>
                <strong>Refund Processing:</strong> Once we receive and inspect your return, we'll process your refund to your original payment method.
              </li>
            </ol>
            
            <div className="bg-accent/10 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2">Return Shipping Costs</h3>
              <p className="mb-0">
                Return shipping costs are the responsibility of the customer, except in cases of defective items or our error (wrong item shipped). For defective items or our errors, we'll provide a prepaid return shipping label.
              </p>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
            <p>
              Once we receive your returned item, we'll inspect it and notify you of the status of your refund.
            </p>
            <p>
              If your return is approved, we'll initiate a refund to your original payment method. Depending on your payment provider, refunds may take 5-10 business days to appear in your account after processing.
            </p>
            <p>
              You'll receive an email notification when your refund has been processed.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
            <p>
              We offer exchanges for items within 30 days of delivery. To request an exchange:
            </p>
            <ol className="list-decimal pl-6">
              <li className="mb-2">Contact our customer service team at <a href="mailto:support@healside.net" className="text-accent">support@healside.net</a></li>
              <li className="mb-2">Specify the item you wish to return and the item you'd like to exchange it for</li>
              <li>Follow the return instructions provided by our team</li>
            </ol>
            <p>
              If the exchange item has a different price than the original purchase:
            </p>
            <ul className="list-disc pl-6">
              <li>If the new item costs more, we'll send you a payment link for the difference</li>
              <li>If the new item costs less, we'll refund the difference to your original payment method</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Damaged or Defective Items</h2>
            <p>
              If you receive an item that is damaged or defective, please contact us within 48 hours of delivery at <a href="mailto:support@healside.net" className="text-accent">support@healside.net</a>. Include your order number and photos of the damaged or defective item.
            </p>
            <p>
              We'll provide you with a prepaid return shipping label and process a replacement or refund as quickly as possible.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">International Returns</h2>
            <p>
              International customers are eligible for our return policy, but please note:
            </p>
            <ul className="list-disc pl-6">
              <li>Return shipping costs are the responsibility of the customer</li>
              <li>Import duties, taxes, and customs fees are non-refundable</li>
              <li>International return shipping can take 2-4 weeks</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Questions About Returns?</h2>
            <p>
              If you have any questions about our return policy or need assistance with a return, please contact our customer service team:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> <a href="mailto:support@healside.net" className="text-accent">support@healside.net</a><br />
              <strong>Phone:</strong> 1-800-HEALSIDE (1-800-432-5743)<br />
              <strong>Hours:</strong> Monday to Friday, 9am-5pm EST
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Returns;