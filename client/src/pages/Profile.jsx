import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { useNavigate } from 'react-router-dom';
import { Save, X, AlertTriangle, Info } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';
import { logoutService } from '../services/logoutService';
const PartnerInvitePopup = lazy(() => import('../components/PartnerInvitePopup'));

const Profile = () => {
  const { user, updateProfile, loading } = useUser();
  const { logout, updateUser } = useAuth();
  const [showPartnerInvite, setShowPartnerInvite] = useState(false);

  // Partner invite display logic (same as before)
  useEffect(() => {
    if (!user) return setShowPartnerInvite(false);
    if (user.role && user.role !== 'student') return setShowPartnerInvite(false);
    if (user.partnerInviteShown) return setShowPartnerInvite(false);
    const shownKey = 'partner_invite_shown_' + user._id;
    const snoozeKey = 'partner_invite_snooze_' + user._id;
    const snooze = localStorage.getItem(snoozeKey);
    const now = Date.now();
    if (!(localStorage.getItem(shownKey))) {
      if (!snooze || parseInt(snooze, 10) <= now) {
        setShowPartnerInvite(true);
        return;
      }
    }
    setShowPartnerInvite(false);
  }, [user]);

  const navigate = useNavigate();

  const handleLogoutAll = async () => {
    try {
      await logoutService.logoutAll();
      logout(); // Clear local session
      toast.success('Logged out from all devices!');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Failed to logout from all devices');
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showUpdateLimitPopup, setShowUpdateLimitPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    year: user?.year || '',
    branch: user?.branch || '',
    college: user?.college || ''
  });
  const [errors, setErrors] = useState({});
  const [showEmail, setShowEmail] = useState(false);
  const [showRoll, setShowRoll] = useState(false);

  // Calculate remaining updates
  const remainingUpdates = 2 - (user?.profileUpdateCount || 0);
  const canUpdate = remainingUpdates > 0;

  const yearOptions = [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' }
  ];

  const branchOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Mechanical', label: 'Mechanical' },
    { value: 'Civil', label: 'Civil' },
    { value: 'Electronics', label: 'Electronics' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!validateForm()) return;
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success(result.message || 'Profile updated successfully!');
        if (result.remainingUpdates !== undefined) {
          toast.success(`You have ${result.remainingUpdates} profile update${result.remainingUpdates !== 1 ? 's' : ''} remaining.`);
        }
        setIsEditing(false);
      } else {
        if (result.error === 'UPDATE_LIMIT_REACHED') {
          toast.error('Profile update limit reached! You can only update your profile 2 times.');
          setShowUpdateLimitPopup(true);
        } else {
          toast.error(result.error || 'Failed to update profile');
        }
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEdit = () => {
    setFormData({ name: user?.name || '', year: user?.year || '', branch: user?.branch || '', college: user?.college || '' });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
  <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 overflow-x-hidden">
      <Suspense fallback={null}>
        {showPartnerInvite && user && (
          <PartnerInvitePopup
            onClose={() => setShowPartnerInvite(false)}
            onDontShowAgain={async () => {
              if (!user) return setShowPartnerInvite(false);
              try {
                const res = await profileService.markPartnerInviteShown();
                if (res && res.user) updateUser(res.user);
              } catch (err) {
                localStorage.setItem('partner_invite_shown_' + user._id, '1');
              } finally {
                setShowPartnerInvite(false);
              }
            }}
            onMaybeLater={() => {
              if (!user) return setShowPartnerInvite(false);
              const snoozeKey = 'partner_invite_snooze_' + user._id;
              const snoozeUntil = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
              localStorage.setItem(snoozeKey, snoozeUntil.toString());
              setShowPartnerInvite(false);
            }}
          />
        )}
      </Suspense>

      <h1 className="text-3xl font-bold text-secondary-900 mb-2 mt-8">Profile</h1>
      <p className="text-secondary-600 mb-6">Manage your personal information and settings</p>

      <div className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center ${canUpdate ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'} w-full max-w-full`}>
        <Info className={`w-5 h-5 mb-2 sm:mb-0 sm:mr-3 ${canUpdate ? 'text-blue-600' : 'text-red-600'}`} />
        <div className="flex-1 text-xs sm:text-sm w-full max-w-full">
          {canUpdate
            ? <span className="text-blue-800">You have <b>{remainingUpdates}</b> profile update{remainingUpdates !== 1 ? 's' : ''} remaining.</span>
            : <span className="text-red-700 font-semibold">You have reached your profile update limit (2 updates maximum).</span>
          }
          {remainingUpdates === 1 && (
            <span className="ml-2 text-orange-600 font-medium">⚠️ Last update remaining!</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full">
        <div className="col-span-1 bg-white rounded-lg shadow-sm border p-4 sm:p-6 flex flex-col items-center text-center w-full max-w-full">
          <Avatar alt={user.name} size="2xl" className="mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 mb-1">{user.name}</h3>
          <p className="text-secondary-600 text-sm mb-4">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>

          <div className="w-full space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-sm text-secondary-600">
              <span className="font-medium">Roll Number</span>
              <span className="flex items-center gap-2 font-mono">
                {showRoll ? user.rollNo : '••••••••'}
                <button
                  type="button"
                  className="ml-2 text-xs text-blue-600 underline focus:outline-none"
                  onClick={() => setShowRoll((v) => !v)}
                >
                  {showRoll ? 'Hide' : 'Show'}
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-secondary-600">
              <span className="font-medium">Email</span>
              <span className="flex items-center gap-2 font-mono">
                {showEmail ? user.email : '••••••••@••••.com'}
                <button
                  type="button"
                  className="ml-2 text-xs text-blue-600 underline focus:outline-none"
                  onClick={() => setShowEmail((v) => !v)}
                >
                  {showEmail ? 'Hide' : 'Show'}
                </button>
              </span>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 w-full flex flex-col gap-2">
            <Button onClick={handleLogoutAll} variant="danger">Logout all</Button>
            <Button onClick={handleEdit} variant="outline" disabled={!canUpdate}>{canUpdate ? 'Edit Profile' : 'Update Limit Reached'}</Button>
          </div>
        </div>

  <div className="col-span-2 bg-white rounded-lg shadow-sm border p-4 sm:p-6 w-full max-w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 w-full max-w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">Personal Information</h2>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              {isEditing && (
                <>
                  <Button onClick={handleSubmit} loading={loading} disabled={loading}><Save className="w-4 h-4 mr-2" />Save</Button>
                  <Button onClick={handleCancel} variant="secondary"><X className="w-4 h-4 mr-2" />Cancel</Button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Enter your full name" />
                <Input label="College" name="college" value={formData.college} onChange={handleChange} placeholder="Enter college name" />
                <Select label="Year" name="year" value={formData.year} onChange={handleChange} error={errors.year} options={yearOptions} />
                <Select label="Branch" name="branch" value={formData.branch} onChange={handleChange} error={errors.branch} options={branchOptions} />
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-medium text-secondary-500">Full Name</label>
                <p className="text-secondary-900 break-words">{user.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-medium text-secondary-500">College</label>
                <p className="text-secondary-900 break-words">{user.college}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-medium text-secondary-500">Year</label>
                <p className="text-secondary-900 break-words">{user.year}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-medium text-secondary-500">Branch</label>
                <p className="text-secondary-900 break-words">{user.branch}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-medium text-secondary-500">Role</label>
                <p className="text-secondary-900 capitalize break-words">{user.role}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-medium text-secondary-500">Member Since</label>
                <p className="text-secondary-900 break-words">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Limit Popup */}
      {showUpdateLimitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Update Limit Reached</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-6">You have reached your profile update limit of 2 times. This limit is set to maintain data integrity and prevent frequent changes to student records.</p>
            <div className="flex justify-end">
              <Button onClick={() => setShowUpdateLimitPopup(false)} variant="outline">Got it</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
