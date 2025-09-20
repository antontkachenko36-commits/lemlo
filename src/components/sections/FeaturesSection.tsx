import React from 'react';
import { Monitor, Users, Shield, Zap, Globe, Headphones } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Monitor,
      title: t('features.controlPanel.title'),
      description: t('features.controlPanel.description'),
    },
    {
      icon: Users,
      title: t('features.partnership.title'),
      description: t('features.partnership.description'),
    },
    {
      icon: Shield,
      title: t('features.ddos.title'),
      description: t('features.ddos.description'),
    },
    {
      icon: Zap,
      title: t('features.instant.title'),
      description: t('features.instant.description'),
    },
    {
      icon: Globe,
      title: t('features.global.title'),
      description: t('features.global.description'),
    },
    {
      icon: Headphones,
      title: t('features.support.title'),
      description: t('features.support.description'),
    },
  ];

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6 border border-white/20">
            <Zap className="h-4 w-4 text-white" />
            <span className="text-sm text-white/80">{t('features.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('features.title')} <span className="gradient-text">{t('features.title.highlight')}</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card group">
              <div className="mb-6">
                <div className="w-12 h-12 accent-element rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-black" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};