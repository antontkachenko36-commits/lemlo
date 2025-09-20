import React from 'react';
import { Globe, Wifi, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Locations: React.FC = () => {
  const { t } = useLanguage();

  const locations = [
    {
      region: t('locations.regions.northAmerica'),
      cities: [
        { name: 'New York, USA', ping: '5ms', status: 'online' },
        { name: 'Los Angeles, USA', ping: '8ms', status: 'online' },
        { name: 'Toronto, Canada', ping: '12ms', status: 'online' },
        { name: 'Dallas, USA', ping: '6ms', status: 'online' },
      ],
    },
    {
      region: t('locations.regions.europe'),
      cities: [
        { name: 'London, UK', ping: '3ms', status: 'online' },
        { name: 'Frankfurt, Germany', ping: '4ms', status: 'online' },
        { name: 'Paris, France', ping: '7ms', status: 'online' },
        { name: 'Amsterdam, Netherlands', ping: '5ms', status: 'online' },
      ],
    },
    {
      region: t('locations.regions.asiaPacific'),
      cities: [
        { name: 'Tokyo, Japan', ping: '9ms', status: 'online' },
        { name: 'Singapore', ping: '11ms', status: 'online' },
        { name: 'Sydney, Australia', ping: '15ms', status: 'online' },
        { name: 'Seoul, South Korea', ping: '8ms', status: 'online' },
      ],
    },
  ];

  const features = [
    {
      icon: Zap,
      title: t('locations.features.latency.title'),
      description: t('locations.features.latency.description'),
    },
    {
      icon: Shield,
      title: t('locations.features.protection.title'),
      description: t('locations.features.protection.description'),
    },
    {
      icon: Wifi,
      title: t('locations.features.network.title'),
      description: t('locations.features.network.description'),
    },
    {
      icon: Globe,
      title: t('locations.features.reach.title'),
      description: t('locations.features.reach.description'),
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-gray-900/20" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6 border border-white/20">
              <Globe className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('locations.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="gradient-text">{t('locations.title')}</span> {t('locations.title.highlight')}
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('locations.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {locations.map((region, index) => (
              <div key={index} className="card">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  {region.region}
                </h2>
                
                <div className="space-y-4">
                  {region.cities.map((city, cityIndex) => (
                    <div key={cityIndex} className="flex items-center justify-between p-4 glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          city.status === 'online' ? 'status-online' : 'status-offline'
                        }`} />
                        <span className="text-white font-medium">{city.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">{city.ping}</span>
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              {t('locations.stats.title')} <span className="gradient-text">{t('locations.stats.title.highlight')}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-white/70">{t('locations.stats.uptime')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">12+</div>
                <div className="text-white/70">{t('locations.stats.locations')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">&lt;20ms</div>
                <div className="text-white/70">{t('locations.stats.latency')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">10Gbps</div>
                <div className="text-white/70">{t('locations.stats.speed')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};