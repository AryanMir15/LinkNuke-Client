import React from "react";

export default function RefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded">
        <p className="text-blue-800 dark:text-blue-200 font-medium">
          <strong>14-Day Money-Back Guarantee:</strong> We offer a 14-day
          money-back guarantee on all LinkNuke purchases.
        </p>
      </div>

      <p className="mb-6">
        At <strong>LinkNuke</strong>, we stand behind our service and want you
        to be completely satisfied with your purchase. This refund policy
        outlines the terms and conditions for requesting refunds in accordance
        with Paddle's requirements.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Refund Eligibility</h2>
      <ul className="mb-6 list-disc pl-6 space-y-2">
        <li>
          <strong>14-Day Window:</strong> You may request a full refund within
          14 days of your purchase date.
        </li>
        <li>
          <strong>Valid Purchase:</strong> Refunds are only available for
          legitimate purchases made through our official channels.
        </li>
        <li>
          <strong>Account Status:</strong> Your account must be in good standing
          at the time of the refund request.
        </li>
        <li>
          <strong>One-Time Refund:</strong> Each purchase is eligible for one
          refund request within the 14-day period.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        2. How to Request a Refund
      </h2>
      <p className="mb-4">To request a refund, please follow these steps:</p>
      <ol className="mb-6 list-decimal pl-6 space-y-2">
        <li>
          <strong>Contact Support:</strong> Send an email to{" "}
          <a
            href="mailto:support@whynotship.me"
            className="text-[#1de4bf] underline hover:text-[#1de4bf]/80"
          >
            support@whynotship.me
          </a>{" "}
          with the subject line "Refund Request"
        </li>
        <li>
          <strong>Include Details:</strong> Provide your order number, email
          address used for purchase, and reason for the refund request
        </li>
        <li>
          <strong>Verification:</strong> We may request additional information
          to verify your purchase and identity
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Refund Processing</h2>
      <ul className="mb-6 list-disc pl-6 space-y-2">
        <li>
          <strong>Review Period:</strong> We will review your refund request
          within 2-3 business days.
        </li>
        <li>
          <strong>Approval:</strong> If approved, your refund will be processed
          through the original payment method.
        </li>
        <li>
          <strong>Processing Time:</strong> Refunds typically appear in your
          account within 5-10 business days, depending on your payment provider.
        </li>
        <li>
          <strong>Account Access:</strong> Upon refund approval, your LinkNuke
          account access will be suspended.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        4. Non-Refundable Circumstances
      </h2>
      <ul className="mb-6 list-disc pl-6 space-y-2">
        <li>Requests made after the 14-day refund period has expired</li>
        <li>
          Accounts that have violated our Terms of Service or Acceptable Use
          Policy
        </li>
        <li>Purchases made through unauthorized third-party resellers</li>
        <li>Cases of fraud or abuse of our refund policy</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        5. Contact Information
      </h2>
      <p className="mb-4">
        For refund requests or questions about this policy, please contact us:
      </p>
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded">
        <p className="mb-2">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:support@whynotship.me"
            className="text-[#1de4bf] underline hover:text-[#1de4bf]/80"
          >
            support@whynotship.me
          </a>
        </p>
        <p className="mb-2">
          <strong>Response Time:</strong> We aim to respond to all refund
          requests within 24 hours during business days
        </p>
        <p>
          <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
          EST
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Policy Updates</h2>
      <p className="mb-6">
        We reserve the right to modify this refund policy at any time. Any
        changes will be posted on this page with an updated effective date.
        Continued use of LinkNuke after policy changes constitutes acceptance of
        the updated terms.
      </p>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Policy Effective Date:</strong>{" "}
          {typeof window !== "undefined" ? new Date().toLocaleDateString() : ""}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          This refund policy is compliant with Paddle's requirements and follows
          their 14-day refund guidelines.
        </p>
      </div>
    </div>
  );
}
