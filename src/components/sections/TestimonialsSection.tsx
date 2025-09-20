import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Server Owner',
      content: 'THE BEST HOSTING. When other providers fail, Deplos delivers 20 TPS and 60ms ping consistently. The performance is incredible for both free and paid plans.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'Sarah Chen',
      role: 'Community Manager',
      content: 'Fast host, used it as a proxy server with no disconnects. The control panel is intuitive and the support team is incredibly responsive. Highly recommended!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'Mike Rodriguez',
      role: 'Game Developer',
      content: 'The host doesn\'t lag and has very powerful hardware. Even with performance mods, the server runs smoothly with ping never above 20ms on the UK node.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6 border border-white/20">
            <Quote className="h-4 w-4 text-white" />
            <span className="text-sm text-white/80">{t('testimonials.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('testimonials.title')}{' '}
            <span className="gradient-text">{t('testimonials.title.highlight')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-white fill-current" />
                ))}
              </div>
              
              <p className="text-white/80 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover grayscale"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};