'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Shield, Rocket, HeartHandshake, CreditCard, ChevronRight, X, AlertCircle } from 'lucide-react';
import { getPublicToken } from '@/lib/helpers';
import apiClient from '@/lib/api-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  popular?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: 'Starter Plan',
    price: '₹1,999',
    description: 'Perfect for local shops & clinics needing basic digital presence.',
    features: [
      'Simple Responsive Website (1 Page)',
      '3 Social Media Posts per month',
      'Basic Local SEO optimization',
      'Shared Support Desk (48h reply)',
      '1 Client User Account'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Business Pro Plan',
    price: '₹3,999',
    description: 'Perfect for expanding coaching centers and growing service shops.',
    popular: true,
    features: [
      'Responsive Website (Up to 5 Pages)',
      '10 Social Media Posts per month',
      'Monthly Google Maps SEO optimization',
      'Lead Form Integration & Collection',
      'Priority Support Desk (24h reply)',
      '2 Client User Accounts'
    ],
    color: 'from-pink-500 to-rose-500'
  },
  {
    name: 'Growth Plan',
    price: '₹5,999',
    description: 'Full-service advertising and campaign leads generation.',
    features: [
      'Responsive Website + Landing Pages',
      '20 Social Media Posts & Custom Creatives',
      'Google Maps + On-Page SEO audit',
      'Facebook & Google Lead Ads Campaign Setup',
      'Direct CRM Lead Downloads (CSV)',
      'Dedicated Slack / WhatsApp operator group',
      '4 Client User Accounts'
    ],
    color: 'from-violet-500 to-indigo-500'
  },
  {
    name: 'Enterprise Scale Plan',
    price: '₹9,999',
    description: 'Custom scaling strategies for larger businesses and franchise stores.',
    features: [
      'Full Multi-Page E-commerce Website',
      'Unlimited Social Post Designs & Copies',
      'Advanced Competitor SEO Keywords tracking',
      'Ads Management (Meta, Google, LinkedIn)',
      'Monthly Strategy Call & Audit Review',
      'Custom Integrations & Deliverables support',
      'Unlimited Client User Accounts'
    ],
    color: 'from-amber-500 to-orange-500'
  }
];

export default function HomePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'nb'>('upi');
  const [paying, setPaying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sendingContact, setSendingContact] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getPublicToken());
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSendingContact(true);
    await new Promise(r => setTimeout(r, 650));
    toast.success('Thank you! Your message has been received.');
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
    setSendingContact(false);
  };

  const handleSubscribe = (plan: PricingPlan) => {
    if (!isLoggedIn) {
      toast.warn('Please register or log in on the website to subscribe to a package!', {
        position: 'top-center',
        autoClose: 3500
      });
      setTimeout(() => {
        router.push('/register');
      }, 1500);
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan) return;
    setPaying(true);
    try {
      await apiClient.post('/subscriptions/purchase', {
        planName: selectedPlan.name,
        price: selectedPlan.price
      });

      toast.success(`Payment Successful! You subscribed to ${selectedPlan.name}.`, {
        position: 'top-center',
        autoClose: 3000
      });

      setTimeout(() => {
        setShowPaymentModal(false);
        // Close modal and refresh storefront context to reflect purchase
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mesh-bg min-h-screen">
      <ToastContainer theme="colored" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles size={13} />
          Digital Agency In A Box
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl leading-tight mb-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-pink-700 dark:from-white dark:via-slate-100 dark:to-pink-500 bg-clip-text text-transparent">
          Accelerate Your Business With Monthly Subscriptions
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
          Hiring developers, SEO consultants, and ad designers separately is exhausting. Just pay one fixed, transparent monthly amount and get all your digital tasks completed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-bold text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800 transition-all shadow-lg shadow-pink-200 dark:shadow-none w-full sm:w-auto"
          >
            Explore Plans
            <ChevronRight size={18} />
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-bold border border-gray-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-slate-800 dark:text-slate-200 w-full sm:w-auto"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Features Cards Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 dark:border-white/5">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-12">Why Choose Growth Subscriptions?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#111116]/50 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
              <Rocket size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">Netflix-Style Pricing</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No hidden quotes, no hourly markups, and no long-term contracts. Cancel or upgrade your plans with a single click.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#111116]/50 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Shield size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">Dedicated Workspace</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Log into your client workspace portal to upload guidelines, monitor ongoing designers tasks in real-time, and download customer leads.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#111116]/50 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <HeartHandshake size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">Premium Agency Output</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your website, social posts, map optimization, and advertising campaigns are managed by experienced designers and copywriters.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black mb-4">Choose Your Growth Tier</h2>
          <p className="text-slate-500 dark:text-slate-400">Simple flat monthly rates. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 rounded-2xl bg-white dark:bg-[#111118] border transition-all duration-200 ${
                plan.popular
                  ? 'border-pink-500 shadow-xl ring-2 ring-pink-500/10 sm:scale-105 z-10'
                  : 'border-gray-200 dark:border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Popular Option
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">{plan.price}</span>
                <span className="text-xs text-slate-500">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Check size={14} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white shadow-md shadow-pink-200 dark:shadow-none'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200 dark:border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Contact details */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-pink-700 dark:from-white dark:via-slate-100 dark:to-pink-500 bg-clip-text text-transparent leading-tight animate-fade-in">
              Get in touch with our specialist growth team
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Have questions about which subscription tier is right for your business? Send us an inquiry, and one of our dedicated account leads will get back to you within 24 hours.
            </p>
            
            <div className="space-y-4 pt-6 text-sm text-slate-700 dark:text-slate-300">
              <p>📍 Location: Delhi NCR & Bangalore, India</p>
              <p>✉️ Email: support@growthhub.local</p>
              <p>📞 Phone: +91 99999 88888</p>
              <p>🕒 Hours: Mon - Sat, 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>

          {/* Right Column: Contact form Card */}
          <div className="p-6 sm:p-8 bg-white dark:bg-[#111118] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Send a Message</h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact_name" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact_name"
                    type="text"
                    required
                    placeholder="Amit Patel"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    disabled={sendingContact}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor="contact_email" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact_email"
                    type="email"
                    required
                    placeholder="amit.patel@gmail.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    disabled={sendingContact}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact_subject" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Subject Inquiry
                </label>
                <input
                  id="contact_subject"
                  type="text"
                  placeholder="Inquiry about custom onboarding"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  disabled={sendingContact}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="contact_message" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Message Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact_message"
                  required
                  placeholder="Please describe your business goals..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  disabled={sendingContact}
                  rows={4}
                  className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={sendingContact}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-200 dark:shadow-none transition-all cursor-pointer text-slate-900 dark:text-white"
              >
                {sendingContact ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  'Send Message Inquiry'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* RAZORPAY PAYMENT SIMULATION DIALOG */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#11111a] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl z-10 animate-fade-in text-slate-900 dark:text-slate-100">
            {/* Razorpay Simulated Header */}
            <div className="bg-[#0b1b3d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-bold text-xs">R</div>
                <div>
                  <h4 className="text-sm font-bold leading-tight">Razorpay checkout</h4>
                  <p className="text-[10px] text-slate-400">Growth Immortals Platform</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Price detail block */}
            <div className="bg-slate-50 dark:bg-white/2 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-white/5">
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Subscribing to</p>
                <p className="text-sm font-bold">{selectedPlan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-950 dark:text-white">{selectedPlan.price}</p>
                <p className="text-[10px] text-slate-400">Recurring payment</p>
              </div>
            </div>

            {/* Payment options selection */}
            <div className="p-6">
              <p className="text-xs font-semibold text-slate-500 mb-3">SELECT PAYMENT METHOD</p>
              
              <div className="space-y-2 mb-6">
                {/* UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-pink-500 bg-pink-500/5 ring-1 ring-pink-500/10'
                      : 'border-gray-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Rocket size={12} className="text-pink-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">UPI / GPay / PhonePe</p>
                      <p className="text-[10px] text-slate-400">Pay instantly using your UPI ID</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-pink-500' : 'border-slate-300'}`}>
                    {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />}
                  </div>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-pink-500 bg-pink-500/5 ring-1 ring-pink-500/10'
                      : 'border-gray-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <CreditCard size={12} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Credit / Debit Card</p>
                      <p className="text-[10px] text-slate-400">Visa, Mastercard, RuPay, Amex</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-pink-500' : 'border-slate-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />}
                  </div>
                </button>
              </div>

              {/* simulated payment credentials info */}
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-xl flex gap-2.5">
                <AlertCircle size={15} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-normal">
                  <strong>Simulated checkout:</strong> No real money will be charged. Clicking confirm simulates a Razorpay webhook return to activate the package subscription.
                </p>
              </div>

              {/* Confirm button */}
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={paying}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 active:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {paying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard size={14} />
                    Confirm Payment ({selectedPlan.price})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
