import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCardForm from './StripeCardForm';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Stripe 초기화
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripePaymentProps {
  amount: number;
  currency?: string;
  onPaymentSuccess?: (paymentIntent: any) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  currency = 'usd',
  onPaymentSuccess
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the amount is valid
    if (!amount || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Payment amount must be greater than 0.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Create payment intent request
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('POST', '/api/stripe/create-payment-intent', {
          amount: amount.toString(),
          currency,
        });
        
        const data = await response.json();
        
        if (response.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error(data.error || 'An error occurred during payment initialization');
        }
      } catch (error: any) {
        console.error('Payment intent creation error:', error);
        toast({
          title: 'Payment Initialization Error',
          description: error.message || 'There was a problem setting up the payment',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, currency, toast]);

  // Payment success handler
  const handlePaymentSuccess = (paymentIntent: any) => {
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentIntent);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-4 text-red-500">
        There was a problem setting up the payment. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#6366f1',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#ef4444',
              fontFamily: 'Inter, system-ui, sans-serif',
              borderRadius: '8px',
            },
          },
        }}
      >
        <StripeCardForm onPaymentSuccess={handlePaymentSuccess} />
      </Elements>
    </div>
  );
};

export default StripePayment;