import React, { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationRead } from '../services/community';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { Menu, LogOut, User, Settings } from 'lucide-react';
import { Bell } from 'lucide-react';
import Avatar from './Avatar';

const Navbar = ({ onMobileMenu }) => {
  const [showNotif, setShowNotif] = useState(false);
  const { user, logout } = useAuth();
  const { user: userData } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

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

  // Notifications logic (only in main function scope)
  const fetchNotifications = useCallback(async () => {
    if (!user?.token) return;
    setNotifLoading(true);
    try {
      const data = await getNotifications(user.token);
      setNotifications(data);
    } catch {}
    setNotifLoading(false);
  }, [user]);

  useEffect(() => {
    if (showNotif) fetchNotifications();
    // eslint-disable-next-line
  }, [showNotif]);

  const handleMarkRead = async (notifId) => {
    try {
      await markNotificationRead(notifId, user.token);
      fetchNotifications();
    } catch {}
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
  <nav className="bg-white border-b border-gray-200 px-2 sm:px-6 py-3 sm:py-4 relative">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
  <div className="flex items-center w-full sm:w-auto justify-between">
          {/* Notifications bell - right side */}
          <div className="flex-1 flex justify-end items-center">
            <div className="relative">
              <button
                className={`p-2 rounded-full focus:outline-none transition-colors ${notifications.filter(n => !n.read).length > 0 ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                aria-label="Show notifications"
                onClick={() => setShowNotif(v => !v)}
              >
                <Bell className={`w-6 h-6 ${notifications.filter(n => !n.read).length > 0 ? 'text-blue-600 animate-bounce' : 'text-gray-400'}`} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{notifications.filter(n => !n.read).length}</span>
                )}
              </button>
              {/* Floating notifications panel */}
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white rounded-xl shadow-lg border border-blue-100 z-50 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-blue-700">Notifications</h3>
                    <button className="text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={() => setShowNotif(false)} aria-label="Close notifications">&times;</button>
                  </div>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {notifLoading ? (
                      <span className="text-blue-600">Loading...</span>
                    ) : notifications.length === 0 ? (
                      <span className="text-gray-400">No notifications</span>
                    ) : notifications.map(notif => (
                      <div key={notif._id} className={`flex items-center gap-2 p-2 rounded-lg ${notif.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                        <span className="text-sm text-gray-700">{notif.type} on post {notif.post?.content || 'Image'}</span>
                        {!notif.read && <button onClick={() => handleMarkRead(notif._id)} className="ml-auto text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">Mark as read</button>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Hamburger menu for mobile */}
          <button
            className="sm:hidden mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={onMobileMenu}
            aria-label="Open sidebar menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 whitespace-nowrap">Max Solutions</h1>
          {/* User info for mobile, right-aligned */}
          <div className="flex items-center gap-2 sm:hidden">
            <Avatar 
              src={user?.profilePic} 
              alt={user?.name} 
              size="xs"
              fallback={user?.name?.charAt(0)}
            />
            <span className="text-xs font-medium text-gray-700 truncate max-w-[80px]">{user?.name}</span>
          </div>
        </div>
        {/* User menu for desktop */}
        <div className="hidden sm:flex items-center space-x-4">
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
