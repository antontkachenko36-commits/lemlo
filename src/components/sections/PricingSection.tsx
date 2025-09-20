import React from 'react';
import { Check, Star } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const PricingSection: React.FC = () => {
  const { pricingPlans } = useAdmin();
  const { t } = useLanguage();
  
  const handleGetStarted = () => {
    window.open('https://client.deplos.com', '_blank', 'noopener,noreferrer');
  };

  // Fallback plans if no plans are available
  const fallbackPlans = [
    {
      id: 'fallback-1',
      name: 'Free',
      price: '0',
      period: 'Forever',
      description: 'Perfect for testing and small communities',
      features: [
        '90% CPU',
        '1800MB RAM',
        '5GB SSD Storage',
        'Low Priority Support',
        'Basic DDoS Protection',
      ],
      popular: false,
    },
    {
      id: 'fallback-2',
      name: 'Mini',
      price: '5',
      period: 'per month',
      description: 'Great for growing communities',
      features: [
        '110% CPU',
        '2400MB RAM',
        '10GB SSD Storage',
        'Medium Priority Support',
        'Advanced DDoS Protection',
        'Private Location Access',
      ],
      popular: true,
    },
    {
      id: 'fallback-3',
      name: 'Alpha',
      price: '15',
      period: 'per month',
      description: 'Ultimate performance for large servers',
      features: [
        '130% CPU',
        '3000MB RAM',
        '15GB SSD Storage',
        'High Priority Support',
        'Premium DDoS Protection',
        'Private Location Access',
        'VIP Chat Access',
        'Fast NVMe SSD',
      ],
      popular: false,
    },
  ];

  const plans = pricingPlans.length > 0 ? pricingPlans : fallbackPlans;

  return (
    <section id="pricing" className="section-padding relative pattern-dots">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/80" />
      
      <div className="container-custom relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6 border border-white/20">
            <Star className="h-4 w-4 text-white" />
            <span className="text-sm text-white/80">{t('pricing.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('pricing.title')}{' '}
            <span className="gradient-text">{t('pricing.title.highlight')}</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {t('pricing.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative card ${plan.popular ? 'ring-2 ring-white scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="accent-element text-black px-4 py-1 rounded-full text-sm font-semibold">
                    {t('pricing.mostPopular')}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/60 ml-2">{plan.period}</span>
                </div>
                <p className="text-white/70">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-white flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGetStarted}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {t('pricing.getStarted')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};