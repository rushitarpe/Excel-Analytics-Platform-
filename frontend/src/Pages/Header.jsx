import React, { useState } from 'react';
import { BarChart3, Upload, TrendingUp, Users, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      <nav className="relative z-20 container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ExcelViz</h1>
              <p className="text-sm text-blue-200">Analytics Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink icon={<Upload className="w-4 h-4" />} text="Upload" />
            <NavLink icon={<BarChart3 className="w-4 h-4" />} text="Analytics" />
            <NavLink icon={<TrendingUp className="w-4 h-4" />} text="Dashboard" />
            <NavLink icon={<Users className="w-4 h-4" />} text="Admin" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 mt-2">
            <div className="container mx-auto px-6 py-4 space-y-4">
              <MobileNavLink icon={<Upload className="w-5 h-5" />} text="Upload Excel" />
              <MobileNavLink icon={<BarChart3 className="w-5 h-5" />} text="Analytics" />
              <MobileNavLink icon={<TrendingUp className="w-5 h-5" />} text="Dashboard" />
              <MobileNavLink icon={<Users className="w-5 h-5" />} text="Admin Panel" />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

const NavLink = ({ icon, text }) => (
  <a href="#" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 hover:scale-105 transform">
    {icon}
    <span className="font-medium">{text}</span>
  </a>
);

const MobileNavLink = ({ icon, text }) => (
  <a href="#" className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300 py-2">
    {icon}
    <span className="font-medium">{text}</span>
  </a>
);

export default Header;
