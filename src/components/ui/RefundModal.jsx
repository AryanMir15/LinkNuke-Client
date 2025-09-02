import React, { useEffect } from "react";
import { X, RefreshCw, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const RefundModal = ({
  isOpen,
  onClose,
  onRequestRefund,
  refundDaysRemaining,
  refundReason,
  setRefundReason,
  refunding,
}) => {
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
      <div className="bg-[#2A2A2E] border border-[#2E2E32] rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium text-white">Request Refund</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-[#2E2E32]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">
              {refundDaysRemaining} Days Remaining
            </span>
          </div>
          <p className="text-sm text-amber-300">
            You have {refundDaysRemaining} days remaining to request a refund.
            Refunds are processed immediately and your access will be removed.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reason for refund (optional)
          </label>
          <textarea
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Help us improve by sharing your feedback..."
            className="w-full p-3 bg-[#1F1F23] border border-[#2E2E32] rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none resize-none text-sm"
            rows={3}
          />
        </div>

        <div className="mb-6 text-center">
          <Link
            to="/refund-policy"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors underline"
            onClick={onClose}
          >
            View Refund Policy
          </Link>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-300 border border-[#2E2E32] rounded-lg hover:bg-[#2E2E32] transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onRequestRefund}
            disabled={refunding}
            className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {refunding ? "Processing..." : "Request Refund"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
