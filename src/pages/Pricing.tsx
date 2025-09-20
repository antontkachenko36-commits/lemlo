import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Pricing: React.FC = () => {
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
        '90% CPU Performance',
        '1800MB RAM',
        '5GB SSD Storage',
        'Low Priority Support',
        'Basic DDoS Protection',
        'Community Discord Access',
        'Standard Network Speed',
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
        '110% CPU Performance',
        '2400MB RAM',
        '10GB SSD Storage',
        'Medium Priority Support',
        'Advanced DDoS Protection',
        'Private Location Access',
        'Enhanced Network Speed',
        'Automated Backups',
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
        '130% CPU Performance',
        '3000MB RAM',
        '15GB NVMe SSD Storage',
        'High Priority Support',
        'Premium DDoS Protection',
        'Private Location Access',
        'VIP Chat Access',
        'Fast NVMe SSD',
        'Priority Network Routing',
        'Custom Server Configurations',
      ],
      popular: false,
    },
  ];

  const plans = pricingPlans.length > 0 ? pricingPlans : fallbackPlans;

  const addons = [
    { name: t('pricing.addons.ram'), price: '$2/month' },
    { name: t('pricing.addons.storage'), price: '$3/month' },
    { name: t('pricing.addons.support'), price: '$5/month' },
    { name: t('pricing.addons.domain'), price: '$1/month' },
  ];

  const faqs = [
    {
      question: t('pricing.faq.q1'),
      answer: t('pricing.faq.a1'),
    },
    {
      question: t('pricing.faq.q2'),
      answer: t('pricing.faq.a2'),
    },
    {
      question: t('pricing.faq.q3'),
      answer: t('pricing.faq.a3'),
    },
    {
      question: t('pricing.faq.q4'),
      answer: t('pricing.faq.a4'),
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-gray-900/20" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('pricing.page.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('pricing.page.title')} <span className="gradient-text">{t('pricing.page.title.highlight')}</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('pricing.page.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative card ${plan.popular ? 'ring-2 ring-white scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">
                      {t('pricing.mostPopular')}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-black" />
                  </div>
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

      {/* Add-ons Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('pricing.addons.title')} <span className="gradient-text">{t('pricing.addons.title.highlight')}</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('pricing.addons.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {addons.map((addon, index) => (
              <div key={index} className="card text-center">
                <h3 className="text-lg font-semibold text-white mb-2">{addon.name}</h3>
                <p className="text-2xl font-bold gradient-text">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('pricing.faq.title')} <span className="gradient-text">{t('pricing.faq.title.highlight')}</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-white mb-4">{faq.question}</h3>
                <p className="text-white/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};