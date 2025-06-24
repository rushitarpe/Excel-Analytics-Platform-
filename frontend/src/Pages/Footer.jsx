import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Logo and Tagline */}
        <div>
          <h2 className="text-2xl font-bold text-white">ExcelViz</h2>
          <p className="text-sm mt-2 text-gray-400">Visualize Excel like never before.</p>
          <p className="text-xs mt-4">&copy; {new Date().getFullYear()} ExcelViz. All rights reserved.</p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">Upload</a></li>
            <li><a href="#" className="hover:text-white transition">Analytics</a></li>
            <li><a href="#" className="hover:text-white transition">Dashboard</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Github className="w-5 h-5" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
