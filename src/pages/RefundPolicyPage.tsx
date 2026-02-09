import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import { Container } from '../components/ui/Container';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, FileText, Clock, CheckCircle } from 'lucide-react';

const RefundPolicyPage: React.FC = () => {
  return (
    <LandingLayout>
      <NavBar />
      <div className="min-h-screen bg-greyed-white pt-24 pb-16">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-greyed-blue mr-4" />
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-greyed-navy">
                Refund Policy
              </h1>
            </div>
            <p className="text-center text-greyed-navy/70 text-lg max-w-2xl mx-auto">
              Last Updated: October 20, 2025
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
                    1. Overview and Scope
                  </h2>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    This Refund Policy ("Policy") governs all payment transactions and refund requests made through Cophetsheni Primary School ("Cophetsheni," "we," "us," or "our"), a public school located in Mpumalanga Province, Republic of South Africa. This Policy applies to all users, subscribers, customers, educational institutions, and business entities ("you," "your," or "User") who purchase, subscribe to, or otherwise engage with our Siyafunda educational technology platform and services.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    By accessing or using Cophetsheni Primary School's Siyafunda services, creating an account, making a payment, or accepting these terms through any means, you acknowledge that you have read, understood, and agree to be bound by this Policy in its entirety. If you do not agree with any provision of this Policy, you must immediately cease using our services and refrain from making any payments.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    2. Consumer Platform Services - No Refund Policy
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.1 Strict No Refund Policy
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    <strong>ALL PAYMENTS FOR CONSUMER PLATFORM SERVICES ARE FINAL AND NON-REFUNDABLE.</strong> This includes, but is not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Individual student subscriptions (monthly, quarterly, or annual)</li>
                    <li>Premium tier upgrades and feature unlocks</li>
                    <li>One-time purchases of educational content, courses, or materials</li>
                    <li>AI tutoring session packages and credits</li>
                    <li>Assessment and testing services</li>
                    <li>Study planner and organizational tools</li>
                    <li>Any add-on features, services, or digital products</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.2 Justification for No Refund Policy
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Our no refund policy is justified by the following factors:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li><strong>Immediate Access:</strong> Upon payment, you receive immediate and unrestricted access to our platform, AI technologies, proprietary algorithms, educational content, and digital resources. Once access is granted, the value has been delivered and cannot be returned.</li>
                    <li><strong>Digital Nature:</strong> Our services are entirely digital and intangible. Unlike physical goods, digital services cannot be "returned" once accessed, downloaded, or utilized.</li>
                    <li><strong>Resource Allocation:</strong> Substantial computational resources, AI processing power, server infrastructure, and personalized algorithm training are allocated to each user account immediately upon activation.</li>
                    <li><strong>Intellectual Property:</strong> Our platform contains proprietary educational methodologies, AI models, curriculum design, and learning frameworks that represent significant intellectual property value delivered instantly.</li>
                    <li><strong>Free Trial Availability:</strong> We offer free trials, demo accounts, or limited access periods that allow prospective users to evaluate our services before committing to a paid subscription.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.3 Subscription Management
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    While we do not offer refunds, you may cancel your subscription at any time to prevent future charges. Please note:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Cancellation takes effect at the end of your current billing period</li>
                    <li>You retain access to paid features until the end of your subscription period</li>
                    <li>No partial refunds are provided for unused time in a billing cycle</li>
                    <li>No refunds are provided for mid-cycle cancellations</li>
                    <li>Reactivation of a cancelled subscription is treated as a new purchase</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    2.4 Acknowledgment of Terms
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    By proceeding with any payment, you expressly acknowledge and agree that: (a) you have read and understood this no refund policy; (b) you accept that all payments are final; (c) you waive any right to chargeback, dispute, or refund request except as required by applicable law; (d) you have had adequate opportunity to evaluate our services through free trials or demonstrations; and (e) you are making an informed decision to purchase our services.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <CheckCircle className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    3. B2B and Enterprise Services - Payment Structure and Limited Refund Eligibility
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.1 Three-Stage Payment Structure
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Business-to-Business ("B2B") and Enterprise engagements, including but not limited to institutional licenses, school district partnerships, corporate training programs, and custom integration projects, follow a milestone-based payment structure:
                  </p>

                  <div className="bg-greyed-beige/20 p-6 rounded-lg mb-4">
                    <h4 className="font-semibold text-greyed-navy mb-3">Payment Schedule:</h4>
                    <ul className="space-y-3 text-greyed-navy/80">
                      <li className="flex items-start">
                        <span className="font-bold mr-2">Stage 1:</span>
                        <span><strong>60% Initial Deposit</strong> - Due upon contract execution and before any services commence. This deposit is <strong>NON-REFUNDABLE</strong> under all circumstances.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">Stage 2:</span>
                        <span><strong>20% Progress Payment</strong> - Due at agreed milestone (typically 30-60 days after project initiation or upon delivery of Phase 1 deliverables). This payment is refundable only within 7 calendar days of the transfer date, subject to conditions outlined in Section 3.3.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">Stage 3:</span>
                        <span><strong>20% Final Payment</strong> - Due upon project completion, final delivery, or go-live date. This payment is <strong>NON-REFUNDABLE</strong> once services are delivered.</span>
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.2 Non-Refundable Initial Deposit (60%)
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    The 60% initial deposit is non-refundable because it covers:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Project scoping, requirements analysis, and discovery phase work</li>
                    <li>Custom development, platform configuration, and infrastructure setup</li>
                    <li>Dedicated team allocation and resource reservation</li>
                    <li>Initial training materials, documentation, and onboarding preparation</li>
                    <li>Legal, administrative, and contractual processing costs</li>
                    <li>Opportunity cost of declining other potential clients</li>
                    <li>Third-party licensing fees, API costs, and vendor commitments made on your behalf</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Once the initial deposit is paid, these resources are immediately committed and cannot be recovered, regardless of project cancellation, client dissatisfaction, or any other circumstance. No portion of the 60% deposit will be refunded under any conditions, including but not limited to force majeure events, client-initiated termination, breach of contract, or mutual agreement to discontinue services.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.3 Limited Refund Window for Progress Payment (20%)
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    The 20% progress payment may be eligible for refund ONLY if all of the following conditions are met:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li><strong>Timing:</strong> Refund request must be submitted in writing within 7 calendar days from the date the progress payment was received by Cophetsheni Primary School. This deadline is absolute and cannot be extended.</li>
                    <li><strong>Documented Deficiency:</strong> Client must provide detailed written documentation demonstrating material failure to meet agreed-upon milestones, deliverables, or performance standards as explicitly defined in the service agreement.</li>
                    <li><strong>Good Faith Effort:</strong> Client must demonstrate good faith efforts to work with Cophetsheni Primary School to resolve issues through our standard support and escalation channels before requesting a refund.</li>
                    <li><strong>No Material Use:</strong> Client must not have materially implemented, deployed, or utilized the services, features, or deliverables associated with the progress payment milestone.</li>
                    <li><strong>Mutual Agreement:</strong> Refund is subject to mutual written agreement between Cophetsheni Primary School and the Client regarding the specific deficiencies and remediation attempts.</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    After the 7-day window expires, the progress payment becomes non-refundable regardless of circumstances. Cophetsheni Primary School reserves the sole and absolute discretion to approve or deny any refund request, even if the above conditions are met.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.4 Refund Processing for Approved B2B Requests
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    If a refund request for the 20% progress payment is approved:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Refunds will be issued to the original payment method within 30 business days of written approval</li>
                    <li>Processing fees, transaction costs, and administrative fees (up to 5% of the payment amount) may be deducted from the refund</li>
                    <li>All access to Siyafunda services, platforms, APIs, and resources will be immediately terminated</li>
                    <li>Any work product, deliverables, code, documentation, or materials provided must be destroyed and cannot be retained or used</li>
                    <li>Client agrees to execute a mutual release of claims as a condition of receiving the refund</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    3.5 Project Cancellation or Early Termination
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    If a B2B project is cancelled or terminated by either party for any reason:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>All payments received prior to cancellation are non-refundable</li>
                    <li>Client remains responsible for payment of any invoiced amounts for work completed</li>
                    <li>Client must pay for any third-party costs, vendor fees, or committed expenses incurred on their behalf</li>
                    <li>No refunds will be provided for anticipated future value, projected savings, or expected outcomes</li>
                    <li>Cophetsheni Primary School retains all intellectual property rights to any work product, code, or materials developed</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Clock className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    4. Exceptions and Special Circumstances
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.1 Billing Errors and Technical Failures
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    In the rare event of a verified billing error, duplicate charge, or technical processing failure directly attributable to Cophetsheni Primary School's systems:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Confirmed duplicate charges will be refunded in full within 10 business days</li>
                    <li>Billing errors caused by incorrect pricing display or system malfunction will be corrected</li>
                    <li>You must report suspected billing errors within 60 days of the charge date</li>
                    <li>Cophetsheni Primary School will conduct a thorough investigation and provide written findings</li>
                    <li>Billing disputes do not exempt you from paying undisputed amounts</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.2 Service Unavailability and Platform Outages
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Cophetsheni Primary School strives to maintain 99.5% uptime but does not guarantee uninterrupted service availability. In cases of extended service outages:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>No refunds will be provided for brief outages, scheduled maintenance, or routine service interruptions</li>
                    <li>For documented outages exceeding 72 consecutive hours that prevent all platform access, Cophetsheni Primary School may, at its sole discretion, provide service credits (not cash refunds) equivalent to the pro-rated daily value of the affected subscription period</li>
                    <li>Service credits must be requested in writing within 15 days of the outage resolution</li>
                    <li>Service credits are applied to future subscription periods and cannot be redeemed for cash</li>
                    <li>Outages caused by circumstances beyond our reasonable control (see Section 6.3) are excluded</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.3 Unauthorized Transactions and Account Security
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    If you believe your account has been compromised or charges were made without your authorization:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Immediately notify Cophetsheni Primary School in writing at support@cophetsheni.edu.za</li>
                    <li>Provide detailed information about the unauthorized activity</li>
                    <li>Cooperate fully with our security investigation</li>
                    <li>If we verify unauthorized access, refunds may be issued for fraudulent charges</li>
                    <li>You are responsible for maintaining account security and may be liable for charges made before reporting the issue</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    4.4 Legal and Regulatory Requirements
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Nothing in this Policy limits your statutory rights under applicable consumer protection laws. In jurisdictions where refund restrictions are prohibited or limited by law, this Policy will be interpreted to comply with such requirements to the minimum extent necessary. If any provision of this Policy is deemed unenforceable in your jurisdiction, it shall be severed without affecting the enforceability of remaining provisions.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    5. Payment Terms and Conditions
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.1 Payment Methods and Processing
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    We accept major credit cards, debit cards, EFT (Electronic Funds Transfer), and other payment methods as displayed at checkout. By providing payment information, you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Represent that you are authorized to use the payment method</li>
                    <li>Authorize us to charge the payment method for all fees and applicable taxes</li>
                    <li>Authorize us to store payment information for recurring billing</li>
                    <li>Agree to update payment information if it changes or expires</li>
                    <li>Acknowledge that third-party payment processors may charge additional fees</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.2 Automatic Renewal and Recurring Billing
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Subscription services automatically renew at the end of each billing period unless cancelled:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Your payment method will be automatically charged at the then-current subscription rate</li>
                    <li>Prices are subject to change with 30 days advance notice</li>
                    <li>Failed payments may result in service suspension or account termination</li>
                    <li>You are responsible for any overdraft fees, declined payment fees, or other bank charges</li>
                    <li>We may retry failed payments multiple times before suspending service</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.3 Taxes and Fees
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    All prices are exclusive of applicable taxes unless otherwise stated. You are responsible for all sales taxes, use taxes, value-added taxes (VAT), goods and services taxes (GST), and other governmental charges, fees, or assessments imposed by any jurisdiction. If we are required to collect such taxes, they will be added to your invoice. Taxes are non-refundable even if the underlying service charge becomes eligible for refund under limited circumstances.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    5.4 Currency and Exchange Rates
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    All prices are stated in South African Rand (ZAR) unless otherwise specified. If you pay in a different currency, the conversion rate applied by your financial institution or payment processor will determine the final charge. Cophetsheni Primary School is not responsible for currency conversion fees, exchange rate fluctuations, or international transaction fees imposed by your bank or payment provider.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Shield className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    6. Dispute Resolution and Legal Protection
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.1 Internal Dispute Resolution Process
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Before initiating any formal dispute or chargeback, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Contact Cophetsheni Primary School support at support@cophetsheni.edu.za with a detailed description of the issue</li>
                    <li>Provide us with at least 30 days to investigate and respond to your concern</li>
                    <li>Engage in good faith negotiations to reach a mutually acceptable resolution</li>
                    <li>Escalate unresolved issues to our administration at info@cophetsheni.edu.za</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.2 Chargebacks and Payment Disputes
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Initiating a chargeback or payment dispute without first attempting to resolve the issue with Cophetsheni Primary School may result in:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Immediate suspension or termination of your account and all services</li>
                    <li>Loss of access to all data, content, and materials associated with your account</li>
                    <li>Reporting to credit bureaus or collection agencies for unpaid fees</li>
                    <li>Legal action to recover owed amounts plus collection costs, attorney fees, and damages</li>
                    <li>Prohibition from creating new accounts or accessing Siyafunda services in the future</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    If a chargeback is filed, Cophetsheni Primary School will provide evidence to the financial institution demonstrating that services were properly delivered and charges were authorized. You acknowledge that chargebacks are inappropriate for services that were delivered as promised, and you may be liable for chargeback fees and related costs.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.3 Force Majeure and Limitation of Liability
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Cophetsheni Primary School shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Acts of God, natural disasters, pandemics, or public health emergencies</li>
                    <li>War, terrorism, civil unrest, or government actions</li>
                    <li>Internet service provider failures, telecommunications outages, or power failures</li>
                    <li>Cyberattacks, hacking attempts, DDoS attacks, or other malicious activities</li>
                    <li>Third-party service provider failures or breaches</li>
                    <li>Labor disputes, strikes, or shortage of qualified personnel</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    In no event shall Cophetsheni Primary School's total liability to you for all claims arising from or related to this Policy or our services exceed the total amount you paid to Cophetsheni Primary School in the twelve (12) months preceding the claim. We are not liable for any indirect, incidental, consequential, special, exemplary, or punitive damages.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.4 Dispute Resolution
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Any dispute, controversy, or claim arising out of or relating to this Policy shall be resolved in accordance with the laws of the Republic of South Africa. You may lodge a complaint with the National Consumer Commission under the Consumer Protection Act 68 of 2008, or refer the dispute to the Magistrate's Court or the High Court of South Africa (Mpumalanga Division), as applicable.
                  </p>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Nothing in this Policy limits your statutory rights under the Consumer Protection Act 68 of 2008 or any other applicable South African legislation. You retain all rights afforded to consumers under South African law.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    6.5 Governing Law and Jurisdiction
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    This Policy shall be governed by and construed in accordance with the laws of the Republic of South Africa. You agree to submit to the jurisdiction of the courts of the Republic of South Africa, specifically the Magistrate's Court or the High Court of South Africa (Mpumalanga Division), as applicable.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    7. Account Termination and Data Retention
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.1 Voluntary Account Cancellation
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    You may cancel your account at any time through your account settings or by contacting support. Upon cancellation:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Your subscription will remain active until the end of the current billing period</li>
                    <li>No refunds will be provided for the remaining subscription period</li>
                    <li>You will lose access to premium features at the end of the billing period</li>
                    <li>Your data will be retained according to our Privacy Policy and data retention schedule</li>
                    <li>Reactivation may require paying any outstanding balances</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.2 Account Termination by Cophetsheni Primary School
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Cophetsheni Primary School reserves the right to suspend or terminate your account immediately if you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Violate our Terms of Service or Acceptable Use Policy</li>
                    <li>Provide false, inaccurate, or misleading information</li>
                    <li>Engage in fraudulent activity or payment disputes</li>
                    <li>Abuse our services, systems, or support staff</li>
                    <li>Fail to pay amounts owed within specified timeframes</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Termination by Cophetsheni Primary School for cause does not entitle you to any refund of fees paid. You remain liable for all charges incurred prior to termination, including any early termination fees specified in your agreement.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    7.3 Data Deletion and Recovery
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    After account termination, your data will be retained for a period of 90 days for recovery purposes. After 90 days, data may be permanently deleted and cannot be recovered. Cophetsheni Primary School is not responsible for data loss resulting from account termination or cancellation. You are responsible for exporting any data you wish to retain before cancelling your account.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    8. Policy Modifications and Updates
                  </h2>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    8.1 Right to Modify Policy
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    Cophetsheni Primary School reserves the right to modify, amend, or replace this Refund Policy at any time at our sole discretion. Changes may be made to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>Comply with legal or regulatory requirements</li>
                    <li>Reflect changes in our business practices or service offerings</li>
                    <li>Address new payment methods or billing structures</li>
                    <li>Improve clarity, organization, or user understanding</li>
                    <li>Protect Cophetsheni Primary School's legitimate interests</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    8.2 Notification of Changes
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed mb-3">
                    When we make material changes to this Policy:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-greyed-navy/80 mb-4">
                    <li>We will update the "Last Updated" date at the top of this page</li>
                    <li>We may notify you via email to the address associated with your account</li>
                    <li>We may display a prominent notice on our website or platform</li>
                    <li>For B2B customers, we will provide written notice per the terms of your service agreement</li>
                  </ul>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    Your continued use of Siyafunda services after changes become effective constitutes acceptance of the revised Policy. If you do not agree to the changes, you must cancel your account before the effective date of the changes.
                  </p>

                  <h3 className="text-xl font-semibold text-greyed-navy mb-2 mt-4">
                    8.3 Effective Date and Application
                  </h3>
                  <p className="text-greyed-navy/80 leading-relaxed">
                    This Policy is effective as of the date stated at the top of this page and applies to all payments made on or after that date. For payments made before the effective date, the refund policy in effect at the time of payment shall govern to the extent required by law.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="flex items-start mb-4">
                <Shield className="w-6 h-6 text-greyed-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-3">
                    9. Contact Information and Support
                  </h2>

                  <p className="text-greyed-navy/80 leading-relaxed mb-4">
                    If you have questions about this Refund Policy, billing inquiries, or need to request a refund under the limited circumstances where refunds may be available, please contact us:
                  </p>

                  <div className="bg-greyed-beige/20 p-6 rounded-lg space-y-3">
                    <p className="text-greyed-navy">
                      <strong>Cophetsheni Primary School</strong><br />
                      Mpumalanga Province<br />
                      Republic of South Africa
                    </p>
                    <p className="text-greyed-navy">
                      <strong>Email Support:</strong><br />
                      General Inquiries: info@cophetsheni.edu.za<br />
                      Support: support@cophetsheni.edu.za<br />
                      Privacy: privacy@cophetsheni.edu.za
                    </p>
                    <p className="text-greyed-navy">
                      <strong>Phone:</strong> +27 (0)13 XXX XXXX
                    </p>
                    <p className="text-greyed-navy/70 text-sm mt-4">
                      Support hours: Monday-Friday, 08:00 - 16:00 SAST (excluding public holidays)
                    </p>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-900 text-sm">
                      <strong>Important Notice:</strong> Before contacting payment processors or financial institutions to dispute charges, we strongly encourage you to contact Cophetsheni Primary School support directly. Many billing concerns can be resolved quickly through direct communication, and initiating chargebacks without contacting us may result in account termination and additional fees.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-greyed-navy/10 pt-8">
              <div className="bg-greyed-navy/5 p-6 rounded-lg">
                <h3 className="font-semibold text-greyed-navy mb-3">Acknowledgment</h3>
                <p className="text-greyed-navy/80 text-sm leading-relaxed">
                  By using Cophetsheni Primary School's Siyafunda services and making any payment, you acknowledge that you have read, understood, and agree to be bound by this Refund Policy. You further acknowledge that this Policy has been made available to you prior to purchase, you have had adequate opportunity to review it, and you accept the terms including the no-refund provisions for consumer services and the limited refund provisions for B2B services. This Policy forms an integral part of your agreement with Cophetsheni Primary School and should be read in conjunction with our Terms of Service and Privacy Policy.
                </p>
              </div>
            </section>
          </motion.div>
        </Container>
      </div>
      <Footer />
    </LandingLayout>
  );
};

export default RefundPolicyPage;
