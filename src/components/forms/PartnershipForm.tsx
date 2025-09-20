import React, { useState } from 'react';
import { X, Send, Users, Building, Globe, Mail, Phone, User } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface PartnershipFormProps {
  onClose: () => void;
}

export const PartnershipForm: React.FC<PartnershipFormProps> = ({ onClose }) => {
  const { addMessage } = useAdmin();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    socialMedia: '',
    audience: '',
    experience: '',
    reason: '',
    additionalInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const message = `
PARTNERSHIP APPLICATION

Contact Information:
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}

Company/Project Information:
• Company: ${formData.company || 'Not provided'}
• Website: ${formData.website || 'Not provided'}
• Social Media: ${formData.socialMedia || 'Not provided'}

Audience and Experience:
• Audience Size: ${formData.audience}
• Gaming Industry Experience: ${formData.experience}

Motivation:
${formData.reason}

Additional Information:
${formData.additionalInfo || 'Not provided'}

Application Date: ${new Date().toLocaleString()}
      `.trim();

      await addMessage({
        type: 'partnership',
        name: formData.name,
        email: formData.email,
        subject: 'Partnership Application',
        message: message,
        priority: 'medium',
        source: 'Partnership Page - Application Form'
      });

      setSubmitMessage(t('partnership.form.success'));
      
      // Clear form after 2 seconds and close
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit partnership application:', error);
      setSubmitMessage(t('partnership.form.error'));
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-dark rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>{t('partnership.form.title')}</span>
          </h2>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitMessage.includes(t('partnership.form.success').split('!')[0]) 
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t('partnership.form.contact.title')}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('partnership.form.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder={t('partnership.form.name')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('partnership.form.email')} *
                  </label>
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
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('partnership.form.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder="+1 (555) 123-4567"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('partnership.form.company')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder={t('partnership.form.company')}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Online Presence */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>{t('partnership.form.online.title')}</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('partnership.form.website')}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder="https://yourwebsite.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('partnership.form.social')} *
                  </label>
                  <textarea
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                    rows={3}
                    placeholder={t('partnership.form.social.placeholder')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Audience and Experience */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>{t('partnership.form.audience.title')}</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('partnership.form.audience.size')} *
                  </label>
                  <input
                    type="text"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder={t('partnership.form.audience.size.placeholder')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('partnership.form.experience')} *
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                    rows={3}
                    placeholder={t('partnership.form.experience.placeholder')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('partnership.form.motivation')} *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                rows={4}
                placeholder={t('partnership.form.motivation.placeholder')}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('partnership.form.additional')}
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                rows={3}
                placeholder={t('partnership.form.additional.placeholder')}
                disabled={isSubmitting}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{t('partnership.form.submit')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};