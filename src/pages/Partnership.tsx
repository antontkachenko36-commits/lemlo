import React, { useState } from 'react';
import { Users, DollarSign, Trophy, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PartnershipForm } from '../components/forms/PartnershipForm';

export const Partnership: React.FC = () => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  const handleApply = () => {
    setShowForm(true);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: t('partnership.benefits.revenue.title'),
      description: t('partnership.benefits.revenue.description'),
    },
    {
      icon: Trophy,
      title: t('partnership.benefits.rewards.title'),
      description: t('partnership.benefits.rewards.description'),
    },
    {
      icon: Users,
      title: t('partnership.benefits.support.title'),
      description: t('partnership.benefits.support.description'),
    },
    {
      icon: Star,
      title: t('partnership.benefits.marketing.title'),
      description: t('partnership.benefits.marketing.description'),
    },
  ];

  const requirements = [
    t('partnership.requirements.1'),
    t('partnership.requirements.2'),
    t('partnership.requirements.3'),
    t('partnership.requirements.4'),
    t('partnership.requirements.5'),
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-gray-900/20" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('partnership.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('partnership.title')} <span className="gradient-text">{t('partnership.title.highlight')}</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('partnership.description')}
            </p>
            
            <button onClick={handleApply} className="btn-primary flex items-center space-x-2 mx-auto">
              <span>{t('partnership.apply')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('partnership.benefits.title')} <span className="gradient-text">{t('partnership.benefits.title.highlight')}</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('partnership.benefits.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{benefit.title}</h3>
                <p className="text-white/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('partnership.requirements.title')} <span className="gradient-text">{t('partnership.requirements.title.highlight')}</span>
              </h2>
              <p className="text-xl text-white/70">
                {t('partnership.requirements.description')}
              </p>
            </div>

            <div className="card">
              <h3 className="text-2xl font-semibold text-white mb-8 text-center">{t('partnership.requirements.subtitle')}</h3>
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-white/80 text-lg">{requirement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('partnership.cta.title')} <span className="gradient-text">{t('partnership.cta.title.highlight')}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t('partnership.cta.description')}
            </p>
            <button onClick={handleApply} className="btn-primary flex items-center space-x-2 mx-auto">
              <span>{t('partnership.cta.button')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Partnership Form Modal */}
      {showForm && (
        <PartnershipForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};