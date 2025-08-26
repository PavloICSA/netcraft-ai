import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import DemoCarousel from '../components/Landing/DemoCarousel';

/**
 * Landing page with hero section, features, and demo showcase
 */
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Beautiful Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Glowing background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-2xl blur-xl opacity-30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main title with gradient and glow */}
            <motion.div
              className="relative px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-800 bg-clip-text text-transparent text-center"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%",
                  filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))"
                }}
              >
                NetCraft AI
              </motion.h1>
              
              {/* Running animated subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center text-xs md:text-sm text-secondary-600 font-medium mt-2 overflow-hidden"
                style={{ height: '24px', lineHeight: '24px' }}
              >
                <motion.p
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                  className="whitespace-nowrap"
                >
                  AI-powered data analysis platform combining neural network prediction and advanced clustering
                </motion.p>
              </motion.div>
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-60"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 2) * 80}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-bold">See It In Action</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Explore interactive demos showcasing neural network prediction and clustering analysis
            </p>
          </motion.div>
          
          <DemoCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Analyze Your Data?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Upload your dataset and start building predictive models in minutes
            </p>
            <div className="flex gap-6 justify-center">
              {/* Upload Data Button - Primary Style */}
              <Link
                to="/data"
                className="relative bg-gradient-to-r from-white to-primary-50 hover:from-primary-50 hover:to-white text-primary-600 hover:text-primary-700 font-bold py-5 px-12 rounded-xl text-xl transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:shadow-2xl transform hover:scale-105 hover:brightness-110 group overflow-hidden"
              >
                <span className="relative z-10">Upload Data</span>
                {/* Glowing overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-white opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-xl blur-sm"></div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
              </Link>

              {/* View Guidelines Button - Secondary Style */}
              <Link
                to="/guidelines"
                className="relative bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border-2 border-white hover:border-white/80 text-white font-bold py-5 px-12 rounded-xl text-xl transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:shadow-2xl transform hover:scale-105 hover:brightness-110 group overflow-hidden backdrop-blur-sm"
              >
                <span className="relative z-10">View Guidelines</span>
                {/* Glowing overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-xl blur-sm"></div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-secondary-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">NetCraft AI</h3>
              <p className="text-sm">
                Crafting artificial neural networks, clustering, and forecasts in the browser
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/predictor" className="hover:text-white">Neural Networks</Link></li>
                <li><Link to="/clusterizer" className="hover:text-white">Clustering</Link></li>
                <li><Link to="/data" className="hover:text-white">Data Analysis</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/guidelines" className="hover:text-white">Guidelines</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 NetCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;