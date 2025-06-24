import React, { useState } from 'react';
import { BarChart3, Upload, TrendingUp, Users, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
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
            <NavLink icon={<BarChart3 className="w-4 h-4" />} text="Home" to="/" />
            <NavLink icon={<Upload className="w-4 h-4" />} text="Upload" to="/upload" />
            <NavLink icon={<BarChart3 className="w-4 h-4" />} text="Analytics" to="/analytics" />
            <NavLink icon={<TrendingUp className="w-4 h-4" />} text="Dashboard" to="/dashboard" />
            {/* Account Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Account</span>
                </button>

                <div className="absolute right-0 mt-2 w-40 bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200 z-50">
                  <Link to="/sign-up" className="block px-4 py-2 text-white/80 hover:bg-slate-700 hover:text-white">Register</Link>
                  <Link to="/sign-in" className="block px-4 py-2 text-white/80 hover:bg-slate-700 hover:text-white">Login</Link>
                </div>
              </div>
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
          <div className="container mx-auto px-6 py-4 space-y-4">
            <MobileNavLink icon={<BarChart3 className="w-5 h-5" />} text="Home" to="/" />
            <MobileNavLink icon={<Upload className="w-5 h-5" />} text="Upload Excel" to="/upload" />
            <MobileNavLink icon={<BarChart3 className="w-5 h-5" />} text="Analytics" to="/analytics" />
            <MobileNavLink icon={<TrendingUp className="w-5 h-5" />} text="Dashboard" to="/dashboard" />
            <MobileNavLink icon={<Users className="w-5 h-5" />} text="Register" to="/sign-up" />
            <MobileNavLink icon={<Users className="w-5 h-5" />} text="Login" to="/sign-in" />
          </div>

        )}
      </nav>
    </div>
  );
};

const NavLink = ({ icon, text, to }) => (
  <Link to={to} className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 hover:scale-105 transform">
    {icon}
    <span className="font-medium">{text}</span>
  </Link>
);

const MobileNavLink = ({ icon, text, to }) => (
  <Link to={to} className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300 py-2">
    {icon}
    <span className="font-medium">{text}</span>
  </Link>
);



export default Header;
