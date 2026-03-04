import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        <strong>LinkNuke</strong> is committed to protecting your privacy and
        data. This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you use our service. By using LinkNuke,
        you agree to the terms outlined below.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. Information We Collect
      </h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong>Account Information:</strong> We collect your email address
          and password when you create an account.
        </li>
        <li>
          <strong>Link Data:</strong> We store metadata about the links you
          create (such as creation date, expiration, and access statistics). The
          actual content of your links is deleted permanently once a link is
          nuked or expired.
        </li>
        <li>
          <strong>Usage Data:</strong> We may collect anonymized usage data to
          improve our service, such as device type, browser, and general
          location (city/country level only).
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>To provide, operate, and maintain LinkNuke.</li>
        <li>To improve, personalize, and expand our service.</li>
        <li>To communicate with you, including support and service updates.</li>
        <li>To ensure security and prevent abuse or fraud.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Data Deletion & Retention
      </h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>
          We do <strong>not</strong> retain your sensitive link content after
          expiration or nuking. It is permanently deleted from our servers.
        </li>
        <li>
          You may delete your account and all associated data at any time from
          your dashboard.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Security</h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>All data is encrypted in transit (HTTPS) and at rest.</li>
        <li>
          We use industry-standard security practices to protect your
          information.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Sharing & Disclosure
      </h2>
      <ul className="mb-4 list-disc pl-6 space-y-2">
        <li>
          We do <strong>not</strong> sell or share your personal information
          with third parties for marketing purposes.
        </li>
        <li>
          We may disclose information if required by law or to protect our
          rights and users.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Children's Privacy</h2>
      <p className="mb-4">
        LinkNuke is not intended for children under 13. We do not knowingly
        collect personal information from children under 13.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        7. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you
        of any significant changes by posting the new policy on this page.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">8. Contact Us</h2>
      <p className="mb-4">
        If you have any questions or concerns about your privacy, please contact
        us at
        <a
          href="mailto:support@whynotship.me"
          className="underline text-[#1de4bf] ml-1"
        >
          support@whynotship.me
        </a>
        .
      </p>
      <p className="text-xs text-gray-500">
        Last updated:{" "}
        {typeof window !== "undefined" ? new Date().toLocaleDateString() : ""}
      </p>
    </div>
  );
}
