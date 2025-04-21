'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ShoppingBag, Mail, User, Globe, Store } from 'lucide-react';

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shopifyStoreName: '',
    websiteLink: '',
    productCategory: [],
  });
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [formStep, setFormStep] = useState(0);

  const productCategories = ['Clothes', 'Jewelry', 'Sunglasses'];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      console.log('Payment successful, enabling submit');
      setIsPaid(true);
      setError('');
      setFormStep(3);
      setPaymentInitiated(false);
      const savedData = sessionStorage.getItem('waitlistFormData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
      window.history.replaceState({}, document.title, '/waitlist');
    } else if (paymentStatus === 'cancel') {
      console.log('Payment cancelled');
      setError('Payment was cancelled. Please try again.');
      setPaymentInitiated(false);
      setFormStep(3);
      const savedData = sessionStorage.getItem('waitlistFormData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
      window.history.replaceState({}, document.title, '/waitlist');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => {
      const currentCategories = prev.productCategory;
      if (currentCategories.includes(category)) {
        return {
          ...prev,
          productCategory: currentCategories.filter((cat) => cat !== category),
        };
      } else {
        return {
          ...prev,
          productCategory: [...currentCategories, category],
        };
      }
    });
  };

  const handlePayClick = async () => {
    console.log('Pay button clicked');
    if (!formData.name || !formData.email || !formData.shopifyStoreName || !formData.websiteLink) {
      console.log('Validation failed: Missing required fields');
      setError('Please fill out all required fields before payment.');
      return;
    }
    if (formData.productCategory.length === 0) {
      console.log('Validation failed: No product category selected');
      setError('Please select at least one product category.');
      return;
    }

    console.log('Validation passed, saving form data');
    sessionStorage.setItem('waitlistFormData', JSON.stringify(formData));
    setPaymentInitiated(true);
    setError('');

    try {
      console.log('Sending POST to /api/paypal/create-order');
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Received response:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Fetch error:', data.details);
        throw new Error(data.details || 'Failed to create PayPal order');
      }

      if (data.approvalUrl) {
        console.log('Redirecting to PayPal:', data.approvalUrl);
        window.location.href = data.approvalUrl;
      } else {
        console.error('No approval URL in response');
        throw new Error('No approval URL returned from PayPal');
      }
    } catch (error) {
      console.error('Payment initiation error:', error.message);
      setError(`Failed to initiate payment: ${error.message}. Please try again.`);
      setPaymentInitiated(false);
    }
  };

  const handleSubmit = async () => {
    if (!isPaid) {
      console.log('Submit blocked: Payment not completed');
      setError('Please complete the payment first.');
      return;
    }

    console.log('Submitting form data:', formData);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Form submitted successfully');
        alert('Successfully joined the waitlist! Check your email for the welcome message.');
        setFormData({ name: '', email: '', shopifyStoreName: '', websiteLink: '', productCategory: [] });
        setIsPaid(false);
        setPaymentInitiated(false);
        setError('');
        setFormStep(0);
        sessionStorage.removeItem('waitlistFormData');
      } else {
        console.error('Form submission failed:', result.error);
        setError(result.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error.message);
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = () => {
    if (formStep === 0) {
      if (!formData.name || !formData.email) {
        setError('Please fill out your name and email.');
        return false;
      }
      if (!formData.email.includes('@') || !formData.email.includes('.')) {
        setError('Please enter a valid email address.');
        return false;
      }
    } else if (formStep === 1) {
      if (!formData.shopifyStoreName || !formData.websiteLink) {
        setError('Please fill out your store information.');
        return false;
      }
      if (!formData.websiteLink.includes('.')) {
        setError('Please enter a valid website URL.');
        return false;
      }
    } else if (formStep === 2) {
      if (formData.productCategory.length === 0) {
        setError('Please select at least one product category.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-xl" />

        <CardHeader className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Join the Waitlist
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Be among the first to experience our Virtual Try-On platform for your Shopify store.
            </CardDescription>
          </motion.div>

          <div className="flex justify-between mt-6 mb-2">
            {[0, 1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className={`h-1 rounded-full ${
                  step <= formStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'
                }`}
                style={{ width: '23%' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step <= formStep ? 1 : 0 }}
                transition={{ duration: 0.5, delay: step * 0.1 }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className={formStep >= 0 ? 'text-purple-400' : ''}>Personal</span>
            <span className={formStep >= 1 ? 'text-purple-400' : ''}>Store</span>
            <span className={formStep >= 2 ? 'text-purple-400' : ''}>Products</span>
            <span className={formStep >= 3 ? 'text-purple-400' : ''}>Payment</span>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-5">
          <AnimatePresence mode="wait">
            {formStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-100 flex items-center">
                    <User className="w-4 h-4 mr-2 text-purple-400" />
                    Full Name
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      activeField === 'name' ? 'transform scale-[1.02]' : ''
                    }`}
                  >
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setActiveField('name')}
                      onBlur={() => setActiveField(null)}
                      required
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white placeholder:text-gray-500 pl-10"
                      placeholder="Enter your name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-purple-400" />
                    Email Address
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      activeField === 'email' ? 'transform scale-[1.02]' : ''
                    }`}
                  >
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField(null)}
                      required
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white placeholder:text-gray-500 pl-10"
                      placeholder="you@example.com"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {formStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="shopifyStoreName" className="text-gray-300 flex items-center">
                    <Store className="w-4 h-4 mr-2 text-purple-400" />
                    Shopify Store Name
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      activeField === 'shopifyStoreName' ? 'transform scale-[1.02]' : ''
                    }`}
                  >
                    <Input
                      id="shopifyStoreName"
                      name="shopifyStoreName"
                      value={formData.shopifyStoreName}
                      onChange={handleChange}
                      onFocus={() => setActiveField('shopifyStoreName')}
                      onBlur={() => setActiveField(null)}
                      required
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white placeholder:text-gray-500 pl-10"
                      placeholder="Your store name"
                    />
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteLink" className="text-gray-300 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-purple-400" />
                    Website Link
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      activeField === 'websiteLink' ? 'transform scale-[1.02]' : ''
                    }`}
                  >
                    <Input
                      id="websiteLink"
                      name="websiteLink"
                      value={formData.websiteLink}
                      onChange={handleChange}
                      onFocus={() => setActiveField('websiteLink')}
                      onBlur={() => setActiveField(null)}
                      required
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white placeholder:text-gray-500 pl-10"
                      placeholder="https://your-store.myshopify.com"
                    />
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {formStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <Label className="text-gray-300 flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2 text-purple-400" />
                    Product Categories
                  </Label>
                  <p className="text-sm text-gray-400">Select the types of products you sell:</p>
                  <div className="grid grid-cols-1 gap-3">
                    {productCategories.map((category) => (
                      <motion.div
                        key={category}
                        className={`
                          relative flex items-center p-4 rounded-lg border cursor-pointer transition-all
                          ${
                            formData.productCategory.includes(category)
                              ? 'border-purple-500 bg-purple-900/20'
                              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                          }
                        `}
                        onClick={() => handleCategoryChange(category)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          id={category}
                          checked={formData.productCategory.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              formData.productCategory.includes(category) ? 'bg-purple-500' : 'bg-gray-700'
                            }`}
                          >
                            {category === 'Clothes' && (
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                              </svg>
                            )}
                            {category === 'Jewelry' && (
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            )}
                            {category === 'Sunglasses' && (
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M9 12h6m-6 4h6m-6-8h6M9 20h6"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <Label htmlFor={category} className="cursor-pointer text-base font-medium">
                              {category}
                            </Label>
                            <p className="text-xs text-gray-400">
                              {category === 'Clothes' && 'Apparel, footwear, accessories'}
                              {category === 'Jewelry' && 'Rings, necklaces, earrings'}
                              {category === 'Sunglasses' && 'Eyewear and frames'}
                            </p>
                          </div>
                        </div>
                        {formData.productCategory.includes(category) && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {formStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-2">Waitlist Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Store:</span>
                      <span className="text-white font-medium">{formData.shopifyStoreName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Categories:</span>
                      <span className="text-white font-medium">{formData.productCategory.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">Waitlist Fee</h3>
                      <p className="text-sm text-gray-400">One-time payment for early access</p>
                    </div>
                    <div className="text-2xl font-bold text-white">$9</div>
                  </div>

                  {!paymentInitiated && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handlePayClick}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition-all"
                      >
                        Pay to Join Waitlist
                      </Button>
                    </motion.div>
                  )}

                  {paymentInitiated && !isPaid && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                      <span className="ml-2 text-gray-400">Redirecting to PayPal for payment...</span>
                    </div>
                  )}

                  {isPaid && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-900/20 border border-green-800 rounded-lg p-4 flex items-center"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-green-300 font-medium">Payment Successful!</h3>
                        <p className="text-green-400 text-sm">Click submit to complete your registration.</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="flex justify-between mt-6">
            {formStep > 0 ? (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300"
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {formStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Continue
              </Button>
            ) : (
              <motion.div whileHover={{ scale: isPaid ? 1.02 : 1 }} whileTap={{ scale: isPaid ? 0.98 : 1 }}>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isPaid || isSubmitting}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center ${
                    isPaid
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isPaid ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Submit
                        </>
                      ) : (
                        'Submit'
                      )}
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}