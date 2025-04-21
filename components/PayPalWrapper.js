'use client';

import { useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function PayPalWrapper({ children }) {
  const paypalScriptOptions = {
    'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: 'USD',
  };

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      console.error('PayPal client ID is missing. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.');
    } else {
      console.log('PayPal SDK initializing with client ID:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
    }
  }, []);

  return (
    <PayPalScriptProvider
      options={paypalScriptOptions}
      onError={(err) => {
        console.error('PayPal SDK loading error:', err);
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}