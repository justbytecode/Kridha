"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from 'lucide-react'
import AnimatedButton from "./animated-button"
import Link from "next/link"

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: "Basic",
      description: "Try our platform free for one day",
      monthlyPrice: 0,
      annualPrice: 0,
      trial: "1-Day Free Trial",
      features: [
        "Virtual try-on for up to 5 products",
        "Basic analytics dashboard",
        "Email support",
        "Shopify app integration",
        "Mobile optimization",
      ],
      color: "from-gray-600 to-gray-500",
      popular: false,
      buttonText: "Start Free Trial",
    },
    {
      name: "Starter",
      description: "Perfect for small Shopify stores just getting started",
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        "Virtual try-on for up to 50 products",
        "Standard analytics dashboard",
        "Email support",
        "Shopify app integration",
        "Mobile optimization",
        "Basic customer insights",
      ],
      color: "from-purple-600 to-indigo-600",
      popular: false,
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses with expanding product lines",
      monthlyPrice: 25,
      annualPrice: 199 / 12, // Approximately 16.58
      yearlyDisplay: 199,
      features: [
        "Advanced virtual try-on for up to 200 products",
        "Detailed analytics and reporting",
        "Priority email & chat support",
        "AI-powered product recommendations",
        "Custom branding options",
        "API access",
        "Conversion optimization tools",
      ],
      color: "from-pink-600 to-purple-600",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large stores with complex requirements",
      monthlyPrice: 199,
      annualPrice: 169,
      features: [
        "Unlimited products with virtual try-on",
        "Advanced analytics with custom reports",
        "24/7 dedicated support",
        "Custom AI model training",
        "White-label solution",
        "Advanced API access",
        "Custom integration support",
        "Dedicated account manager",
      ],
      color: "from-cyan-600 to-blue-600",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-block px-4 py-1 mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-sm font-medium text-purple-300 border border-purple-500/30"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Simple Pricing
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Choose the Perfect Plan for Your Store
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            No hidden fees. All plans include core virtual try-on features. Choose the plan that fits your business
            needs.
          </motion.p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center mb-10">
            <span className={`mr-3 text-sm ${!isAnnual ? "text-white font-medium" : "text-gray-400"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`ml-3 text-sm ${isAnnual ? "text-white font-medium" : "text-gray-400"}`}>
              Annual <span className="text-purple-400 font-medium">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl backdrop-blur-sm border border-gray-800 overflow-hidden ${
                plan.popular ? "md:-mt-4 md:mb-4" : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold uppercase py-1 text-center">
                  Most Popular
                </div>
              )}

              <div className="p-5 md:p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>

                <div className="mb-6">
                  {plan.trial ? (
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-purple-400">{plan.trial}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">${isAnnual ? plan.annualPrice.toFixed(0) : plan.monthlyPrice}</span>
                        <span className="text-gray-400 ml-2">/month</span>
                      </div>
                      {isAnnual && plan.yearlyDisplay && (
                        <p className="text-sm text-purple-400 mt-1">Billed annually (${plan.yearlyDisplay}/year)</p>
                      )}
                      {isAnnual && !plan.yearlyDisplay && (
                        <p className="text-sm text-purple-400 mt-1">Billed annually (${(plan.annualPrice * 12).toFixed(0)}/year)</p>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mt-0.5`}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="ml-3 text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <AnimatedButton
                  className={`w-full ${
                    plan.popular ? "bg-gradient-to-r from-pink-600 to-purple-600" : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {plan.buttonText || (plan.popular ? "Get Started" : "Choose Plan")}
                </AnimatedButton>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-xl font-bold mb-4">Need a custom solution?</h3>
          <p className="text-gray-300 mb-6">
            Contact our sales team for a tailored plan that meets your specific requirements.
          </p>
          <Link  href="/waitlist">
          <AnimatedButton>Contact For First 6 Month Free Subscription</AnimatedButton>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
