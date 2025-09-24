
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts as getCommunityPosts, deletePost as deleteCommunityPost } from '../services/community';
import { createPost } from '../services/community';
import api from '../services/api';
import CreateTestForm from '../components/CreateTestForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import AdminExamResults from './AdminExamResults';
import UserManagement from './UserManagement';
import TestAnalytics from './TestAnalytics';
import SuperAdminPanel from './SuperAdminPanel';
import AdminFeedbackTable from '../components/AdminFeedbackTable';
const ManageTestsTable = lazy(() => import('../components/ManageTestsTable'));


const sidebarItems = [
  { key: 'create', label: 'Create Test' },
  { key: 'manage', label: 'Manage Tests' },
  { key: 'users', label: 'User Activity' },
  { key: 'userMgmt', label: 'User Management' },
  { key: 'results', label: 'Exam Results' },
  { key: 'analytics', label: 'Test Analytics' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'monitorCommunity', label: 'Monitor Community' },
];
// (removed all misplaced hooks and JSX for monitorCommunity section)
// (removed misplaced duplicate JSX for monitorCommunity section)

const AdminPanel = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('create');

  // State for admin post as Max Solutions
  const [adminPostContent, setAdminPostContent] = useState('');
  const [adminPostImage, setAdminPostImage] = useState(null);
  const [adminPostError, setAdminPostError] = useState('');
  const [adminPostSuccess, setAdminPostSuccess] = useState('');
  // Community monitor state/hooks
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityError, setCommunityError] = useState('');

  // Check if user is authenticated with valid token
  useEffect(() => {
    if (!token || !user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      logout();
      navigate('/admin-login', { replace: true });
    }
  }, [token, user, logout, navigate]);

  // Fetch all community posts for monitor tab
  const fetchCommunityPosts = async () => {
    setCommunityLoading(true);
    setCommunityError('');
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const data = await getCommunityPosts(token);
      setCommunityPosts(data);
    } catch (err) {
      console.error('Fetch posts error:', err);
      setCommunityError(err.response?.data?.message || 'Failed to fetch community posts');
      
      // Check if we need to redirect to login
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        logout();
      }
    } finally {
      setCommunityLoading(false);
    }
  };

  useEffect(() => {
    if (section === 'monitorCommunity') {
      fetchCommunityPosts();
    }
    // eslint-disable-next-line
  }, [section]);
  // Filter for deactivated users
  const [showDeactivatedOnly, setShowDeactivatedOnly] = useState(false);

  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // User details modal state
  const [selectedUser, setSelectedUser] = useState(null);



  // Pagination logic (moved below for bulk actions)

  // Bulk selection state
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Pagination logic (moved below for bulk actions)

  // allSelected must be after paginatedUsers is defined (keep only one definition after paginatedUsers)

  // Bulk action handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(paginatedUsers.map(u => u._id));
    } else {
      setSelectedUserIds([]);
    }
  };
  const handleSelectUser = (id) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };
  const handleBulkActivate = async () => {
    for (const id of selectedUserIds) {
      await api.put(`/api/profile/${id}/status`, { isActive: true });
    }
    setSelectedUserIds([]);
    window.location.reload();
  };
  const handleBulkDeactivate = async () => {
    for (const id of selectedUserIds) {
      await api.put(`/api/profile/${id}/status`, { isActive: false });
    }
    setSelectedUserIds([]);
    window.location.reload();
  };
  const handleBulkDelete = async () => {
    if (!window.confirm('Are you sure you want to delete selected users?')) return;
    for (const id of selectedUserIds) {
      await api.delete(`/api/profile/${id}`);
    }
    setSelectedUserIds([]);
    window.location.reload();
  };
  // Fetch users and tests on initial load and when needed
  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
  api.get('/api/users'),
  api.get('/api/tests/results/all')
    ])
      .then(([usersRes, resultsRes]) => {
        setUsers(usersRes.data.users || []);
        setResults(resultsRes.data.results || []);
      })
      .catch((err) => {
        setError('Failed to fetch user activity');
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return <Navigate to="/admin-login" replace />;
  }

  // Dashboard stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const totalTests = results.length;
  const recentUsers = users.slice(0, 5);

  // Search/filter users
  let filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.rollNo.toLowerCase().includes(search.toLowerCase())
  );
  if (showDeactivatedOnly) {
    filteredUsers = filteredUsers.filter(u => !u.isActive);
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUserIds.includes(u._id));



  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg h-screen sticky top-0" aria-label="Admin sidebar navigation">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold text-center" aria-label="Maxx Solutions Admin Panel">Maxx Solutions</h1>
              <div className="text-center text-xs text-gray-500 mt-1">Admin Panel</div>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              {sidebarItems.map(item => (
                <button
                  key={item.key}
                  className={`w-full text-left px-4 py-2 rounded transition-all mb-1 ${
                    section === item.key 
                      ? 'bg-blue-600 text-white font-semibold' 
                      : 'hover:bg-blue-100 text-gray-700'
                  }`}
                  onClick={() => setSection(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6" aria-label="Admin main content" role="main">
        {section === 'monitorCommunity' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Monitor Community</h2>

            {/* Create Post as Max Solutions */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-col gap-2 max-w-xl mx-auto">
              <h3 className="text-lg font-bold mb-2 text-blue-700">Post an Update as Max Solutions</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!adminPostContent && !adminPostImage) {
                  setAdminPostError('Please provide content or an image');
                  return;
                }
                setAdminPostError('');
                setAdminPostSuccess('');
                
                try {
                  const formData = new FormData();
                  formData.append('caption', adminPostContent); // Changed from content to caption to match API
                  if (adminPostImage) {
                    formData.append('image', adminPostImage); // Changed from imageFile to image to match API
                  }
                  
                  // Set the admin flag for proper handling on the server
                  formData.append('isAdminPost', 'true');
                  
                  await createPost(formData, token, true); // Using token directly
                  
                  // Clear form and show success
                  setAdminPostContent('');
                  setAdminPostImage(null);
                  setAdminPostSuccess('Posted successfully as Max Solutions!');
                  
                  // Refresh the post list
                  await fetchCommunityPosts();
                } catch (err) {
                  console.error('Post creation error:', err);
                  setAdminPostError('Failed to create post. Please try again.');
                }
              }} className="flex flex-col gap-2" encType="multipart/form-data">
                <textarea
                  className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[60px]"
                  placeholder="Write an important update..."
                  value={adminPostContent}
                  onChange={e => setAdminPostContent(e.target.value)}
                  maxLength={300}
                />
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={e => setAdminPostImage(e.target.files[0])}
                  />
                  <button type="submit" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all">Post as Max Solutions</button>
                </div>
                {adminPostError && <div className="text-red-600 text-sm mt-1">{adminPostError}</div>}
                {adminPostSuccess && <div className="text-green-600 text-sm mt-1">{adminPostSuccess}</div>}
              </form>
            </div>

            {communityLoading ? (
              <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
                <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span>Loading community posts...</span>
              </div>
            ) : communityError ? (
              <p className="text-red-600">{communityError}</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full border text-xs md:text-sm" aria-label="Community posts list">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">User</th>
                      <th className="border px-2 py-1">Caption</th>
                      <th className="border px-2 py-1">Image</th>
                      <th className="border px-2 py-1">Created</th>
                      <th className="border px-2 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {communityPosts.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4">No community posts found.</td></tr>
                    ) : (
                      communityPosts.map(post => (
                        <tr key={post._id} className="border-b">
                          <td className="border px-2 py-1">{post.user?.name || '—'}</td>
                          <td className="border px-2 py-1 max-w-xs truncate">{post.caption || '—'}</td>
                          <td className="border px-2 py-1">
                            {post.image ? (
                              <img 
                                src={post.image.startsWith('http') ? post.image : `${process.env.REACT_APP_API_URL}/uploads/${post.image}`}
                                alt="Community post" 
                                className="h-12 w-12 object-cover rounded"
                              />
                            ) : '—'}
                          </td>
                          <td className="border px-2 py-1">{post.createdAt ? new Date(post.createdAt).toLocaleString() : '—'}</td>
                          <td className="border px-2 py-1">
                            <button 
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded mr-2" 
                              onClick={async () => {
                                if(window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                                  try {
                                    setAdminPostError('');
                                    setAdminPostSuccess('');
                                    
                                    console.log('Attempting to delete post:', {
                                      postId: post._id,
                                      hasToken: !!token,
                                      userRole: user?.role
                                    });
                                    
                                    if (!token) {
                                      throw new Error('No authentication token available');
                                    }
                                    
                                    await deleteCommunityPost(post._id, token);
                                    setAdminPostSuccess('Post deleted successfully');
                                    
                                    // Refresh the posts list
                                    await fetchCommunityPosts();
                                  } catch (err) {
                                    console.error('Delete error:', err);
                                    const errorMessage = err.response?.data?.message || err.message || 'Failed to delete post';
                                    setAdminPostError(errorMessage);
                                    
                                    // Check if we need to redirect to login
                                    if (err.response?.status === 401) {
                                      alert('Your session has expired. Please log in again.');
                                      logout();
                                    }
                                  }
                                }
                              }}
                              aria-label={`Delete post by ${post.user?.name || 'unknown user'}`}
                            >
                              Delete
                            </button>
                            {/* Future: Hide/Unhide button here */}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* Dashboard Overview */}
        {section === 'create' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{totalUsers}</div>
                <div className="text-gray-600">Total Users</div>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{activeUsers}</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{totalTests}</div>
                <div className="text-gray-600">Total Tests</div>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{recentUsers.length}</div>
                <div className="text-gray-600">Recent Users</div>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Create Test</h2>
            <CreateTestForm />
          </div>
        )}
        {section === 'manage' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage & Update Tests</h2>
            <Suspense fallback={<div className="flex items-center justify-center py-8" role="status" aria-live="polite"><svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg><span>Loading tests...</span></div>}>
              <ManageTestsTable />
            </Suspense>
          </div>
        )}
        {section === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">User Activity</h2>
            <div className="flex items-center mb-2 gap-4">
              <input
                type="checkbox"
                id="showDeactivatedOnly"
                checked={showDeactivatedOnly}
                onChange={e => setShowDeactivatedOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showDeactivatedOnly" className="text-sm">Show only deactivated accounts</label>
            </div>
            <input
              type="text"
              className="border rounded px-3 py-2 mb-4 w-full max-w-xs"
              placeholder="Search by name, email, or roll no"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              aria-label="Search users"
            />
            {loading ? (
              <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
                <svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span>Loading users...</span>
              </div>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <>
                {/* Bulk Actions */}
                <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Bulk actions">
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleBulkActivate} disabled={selectedUserIds.length === 0} tabIndex={0} aria-label="Activate selected users">Activate</button>
                  <button className="bg-yellow-600 text-white px-3 py-1 rounded" onClick={handleBulkDeactivate} disabled={selectedUserIds.length === 0} tabIndex={0} aria-label="Deactivate selected users">Deactivate</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={handleBulkDelete} disabled={selectedUserIds.length === 0} tabIndex={0} aria-label="Delete selected users">Delete</button>
                  <span className="text-xs text-gray-500 ml-2">{selectedUserIds.length} selected</span>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full border text-xs md:text-sm" aria-label="User list">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1">
                          <input type="checkbox" aria-label="Select all users" checked={allSelected} onChange={handleSelectAll} tabIndex={0} />
                        </th>
                        <th className="border px-2 py-1">Name</th>
                        <th className="border px-2 py-1">Email</th>
                        <th className="border px-2 py-1">Roll No</th>
                        <th className="border px-2 py-1">Branch</th>
                        <th className="border px-2 py-1">Active?</th>
                        <th className="border px-2 py-1">Tests Taken</th>
                        <th className="border px-2 py-1">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user, idx) => {
                        const userResults = results.filter(r => r.student && (r.student._id === user._id || r.student === user._id));
                        const lastActivity = userResults.length > 0 ? new Date(userResults[0].createdAt).toLocaleString() : '—';
                        const rowClass = user.isActive ? "cursor-pointer hover:bg-blue-50 focus-within:bg-blue-100" : "cursor-pointer bg-red-50 text-gray-500 hover:bg-red-100 focus-within:bg-red-100";
                        return (
                          <tr key={user._id} className={rowClass} tabIndex={0} aria-label={`User ${user.name}`} onKeyDown={e => {if(e.key==='Enter'){setSelectedUser(user);}}} role="row">
                            <td className="border px-2 py-1 text-center">
                              <input type="checkbox" aria-label={`Select user ${user.name}`} checked={selectedUserIds.includes(user._id)} onChange={() => handleSelectUser(user._id)} tabIndex={0} />
                            </td>
                            <td className="border px-2 py-1" tabIndex={0}>{user.name} {!user.isActive && <span className="ml-1 px-2 py-1 bg-red-200 text-red-800 rounded text-xs">Deactivated</span>}</td>
                            <td className="border px-2 py-1" tabIndex={0}>{user.email}</td>
                            <td className="border px-2 py-1" tabIndex={0}>{user.rollNo}</td>
                            <td className="border px-2 py-1" tabIndex={0}>{user.branch || '—'}</td>
                            <td className="border px-2 py-1" tabIndex={0}>{user.isActive ? 'Yes' : <span className="text-red-600 font-bold">No</span>}</td>
                            <td className="border px-2 py-1" tabIndex={0}>{userResults.length}</td>
                            <td className="border px-2 py-1" tabIndex={0}>{lastActivity}</td>
                          </tr>
                        );
                      })}
        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-label="User Details Modal">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setSelectedUser(null)}
                aria-label="Close user details modal"
                tabIndex={0}
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4">User Details</h3>
              <div className="space-y-2">
                <div><span className="font-semibold">Name:</span> {selectedUser.name}</div>
                <div><span className="font-semibold">Email:</span> {selectedUser.email}</div>
                <div><span className="font-semibold">Roll No:</span> {selectedUser.rollNo}</div>
                <div><span className="font-semibold">Branch:</span> {selectedUser.branch || '—'}</div>
                <div><span className="font-semibold">Role:</span> {selectedUser.role}</div>
                <div><span className="font-semibold">Active:</span> {selectedUser.isActive ? 'Yes' : 'No'}</div>
                <div><span className="font-semibold">Created At:</span> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '—'}</div>
                <div><span className="font-semibold">Updated At:</span> {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : '—'}</div>
                {/* Add more fields as needed */}
              </div>
            </div>
          </div>
        )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white'}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {section === 'results' && (
          <div>
            <AdminExamResults />
          </div>
        )}
        {section === 'userMgmt' && (
          <div>
            <UserManagement />
          </div>
        )}
        {section === 'analytics' && (
          <div>
            <TestAnalytics />
          </div>
        )}
        {section === 'feedback' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Student Feedback</h2>
            <AdminFeedbackTable />
          </div>
        )}
        {section === 'superadmin' && user?.role === 'superadmin' && (
          <div>
            <SuperAdminPanel />
          </div>
        )}
        {section === 'changepw' && (
          <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPwMsg('');
                // Validation
                if (!pwOld || !pwNew || !pwConfirm) {
                  setPwMsg('All fields are required.');
                  return;
                }
                if (pwNew !== pwConfirm) {
                  setPwMsg('New passwords do not match.');
                  return;
                }
                if (pwNew.length < 8 ||
                  !/[A-Z]/.test(pwNew) ||
                  !/[a-z]/.test(pwNew) ||
                  !/\d/.test(pwNew) ||
                  !/[!@#$%^&*(),.?":{}|<>]/.test(pwNew)
                ) {
                  setPwMsg('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
                  return;
                }
                setPwLoading(true);
                try {
                  const res = await api.post('/users/change-password', {
                    oldPassword: pwOld,
                    newPassword: pwNew
                  });
                  setPwMsg(res.data.message || 'Password changed successfully.');
                  setPwOld(''); setPwNew(''); setPwConfirm('');
                } catch (err) {
                  setPwMsg(err.response?.data?.message || 'Failed to change password.');
                } finally {
                  setPwLoading(false);
                }
              }}
            >
              <div className="mb-3">
                <label className="block mb-1 font-medium">Old Password</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={pwOld} onChange={e => setPwOld(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">New Password</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={pwNew} onChange={e => setPwNew(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Confirm New Password</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} required />
              </div>
              {pwMsg && <div className={`mb-2 text-sm ${pwMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{pwMsg}</div>}
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={pwLoading}>{pwLoading ? 'Changing...' : 'Change Password'}</button>
            </form>
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
