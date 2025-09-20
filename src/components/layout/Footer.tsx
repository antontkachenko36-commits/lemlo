import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const footerSections = [
    {
      title: t('footer.quickAccess'),
      links: [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.partnership'), path: '/partnership' },
        { name: t('nav.pricing'), path: '/pricing' },
        { name: t('nav.locations'), path: '/locations' },
        { name: 'Guides', path: '/guides' },
        { name: 'Support', path: '/support' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { name: 'Rules', path: '/rules' },
        { name: 'Privacy', path: '/privacy' },
      ],
    },
    {
      title: t('footer.services'),
      links: [
        { name: 'Panel', external: 'https://panel.deplos.com' },
        { name: 'Client', external: 'https://client.deplos.com' },
      ],
    },
  ];

  return (
    <footer className="glass-dark border-t border-white/10">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M28.16 16C28.16 22.7158 22.7158 28.16 16 28.16C9.28422 28.16 3.84 22.7158 3.84 16H0C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0V3.84C22.7158 3.84 28.16 9.28422 28.16 16Z" fill="white"/>
                  <rect width="11.7073" height="11.7073" fill="white"/>
                  <path d="M13.5029 13.5029H31.36L27.0058 27.0058L13.5029 29.44V13.5029Z" fill="white"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Deplos</span>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleExternalLink('https://discord.gg/deplos')}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors border border-white/10"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => handleExternalLink('https://youtube.com/@deplos')}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors border border-white/10"
              >
                <Youtube className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <button
                        onClick={() => handleExternalLink(link.external)}
                        className="text-white/70 hover:text-white transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/60">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};