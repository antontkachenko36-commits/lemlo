import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Partnership } from './pages/Partnership';
import { Pricing } from './pages/Pricing';
import { Locations } from './pages/Locations';
import { Guides } from './pages/Guides';
import { GuideDetail } from './pages/GuideDetail';
import { Support } from './pages/Support';
import { Rules } from './pages/Rules';
import { Privacy } from './pages/Privacy';
import { Creators } from './pages/Creators';
import { Services } from './pages/Services';
import { Help } from './pages/Help';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminProvider } from './contexts/AdminContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin1188" element={<AdminLogin />} />
            <Route 
              path="/admin1188/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-black">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/partnership" element={<Partnership />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/guides" element={<Guides />} />
                    <Route path="/guides/:id" element={<GuideDetail />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/creators" element={<Creators />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/help" element={<Help />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </AdminProvider>
    </LanguageProvider>
  );
}

export default App;