"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Loading component
function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading legal information...</p>
      </div>
    </div>
  );
}

// Main content component that uses useSearchParams
function TermsAndConditionContent() {
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
        {/* Legal Warning */}
        <section id="legal-warning" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Legal Warning
          </h2>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p>
              The website of Chauffeurio.com (hereinafter the "Site") is operated by CHAUFFEURIO TRANSPORT S.L. (hereinafter the "Company").
              By accessing or using this Site, you agree to be bound by these Terms and Conditions in their entirety. If you do not agree with these Terms and Conditions, you should not use this Site.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                RESPONSIBLE PARTY INFORMATION
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Legal name: CHAUFFEURIO TRANSPORT S.L.</li>
                <li>Registered address: C/ Dama de Elche 26 P01 PTA03, 46023 Valencia (Spain)</li>
                <li>Tax identification number (NIF): B-23849482</li>
                <li>Email: info@chauffeurio.com</li>
                <li>Mobile number: +34 614 014 277</li>
                <li>Activity: website booking reservation for transfer services and chauffeur hourly services</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                PRIVACY
              </h3>
              <p>
                Our Privacy Policy outlines how we collect, use, and disclose your personal information. By using this Site, you agree that we collect, use, and disclose your personal information in accordance with our Privacy Policy.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                COPYRIGHT
              </h3>
              <p>
                All content on this Site, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, and software, is the property of the Company or its licensors and is protected by trademarks, copyrights, and other legitimate rights, in accordance with the international treaties to which Spain is a party, as well as other proprietary rights and laws of Spain. It may not be copied, reproduced, distributed, transmitted, displayed, published, modified, or used in any way, in whole or in part, without the prior written permission of the Company.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                LINKS TO OTHER WEBSITES
              </h3>
              <p>
                This Site may contain links to other websites not operated by the Company. The Company has no control over and assumes no responsibility for the content, privacy policies, or practices of other websites.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                DISCLAIMER
              </h3>
              <p>
                The use of this Site is at your own risk. The Company does not guarantee that this Site will be uninterrupted or error-free, nor does it guarantee the results that may be obtained from the use of this Site. The Company assumes no responsibility for any direct, indirect, incidental, special, or consequential damages, including but not limited to damages for loss of use, data, or profits, arising from the use or inability to use this Site, even if the Company has been advised of the possibility of such damages.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                APPLICABLE LAW
              </h3>
              <p>
                These terms and conditions will be governed and construed in accordance with the laws of Spain, without regard to its conflict of laws principles. Any dispute arising from these terms and conditions or your use of this Site will be finally resolved by arbitration in Valencia, Spain, in accordance with the applicable rules and regulations. The award of the arbitration tribunal will be binding and enforceable in any court of competent jurisdiction.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CHANGES TO THESE TERMS AND CONDITIONS
              </h3>
              <p>
                The Company reserves the right to modify these terms and conditions at any time. By using this Site, you agree to be bound by the current version of these terms and conditions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CONTACT
              </h3>
              <p>
                If you have any questions about these terms and conditions, please contact us at info@chauffeurio.com or call +34 614 014 277.
              </p>
            </div>
          </div>
        </section>

        {/* Terms and Conditions */}
        <section id="terms" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Terms and Conditions
          </h2>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CARRIER
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L.<br />
                Contact:<br />
                Phone: +34 614 014 277<br />
                Email: info@chauffeurio.com
              </p>
              <p>
                CHAUFFEURIO TRANSPORT S.L., through its trademarks www.chauffeurio.com, provides passenger transport and chauffeur services in the area of Valencia and surrounding regions, by means of properly licensed vehicles.
              </p>
              <p>
                CHAUFFEURIO TRANSPORT S.L. acts as a provider of transport services and in no case as a travel agency. All vehicles have the compulsory administrative and insurance licenses required by current legislation.
              </p>
              <p>
                CHAUFFEURIO TRANSPORT S.L. reserves the right to transfer or subcontract at any time with third parties some of our rights and obligations, or all of them, under these terms and conditions.
              </p>
              <p>
                CHAUFFEURIO TRANSPORT S.L. will be closed and will not provide any service on December 24 (Christmas Eve), December 25 (Christmas), December 31 (New Year's Eve), and January 1 (New Year).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ABOUT THE SERVICE
              </h3>
              <p>
                To request a service, the customer must follow the application procedure set out on our website. All applications must be made at least 24 hours in advance. For services with less than 24 hours' notice, customers should call the contact number listed in section 1.
              </p>
              <p>
                By formalizing the request, the customer confirms that they have read, understood, and accepted these terms and conditions, and also confirm that they have the necessary legal capacity to accept these terms on behalf of themselves and/or their companions.
              </p>
              <p>
                All accepted service applications will be formalized by sending a boarding pass to the email address provided. The ticket will only be sent after full payment has been received.
              </p>
              <p>
                Extra services (child seats, extra stops, golf kits, bicycles, skis, pets, etc.) must be requested in advance.
              </p>
              <p>
                The boarding pass will include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Indication of the carrier</li>
                <li>Trip details</li>
                <li>Return details (if applicable)</li>
                <li>Total price</li>
              </ul>
              <p>
                If the customer detects an error, they must immediately notify CHAUFFEURIO TRANSPORT S.L. for correction.
              </p>
              <p>
                CHAUFFEURIO TRANSPORT S.L. assumes no responsibility for errors or omissions made by the customer during the booking process or for incomplete or incorrect information.
              </p>
              <p>
                Customers must print their boarding pass and proof of payment and carry them during the trip. The driver may refuse service if these documents are not provided, without the right to a refund.
              </p>
              <p>
                CHAUFFEURIO TRANSPORT S.L. will send any notices or updates by email to the address provided by the customer, which will be stored for verification during the claim period.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                PRICE
              </h3>
              <p>
                Service prices are agreed upon during the booking process with CHAUFFEURIO TRANSPORT S.L.
              </p>
              <p>
                Prices include all applicable taxes (currently 10% VAT), tolls, and fees. Prices are fixed per vehicle regardless of the number of passengers, within legal capacity limits.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                TIPS
              </h3>
              <p>
                Tips are not included in the service price. Customers are under no obligation to tip drivers; any gratuities are voluntary.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                PAYMENT
              </h3>
              <p>
                Payments may be made during booking (via credit/debit card or PayPal) or directly to the driver at the end of the service (cash or card).
              </p>
              <p>
                Payments are processed through secure payment gateways (POS or PayPal). The Company does not store sensitive payment information.
              </p>
              <p>
                Any fraudulent or unauthorized transactions must be reported immediately to the bank and to info@chauffeurio.com or by calling +34 614 014 277.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                NOTICES
              </h3>
              <p>
                All communications between CHAUFFEURIO TRANSPORT S.L. and the customer must be made by email, using info@chauffeurio.com.
              </p>
              <p>
                Customers must provide a valid email and phone number (with country code) for notifications or urgent communications.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CONTRACT MODIFICATIONS
              </h3>
              <p>
                Changes to bookings may be made up to 48 hours before the scheduled service time. Requests must be sent by email.
              </p>
              <p>
                One modification is allowed free of charge; subsequent changes incur a €10 fee.
                Modifications made within 24 hours of service time incur a €10 penalty and may require vehicle reassignment.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CANCELLATIONS
              </h3>
              <p>
                Cancellations must be requested in writing via email.
              </p>
              <p>Cancellation fees:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>100% if less than 24 hours before service.</li>
                <li>50% if between 24–48 hours before service.</li>
                <li>10% if more than 48 hours before service.</li>
              </ul>
              <p>
                If CHAUFFEURIO TRANSPORT S.L. must cancel for reasons beyond its control, a full refund will be provided.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                DRIVER'S WAITING TIMES
              </h3>
              <p>Free waiting times:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Airports: 60 minutes after landing.</li>
                <li>Ports: 60 minutes after ship arrival.</li>
                <li>Train/bus stations: 30 minutes after arrival.</li>
                <li>Hotels/homes: 15 minutes.</li>
              </ul>
              <p>
                If the customer does not appear within these times, the service will be cancelled without refund. Drivers will attempt to contact the customer before leaving.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                DELAYS AND CANCELLATIONS
              </h3>
              <p>
                Customers must inform CHAUFFEURIO TRANSPORT S.L. as soon as possible of any delays.
                If flights/trains are cancelled, customers may request a full refund by providing proof of cancellation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                MEETING POINT
              </h3>
              <p>
                Drivers will carry a sign with the passenger's or group's name. Meeting points are within the terminal or as agreed in the contract.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ADMISSION RIGHTS
              </h3>
              <p>
                Drivers may refuse or terminate service if passengers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Are under the influence of alcohol or drugs.</li>
                <li>Smoke, eat, or drink alcohol in the vehicle.</li>
                <li>Endanger the driver or passengers.</li>
                <li>Carry prohibited items.</li>
              </ul>
              <p>
                No refund will be provided in these cases.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                POINT-TO-POINT SERVICE
              </h3>
              <p>
                Drivers will take customers as close as possible to the destination.
                If customers choose an alternative route, additional fees may apply.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                BAGGAGE
              </h3>
              <p>
                Luggage must fit within the vehicle's capacity. Each sedan typically holds 2 large or 3 medium suitcases (max 40 kg total).
              </p>
              <p>
                CHAUFFEURIO TRANSPORT S.L. and its drivers are not responsible for luggage damage or loss. Customers must remove all belongings at the end of the trip.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                PETS
              </h3>
              <p>
                Pet transport is possible subject to prior notice and approval. If not properly declared or secured, service may be denied without refund.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                MINORS
              </h3>
              <p>
                Children must occupy a seat and use an approved child restraint system (CRS). Customers must request these in advance.
              </p>
              <p>
                Failure to declare minors may result in cancellation without refund.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CUSTOMER RESPONSIBILITIES
              </h3>
              <p>Customers must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verify booking details.</li>
                <li>Notify any changes or errors in advance.</li>
                <li>Supervise minors and companions.</li>
                <li>Accept that personal data will be shared with the driver for service purposes.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ESTIMATED TIME AND DISTANCE
              </h3>
              <p>
                Travel times are approximate. CHAUFFEURIO TRANSPORT S.L. is not responsible for delays caused by traffic, weather, or other uncontrollable factors.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                VEHICLE TYPE
              </h3>
              <p>
                Vehicle capacity is based on free passenger seats plus the driver. All vehicles are properly licensed and driven by professional drivers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                PUNCTUALITY GUARANTEE
              </h3>
              <p>
                Drivers will wait up to 30 minutes.
                If a driver arrives more than 30 minutes late (without just cause), CHAUFFEURIO TRANSPORT S.L. will refund 50% of the service fee.
                No compensation applies if the delay is due to external causes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                LIABILITY WAIVER
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. is not responsible for delays or cancellations due to events beyond its control (e.g., strikes, weather, roadblocks, accidents, etc.).
              </p>
              <p>
                Force majeure events do not entitle the customer to compensation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CLAIMS
              </h3>
              <p>
                Complaints must be submitted in writing within 15 days of service.
              </p>
              <p>
                CHAUFFEURIO TRANSPORT S.L. will respond within 15 days.
              </p>
              <p>
                Claims due to vehicle unavailability must be reported immediately at the scheduled pickup time.
              </p>
              <p>
                The company is only liable for administrative or financial errors directly attributable to its operations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                FEEDBACK
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. may contact customers after service completion to gather feedback and improve quality.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                GOVERNING LAW AND JURISDICTION
              </h3>
              <p>
                These terms and conditions are governed by Spanish law.
                Any disputes will be subject to the jurisdiction of the courts of Valencia, Spain.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                DATA PROTECTION
              </h3>
              <p>
                Under Spanish Data Protection Law (LOPDGDD) and the General Data Protection Regulation (GDPR), customers authorize CHAUFFEURIO TRANSPORT S.L. to process their personal data solely to provide transport services.
              </p>
              <p>
                Customers may exercise their rights of access, rectification, cancellation, or opposition by writing to info@chauffeurio.com.
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
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                LEGAL NOTICE AND DATA PROTECTION POLICY
              </h3>
              <p>
                In compliance with the reporting obligations contained in Article 10 of Law 34/2002 of July 11, on Services of the Information Society and Electronic Commerce, the following information is provided:
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                CONTACT INFORMATION
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mailbox: info@chauffeurio.com</li>
                <li>Phone: +34 614 014 277</li>
                <li>Website: www.chauffeurio.com</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                DATA PROTECTION POLICY
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. informs visitors and users of its website of its policy for the protection and processing of personal data, which shall apply if users decide to fill out any form on www.chauffeurio.com, where personal data may be collected — except as indicated in the privacy policy applicable to each particular form.
              </p>
              <p>
                In all cases, CHAUFFEURIO TRANSPORT S.L. guarantees full compliance with the obligations established by Organic Law 15/1999 of December 13 on Personal Data Protection, as well as those set forth in Royal Decree 994/1999, which approves the Regulation on Security Measures and other applicable regulations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                DATA FILE AND PURPOSE
              </h3>
              <p>
                The personal data provided by users or visitors will be included in an automated file under the responsibility of CHAUFFEURIO TRANSPORT S.L., with the purpose of facilitating access to the contents offered via the website; providing, managing, administering, expanding, and improving the services and/or content offered; adapting services to user preferences; studying service usage; managing incidents; maintaining the website; and conducting advertising and market research related to the products and services of CHAUFFEURIO TRANSPORT S.L.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                OBLIGATION TO PROVIDE DATA
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. informs users of their obligation or not to provide personal data requested in registration forms or when accessing certain services or content.
              </p>
              <p>
                Refusal to provide the requested data, or providing false or incomplete information, may result in faulty or incomplete service delivery.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                DATA TRANSFER AUTHORIZATION
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. may request users' express authorization to share their personal data with entities related to the company for the purpose of sending information and promotional material.
              </p>
              <p>
                Users may object to this either at the time of data collection or at any later time by sending an email to info@chauffeurio.com.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                POLICY MODIFICATIONS
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. reserves the right to modify this Privacy Policy to adapt it to legislative or regulatory changes or to instructions issued by the Spanish Data Protection Agency (AEPD). Users are encouraged to review this policy periodically.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                DATA USE
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. is fully aware of the use and treatment given to personal data collected from users of its websites. The company commits to process this data solely to manage requested services or send commercial communications about products or services that may be of interest to users.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                SECURITY MEASURES
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. will adopt all necessary technical and organizational measures to ensure the security of personal data and to prevent alteration, loss, or unauthorized access, in accordance with Royal Decree 994/1999 of July 11, approving the Regulation on Security Measures for automated files containing personal data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ACCURACY OF DATA
              </h3>
              <p>
                Users are responsible for the accuracy of the data provided and must notify CHAUFFEURIO TRANSPORT S.L. of any changes via info@chauffeurio.com, thereby exempting the company from any liability arising from inaccurate or outdated information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                USER RIGHTS
              </h3>
              <p>
                Users may exercise their rights of access, rectification, cancellation, and opposition (ARCO rights) by sending an email to info@chauffeurio.com.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                COMMERCIAL COMMUNICATIONS
              </h3>
              <p>
                CHAUFFEURIO TRANSPORT S.L. will not send unsolicited commercial messages or spam. Users may object to receiving commercial communications at any time by following the instructions provided in each email or by writing to info@chauffeurio.com.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                MINORS
              </h3>
              <p>
                Regarding data related to minors, CHAUFFEURIO TRANSPORT S.L. will not use such information for inappropriate purposes relative to the age of the child.
              </p>
              <p>
                The company will allow parents or guardians to exercise the rights of access, rectification, cancellation, and opposition regarding their children's data.
              </p>
              <p>
                If the user is under 14 years old, they must provide authorization from their legal representative consenting to the processing of their data by sending an email to info@chauffeurio.com.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                MOBILE APP - GEOLOCATION USAGE
              </h3>
              <p>
                Our chauffeur service application uses the device's geolocation function solely for the purpose of managing and supervising rides requested through the platform. This data is used to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Assign and optimize chauffeur services efficiently.</li>
                <li>Display the real-time location of the vehicle to provide estimated arrival times.</li>
                <li>Ensure the safety and traceability of each journey.</li>
              </ul>
              <p>
                The use of geolocation is limited strictly to the duration of the active ride. Once the trip is completed, the app stops collecting location data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                LOCATION DATA PROTECTION
              </h3>
              <p>
                Geolocation data is treated confidentially and processed according to applicable data protection regulations.
                We do not share your exact location with third parties except when necessary to provide the service or when legally required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                OPT-OUT OPTION
              </h3>
              <p>
                You may deactivate geolocation at any time from your device settings. However, disabling it may limit or prevent the proper operation of key app features such as ride management and assignment.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                WEBSITE OWNERSHIP
              </h3>
              <p>
                The owner of the website www.chauffeurio.com is CHAUFFEURIO TRANSPORT S.L., with NIF B-23849482.<br />
                Address: C/ Dama de Elche 26 P01 PTA03, 46023 Valencia (Spain)<br />
                © 2025 All rights reserved.
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
            <p>
              This Cookie Policy applies to www.chauffeurio.com.
              By accessing any of our websites, you agree that this Cookie Policy will apply each time you access the website from any device.
            </p>
            <p>
              All changes to this policy will be published here, and we reserve the right to modify it at any time. Continued use of our websites will be deemed acceptance of such changes.
            </p>
            <p>
              The date of the last update to this policy was: June 18, 2012. Please check periodically for new updates.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Our Use of Cookies
              </h3>
              <p>
                Like many companies, some (or all) of our websites may use "cookies" to determine, for example, how many users visit our sites and which pages they access.
                Cookies are text strings installed on your computer's hard drive when you visit certain websites.
              </p>
              <p>
                We may use cookies to identify whether you have visited us before or if it is your first time, and to help us understand which features of the website are most interesting to you. Cookies can enhance your online experience by remembering your preferences when visiting a specific site.
              </p>
              <p>
                If you would like more information about cookies, please visit www.aboutcookies.org.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Types of Cookies We Use
              </h3>
              <p><strong>Analytical Cookies</strong><br />
                These cookies help us improve our websites over time by providing information about how different sections of our websites are used and how users interact with them. The information collected is anonymous and used for statistical purposes only.
              </p>
              <p><strong>Authentication Cookies</strong><br />
                These cookies are used to individually identify visitors to our websites. When you log in to the site, these cookies allow us to remember who you are in order to give you access to your personal pages — for example, private or restricted areas, or pages that save your favorite selections or product comparisons.
              </p>
              <p><strong>Session Cookies</strong><br />
                These cookies are designed to ensure that your visit to our websites is as pleasant as possible. Their main functions include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Allowing us to recognize your device when you access the site, so that you are not considered a new visitor each time you navigate to another section.</li>
              </ul>
              <p>
                All information obtained through cookies is encrypted, and no data such as credit card numbers are collected through cookies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Managing Cookies
              </h3>
              <p>
                Most browsers will tell you how to refuse new cookies, how to receive notifications when new cookies are set, and how to disable existing cookies.
                However, please note that without cookies, you may not be able to take full advantage of all features of our website.
              </p>
              <p>
                Also note that we use a cookie to remember your cookie preferences, which implies a few consequences:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>If you delete all your cookies, you will need to update your preferences with us again.</li>
                <li>If you use a different device, computer profile, or browser, you will need to communicate your preferences to us again.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function TermsAndCondition() {
  return (
    <Suspense fallback={<Loading />}>
      <TermsAndConditionContent />
    </Suspense>
  );
}