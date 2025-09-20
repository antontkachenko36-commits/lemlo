import React, { useState } from 'react';
import { MessageCircle, Mail, Clock, HelpCircle, Zap, Users, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { SupportForm } from '../components/forms/SupportForm';

export const Support: React.FC = () => {
  const { t } = useLanguage();
  const { addMessage } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [showSupportForm, setShowSupportForm] = useState(false);

  const supportOptions = [
    {
      icon: MessageCircle,
      title: t('support.chat.title'),
      description: t('support.chat.description'),
      availability: t('support.chat.availability'),
      action: t('support.chat.action'),
      primary: true,
    },
    {
      icon: Mail,
      title: t('support.email.title'),
      description: t('support.email.description'),
      availability: t('support.email.availability'),
      action: t('support.email.action'),
      primary: false,
    },
    {
      icon: Users,
      title: t('support.discord.title'),
      description: t('support.discord.description'),
      availability: t('support.discord.availability'),
      action: t('support.discord.action'),
      primary: false,
    },
  ];

  const faqItems = [
    {
      question: t('support.faq.q1'),
      answer: t('support.faq.a1'),
    },
    {
      question: t('support.faq.q2'),
      answer: t('support.faq.a2'),
    },
    {
      question: t('support.faq.q3'),
      answer: t('support.faq.a3'),
    },
    {
      question: t('support.faq.q4'),
      answer: t('support.faq.a4'),
    },
    {
      question: t('support.faq.q5'),
      answer: t('support.faq.a5'),
    },
    {
      question: t('support.faq.q6'),
      answer: t('support.faq.a6'),
    },
  ];

  const handleContactSupport = (method: string) => {
    switch (method) {
      case 'chat':
        setShowSupportForm(true);
        break;
      case 'email':
        window.location.href = 'mailto:support@deplos.com';
        break;
      case 'discord':
        window.open('https://discord.gg/deplos', '_blank', 'noopener,noreferrer');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Определяем приоритет на основе содержания сообщения
      const priority = formData.message.toLowerCase().includes('urgent') || 
                      formData.message.toLowerCase().includes('срочно') ||
                      formData.subject.toLowerCase().includes('urgent') ||
                      formData.subject.toLowerCase().includes('срочно') ? 'high' : 'medium';

      await addMessage({
        type: 'support',
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        priority,
        source: 'Страница поддержки - Форма обратной связи'
      });

      setSubmitMessage('Спасибо за ваше обращение! Мы рассмотрим его в ближайшее время и свяжемся с вами.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to submit support message:', error);
      setSubmitMessage('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
              <span className="text-sm text-white/80">{t('support.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('support.title')} <span className="gradient-text">{t('support.title.highlight')}</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {t('support.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('support.methods.title')} <span className="gradient-text">{t('support.methods.title.highlight')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {supportOptions.map((option, index) => (
              <div key={index} className={`card text-center ${option.primary ? 'ring-2 ring-white' : ''}`}>
                <div className={`w-16 h-16 ${option.primary ? 'bg-white' : 'bg-gray-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <option.icon className={`h-8 w-8 ${option.primary ? 'text-black' : 'text-white'}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">{option.title}</h3>
                <p className="text-white/70 mb-4">{option.description}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Clock className="h-4 w-4 text-white" />
                  <span className="text-white text-sm">{option.availability}</span>
                </div>
                
                <button
                  onClick={() => handleContactSupport(option.title.toLowerCase().includes('chat') || option.title.toLowerCase().includes('чат') ? 'chat' : option.title.toLowerCase().includes('email') ? 'email' : 'discord')}
                  className={option.primary ? 'btn-primary w-full' : 'btn-secondary w-full'}
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Form */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-black/10" />
        
        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Отправить запрос в <span className="gradient-text">поддержку</span>
              </h2>
              <p className="text-xl text-white/70">
                Опишите вашу проблему подробно, и мы поможем вам решить её
              </p>
            </div>

            <div className="card">
              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitMessage.includes('Спасибо') 
                    ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                    : 'bg-red-500/20 border border-red-500/50 text-red-300'
                }`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Имя *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                      placeholder="Ваше имя"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Тема обращения *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder="Кратко опишите проблему"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Подробное описание *</label>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                    placeholder="Опишите вашу проблему как можно подробнее. Укажите шаги для воспроизведения, сообщения об ошибках и другую полезную информацию."
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Отправить запрос</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('support.faq.title')} <span className="gradient-text">{t('support.faq.title.highlight')}</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('support.faq.description')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-white mb-4">{item.question}</h3>
                <p className="text-white/70 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card text-center max-w-2xl mx-auto">
            <Zap className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('support.cta.title')} <span className="gradient-text">{t('support.cta.title.highlight')}</span>
            </h2>
            <p className="text-white/70 mb-8">
              {t('support.cta.description')}
            </p>
            <button
              onClick={() => setShowSupportForm(true)}
              className="btn-primary"
            >
              {t('support.cta.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Support Form Modal */}
      {showSupportForm && (
        <SupportForm onClose={() => setShowSupportForm(false)} />
      )}
    </div>
  );
};