import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storageUtils } from '../lib/data/migration-utils';
import { useTranslation } from 'react-i18next';

/**
 * Contact page with form and information
 */
const ContactPage: React.FC = () => {
  const { t } = useTranslation('pages');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage (since this is client-side only)
    const contacts = JSON.parse(storageUtils.getContacts() || '[]');
    const newContact = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    contacts.push(newContact);
    storageUtils.setContacts(JSON.stringify(contacts));
    
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  /**
   * Handle input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-gray-100 mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-300">
          {t('contact.subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
            {t('contact.form.title')}
          </h2>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">
                {t('contact.form.success.title')}
              </h3>
              <p className="text-secondary-600 dark:text-gray-300">
                {t('contact.form.success.description')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  {t('contact.form.subject')} *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">{t('contact.form.selectSubject')}</option>
                  <option value="general">{t('contact.form.subjects.general')}</option>
                  <option value="bug">{t('contact.form.subjects.bug')}</option>
                  <option value="feature">{t('contact.form.subjects.feature')}</option>
                  <option value="collaboration">{t('contact.form.subjects.collaboration')}</option>
                  <option value="support">{t('contact.form.subjects.support')}</option>
                  <option value="other">{t('contact.form.subjects.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  {t('contact.form.message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                {t('contact.form.sendMessage')}
              </button>
            </form>
          )}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Contact */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
              {t('contact.quickContact.title')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-secondary-900 dark:text-gray-100">{t('contact.quickContact.email')}</div>
                  <div className="text-secondary-600 dark:text-gray-400">pavel.likhovid@gmail.com</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-secondary-900 dark:text-gray-100">{t('contact.quickContact.community')}</div>
                  <div className="text-secondary-600 dark:text-gray-400">{t('contact.quickContact.communityDescription')}</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-secondary-900 dark:text-gray-100">{t('contact.quickContact.status')}</div>
                  <div className="text-secondary-600 dark:text-gray-400">{t('contact.quickContact.statusDescription')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
              {t('contact.faq.title')}
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">
                  {t('contact.faq.dataSecure.question')}
                </h4>
                <p className="text-sm text-secondary-600 dark:text-gray-400 text-justify leading-relaxed">
                  {t('contact.faq.dataSecure.answer')}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">
                  {t('contact.faq.commercial.question')}
                </h4>
                <p className="text-sm text-secondary-600 dark:text-gray-400 text-justify leading-relaxed">
                  {t('contact.faq.commercial.answer')}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">
                  {t('contact.faq.bugs.question')}
                </h4>
                <p className="text-sm text-secondary-600 dark:text-gray-400 text-justify leading-relaxed">
                  {t('contact.faq.bugs.answer')}
                </p>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
              {t('contact.resources.title')}
            </h3>
            <div className="space-y-2">
              <Link to="/guidelines" className="block text-primary-600 hover:text-primary-700">
                → {t('contact.resources.usageGuidelines')}
              </Link>
              <Link to="/about" className="block text-primary-600 hover:text-primary-700">
                → {t('contact.resources.aboutProject')}
              </Link>
              <a href="https://github.com/PavloICSA/netcraft-ai" className="block text-primary-600 hover:text-primary-700" target="_blank" rel="noopener noreferrer">
                → {t('contact.resources.githubRepository')}
              </a>
              <Link to="/terms" className="block text-primary-600 hover:text-primary-700">
                → {t('contact.resources.termsOfUse')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;