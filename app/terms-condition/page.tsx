"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function TermsAndCondition() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  useEffect(() => {
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [section]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white pb-12 md:pt-40 pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Legal Information</h1>
          <p className="mt-2 text-gray-200">
            Please read our policies carefully
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Terms and Conditions */}
        <section id="terms" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Terms and Conditions
          </h2>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">Last updated: January 2025</p>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing and using our chauffeur services, you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to these terms, please do not use our
                services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Service Description
              </h3>
              <p>
                We provide premium chauffeur and transportation services
                including airport transfers, hourly hire, event transportation,
                and city-to-city travel. All services are subject to
                availability and confirmation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Booking and Payment
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All bookings must be made in advance through our website,
                  phone, or email
                </li>
                <li>
                  Payment can be made via credit card, debit card, or other
                  accepted payment methods
                </li>
                <li>Full payment or deposit may be required at time of booking</li>
                <li>Prices are quoted in Euros (EUR) unless otherwise stated</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4. Cancellation Policy
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Cancellations made 24 hours or more before scheduled pickup:
                  Full refund
                </li>
                <li>
                  Cancellations made less than 24 hours: 50% cancellation fee
                </li>
                <li>No-shows or same-day cancellations: No refund</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                5. Customer Responsibilities
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate pickup and drop-off information</li>
                <li>Be ready at the designated pickup time</li>
                <li>Respect the vehicle and chauffeur</li>
                <li>
                  Inform us of any special requirements or accessibility needs
                </li>
                <li>No smoking, eating, or drinking in vehicles without permission</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                6. Liability and Insurance
              </h3>
              <p>
                All our vehicles are fully insured. We are not liable for delays
                caused by traffic, weather, or circumstances beyond our control.
                We are not responsible for personal belongings left in vehicles.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                7. Contact Information
              </h3>
              <p>
                For questions about these terms, please contact us at
                Info@Chauffeurio.com or +34 614 014 277.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Warning */}
        <section id="legal-warning" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Legal Warning
          </h2>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Intellectual Property
              </h3>
              <p>
                All content on this website, including text, graphics, logos,
                images, and software, is the property of our company or its
                content suppliers and is protected by international copyright
                laws. Unauthorized use of any materials may violate copyright,
                trademark, and other laws.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Limitation of Liability
              </h3>
              <p>
                We strive to provide accurate information on our website.
                However, we make no warranties or representations about the
                accuracy or completeness of the content. We are not liable for
                any damages arising from the use of our website or services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Governing Law
              </h3>
              <p>
                These terms shall be governed by and construed in accordance
                with the laws of Spain. Any disputes shall be subject to the
                exclusive jurisdiction of the courts of Valencia, Spain.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Modifications
              </h3>
              <p>
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting to the website.
                Continued use of our services constitutes acceptance of modified
                terms.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h2>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Effective date: January 2025
            </p>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Information We Collect
              </h3>
              <p>We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, payment information
                </li>
                <li>
                  <strong>Booking Information:</strong> Pickup/drop-off
                  locations, dates, times, flight details
                </li>
                <li>
                  <strong>Technical Information:</strong> IP address, browser
                  type, device information
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. How We Use Your Information
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve our chauffeur services</li>
                <li>To process bookings and payments</li>
                <li>To communicate with you about your bookings</li>
                <li>To send promotional materials (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Information Sharing
              </h3>
              <p>
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Our chauffeurs (only information necessary for service)</li>
                <li>Payment processors for transaction processing</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4. Data Security
              </h3>
              <p>
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the internet is 100% secure, and we cannot guarantee absolute
                security.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                5. Your Rights
              </h3>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                6. Contact Us
              </h3>
              <p>
                For privacy-related questions, contact us at
                Info@Chauffeurio.com or +34 614 014 277.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies Policy */}
        <section id="cookies" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Cookies Policy
          </h2>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What Are Cookies?
              </h3>
              <p>
                Cookies are small text files stored on your device when you
                visit our website. They help us provide a better user experience
                and analyze website usage.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Types of Cookies We Use
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for website
                  functionality (login, booking process)
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Help us understand how
                  visitors interact with our website
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Remember your preferences
                  and choices
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Track your visits across
                  websites to show relevant ads
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Managing Cookies
              </h3>
              <p>
                You can control and/or delete cookies as you wish. You can
                delete all cookies already on your computer and set most
                browsers to prevent them from being placed. However, this may
                prevent you from using certain features of our website.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Third-Party Cookies
              </h3>
              <p>
                We may use third-party services (Google Analytics, payment
                processors) that also use cookies. These cookies are subject to
                the respective privacy policies of these external services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Updates to This Policy
              </h3>
              <p>
                We may update this cookies policy from time to time. Please
                check this page periodically for changes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Contact
              </h3>
              <p>
                Questions about our use of cookies? Contact us at
                Info@Chauffeurio.com.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}