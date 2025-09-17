
import React, { useEffect, useState, lazy, Suspense } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { User, GraduationCap, Building, Calendar } from 'lucide-react';
import { useFeedback } from '../hooks/useFeedback';
import Avatar from '../components/Avatar';
import { useNavigate } from 'react-router-dom';
const FeedbackPopup = lazy(() => import('../components/FeedbackPopup'));
const PartnerInvitePopup = lazy(() => import('../components/PartnerInvitePopup'));

const Dashboard = () => {

  const { user } = useAuth();
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTests, setActiveTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [showProfileBanner, setShowProfileBanner] = useState(false);
  const { 
    shouldShowFeedback, 
    feedbackType, 
    recordFeedbackShown, 
    closeFeedback 
  } = useFeedback(user);
  const [showPartnerInvite, setShowPartnerInvite] = useState(false);

  useEffect(() => {
    // Show partner invite once after login (per browser)
    if (user) {
      // Do not show partner invite to admins/faculty/superadmins
      if (user.role && user.role !== 'student') return;
      // Respect server-side flag first
      if (user.partnerInviteShown) return;
      const key = 'partner_invite_shown_' + user._id;
      const snoozeKey = 'partner_invite_snooze_' + user._id;
      const snooze = localStorage.getItem(snoozeKey);
      const now = Date.now();
      if (snooze && parseInt(snooze, 10) > now) {
        // snoozed, do not show
        return;
      }
      const dontShow = localStorage.getItem(key);
      if (!dontShow) {
        // show after a short delay so it doesn't interrupt rendering
        setTimeout(() => setShowPartnerInvite(true), 1200);
      }
    }
  }, [user]);

  useEffect(() => {
    // Redirect admin/superadmin to admin panel
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      navigate('/admin-panel', { replace: true });
      return;
    }
    fetchActiveTests();
    // Profile completeness check
    if (user && (!user.year || !user.branch || !user.college)) {
      setShowProfileBanner(true);
    } else {
      setShowProfileBanner(false);
    }
  }, [user, navigate]);

  const fetchActiveTests = async () => {
    try {
      setLoadingTests(true);
  const res = await api.get('/api/tests');
      if (res.data.success) {
        setActiveTests(res.data.tests.filter(t => t.status === 'active'));
      } else {
        setActiveTests([]);
      }
    } catch {
      setActiveTests([]);
    } finally {
      setLoadingTests(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Only show non-sensitive info in stats
  const stats = [
    {
      label: 'Year',
      value: user.year,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      label: 'Branch',
      value: user.branch,
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      label: 'College',
      value: user.college,
      icon: Building,
      color: 'bg-purple-500',
    },
    {
      label: 'Role',
      value: user.role === 'admin' ? 'Administrator' : 'Student',
      icon: User,
      color: 'bg-orange-500',
    },
  ];

  return (
  <div className="w-full min-h-screen flex flex-col bg-white sm:bg-gray-50 overflow-x-hidden">
      {/* Feedback Popup */}
      <Suspense fallback={null}>
        {shouldShowFeedback && (
          <FeedbackPopup 
            user={user} 
            onClose={() => {
              recordFeedbackShown(feedbackType);
              closeFeedback();
            }}
            feedbackType={feedbackType}
          />
        )}
        {showPartnerInvite && (
          <PartnerInvitePopup
            onClose={() => setShowPartnerInvite(false)}
            onDontShowAgain={async () => {
              if (!user) return setShowPartnerInvite(false);
              try {
                const res = await profileService.markPartnerInviteShown();
                // update local auth user object with new flag if response contains user
                if (res && res.user) {
                  updateUser(res.user);
                }
              } catch (err) {
                // fallback to localStorage if API fails
                localStorage.setItem('partner_invite_shown_' + user._id, '1');
              } finally {
                setShowPartnerInvite(false);
              }
            }}
            onMaybeLater={() => {
              if (!user) return setShowPartnerInvite(false);
              // snooze for 7 days
              const snoozeKey = 'partner_invite_snooze_' + user._id;
              const snoozeUntil = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
              localStorage.setItem(snoozeKey, snoozeUntil.toString());
              setShowPartnerInvite(false);
            }}
          />
        )}
      </Suspense>
      {/* Profile Completeness Banner */}
      {showProfileBanner && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 max-w-full overflow-x-hidden" role="alert" aria-label="Profile incomplete">
          <div className="w-full max-w-full">
            <strong>Complete your profile!</strong> Please update your year, branch, and college for a better experience.
          </div>
          <button className="mt-2 sm:mt-0 sm:ml-4 px-3 py-1 w-full sm:w-auto bg-yellow-500 text-white rounded max-w-xs" onClick={() => navigate('/profile')} aria-label="Go to profile">Update Now</button>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8 w-full max-w-full px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 w-full max-w-full" aria-label="Welcome section">
          <Avatar alt={user.name} size="xl" />
          <div className="mt-3 sm:mt-0 text-center sm:text-left w-full max-w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 break-words" aria-label={`Welcome back, ${user.name}`}>Welcome back, {user.name}! 👋</h1>
            <p className="text-secondary-600 mt-2 text-sm sm:text-base break-words">Here's what's happening with your account today.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 w-full max-w-full" aria-label="User stats">
        {stats.map((stat, index) => (
          <div key={index} className="card p-3 flex items-center w-full max-w-full overflow-x-hidden" tabIndex={0} aria-label={stat.label}>
            <div className={`p-2 sm:p-3 rounded-lg ${stat.color} text-white`} aria-hidden="true">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="ml-3 sm:ml-4 w-full max-w-full">
              <p className="text-xs sm:text-sm font-medium text-secondary-600 break-words">{stat.label}</p>
              <p className="text-base sm:text-lg font-semibold text-secondary-900 break-words">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Tests Section */}
      <div className="mb-6 sm:mb-8 w-full max-w-full px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Active Tests</h2>
        {loadingTests ? (
          <div className="flex items-center justify-center py-6 sm:py-8" role="status" aria-live="polite">
            <svg className="animate-spin h-7 w-7 sm:h-8 sm:w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span>Loading tests...</span>
          </div>
        ) : activeTests.length === 0 ? (
          <div className="text-gray-500">No active tests at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full max-w-full" aria-label="Active tests">
            {activeTests.map(test => (
              <div key={test._id} className="card border p-3 sm:p-4 flex flex-col justify-between w-full max-w-full overflow-x-hidden" tabIndex={0} aria-label={test.title}>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 break-words">{test.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 break-words">{test.description || 'No description'}</p>
                  <div className="text-xs text-gray-500 mb-1 sm:mb-2 break-words">{test.category}</div>
                </div>
                <div className="mt-3 sm:mt-4 px-2 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded text-center text-xs sm:text-sm">
                  Go to Tests tab to take this test
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

  {/* User's Latest Result Section */}
  {/* Feedback popup and lazy loading for future */}
    </div>
  );
};

export default Dashboard;








