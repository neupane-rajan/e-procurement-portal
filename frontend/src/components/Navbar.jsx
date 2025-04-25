import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardList, 
  PackageOpen, 
  BarChart3, 
  Moon, 
  Sun, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings
} from 'lucide-react';

function Navbar({ currentUser = "neupane-rajan" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation links configuration
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/vendors', label: 'Vendors', icon: <Building2 size={18} /> },
    { path: '/requisitions', label: 'Requisitions', icon: <ClipboardList size={18} /> },
    { path: '/inventory', label: 'Inventory', icon: <PackageOpen size={18} /> },
    { path: '/reports', label: 'Reports', icon: <BarChart3 size={18} /> }
  ];

  // Dark mode initialization
  useEffect(() => {
    const darkModeStored = localStorage.getItem('darkMode') === 'true';
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkMode = darkModeStored || (prefersDarkMode && localStorage.getItem('darkMode') === null);
    
    setIsDarkMode(shouldUseDarkMode);
    applyDarkMode(shouldUseDarkMode);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
        applyDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener?.('change', handleChange) || mediaQuery.addListener?.(handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange) || mediaQuery.removeListener?.(handleChange);
  }, []);

  // Apply dark mode to the DOM
  const applyDarkMode = (isDark) => {
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    applyDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!isProfileOpen) return;
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('#profile-menu')) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Handle logout
  const handleLogout = () => {
    ['isLoggedIn', 'username', 'userRole'].forEach(key => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });
    
    setIsProfileOpen(false);
    navigate('/login');
  };

  // Get user role and avatar letter
  const userRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole') || 'Administrator';
  const avatarLetter = currentUser.charAt(0).toUpperCase();

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-lg border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-black rounded-lg h-9 w-9 flex items-center justify-center mr-2 shadow-md">
                EP
              </div>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 hidden sm:block">
                e-Procurement
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200
                    ${location.pathname === link.path
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}
                  `}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Desktop Profile Dropdown */}
            <div className="relative hidden md:block" id="profile-menu">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
                  {avatarLetter}
                </div>
              </button>
              
              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-10 divide-y divide-gray-200 dark:divide-slate-700">
                  <div className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
                        {avatarLetter}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{currentUser}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{userRole}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                      Last login: 2025-04-24 19:33:33
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2">
                      <User size={16} />
                      My Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2">
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-1 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
                  {avatarLetter}
                </div>
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2
                  ${location.pathname === link.path
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile profile dropdown */}
      {isProfileOpen && (
        <div className="md:hidden absolute z-10 w-full transform px-2 transition">
          <div className="rounded-lg shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-slate-700">
            <div className="px-4 py-3">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
                  {avatarLetter}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{currentUser}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{userRole}</div>
                </div>
              </div>
            </div>
            <div className="py-2">
              <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                Last login: 2025-04-24 19:33:33
              </p>
            </div>
            <div className="py-1">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2" onClick={() => setIsProfileOpen(false)}>
                <User size={16} />
                My Profile
              </Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2" onClick={() => setIsProfileOpen(false)}>
                <Settings size={16} />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;