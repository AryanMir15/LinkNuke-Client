import React from "react";
import {
  X,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const RefundPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-[#1de4bf]" />
            <h2 className="text-xl font-semibold text-white">Refund Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main Policy */}
          <div className="p-4 bg-[#1de4bf]/10 border border-[#1de4bf]/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-[#1de4bf]" />
              <h3 className="font-semibold text-[#1de4bf]">
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
            <h3 className="text-lg font-semibold text-white">Key Points</h3>

            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-[#2E2E32] rounded-lg">
                <Clock className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">15-Day Window</h4>
                  <p className="text-sm text-gray-400">
                    Refunds must be requested within 15 days of your first
                    payment date.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#2E2E32] rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">Full Refund</h4>
                  <p className="text-sm text-gray-400">
                    You'll receive a complete refund of your payment amount.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#2E2E32] rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">
                    Immediate Access Removal
                  </h4>
                  <p className="text-sm text-gray-400">
                    Premium features will be removed immediately upon refund
                    processing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#2E2E32] rounded-lg">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">
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
            <h3 className="text-lg font-semibold text-white">
              Refund Conditions
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1de4bf] rounded-full"></div>
                <span className="text-sm text-gray-300">
                  Refund must be requested within 15 days of first payment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1de4bf] rounded-full"></div>
                <span className="text-sm text-gray-300">
                  Access to premium features will be removed immediately
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1de4bf] rounded-full"></div>
                <span className="text-sm text-gray-300">
                  Refund will be processed to the original payment method
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1de4bf] rounded-full"></div>
                <span className="text-sm text-gray-300">
                  No partial refunds available
                </span>
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-blue-400">Processing Time</h4>
            </div>
            <p className="text-sm text-gray-300">
              Refunds are processed immediately. You should see the refund in
              your account within 3-5 business days, depending on your bank or
              payment provider.
            </p>
          </div>

          {/* Contact Info */}
          <div className="p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Need Help?</h4>
            <p className="text-sm text-gray-300">
              If you have any questions about our refund policy or need
              assistance with a refund request, please contact our support team.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#1de4bf] text-black rounded-lg hover:bg-[#1de4bf]/90 transition-colors font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyModal;
