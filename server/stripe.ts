import Stripe from 'stripe';
import { Request, Response } from 'express';

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Payment Intent
 */
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be a positive number.',
      });
    }

    // Stripe processes amounts in cents, so we need to convert
    const amountInCents = Math.round(parseFloat(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe payment intent creation error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred creating the payment intent',
    });
  }
};

/**
 * Check Payment Status
 */
export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Payment intent ID is required',
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from cents to dollars
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
  } catch (error: any) {
    console.error('Stripe payment status check error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred checking payment status',
    });
  }
};

/**
 * Handle Webhook (Process Payment Events)
 */
export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'];

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  try {
    // Verify event
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Process based on event type
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount / 100} was successful!`);
        // Process successful payment (e.g., update order status)
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${failedPayment.last_payment_error?.message}`);
        // Process failed payment
        break;
      default:
        // Process other events
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
};