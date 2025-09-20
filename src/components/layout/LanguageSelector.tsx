import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '../../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
    { code: 'uk' as Language, name: 'Українська', flag: '🇺🇦' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 glass rounded-lg hover:bg-white/10 transition-colors border border-white/10"
      >
        <Globe className="h-4 w-4 text-white" />
        <span className="text-white text-sm">{currentLanguage?.flag}</span>
        <span className="text-white text-sm hidden sm:block">{currentLanguage?.name}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-48 glass-dark rounded-lg border border-white/10 z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};