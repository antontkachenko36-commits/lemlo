import React, { useState } from 'react';
import { HelpCircle, Book, MessageCircle, Video, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Help: React.FC = () => {
  const { guides } = useAdmin();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const helpCategories = [
    {
      icon: Book,
      title: t('help.categories.gettingStarted.title'),
      description: t('help.categories.gettingStarted.description'),
      articles: guides.filter(g => g.category === 'Getting Started' && g.published).length || 12,
      category: 'Getting Started',
    },
    {
      icon: Video,
      title: t('help.categories.tutorials.title'),
      description: t('help.categories.tutorials.description'),
      articles: 8,
      category: 'Advanced',
    },
    {
      icon: MessageCircle,
      title: t('help.categories.troubleshooting.title'),
      description: t('help.categories.troubleshooting.description'),
      articles: guides.filter(g => g.category === 'Troubleshooting' && g.published).length || 15,
      category: 'Troubleshooting',
    },
    {
      icon: HelpCircle,
      title: t('help.categories.faq.title'),
      description: t('help.categories.faq.description'),
      articles: 20,
      category: 'Management',
    },
  ];

  // Get actual quick links from published guides
  const quickLinks = guides.filter(g => g.published).slice(0, 6).map(guide => ({
    title: guide.title,
    id: guide.id,
  }));

  // Fallback quick links if no guides available
  const fallbackQuickLinks = [
    { title: 'How to create your first server', id: null },
    { title: 'Installing plugins and mods', id: null },
    { title: 'Server performance optimization', id: null },
    { title: 'Backup and restore procedures', id: null },
    { title: 'Managing server permissions', id: null },
    { title: 'Connecting to your server', id: null },
  ];

  const displayQuickLinks = quickLinks.length > 0 ? quickLinks : fallbackQuickLinks;

  const contactOptions = [
    {
      title: t('help.contact.chat.title'),
      description: t('help.contact.chat.description'),
      availability: t('help.contact.chat.availability'),
      action: t('help.contact.chat.action'),
    },
    {
      title: t('help.contact.discord.title'),
      description: t('help.contact.discord.description'),
      availability: t('help.contact.discord.availability'),
      action: t('help.contact.discord.action'),
    },
    {
      title: t('help.contact.email.title'),
      description: t('help.contact.email.description'),
      availability: t('help.contact.email.availability'),
      action: t('help.contact.email.action'),
    },
  ];

  const handleContactOption = (title: string) => {
    if (title.includes('Chat') || title.includes('чат')) {
      alert('Live chat will open here. Please use Discord or email for now.');
    } else if (title.includes('Discord')) {
      window.open('https://discord.gg/deplos', '_blank', 'noopener,noreferrer');
    } else if (title.includes('Email') || title.includes('email')) {
      window.location.href = 'mailto:support@deplos.com';
    }
  };

  const handleCategoryClick = (category: string) => {
    window.location.href = `/guides?category=${encodeURIComponent(category)}`;
  };

  const handleQuickLinkClick = (link: { title: string; id: string | null }) => {
    if (link.id) {
      window.location.href = `/guides/${link.id}`;
    } else {
      window.location.href = `/guides?search=${encodeURIComponent(link.title)}`;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/guides?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-gray-900/20" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
              <HelpCircle className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('help.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('help.title')} <span className="gradient-text">{t('help.title.highlight')}</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('help.description')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  placeholder={t('help.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white text-lg border border-white/20"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2 px-4"
                >
                  {t('help.search.button')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('help.categories.title')} <span className="gradient-text">{t('help.categories.title.highlight')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpCategories.map((category, index) => (
              <div 
                key={index} 
                className="card cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleCategoryClick(category.category)}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
                  <category.icon className="h-6 w-6 text-black" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">{category.title}</h3>
                <p className="text-white/70 mb-4">{category.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{category.articles} {t('common.articles')}</span>
                  <ArrowRight className="h-4 w-4 text-white/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('help.popular.title')} <span className="gradient-text">{t('help.popular.title.highlight')}</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="card">
              <h3 className="text-2xl font-semibold text-white mb-8 text-center">{t('help.popular.subtitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayQuickLinks.map((link, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 glass rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                    onClick={() => handleQuickLinkClick(link)}
                  >
                    <ArrowRight className="h-4 w-4 text-white flex-shrink-0" />
                    <span className="text-white/80">{link.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('help.contact.title')} <span className="gradient-text">{t('help.contact.title.highlight')}</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('help.contact.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactOptions.map((option, index) => (
              <div key={index} className="card text-center">
                <h3 className="text-xl font-semibold text-white mb-4">{option.title}</h3>
                <p className="text-white/70 mb-4">{option.description}</p>
                <div className="text-white text-sm mb-6">{option.availability}</div>
                <button 
                  onClick={() => handleContactOption(option.title)}
                  className="btn-secondary w-full"
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-gray-900/10" />
        
        <div className="container-custom relative">
          <div className="card text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('help.resources.title')} <span className="gradient-text">{t('help.resources.title.highlight')}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t('help.resources.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/guides" className="btn-primary">
                {t('help.resources.guides')}
              </Link>
              <button className="btn-secondary">
                {t('help.resources.download')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};