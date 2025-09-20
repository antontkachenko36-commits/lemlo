import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.pricing'), path: '/pricing' },
    { name: t('nav.partnership'), path: '/partnership' },
    { name: t('nav.locations'), path: '/locations' },
    { name: t('nav.creators'), path: '/creators' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.help'), path: '/help' },
  ];

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-dark shadow-lg border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M28.16 16C28.16 22.7158 22.7158 28.16 16 28.16C9.28422 28.16 3.84 22.7158 3.84 16H0C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0V3.84C22.7158 3.84 28.16 9.28422 28.16 16Z" fill="white"/>
                <rect width="11.7073" height="11.7073" fill="white"/>
                <path d="M13.5029 13.5029H31.36L27.0058 27.0058L13.5029 29.44V13.5029Z" fill="white"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Deplos</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-white relative ${
                  location.pathname === item.path
                    ? 'text-white after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-white'
                    : 'text-white/70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSelector />
            <button
              onClick={() => handleExternalLink('https://panel.deplos.com')}
              className="btn-secondary"
            >
              {t('nav.panel')}
            </button>
            <button
              onClick={() => handleExternalLink('https://client.deplos.com')}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {t('nav.login')}
            </button>
            <button
              onClick={() => handleExternalLink('https://client.deplos.com')}
              className="btn-primary"
            >
              {t('nav.signup')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-white/70 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden glass-dark rounded-lg mt-2 p-4 space-y-4 border border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-white/70'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/20 space-y-3">
              <div className="flex justify-center">
                <LanguageSelector />
              </div>
              <button
                onClick={() => handleExternalLink('https://panel.deplos.com')}
                className="block w-full btn-secondary text-center"
              >
                {t('nav.panel')}
              </button>
              <button
                onClick={() => handleExternalLink('https://client.deplos.com')}
                className="block w-full text-sm font-medium text-white/70 hover:text-white transition-colors text-center py-2"
              >
                {t('nav.login')}
              </button>
              <button
                onClick={() => handleExternalLink('https://client.deplos.com')}
                className="block w-full btn-primary text-center"
              >
                {t('nav.signup')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};