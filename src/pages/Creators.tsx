import React, { useState } from 'react';
import { Video, Users, Star, Gift, ArrowRight, Youtube, Twitch } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CreatorForm } from '../components/forms/CreatorForm';

export const Creators: React.FC = () => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  const handleApply = () => {
    setShowForm(true);
  };

  const handleViewGuidelines = () => {
    alert('Creator guidelines will be displayed here. Please contact support for detailed guidelines.');
  };

  const benefits = [
    {
      icon: Gift,
      title: t('creators.benefits.credits.title'),
      description: t('creators.benefits.credits.description'),
    },
    {
      icon: Star,
      title: t('creators.benefits.priority.title'),
      description: t('creators.benefits.priority.description'),
    },
    {
      icon: Users,
      title: t('creators.benefits.community.title'),
      description: t('creators.benefits.community.description'),
    },
    {
      icon: Video,
      title: t('creators.benefits.collaboration.title'),
      description: t('creators.benefits.collaboration.description'),
    },
  ];

  const requirements = [
    t('creators.requirements.1'),
    t('creators.requirements.2'),
    t('creators.requirements.3'),
    t('creators.requirements.4'),
    t('creators.requirements.5'),
  ];

  const creators = [
    {
      name: 'GamerPro123',
      platform: 'YouTube',
      subscribers: '50K',
      content: 'Minecraft tutorials and server reviews',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'StreamQueen',
      platform: 'Twitch',
      subscribers: '25K',
      content: 'Live gaming streams and community events',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'TechGamer',
      platform: 'YouTube',
      subscribers: '100K',
      content: 'Server setup guides and gaming tech reviews',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
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
              <Video className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('creators.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('creators.title')} <span className="gradient-text">{t('creators.title.highlight')}</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('creators.description')}
            </p>
            
            <button onClick={handleApply} className="btn-primary flex items-center space-x-2 mx-auto">
              <span>{t('creators.apply')}</span>
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
              {t('creators.benefits.title')} <span className="gradient-text">{t('creators.benefits.title.highlight')}</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('creators.benefits.description')}
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

      {/* Featured Creators */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('creators.featured.title')} <span className="gradient-text">{t('creators.featured.title.highlight')}</span>
            </h2>
            <p className="text-xl text-white/70">
              {t('creators.featured.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creators.map((creator, index) => (
              <div key={index} className="card">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover grayscale"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{creator.name}</h3>
                    <div className="flex items-center space-x-2">
                      {creator.platform === 'YouTube' ? (
                        <Youtube className="h-4 w-4 text-white" />
                      ) : (
                        <Twitch className="h-4 w-4 text-white" />
                      )}
                      <span className="text-white/60">{creator.subscribers} followers</span>
                    </div>
                  </div>
                </div>
                <p className="text-white/70">{creator.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('creators.requirements.title')} <span className="gradient-text">{t('creators.requirements.title.highlight')}</span>
              </h2>
              <p className="text-xl text-white/70">
                {t('creators.requirements.description')}
              </p>
            </div>

            <div className="card">
              <h3 className="text-2xl font-semibold text-white mb-8 text-center">{t('creators.requirements.subtitle')}</h3>
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
              {t('creators.cta.title')} <span className="gradient-text">{t('creators.cta.title.highlight')}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t('creators.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleApply} className="btn-primary flex items-center space-x-2">
                <span>{t('creators.cta.button')}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={handleViewGuidelines} className="btn-secondary">
                {t('creators.cta.guidelines')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Form Modal */}
      {showForm && (
        <CreatorForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};