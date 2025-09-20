import React, { useState } from 'react';
import { X, Send, Video, Users, Star, Globe, Youtube, Twitch } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface CreatorFormProps {
  onClose: () => void;
}

export const CreatorForm: React.FC<CreatorFormProps> = ({ onClose }) => {
  const { addMessage } = useAdmin();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: '',
    channelName: '',
    channelUrl: '',
    subscribers: '',
    contentType: '',
    uploadFrequency: '',
    averageViews: '',
    experience: '',
    reason: '',
    collaboration: '',
    additionalInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const platforms = [
    { value: 'youtube', label: t('creators.form.platform.youtube'), icon: Youtube },
    { value: 'twitch', label: t('creators.form.platform.twitch'), icon: Twitch },
    { value: 'discord', label: t('creators.form.platform.discord'), icon: Users },
    { value: 'other', label: t('creators.form.platform.other'), icon: Globe },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const message = `
CREATOR PROGRAM APPLICATION

Contact Information:
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}

Channel/Platform Information:
• Platform: ${formData.platform}
• Channel Name: ${formData.channelName}
• Channel URL: ${formData.channelUrl}
• Subscriber Count: ${formData.subscribers}

Content Information:
• Content Type: ${formData.contentType}
• Upload Frequency: ${formData.uploadFrequency}
• Average Views: ${formData.averageViews || 'Not provided'}

Experience and Motivation:
• Content Creation Experience: ${formData.experience}
• Why join the program: ${formData.reason}

Collaboration Plans:
${formData.collaboration}

Additional Information:
${formData.additionalInfo || 'Not provided'}

Application Date: ${new Date().toLocaleString()}
      `.trim();

      await addMessage({
        type: 'creator',
        name: formData.name,
        email: formData.email,
        subject: 'Creator Program Application',
        message: message,
        priority: 'medium',
        source: 'Creators Page - Application Form'
      });

      setSubmitMessage(t('creators.form.success'));
      
      // Clear form after 2 seconds and close
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit creator application:', error);
      setSubmitMessage(t('creators.form.error'));
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
            <Video className="h-6 w-6" />
            <span>{t('creators.form.title')}</span>
          </h2>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitMessage.includes(t('creators.form.success').split('!')[0]) 
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
                <Users className="h-5 w-5" />
                <span>{t('creators.form.contact.title')}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('creators.form.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder={t('creators.form.name')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('creators.form.email')} *
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
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('creators.form.phone')}
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
              </div>
            </div>

            {/* Channel Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>{t('creators.form.channel.title')}</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('creators.form.platform')} *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-gray-800">{t('creators.form.platform')}</option>
                    {platforms.map(platform => (
                      <option key={platform.value} value={platform.value} className="bg-gray-800">
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('creators.form.channel.name')} *
                    </label>
                    <input
                      type="text"
                      name="channelName"
                      value={formData.channelName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                      placeholder={t('creators.form.channel.name')}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('creators.form.subscribers')} *
                    </label>
                    <input
                      type="text"
                      name="subscribers"
                      value={formData.subscribers}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                      placeholder="e.g., 5,000"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('creators.form.channel.url')} *
                  </label>
                  <input
                    type="url"
                    name="channelUrl"
                    value={formData.channelUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder="https://youtube.com/channel/..."
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Content Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>{t('creators.form.content.title')}</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('creators.form.content.type')} *
                  </label>
                  <textarea
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                    rows={3}
                    placeholder={t('creators.form.content.type.placeholder')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('creators.form.upload.frequency')} *
                    </label>
                    <input
                      type="text"
                      name="uploadFrequency"
                      value={formData.uploadFrequency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                      placeholder={t('creators.form.upload.frequency.placeholder')}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {t('creators.form.average.views')}
                    </label>
                    <input
                      type="text"
                      name="averageViews"
                      value={formData.averageViews}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                      placeholder={t('creators.form.average.views.placeholder')}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Experience and Motivation */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('creators.form.experience')} *
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                  rows={3}
                  placeholder={t('creators.form.experience.placeholder')}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('creators.form.reason')} *
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                  rows={3}
                  placeholder={t('creators.form.reason.placeholder')}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('creators.form.collaboration')} *
                </label>
                <textarea
                  name="collaboration"
                  value={formData.collaboration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                  rows={3}
                  placeholder={t('creators.form.collaboration.placeholder')}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('creators.form.additional')}
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                rows={3}
                placeholder={t('creators.form.additional.placeholder')}
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
                    <span>{t('creators.form.submit')}</span>
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