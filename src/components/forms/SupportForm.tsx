import React, { useState } from 'react';
import { X, Send, HelpCircle, AlertTriangle, Bug, Settings } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SupportFormProps {
  onClose: () => void;
}

export const SupportForm: React.FC<SupportFormProps> = ({ onClose }) => {
  const { addMessage } = useAdmin();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    steps: '',
    expectedResult: '',
    actualResult: '',
    serverInfo: '',
    additionalInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const categories = [
    { value: 'technical', label: t('support.form.category.technical'), icon: Bug },
    { value: 'billing', label: t('support.form.category.billing'), icon: Settings },
    { value: 'general', label: t('support.form.category.general'), icon: HelpCircle },
    { value: 'urgent', label: t('support.form.category.urgent'), icon: AlertTriangle },
  ];

  const priorities = [
    { value: 'low', label: t('support.form.priority.low'), color: 'text-green-400' },
    { value: 'medium', label: t('support.form.priority.medium'), color: 'text-yellow-400' },
    { value: 'high', label: t('support.form.priority.high'), color: 'text-red-400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const message = `
SUPPORT REQUEST

Contact Information:
• Name: ${formData.name}
• Email: ${formData.email}

Issue Information:
• Category: ${categories.find(c => c.value === formData.category)?.label || formData.category}
• Priority: ${priorities.find(p => p.value === formData.priority)?.label || formData.priority}
• Subject: ${formData.subject}

Problem Description:
${formData.description}

${formData.steps ? `Steps to Reproduce:
${formData.steps}` : ''}

${formData.expectedResult ? `Expected Result:
${formData.expectedResult}` : ''}

${formData.actualResult ? `Actual Result:
${formData.actualResult}` : ''}

${formData.serverInfo ? `Server Information:
${formData.serverInfo}` : ''}

${formData.additionalInfo ? `Additional Information:
${formData.additionalInfo}` : ''}

Request Date: ${new Date().toLocaleString()}
      `.trim();

      await addMessage({
        type: 'support',
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: message,
        priority: formData.priority as 'low' | 'medium' | 'high',
        source: 'Support Form - Direct Request'
      });

      setSubmitMessage(t('support.form.success'));
      
      // Clear form after 2 seconds and close
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit support request:', error);
      setSubmitMessage(t('support.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            <HelpCircle className="h-6 w-6" />
            <span>{t('support.form.title')}</span>
          </h2>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitMessage.includes(t('support.form.success').split('!')[0]) 
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('support.form.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  placeholder={t('support.form.name')}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('support.form.email')} *
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
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('support.form.category')} *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  required
                  disabled={isSubmitting}
                >
                  <option value="" className="bg-gray-800">{t('support.form.category')}</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value} className="bg-gray-800">
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('support.form.priority')} *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  required
                  disabled={isSubmitting}
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value} className="bg-gray-800">
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('support.form.subject')} *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                placeholder={t('support.form.subject')}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('support.form.description')} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                rows={4}
                placeholder={t('support.form.description.placeholder')}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Additional fields for technical issues */}
            {formData.category === 'technical' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('support.form.steps')}
                  </label>
                  <textarea
                    name="steps"
                    value={formData.steps}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                    rows={3}
                    placeholder={t('support.form.steps.placeholder')}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('support.form.expected')}
                    </label>
                    <textarea
                      name="expectedResult"
                      value={formData.expectedResult}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                      rows={2}
                      placeholder={t('support.form.expected.placeholder')}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('support.form.actual')}
                    </label>
                    <textarea
                      name="actualResult"
                      value={formData.actualResult}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                      rows={2}
                      placeholder={t('support.form.actual.placeholder')}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('support.form.server')}
                  </label>
                  <textarea
                    name="serverInfo"
                    value={formData.serverInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                    rows={2}
                    placeholder={t('support.form.server.placeholder')}
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('support.form.additional')}
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                rows={3}
                placeholder={t('support.form.additional.placeholder')}
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
                    <span>{t('support.form.submit')}</span>
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