import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, Calendar, Share2, BookOpen } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';

export const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getGuideById } = useAdmin();
  const { t } = useLanguage();
  
  const guide = id ? getGuideById(id) : null;

  if (!guide) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('guide.notFound.title')}</h1>
          <p className="text-white/70 mb-8">{t('guide.notFound.description')}</p>
          <Link to="/guides" className="btn-primary">
            {t('guide.notFound.button')}
          </Link>
        </div>
      </div>
    );
  }

  if (!guide.published) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('guide.unavailable.title')}</h1>
          <p className="text-white/70 mb-8">{t('guide.unavailable.description')}</p>
          <Link to="/guides" className="btn-primary">
            {t('guide.notFound.button')}
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">{line.substring(4)}</h3>;
        }
        
        if (line.startsWith('```')) {
          return <div key={index} className="bg-gray-900 rounded-lg p-4 my-4 font-mono text-sm text-white/90 overflow-x-auto border border-white/10"></div>;
        }
        
        if (line.includes('`')) {
          const parts = line.split('`');
          return (
            <p key={index} className="text-white/80 mb-4 leading-relaxed">
              {parts.map((part, i) => 
                i % 2 === 1 ? 
                  <code key={i} className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">{part}</code> : 
                  part
              )}
            </p>
          );
        }
        
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={index} className="text-white/80 mb-2 ml-4">
              • {line.substring(2)}
            </li>
          );
        }
        
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.+)$/);
          if (match) {
            return (
              <li key={index} className="text-white/80 mb-2 ml-4">
                {match[1]}. {match[2]}
              </li>
            );
          }
        }
        
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        return <p key={index} className="text-white/80 mb-4 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-gray-900/20" />
        
        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <Link 
              to="/guides" 
              className="inline-flex items-center space-x-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('guide.back')}</span>
            </Link>

            {/* Guide Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {guide.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  guide.difficulty === 'Beginner' 
                    ? 'bg-green-500/20 text-green-300'
                    : guide.difficulty === 'Intermediate'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {guide.difficulty}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {guide.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/70 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{guide.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{guide.readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{t('guide.updated')} {formatDate(guide.updatedAt)}</span>
                </div>
              </div>

              {/* Tags */}
              {guide.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {guide.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 bg-white/10 text-white/80 px-2 py-1 rounded text-sm">
                      <Tag className="h-3 w-3" />
                      <span>#{tag}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleShare}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{t('guide.share')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="prose prose-invert max-w-none">
                {renderContent(guide.content)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">{t('guide.related.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/guides" className="card hover:scale-105 transition-transform">
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-8 w-8 text-white" />
                  <div>
                    <h3 className="text-white font-semibold">{t('guide.related.allGuides')}</h3>
                    <p className="text-white/70 text-sm">{t('guide.related.allGuides.description')}</p>
                  </div>
                </div>
              </Link>
              <Link to="/support" className="card hover:scale-105 transition-transform">
                <div className="flex items-center space-x-4">
                  <User className="h-8 w-8 text-white" />
                  <div>
                    <h3 className="text-white font-semibold">{t('guide.related.help')}</h3>
                    <p className="text-white/70 text-sm">{t('guide.related.help.description')}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};