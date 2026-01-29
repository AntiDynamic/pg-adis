<<<<<<< HEAD
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EnhancedDashboardPage from './pages/EnhancedDashboardPage';
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d
import PGListingPage from './pages/PGListingPage';
import RoommateMatchingPage from './pages/RoommateMatchingPage';
import MessDiscoveryPage from './pages/MessDiscoveryPage';
import BrowseRoommatesPage from './pages/BrowseRoommatesPage';
import PGOwnerSignupPage from './pages/PGOwnerSignupPage';
<<<<<<< HEAD
import { PGOwnerDashboard } from './pages/pg-owner';
import './styles/globals.css';
const ExpensesPage = React.lazy(() => import('./pages/ExpensesPage'));
=======
import './styles/globals.css';
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
        <Route path="/dashboard" element={
          <EnhancedDashboardPage 
            userId="demo-user"
            userName="Priya"
            userType="both"
          />
        } />
=======
        <Route path="/dashboard" element={<DashboardPage />} />
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d
        <Route path="/pg-listing" element={<PGListingPage />} />
        <Route path="/roommate-matching" element={<RoommateMatchingPage />} />
        <Route path="/mess-discovery" element={<MessDiscoveryPage />} />
        <Route path="/browse-roommates" element={<BrowseRoommatesPage />} />
        <Route path="/become-owner" element={<PGOwnerSignupPage />} />
<<<<<<< HEAD
        <Route path="/owner/signup" element={<PGOwnerSignupPage />} />
        <Route path="/owner/dashboard" element={<PGOwnerDashboard ownerId="demo-owner" ownerName="Demo Owner" ownerEmail="demo@example.com" />} />
        <Route path="/expenses" element={
          <Suspense fallback={<div className='text-white p-8'>Loading...</div>}>
            <ExpensesPage />
          </Suspense>
        } />
=======
>>>>>>> d9bc5d3c1a2923fd1ec3b256229a32f9b8be8f9d
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
