import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md m-4 p-5 font-sans text-slate-800">

        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-slate-900 pb-2 text-center border-b">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600 my-6">
            <strong>NestMe</strong> ("we", "our", "us") respects your privacy and is committed to protecting your personal information.
          </p>
        </div>

        {/* Section */}
        <Section title="Information We Collect">
          <ul className="list-disc pl-4 space-y-1">
            <li>Name, email, and phone number</li>
            <li>Property preferences and activity</li>
            <li>Device and usage data</li>
          </ul>
        </Section>

        <Section title="How We Use Information">
          <ul className="list-disc pl-4 space-y-1">
            <li>Provide and improve services</li>
            <li>Connect users with agents</li>
            <li>Send updates and notifications</li>
          </ul>
        </Section>

        <Section title="Data Sharing">
          <p className="text-sm text-slate-600">
            We do not sell your data. We may share with:
          </p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>Service providers</li>
            <li>Legal authorities if required</li>
          </ul>
        </Section>

        <Section title="Push Notifications">
          <p className="text-sm text-slate-600">
            We may send updates and alerts. You can disable them in device settings.
          </p>
        </Section>

        <Section title="Data Security">
          <p className="text-sm text-slate-600">
            We take reasonable steps to protect your information.
          </p>
        </Section>

        <Section title="Contact">
          <a
            href="mailto:support@nestme.in"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            support@nestme.in
          </a>
        </Section>

        {/* Footer */}
        <div className="mt-5 text-xs text-slate-400 text-center">
          © 2026 NestMe
        </div>
      </div>
    </div>
  );
}

/* Reusable Section Component */
function Section({ title, children }) {
  return (
    <div className="mt-4">
      <h2 className="text-sm font-semibold text-blue-700 mb-1">
        {title}
      </h2>
      <div className="text-sm text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}