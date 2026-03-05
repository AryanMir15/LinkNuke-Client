import React from "react";

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        By using <strong>LinkNuke</strong>, you agree to the following terms.
        Please read them carefully before using our service.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Acceptable Use</h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>
          You agree not to upload, share, or distribute illegal, harmful, or
          copyrighted content.
        </li>
        <li>
          You are responsible for the links and content you create and share
          using LinkNuke.
        </li>
        <li>
          We reserve the right to remove content or suspend accounts that
          violate these terms or applicable laws.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. Account Responsibility
      </h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>
          You are responsible for maintaining the security of your account and
          password.
        </li>
        <li>
          Notify us immediately if you suspect any unauthorized use of your
          account.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Service Availability
      </h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>
          We strive to provide a reliable service, but LinkNuke is provided "as
          is" and "as available" without warranties of any kind.
        </li>
        <li>
          We may modify, suspend, or discontinue the service at any time without
          notice.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Limitation of Liability
      </h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>
          LinkNuke is not liable for any damages or losses resulting from your
          use of the service.
        </li>
        <li>You use LinkNuke at your own risk.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Refund Policy</h2>
      <p className="mb-4">
        LinkNuke offers a 14-day money-back guarantee on all purchases, in
        accordance with Paddle's requirements. For detailed information about
        our refund policy, including eligibility criteria, how to request
        refunds, and processing timeframes, please visit our{" "}
        <a
          href="/refund-policy"
          className="underline text-[#1de4bf] hover:text-[#1de4bf]/80"
        >
          Refund Policy page
        </a>
        .
      </p>
      <p className="mb-4">
        By making a purchase, you acknowledge that you have read and agree to
        our refund policy terms.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms of Service from time to time. Continued use of
        LinkNuke after changes constitutes acceptance of the new terms.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">7. Contact</h2>
      <p className="mb-4">
        For questions or support, contact us at
        <a
          href="mailto:support@whynotship.me"
          className="underline text-[#1de4bf] ml-1"
        >
          support@whynotship.me
        </a>
        .
      </p>
      <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
