import React, { useEffect } from "react";
import {
  X,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const RefundPolicyModal = ({ isOpen, onClose }) => {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-medium text-white">Refund Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main Policy */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <h3 className="text-base font-medium text-emerald-500 uppercase tracking-wide">
                15-Day Money-Back Guarantee
              </h3>
            </div>
            <p className="text-sm text-gray-300">
              We offer a full refund within 15 days of your first payment. No
              questions asked.
            </p>
          </div>

          {/* Key Points */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white uppercase tracking-wide">
              Key Points
            </h3>

            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-gray-800/20 border border-gray-700/20 rounded-lg">
                <Clock className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-base font-medium text-white mb-1">
                    15-Day Window
                  </h4>
                  <p className="text-sm text-gray-400">
                    Refunds must be requested within 15 days of your first
                    payment date.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-800/20 border border-gray-700/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-base font-medium text-white mb-1">
                    Full Refund
                  </h4>
                  <p className="text-sm text-gray-400">
                    You'll receive a complete refund of your payment amount.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-800/20 border border-gray-700/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-base font-medium text-white mb-1">
                    Immediate Access Removal
                  </h4>
                  <p className="text-sm text-gray-400">
                    Premium features will be removed immediately upon refund
                    processing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-800/20 border border-gray-700/20 rounded-lg">
                <Info className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-base font-medium text-white mb-1">
                    Original Payment Method
                  </h4>
                  <p className="text-sm text-gray-400">
                    Refunds are processed to the original payment method used
                    for purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white uppercase tracking-wide">
              Refund Conditions
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  Refund must be requested within 15 days of first payment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  Access to premium features will be removed immediately
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  Refund will be processed to the original payment method
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  No partial refunds available
                </span>
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <h4 className="text-base font-medium text-emerald-500 uppercase tracking-wide">
                Processing Time
              </h4>
            </div>
            <p className="text-sm text-gray-300">
              Refunds are processed immediately. You should see the refund in
              your account within 3-5 business days, depending on your bank or
              payment provider.
            </p>
          </div>

          {/* Contact Info */}
          <div className="p-4 bg-gray-800/20 border border-gray-700/20 rounded-lg">
            <h4 className="text-base font-medium text-white mb-2">
              Need Help?
            </h4>
            <p className="text-sm text-gray-300">
              If you have any questions about our refund policy or need
              assistance with a refund request, please contact our support team.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyModal;
