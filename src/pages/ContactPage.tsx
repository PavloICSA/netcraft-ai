import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storageUtils } from '../lib/data/migration-utils';

/**
 * Contact page with form and information
 */
const ContactPage: React.FC = () => {
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
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-secondary-600">
          Get in touch with questions, feedback, or collaboration opportunities
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
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Send us a Message
          </h2>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-secondary-600">
                Thank you for your message. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Tell us about your inquiry, feedback, or how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Send Message
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
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Quick Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-secondary-900">Email</div>
                  <div className="text-secondary-600">support@netcraft-ai.com</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-secondary-900">Community</div>
                  <div className="text-secondary-600">GitHub Discussions</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-secondary-900">Status</div>
                  <div className="text-secondary-600">All systems operational</div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-secondary-900 mb-1">
                  Is my data secure?
                </h4>
                <p className="text-sm text-secondary-600 text-justify leading-relaxed">
                  Yes! All processing happens in your browser with complete client-side execution. Your data never leaves your device, ensuring maximum privacy and security.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900 mb-1">
                  Can I use this for commercial projects?
                </h4>
                <p className="text-sm text-secondary-600 text-justify leading-relaxed">
                  Yes, NetCraft AI is available under the MIT license for both personal and commercial use. You have full freedom to integrate it into your projects.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900 mb-1">
                  How do I report bugs?
                </h4>
                <p className="text-sm text-secondary-600 text-justify leading-relaxed">
                  Use the contact form above or create an issue on our GitHub repository. We welcome detailed bug reports and feature suggestions from the community.
                </p>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Resources
            </h3>
            <div className="space-y-2">
              <Link to="/guidelines" className="block text-primary-600 hover:text-primary-700">
                → Usage Guidelines
              </Link>
              <Link to="/about" className="block text-primary-600 hover:text-primary-700">
                → About the Project
              </Link>
              <a href="https://github.com/netcraft-ai" className="block text-primary-600 hover:text-primary-700" target="_blank" rel="noopener noreferrer">
                → GitHub Repository
              </a>
              <Link to="/terms" className="block text-primary-600 hover:text-primary-700">
                → Terms of Use
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;