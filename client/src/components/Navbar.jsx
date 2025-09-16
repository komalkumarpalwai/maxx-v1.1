import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { Menu, LogOut, User, Settings } from 'lucide-react';
import Avatar from './Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { user: userData } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate remaining profile updates
  const remainingUpdates = userData ? 2 - (userData.profileUpdateCount || 0) : 2;

  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const [logoutPassword, setLogoutPassword] = useState('');
  const [logoutError, setLogoutError] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      setShowLogoutPrompt(true);
    } else {
      logout();
      navigate('/login');
    }
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    setLogoutError('');
    try {
      // Use adminLogin for admin/superadmin password check
      await import('../services/authService').then(({ authService }) =>
        authService.adminLogin(user.email, logoutPassword)
      );
      setShowLogoutPrompt(false);
      setLogoutPassword('');
      logout();
      navigate('/login');
    } catch (err) {
      setLogoutError('Incorrect password.');
    } finally {
      setLogoutLoading(false);
    }
  };

  const menuItems = [
    {
      label: 'Profile',
      icon: User,
      onClick: () => navigate('/profile')
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Max Solutions
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <Avatar 
                src={user?.profilePic} 
                alt={user?.name} 
                size="sm"
                fallback={user?.name?.charAt(0)}
              />
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({remainingUpdates} updates left)
              </span>
              <Menu className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
                
                <div className="border-t border-gray-200 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
      {/* Logout password prompt for admin/superadmin */}
      {showLogoutPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-bold mb-2">Confirm Logout</h2>
            <p className="mb-2 text-sm text-gray-700">Enter your password to logout:</p>
            <input
              type="password"
              className="border rounded px-3 py-2 w-full mb-2"
              placeholder="Password"
              value={logoutPassword}
              onChange={e => setLogoutPassword(e.target.value)}
              disabled={logoutLoading}
            />
            {logoutError && <p className="text-red-600 text-sm mb-2">{logoutError}</p>}
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700"
                onClick={() => { setShowLogoutPrompt(false); setLogoutPassword(''); setLogoutError(''); }}
                disabled={logoutLoading}
              >Cancel</button>
              <button
                className="px-3 py-1 rounded bg-red-600 text-white"
                onClick={confirmLogout}
                disabled={logoutLoading || !logoutPassword}
              >{logoutLoading ? 'Logging out...' : 'Logout'}</button>
            </div>
          </div>
        </div>
      )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
