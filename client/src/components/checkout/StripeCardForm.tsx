import React, { useState, useEffect } from 'react';
import { 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface StripeCardFormProps {
  onPaymentSuccess?: (paymentIntent: any) => void;
}

export const StripeCardForm: React.FC<StripeCardFormProps> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  // Clear error message when Stripe or Elements object changes
  useEffect(() => {
    if (stripe && elements) {
      setErrorMessage(undefined);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Show error to your customer
        setErrorMessage(error.message);
        toast({
          title: 'Payment Error',
          description: error.message,
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        toast({
          title: 'Payment Complete',
          description: 'Your payment has been successfully processed.',
        });
        
        // Call the success callback
        if (onPaymentSuccess) {
          onPaymentSuccess(paymentIntent);
        }
      }
    } catch (err: any) {
      console.error('Payment processing error:', err);
      setErrorMessage(err.message || 'An error occurred while processing your payment');
      toast({
        title: 'Payment Error',
        description: err.message || 'An error occurred while processing your payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">
          {errorMessage}
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? 'Processing...' : 'Pay with Card'}
      </Button>
    </form>
  );
};

export default StripeCardForm;