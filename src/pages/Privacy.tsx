import React from 'react';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Privacy: React.FC = () => {
  const { t } = useLanguage();

  const handleContactPrivacy = () => {
    window.location.href = 'mailto:privacy@deplos.com';
  };

  const handleDataRequest = () => {
    alert('Data request form will be available here. Please contact privacy@deplos.com for now.');
  };

  const sections = [
    {
      title: t('privacy.collect.title'),
      content: [
        t('privacy.collect.1'),
        t('privacy.collect.2'),
        t('privacy.collect.3'),
        t('privacy.collect.4'),
        t('privacy.collect.5'),
      ],
    },
    {
      title: t('privacy.use.title'),
      content: [
        t('privacy.use.1'),
        t('privacy.use.2'),
        t('privacy.use.3'),
        t('privacy.use.4'),
        t('privacy.use.5'),
        t('privacy.use.6'),
      ],
    },
    {
      title: t('privacy.sharing.title'),
      content: [
        t('privacy.sharing.1'),
        t('privacy.sharing.2'),
        t('privacy.sharing.3'),
        t('privacy.sharing.4'),
      ],
    },
    {
      title: t('privacy.security.title'),
      content: [
        t('privacy.security.1'),
        t('privacy.security.2'),
        t('privacy.security.3'),
        t('privacy.security.4'),
        t('privacy.security.5'),
      ],
    },
    {
      title: t('privacy.rights.title'),
      content: [
        t('privacy.rights.1'),
        t('privacy.rights.2'),
        t('privacy.rights.3'),
        t('privacy.rights.4'),
        t('privacy.rights.5'),
      ],
    },
    {
      title: t('privacy.cookies.title'),
      content: [
        t('privacy.cookies.1'),
        t('privacy.cookies.2'),
        t('privacy.cookies.3'),
        t('privacy.cookies.4'),
        t('privacy.cookies.5'),
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
              <Shield className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('privacy.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('privacy.title')} <span className="gradient-text">{t('privacy.title.highlight')}</span> {t('privacy.title.end')}
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('privacy.description')}
            </p>
            
            <div className="text-sm text-white/60">
              {t('privacy.lastUpdated')}
            </div>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('privacy.principles.title')} <span className="gradient-text">{t('privacy.principles.title.highlight')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{t('privacy.principles.transparency.title')}</h3>
              <p className="text-white/70">
                {t('privacy.principles.transparency.description')}
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{t('privacy.principles.security.title')}</h3>
              <p className="text-white/70">
                {t('privacy.principles.security.description')}
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{t('privacy.principles.control.title')}</h3>
              <p className="text-white/70">
                {t('privacy.principles.control.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Sections */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="card">
                <h2 className="text-2xl font-bold text-white mb-6">{section.title}</h2>
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                      <p className="text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('privacy.cta.title')} <span className="gradient-text">{t('privacy.cta.title.highlight')}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t('privacy.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleContactPrivacy} className="btn-primary">
                {t('privacy.cta.contact')}
              </button>
              <button onClick={handleDataRequest} className="btn-secondary">
                {t('privacy.cta.request')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};