import CheckoutStepper  from '../components/checkout/CheckoutStepper';
import CheckoutShipping from '../components/checkout/CheckoutShipping';
import CheckoutPayment  from '../components/checkout/CheckoutPayment';
import CheckoutReview   from '../components/checkout/CheckoutReview';
import OrderSummary     from '../components/checkout/OrderSummary';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../i18n/i18nContext';

const STEPS = ['Shipping', 'Payment', 'Review'];

const STEP_COMPONENTS = {
  0: CheckoutShipping,
  1: CheckoutPayment,
  2: CheckoutReview,
};

export default function Checkout() {
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState({});
  const { dark }    = useTheme();
  const { t, lang } = useI18n();
  const isRtl       = lang === 'ar';

  const next = (stepData) => {
    setData(d => ({ ...d, ...stepData }));
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const StepView = STEP_COMPONENTS[step];

  return (
    <main className="min-h-screen pt-4 pb-20 px-4 lg:px-16" style={{ background: dark ? '#111009' : '#f6f4f1' }}>

      {/* Page title */}
      <div className="max-w-[1200px] mx-auto mb-8">
        <h1 className="font-display font-light text-[#1a1612]"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}>
          {t('checkout.title')}
        </h1>
      </div>

      <div className="max-w-[1200px] mx-auto">
        {/* Stepper */}
        <CheckoutStepper steps={STEPS} current={step} />

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 mt-8">
          {/* Left — step form */}
          <div>
            <StepView data={data} onNext={next} onBack={back} isFirst={step === 0} />
          </div>

          {/* Right — order summary */}
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}
