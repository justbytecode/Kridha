const { PayPalScriptProvider } = require('@paypal/react-paypal-js');

const paypalScriptOptions = {
  'client-id': process.env.PAYPAL_CLIENT_ID,
  currency: 'USD',
};

module.exports = { paypalScriptOptions, PayPalProvider: PayPalScriptProvider };