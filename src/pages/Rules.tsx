import React from 'react';
import { Shield, AlertTriangle, Users, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const Rules: React.FC = () => {
  const { t } = useLanguage();

  const handleContactSupport = () => {
    window.open('https://discord.gg/deplos', '_blank', 'noopener,noreferrer');
  };

  const sections = [
    {
      icon: Shield,
      title: t('rules.general.title'),
      rules: [
        t('rules.general.1'),
        t('rules.general.2'),
        t('rules.general.3'),
        t('rules.general.4'),
        t('rules.general.5'),
      ],
    },
    {
      icon: AlertTriangle,
      title: t('rules.prohibited.title'),
      rules: [
        t('rules.prohibited.1'),
        t('rules.prohibited.2'),
        t('rules.prohibited.3'),
        t('rules.prohibited.4'),
        t('rules.prohibited.5'),
      ],
    },
    {
      icon: Users,
      title: t('rules.usage.title'),
      rules: [
        t('rules.usage.1'),
        t('rules.usage.2'),
        t('rules.usage.3'),
        t('rules.usage.4'),
        t('rules.usage.5'),
      ],
    },
    {
      icon: Gavel,
      title: t('rules.enforcement.title'),
      rules: [
        t('rules.enforcement.1'),
        t('rules.enforcement.2'),
        t('rules.enforcement.3'),
        t('rules.enforcement.4'),
        t('rules.enforcement.5'),
      ],
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
              <Gavel className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('rules.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('rules.title')} <span className="gradient-text">{t('rules.title.highlight')}</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('rules.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Rules Sections */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="card">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                      <p className="text-white/80">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="card max-w-4xl mx-auto border-l-4 border-white">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{t('rules.notice.title')}</h3>
                <div className="space-y-4 text-white/80">
                  <p>{t('rules.notice.p1')}</p>
                  <p>{t('rules.notice.p2')}</p>
                  <p>{t('rules.notice.p3')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('rules.cta.title')} <span className="gradient-text">{t('rules.cta.title.highlight')}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t('rules.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/support" className="btn-primary">
                {t('rules.cta.support')}
              </Link>
              <button onClick={handleContactSupport} className="btn-secondary">
                {t('rules.cta.discord')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};