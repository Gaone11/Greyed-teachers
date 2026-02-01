import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, FileText, Clock, CheckCircle, Scale } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <LandingLayout>
      <NavBar />
      <div className="min-h-screen bg-greyed-white pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Scale className="w-12 h-12 text-greyed-blue mr-4" />
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-greyed-navy">
                Terms of Service
              </h1>
            </div>
            <p className="text-center text-greyed-navy/70 text-lg max-w-2xl mx-auto">
              Last Updated: November 2, 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8"
          >
            <section>
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Welcome to GreyEd, Inc. ("GreyEd," "we," "us," or "our"), a Delaware corporation with principal offices at 690 Saratoga Ave, San Jose, CA 95129. These Terms of Service ("Terms," "Agreement") constitute a legally binding agreement between you ("you," "your," "User," "Teacher," "Subscriber") and GreyEd governing your access to and use of the GreyEd platform, website, mobile applications, software, services, and all related features, content, and functionality (collectively, the "Services").
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    By accessing, browsing, registering for, or using any part of our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and our Refund Policy, which are incorporated herein by reference. If you do not agree to these Terms in their entirety, you must immediately discontinue all use of our Services and may not create an account or access any features of the platform.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    <strong>IMPORTANT:</strong> These Terms contain provisions that limit our liability to you and require you to resolve disputes with us through binding arbitration on an individual basis and not as part of any class or representative action. Please review Sections 15 (Limitation of Liability) and 16 (Dispute Resolution and Arbitration) carefully.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <CheckCircle className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    2. Eligibility and Account Requirements
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.1 Age Requirements
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You must be at least 18 years of age to create an account or use our Services. By creating an account, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are under 18, you may not use the Services without the supervision and consent of a parent or legal guardian who agrees to be bound by these Terms.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.2 Account Registration
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    To access certain features of the Services, you must create an account. During registration, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information to keep it accurate and current</li>
                    <li>Maintain the security and confidentiality of your account credentials</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>Accept responsibility for all activities that occur under your account</li>
                    <li>Use only one account unless explicitly authorized to maintain multiple accounts</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.3 Professional Verification
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Teachers and educational professionals may be required to verify their credentials, employment status, or professional licenses before accessing certain features. We reserve the right to request documentation to verify your identity, professional status, or eligibility at any time. Providing false information or fraudulent documentation may result in immediate account termination and legal action.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    3. Acceptable Use Policy
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.1 Permitted Uses
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You may use the Services only for lawful educational purposes consistent with these Terms. Permitted uses include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Accessing educational content and AI-powered teaching tools</li>
                    <li>Creating, managing, and organizing classroom materials and lesson plans</li>
                    <li>Communicating with authorized users through platform features</li>
                    <li>Generating assessments, assignments, and educational resources</li>
                    <li>Tracking academic progress and performance analytics</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.2 Prohibited Conduct
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You expressly agree NOT to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Violate any local, state, national, or international law or regulation</li>
                    <li>Infringe upon the intellectual property rights of GreyEd or any third party</li>
                    <li>Harass, abuse, threaten, or intimidate any other user or GreyEd personnel</li>
                    <li>Impersonate any person or entity or falsely represent your affiliation</li>
                    <li>Attempt to gain unauthorized access to any part of the Services, other accounts, or computer systems</li>
                    <li>Introduce viruses, malware, or any malicious code into the Services</li>
                    <li>Reverse engineer, decompile, disassemble, or derive source code from the Services</li>
                    <li>Use automated scripts, bots, scrapers, or data mining tools without express written permission</li>
                    <li>Interfere with, disrupt, or create an undue burden on the Services or networks</li>
                    <li>Circumvent, disable, or manipulate any security features or access controls</li>
                    <li>Share, sell, rent, lease, or transfer your account to any third party</li>
                    <li>Use the Services to distribute spam, chain letters, or unsolicited messages</li>
                    <li>Post or transmit any content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
                    <li>Collect or harvest personal information about other users without their consent</li>
                    <li>Use the Services for any commercial purpose not explicitly authorized</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.3 Content Standards
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    All content you create, upload, post, or transmit through the Services must comply with applicable laws and must not contain material that is defamatory, obscene, pornographic, hateful, discriminatory, or that promotes violence or illegal activities. We reserve the right to review, monitor, edit, or remove any content that violates these standards or these Terms.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Shield className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    4. Intellectual Property Rights
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.1 GreyEd's Proprietary Rights
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    The Services and all content, features, and functionality, including but not limited to all information, software, code, text, displays, graphics, photographs, video, audio, design, presentation, selection, and arrangement, are owned by GreyEd, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Subject to your compliance with these Terms, GreyEd grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Services for your personal, non-commercial educational purposes. This license does not include any right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Use, copy, reproduce, modify, or create derivative works of the Services or any content</li>
                    <li>Distribute, publish, transmit, or publicly display any part of the Services</li>
                    <li>Download or store any content except as expressly permitted</li>
                    <li>Use any proprietary algorithms, AI models, or machine learning systems independently</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.2 User-Generated Content
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You retain ownership of any original content you create using the Services, including lesson plans, assessments, classroom materials, and educational resources ("User Content"). However, by uploading, posting, or transmitting User Content through the Services, you grant GreyEd a worldwide, perpetual, irrevocable, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display such User Content in connection with operating, providing, improving, and marketing the Services.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.3 Trademarks
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    "GreyEd," the GreyEd logo, and all related names, logos, product and service names, designs, and slogans are trademarks of GreyEd, Inc. You may not use such marks without our prior written permission. All other names, logos, product and service names, designs, and slogans on the Services are the trademarks of their respective owners.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    5. Payment Terms and Subscription Services
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.1 Subscription Plans
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Access to certain features requires a paid subscription. By purchasing a subscription, you agree to pay all applicable fees, including subscription fees, taxes, and any other charges incurred in connection with your use of the Services. All fees are stated in U.S. Dollars unless otherwise indicated.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.2 Automatic Renewal
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Subscriptions automatically renew at the end of each billing period (monthly, quarterly, or annually) unless you cancel before the renewal date. You authorize us to charge your payment method for the renewal fee. Prices are subject to change upon 30 days' advance notice.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.3 Cancellation Policy
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of your current billing period. You will retain access to paid features until that date. No refunds are provided for partial subscription periods. Please review our comprehensive Refund Policy for complete details on payment terms and limited refund circumstances.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.4 Payment Processing
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    All payments are processed by third-party payment processors. By providing payment information, you authorize us and our payment processors to charge the designated payment method. You agree to maintain valid payment information and update it as necessary. Failed payments may result in service suspension or account termination.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Clock className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    6. Service Modifications and Availability
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.1 Right to Modify Services
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We reserve the right to modify, suspend, or discontinue any aspect of the Services at any time, with or without notice, for any reason. We may add, remove, or change features, functionality, pricing, or content at our sole discretion. We are not liable to you or any third party for any modification, suspension, or discontinuance of the Services.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.2 Service Availability
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We strive to maintain 99.5% uptime but do not guarantee that the Services will be available at all times or without interruption. The Services may be temporarily unavailable due to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Scheduled maintenance or emergency repairs</li>
                    <li>Technical difficulties or equipment failures</li>
                    <li>Internet service provider issues or telecommunications failures</li>
                    <li>Security incidents or cyberattacks</li>
                    <li>Events beyond our reasonable control (force majeure)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.3 Beta Features
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    We may offer beta, experimental, or early-access features that are clearly labeled as such. These features are provided "as is" without warranties of any kind and may contain errors, bugs, or limitations. We may modify or discontinue beta features at any time without notice. Your use of beta features is at your own risk.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Shield className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    7. Privacy and Data Protection
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.1 Privacy Policy
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Your privacy is important to us. Our collection, use, and disclosure of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Services, you consent to the collection and use of your information as described in our Privacy Policy.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.2 Educational Privacy Compliance
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We comply with applicable educational privacy laws, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li><strong>FERPA</strong> (Family Educational Rights and Privacy Act) for education records</li>
                    <li><strong>COPPA</strong> (Children's Online Privacy Protection Act) for children under 13</li>
                    <li><strong>GDPR</strong> (General Data Protection Regulation) for users in the European Union</li>
                    <li><strong>CCPA</strong> (California Consumer Privacy Act) for California residents</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.3 Data Security
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    We implement reasonable technical, administrative, and physical security measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute security. You acknowledge and accept the inherent risks of transmitting information over the internet.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    8. Account Termination and Suspension
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    8.1 Termination by You
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You may terminate your account at any time by following the account closure process in your settings or by contacting customer support. Upon termination, you will lose access to all Services and content associated with your account. We are not responsible for any loss of data resulting from account termination.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    8.2 Termination by GreyEd
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Violation of these Terms or any applicable law</li>
                    <li>Fraudulent, abusive, or illegal activity</li>
                    <li>Providing false or misleading information</li>
                    <li>Engaging in conduct that harms or could harm GreyEd or other users</li>
                    <li>Non-payment of fees or chargebacks</li>
                    <li>Prolonged inactivity</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    8.3 Effect of Termination
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Upon termination, your right to use the Services will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity obligations, and limitations of liability. Termination does not relieve you of any payment obligations incurred prior to termination.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    9. Third-Party Services and Links
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    The Services may contain links to third-party websites, applications, services, or resources that are not owned or controlled by GreyEd. We have no control over and assume no responsibility for the content, privacy policies, practices, or availability of any third-party sites or services. You acknowledge and agree that GreyEd is not responsible or liable for any damage or loss caused by or in connection with your use of any third-party content, goods, or services.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    We may integrate with third-party educational tools, learning management systems, payment processors, or analytics services. Your use of such third-party services is governed by their respective terms and conditions and privacy policies. We recommend reviewing these documents before using any third-party services through our platform.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    10. Disclaimers and Warranties
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    10.1 No Warranties
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    <strong>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, GREYED DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    10.2 Educational Outcomes
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    WE DO NOT GUARANTEE OR WARRANT:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Any specific educational outcomes, academic improvement, or learning results</li>
                    <li>That the Services will meet your requirements or be uninterrupted, secure, or error-free</li>
                    <li>That any errors or defects will be corrected</li>
                    <li>The accuracy, reliability, completeness, or timeliness of any content or information</li>
                    <li>That the Services will be compatible with all devices, browsers, or platforms</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    10.3 AI-Generated Content
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Content generated by artificial intelligence, including lesson plans, assessments, recommendations, and educational materials, is provided for informational and educational purposes only. AI-generated content may contain errors, inaccuracies, or inappropriate material. You are solely responsible for reviewing, validating, and determining the appropriateness of any AI-generated content before using it in an educational setting. We are not liable for any consequences resulting from the use of AI-generated content.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Shield className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    11. Limitation of Liability
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    <strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GREYED, ITS AFFILIATES, LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Your access to, use of, or inability to access or use the Services</li>
                    <li>Any conduct or content of any third party on the Services</li>
                    <li>Any content obtained from the Services</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                    <li>Errors, mistakes, or inaccuracies in content or AI-generated materials</li>
                    <li>Personal injury or property damage resulting from your use of the Services</li>
                    <li>Interruption or cessation of transmission to or from the Services</li>
                    <li>Bugs, viruses, trojan horses, or the like transmitted through the Services</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    <strong>IN NO EVENT SHALL GREYED'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICES EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO GREYED IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).</strong>
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitations may not apply to you. In such jurisdictions, our liability is limited to the maximum extent permitted by law.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    12. Indemnification
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed">
                    You agree to defend, indemnify, and hold harmless GreyEd, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Your violation of these Terms or any applicable law or regulation</li>
                    <li>Your violation of any rights of another person or entity</li>
                    <li>Your use or misuse of the Services</li>
                    <li>Your User Content or any content you post or transmit through the Services</li>
                    <li>Your breach of any representations or warranties made herein</li>
                    <li>Any negligent or wrongful conduct by you</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, in which event you will cooperate with us in asserting any available defenses.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Scale className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    13. Dispute Resolution and Arbitration
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    13.1 Informal Resolution
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Before filing a claim, you agree to contact us at legal@greyed.com and attempt to resolve the dispute informally by providing a written description of the dispute and your proposed resolution. We will have 60 days to respond and attempt to resolve the issue. If we cannot resolve the dispute within 60 days, either party may proceed with formal arbitration.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    13.2 Binding Arbitration
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    <strong>YOU AND GREYED AGREE THAT ANY DISPUTE, CLAIM, OR CONTROVERSY BETWEEN YOU AND GREYED ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES SHALL BE RESOLVED BY BINDING ARBITRATION ON AN INDIVIDUAL BASIS, EXCEPT AS PROVIDED BELOW.</strong>
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Arbitration will be conducted by a single arbitrator in accordance with the Commercial Arbitration Rules of the American Arbitration Association (AAA). The arbitration shall take place in Santa Clara County, California, unless otherwise agreed in writing. The arbitrator's decision will be final and binding and may be entered as a judgment in any court of competent jurisdiction.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    13.3 Class Action Waiver
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    <strong>YOU AND GREYED AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.</strong> Unless both parties agree otherwise, the arbitrator may not consolidate more than one person's claims and may not preside over any form of representative or class proceeding.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    13.4 Exceptions to Arbitration
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Either party may bring a claim in small claims court if it qualifies. Additionally, either party may seek equitable relief in court for infringement or misuse of intellectual property rights, confidential information, or proprietary rights.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    14. Governing Law and Jurisdiction
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed">
                    These Terms and your use of the Services shall be governed by and construed in accordance with the laws of the State of California and the federal laws of the United States, without regard to conflict of law principles. To the extent arbitration does not apply, you agree to submit to the personal and exclusive jurisdiction of the state and federal courts located in Santa Clara County, California. You waive any objection to venue in these courts and any claim that such courts are an inconvenient forum.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Clock className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    15. Changes to Terms
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We reserve the right to modify, amend, or update these Terms at any time at our sole discretion. When we make changes, we will update the "Last Updated" date at the top of this page and, for material changes, we may provide additional notice such as sending you an email notification or displaying a prominent notice on the Services.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Your continued use of the Services after the effective date of any changes constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the Services and may close your account. It is your responsibility to review these Terms periodically for changes.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    16. General Provisions
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    16.1 Entire Agreement
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and GreyEd regarding the Services and supersede all prior agreements, understandings, and communications, whether written or oral.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    16.2 Severability
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    16.3 Waiver
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    No waiver of any term or condition of these Terms shall be deemed a continuing waiver or a waiver of any other term or condition. Our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    16.4 Assignment
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You may not assign, transfer, or delegate these Terms or your rights and obligations hereunder without our prior written consent. We may freely assign, transfer, or delegate these Terms and our rights and obligations hereunder. These Terms are binding upon and inure to the benefit of the parties and their respective successors and permitted assigns.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    16.5 Force Majeure
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    16.6 Contact Information
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    If you have questions about these Terms, please contact us at:
                  </p>
                  <div className="bg-greyed-beige/20 p-6 rounded-lg mt-4">
                    <p className="text-greyed-navy">
                      <strong>GreyEd, Inc.</strong><br />
                      Legal Department<br />
                      690 Saratoga Ave<br />
                      San Jose, CA 95129<br />
                      United States
                    </p>
                    <p className="text-greyed-navy mt-3">
                      <strong>Email:</strong> legal@greyed.com<br />
                      <strong>Support:</strong> support@greyed.com
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="bg-greyed-navy/5 p-6 rounded-lg">
                <h3 className="font-semibold text-greyed-navy mb-3">Acknowledgment</h3>
                <p className="text-greyed-navy/80 text-sm leading-relaxed">
                  BY USING THE SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT ACCESS OR USE THE SERVICES. These Terms constitute a legally binding agreement between you and GreyEd, Inc.
                </p>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
      <Footer />
    </LandingLayout>
  );
};

export default TermsOfServicePage;
