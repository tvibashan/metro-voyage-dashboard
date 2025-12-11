"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useStepStore } from "@/app/store/useStepStore";
import { useProductStore } from "@/app/store/useProductStore";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Liability: React.FC = () => {
  const { prevStep, resetCompletedSteps } = useStepStore();
  const { productData, setProductData, submitProduct } = useProductStore();
  const [isProductActive, setIsProductActive] = useState(
    productData.status || false
  );
  const [contactInformation, setContactInformation] = useState(
    productData.contactInformation || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      // Update product data first
      setProductData({
        ...productData,
        contactInformation,
        status: isProductActive,
      });
      
      // Submit product
      const success:boolean = await submitProduct();
      
      if (success) {
        // Reset steps and reload only after successful submission
        resetCompletedSteps();
        window.location.reload();
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-2 h-screen pb-4">
      <div className="w-full mx-auto bg-white border rounded-[20px]">
        <div className="flex items-center justify-between p-6 border-b w-full py-4">
          <h2 className="text-xl font-semibold">Liability Information</h2>
          <Icon icon="iconamoon:arrow-up-2-thin" className="text-2xl" />
        </div>

        {/* Cancellation Policy Section */}
        <div className="p-6 border-b space-y-4">
          <h3 className="text-lg font-semibold mb-4">Cancellation Policy</h3>
          {/* <textarea
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            placeholder="Enter cancellation policy..."
            className="w-full p-4 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
          /> */}
          <h2 className="font-bold text-gray-600">Free Cancellation </h2>
          <p className=" text-gray-600">
            For a full refund, you must cancel at least 24 hours before the
            experience's start date/time*. If you cancel less than 24 hours
            before the experience's start date/time*, the amount you paid will
            not be refunded. Any changes made less than 24 hours before the
            experience's start date/time* will not be accepted. Non-refundable{" "}
          </p>
          <p className=" text-gray-600">
            These experiences are non-refundable and cannot be changed for any
            reason. If you cancel or ask for an amendment, the amount paid will
            not be refunded.
          </p>
        </div>

        {/* Terms and Conditions Section */}
        <div className="p-6  bg-white">
          <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>

          <div className="space-y-4 text-sm">
            {/* Cancellation Policy */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-800 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancellation Policy
              </h4>
              <p className="mt-2 text-green-700">
                Full refund available if cancelled{" "}
                <span className="font-semibold">24+ hours before</span> the
                tour.
                <span className="block mt-1 text-red-600">
                  No refunds for cancellations under 24 hours.
                </span>
              </p>
            </div>

            {/* Booking Policy */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                1. Booking Policy
              </h4>
              <p className="mt-2 text-blue-700">
                Confirmation email sent after payment. Present voucher at
                check-in.
              </p>
            </div>

            {/* Changes Policy */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-800 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                2. Changes Policy
              </h4>
              <p className="mt-2 text-purple-700">
                Date/time changes subject to availability (must request 24+
                hours prior).
              </p>
            </div>

            {/* No-Show Policy */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h4 className="font-medium text-amber-800 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                3. No-Show Policy
              </h4>
              <p className="mt-2 text-amber-700">
                Late arrivals after 15 minutes forfeit the tour without refund.
              </p>
            </div>

            {/* Weather Policy */}
            <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
              <h4 className="font-medium text-sky-800 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
                4. Weather Policy
              </h4>
              <p className="mt-2 text-sky-700">
                Rainchecks offered for severe weather cancellations initiated by
                us.
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            By booking, you agree to these terms. Policies last updated{" "}
            {new Date().toLocaleDateString()}.
          </p>
        </div>

        {/* Contact Information Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <textarea
            value={contactInformation}
            onChange={(e) => setContactInformation(e.target.value)}
            placeholder="Enter contact information..."
            className="w-full p-4 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
          />
        </div>
      </div>
      {/* Activate Product Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Do you want to activate the product?
        </h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="activate-product"
            checked={isProductActive}
            onCheckedChange={setIsProductActive}
            className="data-[state=checked]:bg-green-500"
          />
          <Label htmlFor="activate-product">
            {isProductActive ? "Active" : "Inactive"}
          </Label>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex items-center justify-end gap-[22px] mt-6">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="px-[25px] py-[10px] w-[120px] h-[38px] flex items-center justify-center text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleContinue}
          disabled={isSubmitting}
          className="px-[25px] py-[10px] w-[120px] h-[38px] justify-center bg-black text-white rounded-lg font-medium hover:bg-gray-700 transition flex items-center disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Submit
              <span className="ml-2">&rarr;</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Liability;
