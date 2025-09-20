import React, { useState } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAdmin } from '../../contexts/AdminContext';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const { addMessage } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Определяем приоритет на основе содержания сообщения
      const priority = formData.message.toLowerCase().includes('urgent') || 
                      formData.message.toLowerCase().includes('срочно') ? 'high' : 'medium';

      await addMessage({
        type: 'contact',
        name: formData.name,
        email: formData.email,
        message: formData.message,
        priority,
        source: 'Главная страница - Форма обратной связи'
      });

      setSubmitMessage('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to submit message:', error);
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
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-black/20" />
      
      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6 border border-white/20">
                <MessageCircle className="h-4 w-4 text-white" />
                <span className="text-sm text-white/80">{t('contact.badge')}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                {t('contact.title')}{' '}
                <span className="gradient-text">{t('contact.title.highlight')}</span>
              </h2>
              <p className="text-xl text-white/70">
                {t('contact.description')}
              </p>
            </div>
          </div>

          {/* Contact Form */}
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
                  <input
                    type="text"
                    name="name"
                    placeholder={t('contact.form.name')}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('contact.form.email')}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder={t('contact.form.message')}
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
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
                    <span>{t('contact.form.send')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};