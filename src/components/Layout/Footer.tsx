import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Simple footer component for the dashboard layout
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-secondary-200 px-6 py-4">
      <div className="flex justify-between items-center text-sm text-secondary-500">
        <div>
          <span>© 2025 NetCraft AI. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Version 1.0.0</span>
          <span>•</span>
          <Link to="/terms" className="hover:text-secondary-700">Terms</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-secondary-700">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;