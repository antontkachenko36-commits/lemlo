import React from 'react';
import { ArrowRight, Zap, Shield, Globe, Server, Monitor, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  const handleGetStarted = () => {
    window.open('https://client.deplos.com', '_blank', 'noopener,noreferrer');
  };

  const stats = [
    { value: '250+', label: t('hero.stats.servers') },
    { value: '5.6k+', label: t('hero.stats.gamers') },
    { value: '99.9%', label: t('hero.stats.uptime') },
  ];

  const features = [
    { icon: Shield, label: 'DDoS Protection', color: 'text-blue-400' },
    { icon: Globe, label: 'Global Network', color: 'text-green-400' },
    { icon: Zap, label: 'Instant Setup', color: 'text-yellow-400' },
    { icon: Server, label: 'High Performance', color: 'text-purple-400' },
    { icon: Monitor, label: 'Easy Management', color: 'text-pink-400' },
    { icon: Users, label: '24/7 Support', color: 'text-cyan-400' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pattern-grid">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container-custom section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 border border-white/20">
                <Zap className="h-4 w-4 text-white" />
                <span className="text-sm text-white/80">{t('hero.badge')}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {t('hero.title')}{' '}
                <span className="gradient-text">{t('hero.title.highlight')}</span>{' '}
                {t('hero.title.end')}
              </h1>
              
              <p className="text-xl text-white/70 max-w-2xl">
                {t('hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleGetStarted} className="btn-primary flex items-center justify-center space-x-2">
                <span>{t('hero.getStarted')}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link to="/pricing" className="btn-secondary flex items-center justify-center">
                {t('hero.viewPricing')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element - Заменяем фото на интерактивную схему */}
          <div className="relative">
            <div className="glass rounded-2xl p-8 animate-float border border-white/10 bg-gradient-to-br from-white/5 to-white/10">
              {/* Центральный сервер с анимированными кольцами */}
              <div className="relative flex justify-center mb-8">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center shadow-2xl relative z-10">
                  <Server className="h-12 w-12 text-black" />
                </div>
                
                {/* Пульсирующие кольца - ИСПРАВЛЕНО */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 border-2 border-white/20 rounded-full animate-ping" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-40 h-40 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>

              {/* Функции вокруг сервера */}
              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 glass rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center`}>
                      <feature.icon className={`h-4 w-4 ${feature.color}`} />
                    </div>
                    <span className="text-white/80 text-sm font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Статус индикаторы */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/70">All Systems Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-white/70">Low Latency</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-white/70">High Performance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-white/70">24/7 Monitoring</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 glass rounded-full flex items-center justify-center border border-white/20 animate-bounce">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 glass rounded-full flex items-center justify-center border border-white/20 animate-bounce" style={{ animationDelay: '1s' }}>
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};