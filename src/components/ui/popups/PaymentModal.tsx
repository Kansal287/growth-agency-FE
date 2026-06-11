'use client';

import React, { useState } from "react";
import { X, Rocket, CreditCard, AlertCircle } from "lucide-react";
import apiClient from "@/lib/api-client";
import { toast } from "react-toastify";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  popular?: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, selectedPlan, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "nb">("upi");
  const [paying, setPaying] = useState(false);

  if (!isOpen || !selectedPlan) return null;

  const handleConfirmPayment = async () => {
    setPaying(true);
    try {
      await apiClient.post("/subscriptions/purchase", {
        planName: selectedPlan.name,
        price: selectedPlan.price,
      });

      toast.success(`Payment Successful! You subscribed to ${selectedPlan.name}.`, {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Scrim */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#11111a] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl z-10 animate-fade-in text-slate-900 dark:text-slate-100">
        {/* Razorpay Simulated Header */}
        <div className="bg-[#0b1b3d] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-bold text-xs">
              R
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">Razorpay checkout</h4>
              <p className="text-[10px] text-slate-400">Growth Immortals Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Price detail block */}
        <div className="bg-slate-50 dark:bg-white/2 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-white/5">
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Subscribing to
            </p>
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
              onClick={() => setPaymentMethod("upi")}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                paymentMethod === "upi"
                  ? "border-pink-500 bg-pink-500/5 ring-1 ring-pink-500/10"
                  : "border-gray-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/2"
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
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "upi" ? "border-pink-500" : "border-slate-300"}`}
              >
                {paymentMethod === "upi" && <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />}
              </div>
            </button>

            {/* Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                paymentMethod === "card"
                  ? "border-pink-500 bg-pink-500/5 ring-1 ring-pink-500/10"
                  : "border-gray-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/2"
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
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "card" ? "border-pink-500" : "border-slate-300"}`}
              >
                {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />}
              </div>
            </button>
          </div>

          {/* simulated payment credentials info */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-xl flex gap-2.5">
            <AlertCircle size={15} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-normal">
              <strong>Simulated checkout:</strong> No real money will be charged. Clicking confirm
              simulates a Razorpay webhook return to activate the package subscription.
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
  );
}
