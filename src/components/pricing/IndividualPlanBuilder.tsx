import React, { useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Link as LinkIcon,
  MessageSquare,
  Sparkles,
  UserRound,
  UsersRound
} from 'lucide-react';
import { BillingContext } from '../../context/BillingContext';
import { MotionContext } from '../../context/MotionContext';
import {
  IndividualPricingRole,
  individualRoleOptions
} from '../../data/individualPricingData';
import { useAuth } from '../../context/AuthContext';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import { useNavigate } from 'react-router-dom';

const yearlyDiscount = 0.83;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2
});

const IndividualPlanBuilder: React.FC = () => {
  const { billingPeriod } = useContext(BillingContext);
  const { enabled } = useContext(MotionContext);
  const { user } = useAuth();
  const { openRoleSelection } = useRoleSelection();
  const navigate = useNavigate();
  const [selectedRoleId, setSelectedRoleId] = useState<IndividualPricingRole>('student');
  const [selectedFeatures, setSelectedFeatures] = useState<Record<IndividualPricingRole, string[]>>({
    student: ['student-ai-study', 'student-knowledge'],
    tutor: ['tutor-referral-links', 'tutor-ai-planning']
  });

  const selectedRole = individualRoleOptions.find((role) => role.id === selectedRoleId) ?? individualRoleOptions[0];
  const selectedFeatureIds = selectedFeatures[selectedRoleId];
  const selectedFeatureItems = selectedRole.features.filter((feature) => selectedFeatureIds.includes(feature.id));
  const monthlyTotal = selectedFeatureItems.reduce(
    (total, feature) => total + feature.monthlyPriceGBP,
    selectedRole.baseMonthlyPriceGBP
  );
  const billedTotal = billingPeriod === 'monthly' ? monthlyTotal : monthlyTotal * 12 * yearlyDiscount;
  const monthlyEquivalent = billingPeriod === 'monthly' ? monthlyTotal : billedTotal / 12;

  const connectionSteps = useMemo(() => {
    if (selectedRoleId === 'tutor') {
      return [
        'Create your tutor hub and choose the tools you need.',
        'Share your referral link with students or let students select you in GreyEd.',
        'Each connected student hub links back to your roster, messages, assignments, and updates.'
      ];
    }

    return [
      'Create your student hub and choose your study features.',
      'Select a tutor from GreyEd or open a referral link from your tutor.',
      'Your hub connects to the tutor workspace so support, progress, and assignments stay together.'
    ];
  }, [selectedRoleId]);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((current) => {
      const roleFeatures = current[selectedRoleId];
      const nextRoleFeatures = roleFeatures.includes(featureId)
        ? roleFeatures.filter((id) => id !== featureId)
        : [...roleFeatures, featureId];

      return {
        ...current,
        [selectedRoleId]: nextRoleFeatures
      };
    });
  };

  const handleStart = () => {
    if (user) {
      navigate(selectedRoleId === 'tutor' ? '/teachers/dashboard' : '/students/dashboard');
      return;
    }

    openRoleSelection('signup');
  };

  const content = (
    <div className="container mx-auto px-4">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center rounded-full bg-greyed-blue/30 px-4 py-2 text-sm font-semibold text-greyed-navy">
          <Sparkles size={16} className="mr-2" />
          Individual student and tutor pricing
        </span>
        <h2 className="mt-4 text-2xl md:text-3xl font-headline font-bold text-greyed-navy">
          Customise your account before you pay
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-greyed-navy/70">
          Choose whether you are joining as a student or tutor, select the features for your hub, and see the estimated price update instantly.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-xl border border-greyed-navy/10 bg-white p-5 shadow-md md:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2" role="tablist" aria-label="Choose account type">
            {individualRoleOptions.map((role) => {
              const isSelected = role.id === selectedRoleId;
              const Icon = role.id === 'student' ? UserRound : UsersRound;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`rounded-lg border p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-greyed-blue ${
                    isSelected
                      ? 'border-greyed-navy bg-greyed-navy text-greyed-white'
                      : 'border-greyed-navy/10 bg-greyed-white/60 text-greyed-navy hover:border-greyed-blue'
                  }`}
                  role="tab"
                  aria-selected={isSelected}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Icon className={isSelected ? 'text-greyed-blue' : 'text-greyed-navy'} size={24} />
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isSelected ? 'bg-greyed-blue text-greyed-navy' : 'bg-greyed-blue/30 text-greyed-navy'
                    }`}>
                      {role.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-xl font-headline font-bold">{role.label}</h3>
                  <p className={`mt-2 text-sm ${isSelected ? 'text-greyed-white/80' : 'text-greyed-navy/70'}`}>
                    {role.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg bg-greyed-white/70 p-4">
              <h3 className="font-headline text-lg font-bold text-greyed-navy">
                Included in your {selectedRole.label.toLowerCase()} base
              </h3>
              <p className="mt-1 text-sm text-greyed-navy/70">
                Starts at {currencyFormatter.format(selectedRole.baseMonthlyPriceGBP)} per month.
              </p>
              <ul className="mt-4 space-y-3">
                {selectedRole.included.map((item) => (
                  <li key={item} className="flex items-start text-sm text-greyed-black/80">
                    <Check size={16} className="mr-2 mt-0.5 flex-shrink-0 text-greyed-navy" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-headline text-lg font-bold text-greyed-navy">
                Select optional features
              </h3>
              <div className="mt-3 space-y-3">
                {selectedRole.features.map((feature) => {
                  const isChecked = selectedFeatureIds.includes(feature.id);

                  return (
                    <label
                      key={feature.id}
                      className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-greyed-blue ${
                        isChecked
                          ? 'border-greyed-blue bg-greyed-blue/20'
                          : 'border-greyed-navy/10 bg-white hover:border-greyed-blue/70'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFeature(feature.id)}
                        className="sr-only"
                      />
                      <span className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                        isChecked ? 'border-greyed-navy bg-greyed-navy text-greyed-blue' : 'border-greyed-navy/30 bg-white'
                      }`}>
                        {isChecked && <Check size={14} aria-hidden="true" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-greyed-navy">{feature.name}</span>
                          {feature.recommended && (
                            <span className="rounded-full bg-greyed-navy px-2 py-0.5 text-xs font-semibold text-greyed-blue">
                              Recommended
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-sm text-greyed-black/70">
                          {feature.description}
                        </span>
                      </span>
                      <span className="flex-shrink-0 text-sm font-bold text-greyed-navy">
                        +{currencyFormatter.format(feature.monthlyPriceGBP)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-xl bg-greyed-navy p-5 text-greyed-white shadow-lg md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-greyed-blue">
                Estimated price
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-x-2">
                <span className="text-4xl font-headline font-bold">
                  {currencyFormatter.format(billedTotal)}
                </span>
                <span className="pb-1 text-sm text-greyed-white/70">
                  {billingPeriod === 'monthly' ? '/month' : '/year'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="mt-2 text-sm text-greyed-blue">
                  Equivalent to {currencyFormatter.format(monthlyEquivalent)} per month with yearly billing.
                </p>
              )}
            </div>
            <div className="rounded-lg bg-greyed-blue/15 p-3">
              <LinkIcon size={24} className="text-greyed-blue" />
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-white/10 p-4">
            <div className="flex items-center gap-2 text-greyed-blue">
              <MessageSquare size={18} />
              <h3 className="font-headline font-bold text-greyed-white">Linked hubs</h3>
            </div>
            <ol className="mt-4 space-y-3">
              {connectionSteps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-greyed-white/80">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-greyed-blue text-xs font-bold text-greyed-navy">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 border-t border-white/15 pt-5">
            <h3 className="font-headline font-bold">Your selected setup</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span>{selectedRole.label} base</span>
                <span className="font-semibold">{currencyFormatter.format(selectedRole.baseMonthlyPriceGBP)}/mo</span>
              </div>
              {selectedFeatureItems.map((feature) => (
                <div key={feature.id} className="flex justify-between gap-4 text-greyed-white/75">
                  <span>{feature.name}</span>
                  <span className="font-semibold">+{currencyFormatter.format(feature.monthlyPriceGBP)}/mo</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="mt-6 flex w-full items-center justify-center rounded-full bg-greyed-blue px-5 py-3 font-semibold text-greyed-navy hover:bg-greyed-white focus:outline-none focus:ring-2 focus:ring-greyed-blue focus:ring-offset-2 focus:ring-offset-greyed-navy"
          >
            {user ? 'Open your dashboard' : 'Start with this setup'}
            <ArrowRight size={18} className="ml-2" />
          </button>
          <p className="mt-3 text-center text-xs text-greyed-white/60">
            Final checkout pricing may vary when taxes, promotions, or organisation agreements apply.
          </p>
        </aside>
      </div>
    </div>
  );

  return (
    <section className="bg-greyed-white py-12 snap-start">
      {enabled ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </section>
  );
};

export default IndividualPlanBuilder;
