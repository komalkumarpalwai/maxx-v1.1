import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './pages/Login';
// Coding import removed
import Register from './pages/Register';
import Results from './pages/Results';
import Tests from './pages/Tests';
import TestTaking from './pages/TestTaking';
import TestAttempts from './pages/TestAttempts';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminAnalytics from './pages/AdminAnalytics';
import { initializeSecurity } from './utils/security';
import './index.css';
import Roadmap from './pages/Roadmap';
import Settings from './pages/Settings';
import Partner from './pages/Partner';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Copyright from './pages/Copyright';
import StartTest from './pages/StartTest';
import Community from './pages/Community';

function App() {
  // ...existing code...
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    initializeSecurity();
  }, []);

  // Helper to render sidebar and navbar with mobile toggle
  const renderLayout = (MainComponent) => (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar: only on sm+ */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>
        {/* Mobile Sidebar Overlay: only on mobile and when open */}
        {isMobile && mobileSidebarOpen && (
          <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        )}
        <div className="flex-1 flex flex-col">
          <Navbar onMobileMenu={() => setMobileSidebarOpen(true)} />
          <main className="p-6 flex-1"><MainComponent /></main>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#000000',
                  border: '1px solid #e5e7eb',
                },
              }}
            />

            <Routes>
              {/* All main and public routes use a shared layout with Footer */}
              {/* Coding route removed */}
              <Route path="/community" element={
                <ProtectedRoute>
                  {renderLayout(() => <Community />)}
                </ProtectedRoute>
              } />
              <Route path="/partner" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="p-6 flex-1"><Partner /></main><Footer /></div>} />
              <Route path="/about" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="p-6 flex-1"><About /></main><Footer /></div>} />
              <Route path="/privacy" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="p-6 flex-1"><PrivacyPolicy /></main><Footer /></div>} />
              <Route path="/terms" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="p-6 flex-1"><Terms /></main><Footer /></div>} />
              <Route path="/copyright" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="p-6 flex-1"><Copyright /></main><Footer /></div>} />
              {/* Public routes */}
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  {renderLayout(Dashboard)}
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  {renderLayout(Profile)}
                </ProtectedRoute>
              } />


              <Route path="/tests" element={
                <ProtectedRoute>
                  {renderLayout(Tests)}
                </ProtectedRoute>
              } />

              <Route path="/tests/:id" element={
                <ProtectedRoute>
                  {renderLayout(TestTaking)}
                </ProtectedRoute>
              } />

              <Route path="/results" element={
                <ProtectedRoute>
                  {renderLayout(Results)}
                </ProtectedRoute>
              } />

              <Route path="/tests/:id/attempts" element={
                <ProtectedRoute>
                  {renderLayout(TestAttempts)}
                </ProtectedRoute>
              } />


              <Route path="/roadmap" element={
                <ProtectedRoute>
                  {renderLayout(Roadmap)}
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  {renderLayout(Settings)}
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              {/* AdminLogin route removed */}


              <Route path="/admin" element={
                <ProtectedRoute requireAuth={true} requiredRole={["admin", "superadmin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              <Route path="/admin-panel" element={
                <ProtectedRoute requireAuth={true} requiredRole={["admin", "superadmin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              <Route path="/admin/analytics" element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <div className="flex">
                    <Sidebar />
                    <div className="flex-1">
                      <Navbar />
                      <main className="p-6"><AdminAnalytics /></main>
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              {/* StartTest route without Sidebar, Navbar, Footer */}
              <Route path="/starttest/:id" element={
                <ProtectedRoute>
                  <main className="p-6 flex-1"><StartTest /></main>
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
