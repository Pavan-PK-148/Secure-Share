import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Structural Wrappers
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Full Page Module Route Component Imports
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadPage from './pages/UploadPage';
import ShareResult from './pages/ShareResult';
import DownloadPage from './pages/DownloadPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2C4A3E',
            color: '#FDFBF7',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#A3E6B5',
              secondary: '#2C4A3E',
            },
          },
        }}
      />

      {/* Grid container handles vertical viewport alignment */}
      <div className="flex flex-col min-h-screen bg-cream text-charcoal">
        <Navbar />
        
        {/* Dynamic Client Body Canvas */}
        <main className="flex-grow">
          <Routes>
            {/* Public Page Modules */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/download/:token" element={<DownloadPage />} />

            {/* Strict Guard Isolation Layer */}
            <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/share/:id" element={<ProtectedRoute><ShareResult /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Catch-all Routing Strategy */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;