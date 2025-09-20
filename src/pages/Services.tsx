import React from 'react';
import { Server, Shield, Zap, Globe, Monitor, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const Services: React.FC = () => {
  const { t } = useLanguage();

  const handleGetStarted = () => {
    window.open('https://client.deplos.com', '_blank', 'noopener,noreferrer');
  };

  const services = [
    {
      icon: Server,
      title: t('services.hosting.title'),
      description: t('services.hosting.description'),
      features: [
        t('services.hosting.feature1'),
        t('services.hosting.feature2'),
        t('services.hosting.feature3'),
        t('services.hosting.feature4'),
      ],
      popular: true,
    },
    {
      icon: Shield,
      title: t('services.protection.title'),
      description: t('services.protection.description'),
      features: [
        t('services.protection.feature1'),
        t('services.protection.feature2'),
        t('services.protection.feature3'),
        t('services.protection.feature4'),
      ],
      popular: false,
    },
    {
      icon: Globe,
      title: t('services.network.title'),
      description: t('services.network.description'),
      features: [
        t('services.network.feature1'),
        t('services.network.feature2'),
        t('services.network.feature3'),
        t('services.network.feature4'),
      ],
      popular: false,
    },
    {
      icon: Monitor,
      title: t('services.panel.title'),
      description: t('services.panel.description'),
      features: [
        t('services.panel.feature1'),
        t('services.panel.feature2'),
        t('services.panel.feature3'),
        t('services.panel.feature4'),
      ],
      popular: false,
    },
    {
      icon: Zap,
      title: t('services.optimization.title'),
      description: t('services.optimization.description'),
      features: [
        t('services.optimization.feature1'),
        t('services.optimization.feature2'),
        t('services.optimization.feature3'),
        t('services.optimization.feature4'),
      ],
      popular: false,
    },
    {
      icon: Headphones,
      title: t('services.support247.title'),
      description: t('services.support247.description'),
      features: [
        t('services.support247.feature1'),
        t('services.support247.feature2'),
        t('services.support247.feature3'),
        t('services.support247.feature4'),
      ],
      popular: false,
    },
  ];

  const gameSupport = [
    { name: 'Minecraft', logo: '🎮', description: t('services.games.minecraft') },
    { name: 'CS:GO', logo: '🔫', description: t('services.games.csgo') },
    { name: 'Rust', logo: '⚔️', description: t('services.games.rust') },
    { name: 'Garry\'s Mod', logo: '🛠️', description: t('services.games.gmod') },
    { name: 'ARK', logo: '🦕', description: t('services.games.ark') },
    { name: 'Valheim', logo: '⚡', description: t('services.games.valheim') },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-gray-900/20" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
              <Server className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('services.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('services.title')} <span className="gradient-text">{t('services.title.highlight')}</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('services.description')}
            </p>
            
            <button onClick={handleGetStarted} className="btn-primary">
              {t('services.getStarted')}
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className={`card ${service.popular ? 'ring-2 ring-white' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
                      {t('pricing.mostPopular')}
                    </div>
                  </div>
                )}
                
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="h-6 w-6 text-black" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">{service.title}</h3>
                <p className="text-white/70 mb-6">{service.description}</p>
                
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Support */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('services.games.title')} <span className="gradient-text">{t('services.games.title.highlight')}</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('services.games.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameSupport.map((game, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{game.logo}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{game.name}</h3>
                <p className="text-white/70 text-sm">{game.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('services.why.title')} <span className="gradient-text">{t('services.why.title.highlight')}</span>
            </h2>
          </div>

          <div className="card max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">{t('services.why.subtitle')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold">{t('services.why.setup.title')}</h4>
                      <p className="text-white/70 text-sm">{t('services.why.setup.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold">{t('services.why.security.title')}</h4>
                      <p className="text-white/70 text-sm">{t('services.why.security.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold">{t('services.why.infrastructure.title')}</h4>
                      <p className="text-white/70 text-sm">{t('services.why.infrastructure.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Headphones className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold">{t('services.why.support.title')}</h4>
                      <p className="text-white/70 text-sm">{t('services.why.support.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <img
                  src="https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Gaming Setup"
                  className="w-full h-64 object-cover rounded-lg grayscale"
                />
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
              {t('services.cta.title')} <span className="gradient-text">{t('services.cta.title.highlight')}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t('services.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleGetStarted} className="btn-primary">
                {t('services.cta.trial')}
              </button>
              <Link to="/pricing" className="btn-secondary">
                {t('services.cta.pricing')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};