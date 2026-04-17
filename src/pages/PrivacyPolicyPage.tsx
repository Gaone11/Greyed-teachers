import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText, AlertCircle, CheckCircle, Globe } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <LandingLayout>
      <NavBar />
      <div className="min-h-screen bg-greyed-white pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Lock className="w-12 h-12 text-greyed-blue mr-4" />
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-greyed-navy">
                Privacy Policy
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
                    1. Introduction and Scope
                  </h2>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    GreyEd ("Cophetsheni," "we," "us," or "our"), located in Mpumalanga Province, Republic of South Africa, is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy ("Policy") explains how we collect, use, disclose, store, and protect information about you when you access or use our Siyafunda educational technology platform, website, mobile applications, and related services (collectively, the "Services").
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    This Policy applies to all users of our Services, including teachers, educational professionals, administrators, and visitors. By accessing or using our Services, you acknowledge that you have read, understood, and agree to the collection, use, and disclosure of your information as described in this Policy.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    We are committed to compliance with applicable privacy laws, including the Protection of Personal Information Act 4 of 2013 (POPIA), the South African Schools Act 84 of 1996, the Children's Act 38 of 2005, and the Consumer Protection Act 68 of 2008.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Eye className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    2. Information We Collect
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.1 Information You Provide Directly
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We collect information that you voluntarily provide when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li><strong>Create an Account:</strong> Name, email address, school or institution name, professional role, grade level taught, subject areas, and profile information</li>
                    <li><strong>Use Our Services:</strong> Lesson plans, educational materials, assessments, classroom notes, teaching preferences, curriculum choices, and custom content you create</li>
                    <li><strong>Make Payments:</strong> Billing information, payment method details (processed securely by third-party payment processors), and transaction history</li>
                    <li><strong>Contact Us:</strong> Name, email address, phone number, and the content of your communications when you reach out for support or inquiries</li>
                    <li><strong>Complete Surveys or Assessments:</strong> Responses to questionnaires, feedback forms, personality assessments, learning style evaluations, and research studies</li>
                    <li><strong>Participate in Community Features:</strong> Forum posts, comments, shared resources, and collaborative content</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.2 Information Collected Automatically
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    When you access or use our Services, we automatically collect certain information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li><strong>Device Information:</strong> Device type, operating system, browser type and version, unique device identifiers, mobile network information</li>
                    <li><strong>Usage Information:</strong> Pages viewed, features accessed, time spent on pages, click patterns, navigation paths, search queries, and interaction with content</li>
                    <li><strong>Log Data:</strong> IP address, access times, browser type, referring/exit pages, and crash reports</li>
                    <li><strong>Location Information:</strong> General geographic location derived from IP address (we do not collect precise GPS location without explicit consent)</li>
                    <li><strong>Cookies and Similar Technologies:</strong> Information collected through cookies, web beacons, pixels, and local storage (see Section 3)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.3 Information from Third Parties
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We may receive information about you from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li><strong>School or District Partners:</strong> Roster information, account setup data, and institutional affiliations when your school subscribes to our Services</li>
                    <li><strong>Authentication Providers:</strong> If you use single sign-on (SSO) services, we receive basic profile information</li>
                    <li><strong>Analytics and Service Providers:</strong> Aggregated usage statistics and performance metrics from our technology partners</li>
                    <li><strong>Publicly Available Sources:</strong> Professional credentials, institutional affiliations, and publicly listed contact information for verification purposes</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.4 Sensitive Information
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    We do not intentionally collect special personal information as defined in POPIA, such as South African identity numbers, financial account numbers, health information, or information about racial or ethnic origin, political opinions, religious beliefs, or biometric data, except when explicitly provided for specific purposes with your consent and as permitted by law.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    3. Cookies and Tracking Technologies
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.1 Types of Cookies We Use
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li><strong>Essential Cookies:</strong> Required for basic functionality, authentication, and security features</li>
                    <li><strong>Performance Cookies:</strong> Help us understand how visitors use our Services by collecting aggregated analytics</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences, settings, and customization choices</li>
                    <li><strong>Targeting/Advertising Cookies:</strong> Used to deliver relevant marketing content (you can opt out of these)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.2 Managing Cookies
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. However, disabling cookies may limit your ability to use certain features of our Services. You can also use browser extensions or privacy tools to manage tracking technologies.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.3 Third-Party Analytics
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    We use third-party analytics services to help us understand usage patterns and improve our Services. These services may collect information about your use of our Services and other websites or apps. We use aggregated analytics data to make informed decisions about product development and user experience improvements.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <CheckCircle className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    4. How We Use Your Information
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We use the information we collect for the following purposes:
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.1 Providing and Improving Services
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Create, maintain, and secure your account</li>
                    <li>Deliver the features and functionality of the Services</li>
                    <li>Process transactions and send transaction confirmations</li>
                    <li>Provide customer support and respond to your inquiries</li>
                    <li>Personalize your experience and customize content recommendations</li>
                    <li>Develop new features, products, and services</li>
                    <li>Improve, test, and monitor the effectiveness of our Services</li>
                    <li>Diagnose and fix technology problems</li>
                    <li>Generate and analyze usage statistics and performance metrics</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.2 AI and Machine Learning
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Train and improve AI models and algorithms to enhance educational recommendations</li>
                    <li>Personalize AI-generated content, lesson plans, and assessments based on your teaching preferences</li>
                    <li>Analyze learning patterns to improve educational outcomes</li>
                    <li>Develop and refine natural language processing capabilities for better AI interactions</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.3 Communication and Marketing
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Send service-related announcements, updates, and security alerts</li>
                    <li>Provide educational resources, tips, and best practices</li>
                    <li>Send promotional materials, newsletters, and marketing communications (you may opt out)</li>
                    <li>Conduct surveys and request feedback</li>
                    <li>Invite you to participate in research studies or beta programs</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.4 Safety, Security, and Compliance
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Protect against fraud, abuse, and security threats</li>
                    <li>Monitor and prevent prohibited or illegal activities</li>
                    <li>Enforce our Terms of Service and other policies</li>
                    <li>Comply with legal obligations and respond to legal requests</li>
                    <li>Protect the rights, property, and safety of GreyEd, our users, and the public</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.5 Research and Analytics
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Conduct educational research and generate insights about teaching and learning</li>
                    <li>Create aggregated, de-identified, or anonymized data for research, analytics, and reporting</li>
                    <li>Publish research findings and educational insights (without personally identifiable information)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Globe className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    5. How We Share Your Information
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We do not sell your personal information to third parties. We may share your information in the following circumstances:
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.1 With Your Consent
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We may share your information when you provide explicit consent or direction to do so, such as when you choose to share content publicly or collaborate with other users.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.2 Service Providers and Partners
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We share information with third-party service providers who perform services on our behalf, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Cloud hosting and data storage providers</li>
                    <li>Payment processors and billing services</li>
                    <li>Email and communication platforms</li>
                    <li>Analytics and performance monitoring services</li>
                    <li>Customer support and help desk software</li>
                    <li>Security and fraud prevention services</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    These service providers are contractually required to protect your information, use it only for the purposes we specify, and comply with applicable privacy laws.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.3 Educational Institutions
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    If your school or district has a subscription agreement with us, we may share relevant usage data, progress reports, and performance analytics with authorized school administrators and educational personnel as permitted by POPIA, the South African Schools Act, and other applicable laws.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.4 Legal Obligations and Protection
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We may disclose your information when required by law or when we believe in good faith that disclosure is necessary to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Comply with legal obligations, court orders, subpoenas, or government requests</li>
                    <li>Enforce our Terms of Service and other agreements</li>
                    <li>Protect the rights, property, and safety of GreyEd, our users, or the public</li>
                    <li>Detect, prevent, or address fraud, security, or technical issues</li>
                    <li>Respond to claims that content violates the rights of others</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.5 Business Transfers
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    If GreyEd is involved in a merger, acquisition, reorganization, transfer of assets, or similar institutional transaction, your information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on our Services of any change in ownership or use of your personal information.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.6 Aggregated and De-Identified Data
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    We may share aggregated, de-identified, or anonymized information that cannot reasonably be used to identify you for research, marketing, analytics, or other business purposes. This data does not constitute personal information under privacy laws.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Lock className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    6. Data Security and Retention
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.1 Security Measures
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We implement appropriate technical, administrative, and physical security measures designed to protect your information from unauthorized access, disclosure, alteration, and destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Encryption of data in transit using TLS/SSL protocols</li>
                    <li>Encryption of sensitive data at rest</li>
                    <li>Regular security assessments and penetration testing</li>
                    <li>Access controls and authentication requirements</li>
                    <li>Employee training on data protection and security best practices</li>
                    <li>Incident response and breach notification procedures</li>
                    <li>Regular backups and disaster recovery planning</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.2 Data Retention
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We retain your information for as long as necessary to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Provide the Services and fulfill the purposes described in this Policy</li>
                    <li>Comply with legal, regulatory, or contractual obligations</li>
                    <li>Resolve disputes and enforce our agreements</li>
                    <li>Maintain business records and analytics</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    When you close your account, we retain your information for 90 days for account recovery purposes. After 90 days, we delete or anonymize your personal information, except for information we must retain for legal, tax, audit, or regulatory compliance purposes. Aggregated and de-identified data may be retained indefinitely.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.3 Account Security
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately of any unauthorized access or use of your account. We are not liable for any loss or damage arising from your failure to protect your account information.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Shield className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    7. Your Privacy Rights and Choices
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.1 Access and Correction
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You can access, review, and update your account information at any time by logging into your account settings. If you need assistance accessing or correcting your information, please contact us at privacy@cophetsheni.edu.za.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.2 Data Portability
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You have the right to request a copy of your personal information in a structured, commonly used, and machine-readable format. We will provide this information within 30 days of your request, subject to verification of your identity.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.3 Deletion Rights
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You have the right to request deletion of your personal information, subject to certain exceptions required by law or legitimate business purposes. To request deletion, please contact us at privacy@cophetsheni.edu.za. We will respond within 30 days.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.4 Marketing Communications
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You may opt out of receiving promotional emails by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Clicking the "unsubscribe" link in any promotional email</li>
                    <li>Adjusting your email preferences in your account settings</li>
                    <li>Contacting us at support@cophetsheni.edu.za</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Please note that even if you opt out of marketing communications, we will still send you service-related messages, such as transaction confirmations, account notifications, and security alerts.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.5 Do Not Track
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Some browsers have a "Do Not Track" feature that lets you tell websites not to track your online activities. We currently do not respond to Do Not Track signals because there is no industry standard for how to interpret these signals.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    8. Children's Privacy (POPIA and Children's Act Compliance)
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Our Services are not directed to children under the age of 18 without the involvement of a competent person (parent, guardian, or school), and we do not knowingly collect personal information from children without verified parental or guardian consent as required by POPIA and the Children's Act 38 of 2005.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    If a school or parent/guardian provides consent for a child to use our Services, we collect and use the child's information only for educational purposes as authorized by the school or parent/guardian. We do not use children's information for targeted advertising or direct marketing.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    If we learn that we have collected personal information from a child without proper consent, we will delete that information as quickly as possible. If you believe we have collected information from a child without consent, please contact us immediately at privacy@cophetsheni.edu.za.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    9. Data Subject Rights Under POPIA
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    As a data subject under the Protection of Personal Information Act (POPIA), you have the following rights:
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    9.1 Right to Access
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You have the right to request confirmation of whether we hold personal information about you, and to request access to and a description of such personal information, including the categories of recipients who have or will receive the information.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    9.2 Right to Correction or Deletion
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You have the right to request the correction or deletion of your personal information that is inaccurate, irrelevant, excessive, out of date, incomplete, misleading, or obtained unlawfully.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    9.3 Right to Object to Processing
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You have the right to object to the processing of your personal information for purposes of direct marketing or where the processing causes or is likely to cause you damage or distress.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    9.4 Right to Lodge a Complaint
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You have the right to lodge a complaint with the Information Regulator (South Africa) if you believe your personal information has been processed in violation of POPIA. The Information Regulator can be contacted at: inforeg@justice.gov.za.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    9.5 Exercising Your Rights
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    To exercise your POPIA rights, please contact us at privacy@cophetsheni.edu.za or call +27 (0)13 XXX XXXX. We will verify your identity before processing your request and respond within a reasonable time. You may designate an authorised representative to make requests on your behalf by providing written authorisation.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Globe className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    10. Cross-Border Data Transfers
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Under POPIA, personal information may only be transferred outside of South Africa if certain conditions are met. We ensure compliance with POPIA Section 72 for any cross-border transfers of personal information:
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    10.1 Legal Basis for Processing
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We process your personal information based on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li><strong>Contract Performance:</strong> To provide the Services you have requested</li>
                    <li><strong>Legitimate Interests:</strong> To improve our Services, prevent fraud, and ensure security</li>
                    <li><strong>Consent:</strong> When you have provided explicit consent for specific processing activities</li>
                    <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    10.2 Your Rights Under POPIA
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Under POPIA, you have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Access your personal information held by us</li>
                    <li>Request correction of inaccurate or incomplete information</li>
                    <li>Request deletion of your information where applicable</li>
                    <li>Object to the processing of your personal information</li>
                    <li>Request a copy of your personal information in a readable format</li>
                    <li>Withdraw consent at any time</li>
                    <li>Lodge a complaint with the Information Regulator (South Africa)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    10.3 Data Transfers
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Your information may be transferred to and processed in countries outside the Republic of South Africa where we or our service providers operate. We ensure appropriate safeguards are in place in accordance with POPIA Section 72, including ensuring that the recipient country has adequate data protection laws or that binding agreements are in place. For more information about our data transfer mechanisms, please contact privacy@cophetsheni.edu.za.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    11. Changes to This Privacy Policy
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Update the "Last Updated" date at the top of this Policy</li>
                    <li>Send you an email notification (if you have provided your email address)</li>
                    <li>Display a prominent notice on our Services</li>
                    <li>Request your consent where required by law</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Your continued use of the Services after the effective date of the revised Policy constitutes your acceptance of the changes. We encourage you to review this Policy periodically to stay informed about how we protect your information.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Shield className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    12. Contact Information
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-4">
                    If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                  </p>

                  <div className="bg-greyed-beige/20 p-6 rounded-lg space-y-3">
                    <p className="text-greyed-navy">
                      <strong>GreyEd</strong><br />
                      Privacy Department<br />
                      Mpumalanga Province<br />
                      Republic of South Africa
                    </p>
                    <p className="text-greyed-navy">
                      <strong>Email:</strong> privacy@cophetsheni.edu.za<br />
                      <strong>Support:</strong> support@cophetsheni.edu.za<br />
                      <strong>Phone:</strong> +27 (0)13 XXX XXXX
                    </p>
                    <p className="text-greyed-navy/70 text-sm mt-4">
                      For POPIA-related inquiries, please include "POPIA Request" in your subject line.<br />
                      For data subject access requests, please include "Data Subject Request" in your subject line.
                    </p>
                  </div>

                  <div className="mt-6 p-4 bg-greyed-blue/10 border border-greyed-blue/30 rounded-lg">
                    <p className="text-greyed-navy text-sm">
                      <strong>Information Officer:</strong> For privacy matters requiring escalation, you may contact our Information Officer at privacy@cophetsheni.edu.za. You may also contact the Information Regulator at inforeg@justice.gov.za.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="bg-greyed-navy/5 p-6 rounded-lg">
                <h3 className="font-semibold text-greyed-navy mb-3">Acknowledgment and Consent</h3>
                <p className="text-greyed-navy/80 text-sm leading-relaxed">
                  By using our Services, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, disclosure, and processing of your information as described herein. If you do not agree with this Policy, please do not use our Services. For users in jurisdictions requiring explicit consent, we will obtain your consent before processing your personal information for specific purposes.
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

export default PrivacyPolicyPage;
