import React, { useState, useEffect } from 'react';
import { Book, Video, FileText, Search, Clock, User, Filter, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Guides: React.FC = () => {
  const { guides } = useAdmin();
  const { t } = useLanguage();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  const categories = [
    {
      icon: Book,
      title: t('guides.categories.gettingStarted.title'),
      description: t('guides.categories.gettingStarted.description'),
    },
    {
      icon: Video,
      title: t('guides.categories.advanced.title'),
      description: t('guides.categories.advanced.description'),
    },
    {
      icon: FileText,
      title: t('guides.categories.configuration.title'),
      description: t('guides.categories.configuration.description'),
    },
  ];

  const allCategories = ['all', ...Array.from(new Set(guides.map(guide => guide.category)))];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredGuides = guides.filter(guide => {
    if (!guide.published) return false;
    
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleContactSupport = () => {
    window.open('https://discord.gg/deplos', '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    window.history.pushState({}, '', '/guides');
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-gray-900/20" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
              <Book className="h-4 w-4 text-white" />
              <span className="text-sm text-white/80">{t('guides.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="gradient-text">{t('guides.title')}</span> {t('guides.title.highlight')}
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('guides.description')}
            </p>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  placeholder={t('guides.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                >
                  {allCategories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category === 'all' ? t('guides.filters.allCategories') : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty} className="bg-gray-800">
                      {difficulty === 'all' ? t('guides.filters.allLevels') : difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('guides.categories.title')} <span className="gradient-text">{t('guides.categories.title.highlight')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="card cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedCategory(category.title)}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
                  <category.icon className="h-6 w-6 text-black" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">{category.title}</h3>
                <p className="text-white/70 mb-6">{category.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">
                    {guides.filter(g => g.category === category.title && g.published).length} {t('common.articles')}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides List */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' ? t('guides.results.search') : t('guides.results.title')} <span className="gradient-text">{t('guides.results.title.highlight')}</span>
            </h2>
            <p className="text-white/70">
              {filteredGuides.length} {filteredGuides.length === 1 ? t('guides.results.found') : t('guides.results.foundPlural')}
            </p>
          </div>

          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide) => (
                <Link 
                  key={guide.id} 
                  to={`/guides/${guide.id}`}
                  className="card cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                          {guide.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          guide.difficulty === 'Beginner' 
                            ? 'bg-green-500/20 text-green-300'
                            : guide.difficulty === 'Intermediate'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {guide.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-white/60 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{guide.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{guide.author}</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm line-clamp-3">
                        {guide.content.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-white/60 text-xs">
                      {t('guides.updated')} {formatDate(guide.updatedAt)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/50" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Book className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t('guides.noResults.title')}</h3>
              <p className="text-white/70 mb-6">
                {t('guides.noResults.description')}
              </p>
              <button
                onClick={handleClearFilters}
                className="btn-secondary"
              >
                {t('guides.noResults.clear')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('guides.cta.title')} <span className="gradient-text">{t('guides.cta.title.highlight')}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t('guides.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/support" className="btn-primary">
                {t('guides.cta.support')}
              </Link>
              <button onClick={handleContactSupport} className="btn-secondary">
                {t('guides.cta.discord')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};